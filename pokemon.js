/* pokemon.js – Pokémon Card Collection Tracker
   Uses the free Pokémon TCG API (api.pokemontcg.io/v2) for card data,
   images, rarity and market prices.  Collection stored in localStorage.
   Camera scanning via Tesseract.js OCR.  Price history tracked over time. */

(function () {
    'use strict';

    const API = 'https://api.pokemontcg.io/v2';
    const STORAGE_KEY = 'pokemon-collection';

    /* ── state ─────────────────────────────────────────── */
    let collection = loadCollection();
    // collection shape: { cardId: { card, qty, addedAt, priceHistory: [{ date, price }] } }
    let searchCache = {};
    let lastSearchUrl = '';   // for "Load more"
    let lastSearchPage = 1;
    let lastSearchCards = []; // accumulated results across pages

    /* ── DOM refs ──────────────────────────────────────── */
    const $ = id => document.getElementById(id);

    /* ── persistence ───────────────────────────────────── */
    function loadCollection() {
        try {
            const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
            // migrate: ensure every entry has priceHistory
            for (const id in data) {
                if (!data[id].priceHistory) data[id].priceHistory = [];
            }
            return data;
        } catch { return {}; }
    }
    function saveCollection() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
    }

    /* ── API helpers ───────────────────────────────────── */
    /* Known set name fragments → API set ids (populated on first search) */
    let setsIndex = null;
    async function loadSetsIndex() {
        if (setsIndex) return setsIndex;
        const res = await fetch(`${API}/sets?select=id,name&pageSize=250&orderBy=-releaseDate`);
        if (!res.ok) return [];
        const json = await res.json();
        setsIndex = json.data || [];
        return setsIndex;
    }

    /* Rarity shorthands collectors actually type */
    const RARITY_ALIASES = {
        'sir': 'Special Illustration Rare',
        'sar': 'Special Art Rare',
        'ar': 'Art Rare',
        'ur': 'Ultra Rare',
        'hr': 'Hyper Rare',
        'ir': 'Illustration Rare',
        'dr': 'Double Rare',
        'rr': 'Double Rare',
    };

    /**
     * Smart search: parses a free-text query like "Meowth SIR Perfect Order"
     * into API filters for name, rarity and set.
     */
    async function searchCards(query) {
        const raw = query.trim();
        if (!raw) return [];
        const key = raw.toLowerCase();
        if (searchCache[key]) return searchCache[key];

        await loadSetsIndex();

        let words = raw.split(/\s+/);
        let setFilter = '';
        let rarityFilter = '';
        let nameWords = [];

        // 1) Pull out rarity aliases (e.g. SIR, UR)
        const remaining = [];
        for (const w of words) {
            const alias = RARITY_ALIASES[w.toLowerCase()];
            if (alias && !rarityFilter) {
                rarityFilter = alias;
            } else {
                remaining.push(w);
            }
        }
        words = remaining;

        // 2) Greedily match set names from the end of the query
        if (setsIndex && setsIndex.length) {
            // Try longest substring match from end
            for (let len = words.length; len >= 1; len--) {
                const candidate = words.slice(words.length - len).join(' ').toLowerCase();
                const match = setsIndex.find(s => s.name.toLowerCase() === candidate);
                if (match) {
                    setFilter = match.id;
                    words = words.slice(0, words.length - len);
                    break;
                }
            }
        }

        nameWords = words;
        const nameQuery = nameWords.join(' ');

        // Build API query parts
        const parts = [];
        if (nameQuery) parts.push(`name:"${nameQuery}*"`);
        if (setFilter) parts.push(`set.id:${setFilter}`);
        if (rarityFilter) parts.push(`rarity:"${rarityFilter}"`);

        // If nothing useful parsed, fall back to wildcard name search
        if (!parts.length) parts.push(`name:"${raw}*"`);

        const baseUrl = `${API}/cards?q=${encodeURIComponent(parts.join(' '))}&pageSize=50&select=id,name,images,set,rarity,tcgplayer,cardmarket,number,supertype`;
        lastSearchUrl = baseUrl;
        lastSearchPage = 1;

        const res = await fetch(baseUrl + '&page=1');
        if (!res.ok) throw new Error('API request failed');
        const json = await res.json();
        const cards = json.data || [];
        lastSearchCards = cards;
        searchCache[key] = { cards, totalCount: json.totalCount || cards.length };
        return searchCache[key];
    }

    async function loadMoreResults() {
        if (!lastSearchUrl) return null;
        lastSearchPage++;
        const res = await fetch(lastSearchUrl + '&page=' + lastSearchPage);
        if (!res.ok) return null;
        const json = await res.json();
        const more = json.data || [];
        lastSearchCards = lastSearchCards.concat(more);
        return { cards: lastSearchCards, totalCount: json.totalCount || lastSearchCards.length };
    }

    async function fetchCardById(id) {
        const res = await fetch(`${API}/cards/${id}?select=id,name,images,set,rarity,tcgplayer,cardmarket,number,supertype`);
        if (!res.ok) return null;
        const json = await res.json();
        return json.data || null;
    }

    /* ── price helpers ─────────────────────────────────── */
    function getPrice(card) {
        // TCGPlayer: try every variant, not just a few
        const tcg = card.tcgplayer?.prices;
        if (tcg) {
            for (const variant of Object.values(tcg)) {
                if (variant?.market) return variant.market;
            }
            for (const variant of Object.values(tcg)) {
                if (variant?.mid) return variant.mid;
            }
            for (const variant of Object.values(tcg)) {
                if (variant?.low) return variant.low;
            }
        }
        // Cardmarket fallback
        const cm = card.cardmarket?.prices;
        if (cm) {
            if (cm.averageSellPrice) return cm.averageSellPrice;
            if (cm.trendPrice) return cm.trendPrice;
            if (cm.avg1) return cm.avg1;
            if (cm.avg7) return cm.avg7;
            if (cm.avg30) return cm.avg30;
        }
        return null;
    }

    function formatPrice(price) {
        if (price == null) return '—';
        return '$' + price.toFixed(2);
    }

    function todayStr() {
        return new Date().toISOString().slice(0, 10);
    }

    /** Record today's price if we haven't already today */
    function recordPrice(entry) {
        const price = getPrice(entry.card);
        if (price == null) return;
        const today = todayStr();
        const hist = entry.priceHistory;
        if (hist.length && hist[hist.length - 1].date === today) {
            hist[hist.length - 1].price = price; // update today's entry
        } else {
            hist.push({ date: today, price });
        }
    }

    function getRarityClass(rarity) {
        if (!rarity) return '';
        const r = rarity.toLowerCase();
        if (r.includes('secret') || r.includes('hyper'))      return 'rarity-secret';
        if (r.includes('ultra') || r.includes('illustration')) return 'rarity-ultra';
        if (r.includes('holo') || r.includes('rare'))         return 'rarity-rare';
        if (r.includes('uncommon'))                            return 'rarity-uncommon';
        return 'rarity-common';
    }

    /** Mini SVG sparkline for price history */
    function sparkline(history) {
        if (!history || history.length < 2) return '<span class="pokemon-trend-na">—</span>';
        const prices = history.map(h => h.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const range = max - min || 1;
        const w = 60, h = 24, pad = 2;
        const points = prices.map((p, i) => {
            const x = pad + (i / (prices.length - 1)) * (w - pad * 2);
            const y = pad + (1 - (p - min) / range) * (h - pad * 2);
            return `${x.toFixed(1)},${y.toFixed(1)}`;
        }).join(' ');

        const latest = prices[prices.length - 1];
        const prev = prices[prices.length - 2];
        const color = latest >= prev ? '#10b981' : '#ef4444';

        return `<svg class="pokemon-sparkline" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
            <polyline points="${points}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
    }

    /* ── render: search results ────────────────────────── */
    function renderSearchResults(result) {
        const container = $('pokemon-search-results');
        const cards = result.cards || result;  // support old array or new {cards, totalCount}
        const totalCount = result.totalCount || cards.length;

        if (!cards.length) {
            container.innerHTML = '<p class="pokemon-no-results">No cards found. Try a different name.</p>';
            return;
        }

        let html = cards.map(card => {
            const price = getPrice(card);
            const inCollection = collection[card.id];
            return `
                <div class="pokemon-result-card" data-id="${card.id}">
                    <img class="pokemon-result-img" src="${card.images.small}" alt="${card.name}" loading="lazy">
                    <div class="pokemon-result-info">
                        <span class="pokemon-result-name">${card.name}</span>
                        <span class="pokemon-result-set">${card.set.name} #${card.number}</span>
                        <span class="pokemon-result-rarity ${getRarityClass(card.rarity)}">${card.rarity || 'Unknown'}</span>
                        <span class="pokemon-result-price">${formatPrice(price)}</span>
                    </div>
                    <button class="pokemon-add-btn ${inCollection ? 'added' : ''}" data-id="${card.id}">
                        ${inCollection ? `✓ Owned (${inCollection.qty})` : '+ Add'}
                    </button>
                </div>`;
        }).join('');

        // Show count + Load More if there are more results
        const showing = cards.length;
        if (totalCount > showing) {
            html += `<div class="pokemon-load-more-row">
                <span class="pokemon-result-count">Showing ${showing} of ${totalCount}</span>
                <button class="pokemon-load-more-btn" id="pokemon-load-more">Load more</button>
            </div>`;
        } else if (showing > 5) {
            html += `<div class="pokemon-load-more-row"><span class="pokemon-result-count">${showing} cards found</span></div>`;
        }

        container.innerHTML = html;

        container.querySelectorAll('.pokemon-add-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                const card = cards.find(c => c.id === id);
                if (card) addCard(card);
            });
        });

        const loadMoreBtn = $('pokemon-load-more');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', async () => {
                loadMoreBtn.textContent = 'Loading…';
                loadMoreBtn.disabled = true;
                const more = await loadMoreResults();
                if (more) renderSearchResults(more);
            });
        }
    }

    /* ── render: collection list ───────────────────────── */
    function renderCollection() {
        const tbody = $('pokemon-list-body');
        const empty = $('pokemon-empty');
        const wrap = $('pokemon-list-wrap');
        const entries = Object.values(collection);

        updateStats();
        updateFilters();

        if (!entries.length) {
            empty.style.display = '';
            if (tbody) tbody.innerHTML = '';
            return;
        }
        empty.style.display = 'none';

        // Filters
        let filtered = entries;
        const rarityFilter = $('pokemon-filter-rarity')?.value;
        const setFilter = $('pokemon-filter-set')?.value;
        if (rarityFilter) filtered = filtered.filter(e => e.card.rarity === rarityFilter);
        if (setFilter)    filtered = filtered.filter(e => e.card.set.name === setFilter);

        // Sort
        const sortVal = $('pokemon-sort')?.value || 'name-asc';
        filtered.sort((a, b) => {
            switch (sortVal) {
                case 'name-asc':   return a.card.name.localeCompare(b.card.name);
                case 'name-desc':  return b.card.name.localeCompare(a.card.name);
                case 'value-desc': return (getPrice(b.card) || 0) - (getPrice(a.card) || 0);
                case 'value-asc':  return (getPrice(a.card) || 0) - (getPrice(b.card) || 0);
                case 'date-desc':  return b.addedAt - a.addedAt;
                case 'date-asc':   return a.addedAt - b.addedAt;
            }
            return 0;
        });

        tbody.innerHTML = filtered.map(entry => {
            const card = entry.card;
            const price = getPrice(card);
            const total = price != null ? price * entry.qty : null;
            const hist = entry.priceHistory || [];
            const trendHtml = sparkline(hist);

            return `<tr class="pokemon-list-row" data-id="${card.id}">
                <td class="pokemon-col-img"><img src="${card.images.small}" alt="${card.name}" loading="lazy"></td>
                <td class="pokemon-col-name">${card.name}</td>
                <td class="pokemon-col-set">${card.set.name}</td>
                <td class="pokemon-col-num">${card.number}</td>
                <td class="pokemon-col-rarity"><span class="${getRarityClass(card.rarity)}">${card.rarity || '?'}</span></td>
                <td class="pokemon-col-qty">
                    <div class="pokemon-qty-inline">
                        <button class="pokemon-qty-btn pokemon-qty-minus" data-id="${card.id}">−</button>
                        <span>${entry.qty}</span>
                        <button class="pokemon-qty-btn pokemon-qty-plus" data-id="${card.id}">+</button>
                    </div>
                </td>
                <td class="pokemon-col-price" title="${entry.qty > 1 ? `${formatPrice(price)} each, ${formatPrice(total)} total` : ''}">${formatPrice(price)}</td>
                <td class="pokemon-col-trend pokemon-trend-cell" data-id="${card.id}">${trendHtml}</td>
                <td class="pokemon-col-actions">
                    <button class="pokemon-remove-btn" data-id="${card.id}" title="Remove">🗑</button>
                </td>
            </tr>`;
        }).join('');

        // Wire buttons
        tbody.querySelectorAll('.pokemon-qty-plus').forEach(btn =>
            btn.addEventListener('click', () => changeQty(btn.dataset.id, 1)));
        tbody.querySelectorAll('.pokemon-qty-minus').forEach(btn =>
            btn.addEventListener('click', () => changeQty(btn.dataset.id, -1)));
        tbody.querySelectorAll('.pokemon-remove-btn').forEach(btn =>
            btn.addEventListener('click', () => removeCard(btn.dataset.id)));
        tbody.querySelectorAll('.pokemon-trend-cell').forEach(cell =>
            cell.addEventListener('click', () => showPriceHistory(cell.dataset.id)));
    }

    /* ── stats ─────────────────────────────────────────── */
    function updateStats() {
        const entries = Object.values(collection);
        const totalQty = entries.reduce((s, e) => s + e.qty, 0);
        const uniqueCount = entries.length;
        const totalVal = entries.reduce((s, e) => {
            const p = getPrice(e.card);
            return s + (p != null ? p * e.qty : 0);
        }, 0);

        const tc = $('pokemon-total-cards');
        const uc = $('pokemon-unique-cards');
        const tv = $('pokemon-total-value');
        if (tc) tc.textContent = totalQty;
        if (uc) uc.textContent = uniqueCount;
        if (tv) tv.textContent = '$' + totalVal.toFixed(2);
    }

    /* ── filter dropdowns ──────────────────────────────── */
    function updateFilters() {
        const entries = Object.values(collection);
        const rarities = [...new Set(entries.map(e => e.card.rarity).filter(Boolean))].sort();
        const sets     = [...new Set(entries.map(e => e.card.set.name))].sort();

        const rSel = $('pokemon-filter-rarity');
        const sSel = $('pokemon-filter-set');
        if (!rSel || !sSel) return;

        const rVal = rSel.value;
        const sVal = sSel.value;

        rSel.innerHTML = '<option value="">All Rarities</option>' + rarities.map(r => `<option value="${r}"${r === rVal ? ' selected' : ''}>${r}</option>`).join('');
        sSel.innerHTML = '<option value="">All Sets</option>' + sets.map(s => `<option value="${s}"${s === sVal ? ' selected' : ''}>${s}</option>`).join('');
    }

    /* ── collection mutations ──────────────────────────── */
    function addCard(card) {
        if (collection[card.id]) {
            collection[card.id].qty += 1;
        } else {
            collection[card.id] = { card, qty: 1, addedAt: Date.now(), priceHistory: [] };
        }
        recordPrice(collection[card.id]);
        saveCollection();
        renderCollection();
        // Update button in search results
        const btn = $('pokemon-search-results')?.querySelector(`.pokemon-add-btn[data-id="${card.id}"]`);
        if (btn) {
            btn.classList.add('added');
            btn.textContent = `✓ Owned (${collection[card.id].qty})`;
        }
    }

    function changeQty(id, delta) {
        if (!collection[id]) return;
        collection[id].qty += delta;
        if (collection[id].qty <= 0) {
            delete collection[id];
        }
        saveCollection();
        renderCollection();
    }

    function removeCard(id) {
        delete collection[id];
        saveCollection();
        renderCollection();
    }

    /* ── refresh all prices ────────────────────────────── */
    async function refreshAllPrices() {
        const btn = $('pokemon-refresh-btn');
        if (btn) { btn.disabled = true; btn.textContent = '⏳ Refreshing...'; }

        const ids = Object.keys(collection);
        let updated = 0;
        // Fetch in batches of 5 to avoid hammering the API
        for (let i = 0; i < ids.length; i += 5) {
            const batch = ids.slice(i, i + 5);
            const results = await Promise.all(batch.map(id => fetchCardById(id).catch(() => null)));
            results.forEach((freshCard, idx) => {
                const id = batch[idx];
                if (freshCard && collection[id]) {
                    collection[id].card = freshCard;
                    recordPrice(collection[id]);
                    updated++;
                }
            });
        }

        saveCollection();
        renderCollection();
        if (btn) { btn.disabled = false; btn.textContent = `🔄 Refresh Prices`; }
    }

    /* ── price history modal ───────────────────────────── */
    function showPriceHistory(id) {
        const entry = collection[id];
        if (!entry) return;

        const modal = $('pokemon-modal');
        const body  = $('pokemon-modal-body');
        const hist  = entry.priceHistory || [];

        let histHtml;
        if (hist.length === 0) {
            histHtml = '<p class="pokemon-hist-empty">No price history recorded yet. Click "Refresh Prices" to start tracking.</p>';
        } else {
            // Large sparkline
            const prices = hist.map(h => h.price);
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            const range = max - min || 1;
            const w = 300, h = 100, pad = 8;
            const points = prices.map((p, i) => {
                const x = pad + (i / Math.max(prices.length - 1, 1)) * (w - pad * 2);
                const y = pad + (1 - (p - min) / range) * (h - pad * 2);
                return `${x.toFixed(1)},${y.toFixed(1)}`;
            }).join(' ');
            const latest = prices[prices.length - 1];
            const first = prices[0];
            const color = latest >= first ? '#10b981' : '#ef4444';
            const pctChange = first > 0 ? (((latest - first) / first) * 100).toFixed(1) : '0.0';

            histHtml = `
                <div class="pokemon-hist-chart">
                    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
                        <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <div class="pokemon-hist-range">
                        <span>${hist[0].date}</span>
                        <span>${hist[hist.length - 1].date}</span>
                    </div>
                </div>
                <div class="pokemon-hist-summary">
                    <span>First: ${formatPrice(first)}</span>
                    <span>Latest: ${formatPrice(latest)}</span>
                    <span class="${latest >= first ? 'pokemon-trend-up' : 'pokemon-trend-down'}">${latest >= first ? '▲' : '▼'} ${pctChange}%</span>
                    <span>Low: ${formatPrice(min)}</span>
                    <span>High: ${formatPrice(max)}</span>
                </div>
                <table class="pokemon-hist-table">
                    <thead><tr><th>Date</th><th>Price</th></tr></thead>
                    <tbody>${hist.slice().reverse().map(h => `<tr><td>${h.date}</td><td>${formatPrice(h.price)}</td></tr>`).join('')}</tbody>
                </table>`;
        }

        body.innerHTML = `
            <div class="pokemon-hist-header">
                <img src="${entry.card.images.small}" alt="${entry.card.name}" class="pokemon-hist-img">
                <div>
                    <h3>${entry.card.name}</h3>
                    <p>${entry.card.set.name} #${entry.card.number}</p>
                    <span class="${getRarityClass(entry.card.rarity)}">${entry.card.rarity || 'Unknown'}</span>
                </div>
            </div>
            <h4>Price History</h4>
            ${histHtml}`;

        modal.hidden = false;
    }

    /* ── camera scan (OCR) ─────────────────────────────── */
    async function handleScan(file) {
        const status = $('pokemon-scan-status');
        status.hidden = false;
        status.innerHTML = '<span class="pokemon-scan-spinner"></span> Reading card name…';

        try {
            const worker = await Tesseract.createWorker('eng');
            // Crop to top ~30% of image where the name is
            const img = await createImageBitmap(file);
            const canvas = document.createElement('canvas');
            const cropH = Math.round(img.height * 0.25);
            canvas.width = img.width;
            canvas.height = cropH;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, img.width, cropH, 0, 0, img.width, cropH);

            const { data } = await worker.recognize(canvas);
            await worker.terminate();

            // Extract the most likely card name (first meaningful line)
            const lines = data.text.split('\n').map(l => l.trim()).filter(l => l.length > 1);
            let cardName = '';
            for (const line of lines) {
                // Skip lines that are just numbers, HP, etc.
                const cleaned = line.replace(/[^a-zA-ZéÉ\s'-]/g, '').trim();
                if (cleaned.length >= 3) {
                    cardName = cleaned;
                    break;
                }
            }

            if (cardName) {
                status.innerHTML = `✅ Detected: <strong>${cardName}</strong> — searching…`;
                $('pokemon-search').value = cardName;
                const cards = await searchCards(cardName);
                renderSearchResults(cards);
                if (cards.length) {
                    status.innerHTML = `✅ Found ${cards.length} result${cards.length > 1 ? 's' : ''} for "<strong>${cardName}</strong>". Pick your card below.`;
                } else {
                    status.innerHTML = `⚠️ Detected "<strong>${cardName}</strong>" but no cards matched. Try editing the search.`;
                }
            } else {
                status.innerHTML = '⚠️ Couldn\'t read the card name. Try a clearer photo or type the name manually.';
            }
        } catch (err) {
            console.error('OCR error:', err);
            status.innerHTML = '❌ Scan failed. Try typing the card name instead.';
        }
    }

    /* ── export ────────────────────────────────────────── */
    function exportCollection() {
        const entries = Object.values(collection);
        if (!entries.length) return;
        const lines = ['Name,Set,Number,Rarity,Qty,Price Each,Total'];
        entries.forEach(e => {
            const p = getPrice(e.card);
            lines.push(`"${e.card.name}","${e.card.set.name}",${e.card.number},"${e.card.rarity || ''}",${e.qty},${p != null ? p.toFixed(2) : ''},${p != null ? (p * e.qty).toFixed(2) : ''}`);
        });
        const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'pokemon-collection.csv';
        a.click();
        URL.revokeObjectURL(a.href);
    }

    /* ── init ──────────────────────────────────────────── */
    function init() {
        const searchInput = $('pokemon-search');
        const searchBtn   = $('pokemon-search-btn');
        const exportBtn   = $('pokemon-export-btn');
        const refreshBtn  = $('pokemon-refresh-btn');
        const scanInput   = $('pokemon-scan-input');
        const modalEl     = $('pokemon-modal');
        const modalClose  = $('pokemon-modal-close');

        if (!searchInput) return;

        // Search
        async function doSearch() {
            const q = searchInput.value.trim();
            if (!q) return;
            const container = $('pokemon-search-results');
            container.innerHTML = '<p class="pokemon-searching">Searching…</p>';
            try {
                const cards = await searchCards(q);
                renderSearchResults(cards);
            } catch (err) {
                container.innerHTML = '<p class="pokemon-no-results">Error fetching cards. Please try again.</p>';
            }
        }

        searchBtn.addEventListener('click', doSearch);
        searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(); });

        // Camera scan
        if (scanInput) {
            scanInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) handleScan(file);
                scanInput.value = ''; // allow re-selecting same file
            });
        }

        // Filter & sort
        $('pokemon-filter-rarity')?.addEventListener('change', () => renderCollection());
        $('pokemon-filter-set')?.addEventListener('change', () => renderCollection());
        $('pokemon-sort')?.addEventListener('change', () => renderCollection());

        // Column header sorting
        document.querySelectorAll('.pokemon-sortable').forEach(th => {
            th.addEventListener('click', () => {
                const sortSel = $('pokemon-sort');
                const key = th.dataset.sort;
                const map = { name: 'name', set: 'name', rarity: 'name', value: 'value' };
                const base = map[key] || 'name';
                const current = sortSel.value;
                // Toggle direction
                if (current === base + '-asc') {
                    sortSel.value = base + '-desc';
                } else {
                    sortSel.value = base + '-asc';
                }
                renderCollection();
            });
        });

        // Refresh prices
        if (refreshBtn) refreshBtn.addEventListener('click', refreshAllPrices);

        // Export
        if (exportBtn) exportBtn.addEventListener('click', exportCollection);

        // Modal close
        if (modalClose) modalClose.addEventListener('click', () => { modalEl.hidden = true; });
        if (modalEl) modalEl.addEventListener('click', (e) => { if (e.target === modalEl) modalEl.hidden = true; });

        // Record prices for all cards on load (once per day)
        for (const id in collection) {
            recordPrice(collection[id]);
        }
        saveCollection();

        renderCollection();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
