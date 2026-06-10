/* Tottenham Hotspur news — live multi-source aggregator.
 * RSS feeds are read in the browser via the free rss2json proxy and merged.
 * Each source carries a reliability tier so transfer rumours are clearly
 * labelled and not mistaken for confirmed news. */
(function () {
    'use strict';

    // tier: trusted (factual reporting) | reputable (mainstream) | rumour (transfer speculation)
    const FEEDS = [
        { name: 'BBC Sport',     tier: 'trusted',   url: 'https://feeds.bbci.co.uk/sport/football/teams/tottenham-hotspur/rss.xml' },
        { name: 'The Guardian',  tier: 'trusted',   url: 'https://www.theguardian.com/football/tottenham-hotspur/rss' },
        { name: 'Cartilage Free Captain', tier: 'reputable', url: 'https://cartilagefreecaptain.sbnation.com/rss/index.xml' },
        { name: 'Sport Witness', tier: 'rumour',    url: 'https://www.sportwitness.co.uk/category/club/tottenham-hotspur/feed/' }
    ];

    const TIERS = {
        trusted:   { label: 'Trusted',   emoji: '🟢' },
        reputable: { label: 'Reputable', emoji: '🟡' },
        rumour:    { label: 'Rumour',    emoji: '🔴' }
    };

    // Two proxies so a rate-limited or failing one doesn't kill the feed:
    //   1) rss2json — returns clean JSON, normalises RSS & Atom.
    //   2) allorigins — returns the raw feed, parsed in-browser (RSS or Atom).
    const RSS2JSON = 'https://api.rss2json.com/v1/api.json?count=10&rss_url=';
    const RAWPROXY = 'https://api.allorigins.win/raw?url=';
    const CACHE_KEY = 'spurs_news_cache_v1';
    const CACHE_MS = 15 * 60 * 1000; // 15 minutes
    const MAX_ITEMS = 24;

    let loaded = false;

    /* ---------- data ---------- */

    function parseDate(s) {
        if (!s) return 0;
        return Date.parse(s) || Date.parse(s.replace(' ', 'T')) || 0;
    }
    function mkItem(feed, title, link, date) {
        return { title: title || '', link: link || '#', date: parseDate(date), source: feed.name, tier: feed.tier };
    }

    function viaRss2json(feed) {
        return fetch(RSS2JSON + encodeURIComponent(feed.url))
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (d) {
                if (!d || d.status !== 'ok' || !d.items || !d.items.length) return null;
                return d.items.map(function (it) { return mkItem(feed, it.title, it.link, it.pubDate); });
            })
            .catch(function () { return null; });
    }

    function tagText(node, tag) {
        const els = node.getElementsByTagName(tag);
        return (els && els.length) ? (els[0].textContent || '').trim() : '';
    }

    function viaRaw(feed) {
        return fetch(RAWPROXY + encodeURIComponent(feed.url))
            .then(function (r) { return r.ok ? r.text() : null; })
            .then(function (txt) {
                if (!txt) return null;
                const doc = new DOMParser().parseFromString(txt, 'text/xml');
                if (doc.getElementsByTagName('parsererror').length) return null;
                let nodes = Array.prototype.slice.call(doc.getElementsByTagName('item')); // RSS
                let atom = false;
                if (!nodes.length) { nodes = Array.prototype.slice.call(doc.getElementsByTagName('entry')); atom = true; } // Atom
                if (!nodes.length) return null;
                return nodes.slice(0, 10).map(function (n) {
                    let link = '';
                    if (atom) {
                        const links = n.getElementsByTagName('link');
                        for (let i = 0; i < links.length; i++) {
                            const rel = links[i].getAttribute('rel');
                            if (!rel || rel === 'alternate') { link = links[i].getAttribute('href') || ''; break; }
                        }
                        if (!link && links.length) link = links[0].getAttribute('href') || '';
                    } else {
                        link = tagText(n, 'link');
                    }
                    const date = tagText(n, 'pubDate') || tagText(n, 'published') || tagText(n, 'updated');
                    return mkItem(feed, tagText(n, 'title'), link, date);
                });
            })
            .catch(function () { return null; });
    }

    function fetchFeed(feed) {
        return viaRss2json(feed)
            .then(function (items) { return items || viaRaw(feed); })
            .then(function (items) { return items || []; });
    }

    function fetchAll(force) {
        if (!force) {
            try {
                const c = JSON.parse(localStorage.getItem(CACHE_KEY));
                if (c && (Date.now() - c.t) < CACHE_MS && c.items && c.items.length) {
                    return Promise.resolve(c.items);
                }
            } catch (e) { /* ignore */ }
        }
        return Promise.all(FEEDS.map(fetchFeed)).then(function (lists) {
            let items = [].concat.apply([], lists);
            // de-dupe by title, keep newest, sort by date desc
            const seen = {};
            items = items.filter(function (it) {
                const k = it.title.toLowerCase().trim();
                if (!k || seen[k]) return false;
                seen[k] = true;
                return true;
            }).sort(function (a, b) { return b.date - a.date; }).slice(0, MAX_ITEMS);
            try {
                localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), items: items }));
            } catch (e) { /* quota */ }
            return items;
        });
    }

    /* ---------- render ---------- */

    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function ago(ms) {
        if (!ms) return '';
        const s = Math.floor((Date.now() - ms) / 1000);
        if (s < 60) return 'just now';
        const m = Math.floor(s / 60);
        if (m < 60) return m + 'm ago';
        const h = Math.floor(m / 60);
        if (h < 24) return h + 'h ago';
        const d = Math.floor(h / 24);
        return d + 'd ago';
    }

    function render(items) {
        const list = document.getElementById('spurs-news-list');
        if (!list) return;
        if (!items.length) {
            list.innerHTML = '<p class="fb-loading">Couldn’t load news right now — please try the refresh button. 🔄</p>';
            return;
        }
        list.innerHTML = items.map(function (it) {
            const t = TIERS[it.tier] || TIERS.reputable;
            return '<a class="news-item" href="' + esc(it.link) + '" target="_blank" rel="noopener">' +
                '<div class="news-item-head">' +
                '<span class="news-badge tier-' + it.tier + '">' + t.emoji + ' ' + t.label + '</span>' +
                '<span class="news-source">' + esc(it.source) + '</span>' +
                '<span class="news-time">' + ago(it.date) + '</span>' +
                '</div>' +
                '<div class="news-title">' + esc(it.title) + '</div>' +
                '</a>';
        }).join('');
    }

    function load(force) {
        const list = document.getElementById('spurs-news-list');
        if (force && list) list.innerHTML = '<p class="fb-loading">Refreshing the latest Spurs news…</p>';
        fetchAll(force).then(render).catch(function () {
            if (list) list.innerHTML = '<p class="fb-loading">Couldn’t load news right now — please try the refresh button. 🔄</p>';
        });
    }

    /* ---------- wiring ---------- */

    function init() {
        const refresh = document.getElementById('spurs-refresh');
        if (refresh) refresh.addEventListener('click', function () { load(true); });
        document.addEventListener('tabchange', function (e) {
            if (e.detail === 'football' && !loaded) {
                loaded = true;
                load(false);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
