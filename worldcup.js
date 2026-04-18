// ==================================================================
// 2026 FIFA World Cup Predictor
// 12 groups of 4 · 8 best thirds advance · 32-team knockout bracket
// ==================================================================

const WC_GROUPS = {
    A: ['Mexico', 'South Africa', 'South Korea', 'Czechia'],
    B: ['Canada', 'Bosnia and Herzegovina', 'Qatar', 'Switzerland'],
    C: ['Brazil', 'Morocco', 'Haiti', 'Scotland'],
    D: ['USA', 'Paraguay', 'Australia', 'Türkiye'],
    E: ['Germany', 'Curaçao', 'Ivory Coast', 'Ecuador'],
    F: ['Netherlands', 'Japan', 'Sweden', 'Tunisia'],
    G: ['Belgium', 'Egypt', 'Iran', 'New Zealand'],
    H: ['Spain', 'Cape Verde', 'Saudi Arabia', 'Uruguay'],
    I: ['France', 'Senegal', 'Iraq', 'Norway'],
    J: ['Argentina', 'Algeria', 'Austria', 'Jordan'],
    K: ['Portugal', 'DR Congo', 'Uzbekistan', 'Colombia'],
    L: ['England', 'Croatia', 'Ghana', 'Panama']
};

// Higher = stronger. Loosely anchored to FIFA rankings (April 2026 snapshot),
// with outside-top-50 teams estimated.
const WC_RATINGS = {
    'France': 95, 'Spain': 93, 'Argentina': 91, 'England': 90, 'Portugal': 88,
    'Brazil': 87, 'Netherlands': 85, 'Morocco': 83, 'Belgium': 81, 'Germany': 80,
    'Croatia': 76, 'Colombia': 72, 'Senegal': 71, 'Mexico': 68, 'USA': 67,
    'Uruguay': 66, 'Japan': 65, 'Switzerland': 64, 'Iran': 62, 'Türkiye': 61,
    'Ecuador': 60, 'Austria': 59, 'South Korea': 58, 'Australia': 56,
    'Algeria': 55, 'Egypt': 54, 'Canada': 53, 'Norway': 52, 'Ivory Coast': 50,
    'Bosnia and Herzegovina': 49, 'Panama': 48, 'Sweden': 47, 'Qatar': 46,
    'Ghana': 46, 'Paraguay': 45, 'DR Congo': 45, 'Czechia': 44, 'South Africa': 44,
    'Scotland': 43, 'Tunisia': 42, 'Saudi Arabia': 41, 'Iraq': 40,
    'Cape Verde': 38, 'Uzbekistan': 37, 'Jordan': 36, 'Curaçao': 35,
    'New Zealand': 33, 'Haiti': 32
};

// Home kit primary colour per team. Sampled from each FA's current home shirt.
const WC_SHIRTS = {
    'Mexico': '#006341',               'South Africa': '#007A4D',
    'South Korea': '#C60C30',          'Czechia': '#D7141A',
    'Canada': '#D52B1E',               'Bosnia and Herzegovina': '#002F6C',
    'Qatar': '#8A1538',                'Switzerland': '#DA291C',
    'Brazil': '#FFDF00',               'Morocco': '#C1272D',
    'Haiti': '#00209F',                'Scotland': '#0065BD',
    'USA': '#FFFFFF',                  'Paraguay': '#DA121A',
    'Australia': '#FFCD00',            'Türkiye': '#E30A17',
    'Germany': '#FFFFFF',              'Curaçao': '#002776',
    'Ivory Coast': '#FF8200',          'Ecuador': '#FFD100',
    'Netherlands': '#FF6C0C',          'Japan': '#172F68',
    'Sweden': '#FECB00',               'Tunisia': '#E70013',
    'Belgium': '#C8102E',              'Egypt': '#C8102E',
    'Iran': '#FFFFFF',                 'New Zealand': '#FFFFFF',
    'Spain': '#C60B1E',                'Cape Verde': '#003893',
    'Saudi Arabia': '#006C35',         'Uruguay': '#55B2FF',
    'France': '#002654',               'Senegal': '#00853F',
    'Iraq': '#007A3D',                 'Norway': '#EF2B2D',
    'Argentina': '#75AADB',            'Algeria': '#006233',
    'Austria': '#ED2939',              'Jordan': '#CE1126',
    'Portugal': '#C60C30',             'DR Congo': '#007FFF',
    'Uzbekistan': '#0099B5',           'Colombia': '#FCD116',
    'England': '#FFFFFF',              'Croatia': '#EA1D25',
    'Ghana': '#FCD116',                'Panama': '#DA121A'
};

const WC_FLAGS = {
    'Mexico': '🇲🇽', 'South Africa': '🇿🇦', 'South Korea': '🇰🇷', 'Czechia': '🇨🇿',
    'Canada': '🇨🇦', 'Bosnia and Herzegovina': '🇧🇦', 'Qatar': '🇶🇦', 'Switzerland': '🇨🇭',
    'Brazil': '🇧🇷', 'Morocco': '🇲🇦', 'Haiti': '🇭🇹', 'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    'USA': '🇺🇸', 'Paraguay': '🇵🇾', 'Australia': '🇦🇺', 'Türkiye': '🇹🇷',
    'Germany': '🇩🇪', 'Curaçao': '🇨🇼', 'Ivory Coast': '🇨🇮', 'Ecuador': '🇪🇨',
    'Netherlands': '🇳🇱', 'Japan': '🇯🇵', 'Sweden': '🇸🇪', 'Tunisia': '🇹🇳',
    'Belgium': '🇧🇪', 'Egypt': '🇪🇬', 'Iran': '🇮🇷', 'New Zealand': '🇳🇿',
    'Spain': '🇪🇸', 'Cape Verde': '🇨🇻', 'Saudi Arabia': '🇸🇦', 'Uruguay': '🇺🇾',
    'France': '🇫🇷', 'Senegal': '🇸🇳', 'Iraq': '🇮🇶', 'Norway': '🇳🇴',
    'Argentina': '🇦🇷', 'Algeria': '🇩🇿', 'Austria': '🇦🇹', 'Jordan': '🇯🇴',
    'Portugal': '🇵🇹', 'DR Congo': '🇨🇩', 'Uzbekistan': '🇺🇿', 'Colombia': '🇨🇴',
    'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Croatia': '🇭🇷', 'Ghana': '🇬🇭', 'Panama': '🇵🇦'
};

const GROUP_MATCH_PAIRS = [[0,1],[2,3],[0,2],[1,3],[0,3],[1,2]];
const THIRDS_TO_QUALIFY = 8;
const WC_SAVE_KEY = 'worldcup2026_predictions_v1';

// Canonical single-elimination bracket seeding so top seeds only meet in the final.
function bracketSeeding(n) {
    if (n === 1) return [1];
    const half = bracketSeeding(n / 2);
    const out = [];
    for (const s of half) { out.push(s); out.push(n + 1 - s); }
    return out;
}
const R32_SEED_ORDER = bracketSeeding(32);

// Poisson sample using Knuth's algorithm.
function poisson(lambda) {
    const L = Math.exp(-lambda);
    let p = 1, k = 0;
    do { k++; p *= Math.random(); } while (p > L);
    return k - 1;
}

function ratingOf(team) {
    return WC_RATINGS[team] ?? 35;
}

function simulateMatch(teamA, teamB) {
    const diff = ratingOf(teamA) - ratingOf(teamB);
    const expA = Math.max(0.35, 1.3 + diff * 0.035);
    const expB = Math.max(0.35, 1.3 - diff * 0.035);
    return [poisson(expA), poisson(expB)];
}

function pickKnockoutWinner(teamA, teamB) {
    const diff = ratingOf(teamA) - ratingOf(teamB);
    const pA = 1 / (1 + Math.pow(10, -diff / 15));
    return Math.random() < pA ? teamA : teamB;
}

// Small SVG football shirt coloured by team's home kit.
function shirtSvg(team) {
    const colour = WC_SHIRTS[team] || '#9ca3af';
    return `<svg class="wc-shirt" viewBox="0 0 24 24" aria-hidden="true">`
        + `<path d="M8.5 3 L2 5.5 L1 10 L4.5 10.8 L4.5 21 L19.5 21 L19.5 10.8 L23 10 L22 5.5 L15.5 3 L14 5 L10 5 Z" `
        + `fill="${colour}" stroke="rgba(0,0,0,0.45)" stroke-width="0.9" stroke-linejoin="round"/></svg>`;
}

function teamBadge(team) {
    return `<span class="wc-badge">${shirtSvg(team)}</span>`;
}

// Shorter display names for teams whose full name overflows the UI.
function displayName(team) {
    if (team === 'Bosnia and Herzegovina') return 'Bos & Herz';
    return team;
}

// ---- Compact state encoding for share links ----
// Group scores: 12 groups * 6 matches * 2 ints per match = 144 ints (0..30 each).
// Knockouts: store all picks as team names in a single array.
// URL-safe base64 wraps a minimal JSON payload.

function encodeState(groupStage, knockouts) {
    const gs = [];
    for (const g of Object.keys(WC_GROUPS)) {
        for (const m of groupStage[g]) {
            gs.push(m.score[0] == null ? -1 : m.score[0]);
            gs.push(m.score[1] == null ? -1 : m.score[1]);
        }
    }
    const ko = [
        ...knockouts.r32, ...knockouts.r16, ...knockouts.qf,
        ...knockouts.sf, knockouts.final
    ].map(t => t || '');
    const payload = { v: 1, gs, ko };
    const json = JSON.stringify(payload);
    const b64 = btoa(unescape(encodeURIComponent(json)));
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeState(hash) {
    try {
        let b64 = hash.replace(/-/g, '+').replace(/_/g, '/');
        while (b64.length % 4) b64 += '=';
        const json = decodeURIComponent(escape(atob(b64)));
        const data = JSON.parse(json);
        if (data.v !== 1 || !Array.isArray(data.gs) || !Array.isArray(data.ko)) return null;

        const groupStage = {};
        let idx = 0;
        for (const g of Object.keys(WC_GROUPS)) {
            groupStage[g] = GROUP_MATCH_PAIRS.map(([i, j]) => {
                const a = data.gs[idx++];
                const b = data.gs[idx++];
                return { ai: i, bi: j, score: [a < 0 ? null : a, b < 0 ? null : b] };
            });
        }

        const ko = data.ko.map(t => t || null);
        const knockouts = {
            r32: ko.slice(0, 16),
            r16: ko.slice(16, 24),
            qf:  ko.slice(24, 28),
            sf:  ko.slice(28, 30),
            final: ko[30] || null,
            champion: ko[30] || null
        };
        return { groupStage, knockouts };
    } catch (e) {
        return null;
    }
}

class WorldCupPredictor {
    constructor() {
        this.groupsEl = document.getElementById('wc-groups');
        if (!this.groupsEl) return;
        this.knockoutsEl = document.getElementById('wc-knockouts');
        this.championFlag = document.getElementById('wc-champion-flag');
        this.championName = document.getElementById('wc-champion-name');

        this.groupStage = this.emptyGroupStage();
        this.knockouts = this.emptyKnockouts();
        this.bracketSignature = null;

        this.load();

        // If the URL contains a shared bracket, load that on top of any local state.
        this.loadFromHashIfPresent();

        document.getElementById('wc-autofill-all').addEventListener('click', () => this.autofillAll(true));
        document.getElementById('wc-autofill-remaining').addEventListener('click', () => this.autofillAll(false));
        document.getElementById('wc-clear-all').addEventListener('click', () => this.clearAll());
        document.getElementById('wc-share').addEventListener('click', () => this.share());
        document.getElementById('wc-shared-dismiss').addEventListener('click', () => {
            document.getElementById('wc-shared-banner').hidden = true;
        });

        this.renderAll();
    }

    loadFromHashIfPresent() {
        const hash = window.location.hash || '';
        const match = hash.match(/[#&]wc=([^&]+)/);
        if (!match) return;
        const decoded = decodeState(match[1]);
        if (!decoded) {
            this.showToast('⚠️ Shared bracket link is invalid.');
            return;
        }
        this.groupStage = decoded.groupStage;
        this.knockouts = decoded.knockouts;
        this.bracketSignature = null; // let computeKnockoutsIfStale accept loaded picks
        this.save();
        // Compute + trust the signature so we don't immediately wipe the loaded picks
        const q = this.buildQualifiers();
        if (q) {
            const bracket = this.seedBracket(q);
            this.bracketSignature = bracket.map(b => b ? b.team : '').join('|');
            this.save();
        }
        const banner = document.getElementById('wc-shared-banner');
        if (banner) banner.hidden = false;
        // Jump to the World Cup tab so the shared bracket is visible immediately
        if (typeof switchTab === 'function') switchTab('worldcup');
        // Clean the URL so refreshes don't re-apply the shared state
        if (history.replaceState) history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    async share() {
        const encoded = encodeState(this.groupStage, this.knockouts);
        const url = `${window.location.origin}${window.location.pathname}#wc=${encoded}`;
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(url);
                this.showToast('🔗 Link copied! Paste it to your mates.');
            } else {
                this.fallbackCopy(url);
            }
        } catch (e) {
            this.fallbackCopy(url);
        }
    }

    fallbackCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            this.showToast('🔗 Link copied! Paste it to your mates.');
        } catch {
            this.showToast('Copy this link: ' + text.slice(0, 60) + '…');
        }
        document.body.removeChild(ta);
    }

    showToast(message) {
        const toast = document.getElementById('wc-toast');
        if (!toast) return;
        toast.textContent = message;
        toast.hidden = false;
        toast.classList.remove('show');
        void toast.offsetWidth; // reset animation
        toast.classList.add('show');
        clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => { toast.hidden = true; }, 300);
        }, 2800);
    }

    emptyGroupStage() {
        const state = {};
        for (const g of Object.keys(WC_GROUPS)) {
            state[g] = GROUP_MATCH_PAIRS.map(([i, j]) => ({ ai: i, bi: j, score: [null, null] }));
        }
        return state;
    }

    emptyKnockouts() {
        return {
            r32: new Array(16).fill(null),
            r16: new Array(8).fill(null),
            qf: new Array(4).fill(null),
            sf: new Array(2).fill(null),
            final: null,
            champion: null
        };
    }

    // ----- Groups -----
    renderGroups() {
        this.groupsEl.innerHTML = '';
        for (const g of Object.keys(WC_GROUPS)) {
            this.groupsEl.appendChild(this.buildGroupCard(g));
        }
    }

    buildGroupCard(g) {
        const teams = WC_GROUPS[g];
        const card = document.createElement('div');
        card.className = 'wc-group-card';
        card.dataset.group = g;

        const header = document.createElement('div');
        header.className = 'wc-group-header';
        header.innerHTML = `
            <span class="wc-group-letter">Group ${g}</span>
            <div class="wc-group-actions">
                <button class="wc-btn wc-btn-small" data-action="autofill">🎲 Auto-fill</button>
                <button class="wc-btn wc-btn-small wc-btn-ghost" data-action="clear">Clear</button>
            </div>`;
        header.querySelector('[data-action="autofill"]').addEventListener('click', () => this.autofillGroup(g, true));
        header.querySelector('[data-action="clear"]').addEventListener('click', () => this.clearGroup(g));
        card.appendChild(header);

        const matches = document.createElement('div');
        matches.className = 'wc-matches';
        this.groupStage[g].forEach((m, idx) => {
            const row = document.createElement('div');
            row.className = 'wc-match';
            row.innerHTML = `
                <span class="wc-team wc-team-a">${teamBadge(teams[m.ai])}${displayName(teams[m.ai])}</span>
                <input class="wc-score-input" type="number" min="0" max="20" inputmode="numeric" aria-label="${teams[m.ai]} score" data-side="a">
                <span class="wc-vs">–</span>
                <input class="wc-score-input" type="number" min="0" max="20" inputmode="numeric" aria-label="${teams[m.bi]} score" data-side="b">
                <span class="wc-team wc-team-b">${displayName(teams[m.bi])}${teamBadge(teams[m.bi])}</span>`;
            const [inpA, inpB] = row.querySelectorAll('input');
            if (m.score[0] != null) inpA.value = m.score[0];
            if (m.score[1] != null) inpB.value = m.score[1];
            inpA.addEventListener('input', () => this.onScoreInput(g, idx, 0, inpA.value));
            inpB.addEventListener('input', () => this.onScoreInput(g, idx, 1, inpB.value));
            matches.appendChild(row);
        });
        card.appendChild(matches);

        const table = document.createElement('table');
        table.className = 'wc-standings';
        table.innerHTML = `<thead><tr><th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th></tr></thead><tbody></tbody>`;
        card.appendChild(table);

        return card;
    }

    onScoreInput(g, idx, side, value) {
        const m = this.groupStage[g][idx];
        const v = value === '' ? null : Math.max(0, Math.min(20, parseInt(value, 10) || 0));
        m.score[side] = v;
        this.renderStandings(g);
        this.save();
        this.renderKnockouts();
        this.updateChampion();
    }

    computeStandings(g) {
        const teams = WC_GROUPS[g];
        const stats = teams.map(t => ({ team: t, P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, Pts: 0 }));
        for (const m of this.groupStage[g]) {
            const [sa, sb] = m.score;
            if (sa == null || sb == null) continue;
            stats[m.ai].P++; stats[m.bi].P++;
            stats[m.ai].GF += sa; stats[m.ai].GA += sb;
            stats[m.bi].GF += sb; stats[m.bi].GA += sa;
            if (sa > sb)      { stats[m.ai].W++; stats[m.bi].L++; stats[m.ai].Pts += 3; }
            else if (sa < sb) { stats[m.bi].W++; stats[m.ai].L++; stats[m.bi].Pts += 3; }
            else              { stats[m.ai].D++; stats[m.bi].D++; stats[m.ai].Pts++; stats[m.bi].Pts++; }
        }
        return stats
            .map(s => ({ ...s, GD: s.GF - s.GA }))
            .sort((a, b) => b.Pts - a.Pts || b.GD - a.GD || b.GF - a.GF || a.team.localeCompare(b.team));
    }

    renderStandings(g) {
        const card = this.groupsEl.querySelector(`.wc-group-card[data-group="${g}"]`);
        if (!card) return;
        const tbody = card.querySelector('.wc-standings tbody');
        const standings = this.computeStandings(g);
        tbody.innerHTML = standings.map((s, i) => {
            const rowClass = i < 2 ? 'advance' : i === 2 ? 'third' : '';
            return `<tr class="${rowClass}"><td>${i + 1}</td>
                <td>${teamBadge(s.team)}${displayName(s.team)}</td>
                <td>${s.P}</td><td>${s.W}</td><td>${s.D}</td><td>${s.L}</td>
                <td>${s.GD > 0 ? '+' : ''}${s.GD}</td><td><strong>${s.Pts}</strong></td></tr>`;
        }).join('');
    }

    isGroupStageComplete() {
        for (const g of Object.keys(WC_GROUPS)) {
            for (const m of this.groupStage[g]) {
                if (m.score[0] == null || m.score[1] == null) return false;
            }
        }
        return true;
    }

    // ----- Knockouts -----
    buildQualifiers() {
        if (!this.isGroupStageComplete()) return null;
        const winners = [], runnersUp = [], thirds = [];
        for (const g of Object.keys(WC_GROUPS)) {
            const s = this.computeStandings(g);
            winners.push({ ...s[0], group: g, pos: 1 });
            runnersUp.push({ ...s[1], group: g, pos: 2 });
            thirds.push({ ...s[2], group: g, pos: 3 });
        }
        const cmp = (a, b) => b.Pts - a.Pts || b.GD - a.GD || b.GF - a.GF;
        const top8Thirds = thirds.slice().sort(cmp).slice(0, THIRDS_TO_QUALIFY);
        return {
            winners: winners.slice().sort(cmp),
            runnersUp: runnersUp.slice().sort(cmp),
            thirds: top8Thirds
        };
    }

    seedBracket(q) {
        const seededByOrder = [
            ...q.winners.map(w => ({ ...w, tier: 1 })),
            ...q.runnersUp.map(r => ({ ...r, tier: 2 })),
            ...q.thirds.map(t => ({ ...t, tier: 3 }))
        ];
        const bracket = new Array(32);
        R32_SEED_ORDER.forEach((seed, slotIdx) => {
            bracket[slotIdx] = seededByOrder[seed - 1];
        });
        return bracket;
    }

    computeKnockoutsIfStale() {
        const q = this.buildQualifiers();
        if (!q) {
            this.knockouts = this.emptyKnockouts();
            this.bracketSignature = null;
            return null;
        }
        const bracket = this.seedBracket(q);
        const signature = bracket.map(b => b ? b.team : '').join('|');
        if (this.bracketSignature !== signature) {
            this.knockouts = this.emptyKnockouts();
            this.bracketSignature = signature;
        }
        return bracket;
    }

    renderKnockouts() {
        this.knockoutsEl.innerHTML = '';
        const bracket = this.computeKnockoutsIfStale();
        if (!bracket) {
            const empty = document.createElement('div');
            empty.className = 'wc-knockout-empty';
            empty.textContent = 'Complete all group stage matches (or hit Auto-fill) to unlock the knockout bracket.';
            this.knockoutsEl.appendChild(empty);
            return;
        }

        const r32Matches = Array.from({ length: 16 }, (_, i) => ({
            a: bracket[i * 2] && bracket[i * 2].team,
            b: bracket[i * 2 + 1] && bracket[i * 2 + 1].team,
            aInfo: bracket[i * 2],
            bInfo: bracket[i * 2 + 1]
        }));

        this.knockoutsEl.appendChild(this.buildRound('Round of 32', 16, (i) => ({
            a: r32Matches[i].a, b: r32Matches[i].b,
            aInfo: r32Matches[i].aInfo, bInfo: r32Matches[i].bInfo,
            winner: this.knockouts.r32[i], round: 'r32', idx: i
        })));
        this.knockoutsEl.appendChild(this.buildRound('Round of 16', 8, (i) => ({
            a: this.knockouts.r32[i * 2], b: this.knockouts.r32[i * 2 + 1],
            winner: this.knockouts.r16[i], round: 'r16', idx: i
        })));
        this.knockoutsEl.appendChild(this.buildRound('Quarter-finals', 4, (i) => ({
            a: this.knockouts.r16[i * 2], b: this.knockouts.r16[i * 2 + 1],
            winner: this.knockouts.qf[i], round: 'qf', idx: i
        })));
        this.knockoutsEl.appendChild(this.buildRound('Semi-finals', 2, (i) => ({
            a: this.knockouts.qf[i * 2], b: this.knockouts.qf[i * 2 + 1],
            winner: this.knockouts.sf[i], round: 'sf', idx: i
        })));
        this.knockoutsEl.appendChild(this.buildRound('Final', 1, () => ({
            a: this.knockouts.sf[0], b: this.knockouts.sf[1],
            winner: this.knockouts.final, round: 'final', idx: 0
        })));
    }

    buildRound(title, count, matchFn) {
        const round = document.createElement('div');
        round.className = 'wc-round';
        round.innerHTML = `<h4 class="wc-round-title">${title}</h4>`;
        const matches = document.createElement('div');
        matches.className = 'wc-round-matches';
        for (let i = 0; i < count; i++) {
            const m = matchFn(i);
            const el = document.createElement('div');
            el.className = 'wc-ko-match';
            el.appendChild(this.buildKoTeam(m.a, m.aInfo, m.round, m.idx, m.winner));
            el.appendChild(this.buildKoTeam(m.b, m.bInfo, m.round, m.idx, m.winner));
            matches.appendChild(el);
        }
        round.appendChild(matches);
        return round;
    }

    buildKoTeam(team, info, round, idx, currentWinner) {
        const btn = document.createElement('button');
        btn.className = 'wc-ko-team';
        btn.disabled = !team;
        if (team) {
            const groupTag = info ? `<span class="wc-ko-group">${info.tier === 3 ? '3' + info.group : info.pos + info.group}</span>` : '';
            btn.innerHTML = `${teamBadge(team)}<span class="wc-ko-name">${displayName(team)}</span>${groupTag}`;
            if (currentWinner === team) btn.classList.add('wc-ko-picked');
            btn.addEventListener('click', () => this.pickKo(round, idx, team));
        } else {
            btn.innerHTML = `<span class="wc-ko-empty">—</span>`;
        }
        return btn;
    }

    pickKo(round, idx, team) {
        const current = round === 'final' ? this.knockouts.final : this.knockouts[round][idx];
        const newValue = current === team ? null : team;
        if (round === 'final') this.knockouts.final = newValue;
        else this.knockouts[round][idx] = newValue;
        this.clearDownstream(round, idx);
        this.save();
        this.renderKnockouts();
        this.updateChampion();
    }

    clearDownstream(round, idx) {
        const order = ['r32', 'r16', 'qf', 'sf', 'final'];
        const from = order.indexOf(round);
        let curr = idx;
        for (let r = from + 1; r < order.length; r++) {
            const next = order[r];
            const nextIdx = Math.floor(curr / 2);
            if (next === 'final') {
                this.knockouts.final = null;
                this.knockouts.champion = null;
            } else {
                this.knockouts[next][nextIdx] = null;
            }
            curr = nextIdx;
        }
    }

    updateChampion() {
        const champ = this.knockouts.final;
        if (champ) {
            this.championFlag.innerHTML = `<span class="wc-champ-jersey">${shirtSvg(champ)}</span>`;
            this.championName.textContent = displayName(champ);
            this.knockouts.champion = champ;
        } else {
            this.championFlag.innerHTML = '<span class="wc-champ-emoji">🏆</span>';
            this.championName.textContent = 'Complete the bracket';
            this.knockouts.champion = null;
        }
    }

    // ----- Auto-fill / Clear -----
    autofillGroup(g, overwrite) {
        const teams = WC_GROUPS[g];
        for (const m of this.groupStage[g]) {
            if (!overwrite && m.score[0] != null && m.score[1] != null) continue;
            const [a, b] = simulateMatch(teams[m.ai], teams[m.bi]);
            m.score = [a, b];
        }
        this.renderGroups();
        for (const other of Object.keys(WC_GROUPS)) this.renderStandings(other);
        this.save();
        this.renderKnockouts();
        this.updateChampion();
    }

    autofillAll(overwrite) {
        for (const g of Object.keys(WC_GROUPS)) {
            const teams = WC_GROUPS[g];
            for (const m of this.groupStage[g]) {
                if (!overwrite && m.score[0] != null && m.score[1] != null) continue;
                const [a, b] = simulateMatch(teams[m.ai], teams[m.bi]);
                m.score = [a, b];
            }
        }
        this.renderGroups();
        for (const g of Object.keys(WC_GROUPS)) this.renderStandings(g);
        this.renderKnockouts(); // refreshes qualifiers + resets picks to null
        this.autofillKnockouts(overwrite);
        this.save();
        this.updateChampion();
    }

    autofillKnockouts(overwrite) {
        const q = this.buildQualifiers();
        if (!q) return;
        const bracket = this.seedBracket(q);
        for (let i = 0; i < 16; i++) {
            if (!overwrite && this.knockouts.r32[i]) continue;
            const a = bracket[i * 2] && bracket[i * 2].team;
            const b = bracket[i * 2 + 1] && bracket[i * 2 + 1].team;
            if (a && b) this.knockouts.r32[i] = pickKnockoutWinner(a, b);
        }
        for (let i = 0; i < 8; i++) {
            if (!overwrite && this.knockouts.r16[i]) continue;
            const a = this.knockouts.r32[i * 2];
            const b = this.knockouts.r32[i * 2 + 1];
            if (a && b) this.knockouts.r16[i] = pickKnockoutWinner(a, b);
        }
        for (let i = 0; i < 4; i++) {
            if (!overwrite && this.knockouts.qf[i]) continue;
            const a = this.knockouts.r16[i * 2];
            const b = this.knockouts.r16[i * 2 + 1];
            if (a && b) this.knockouts.qf[i] = pickKnockoutWinner(a, b);
        }
        for (let i = 0; i < 2; i++) {
            if (!overwrite && this.knockouts.sf[i]) continue;
            const a = this.knockouts.qf[i * 2];
            const b = this.knockouts.qf[i * 2 + 1];
            if (a && b) this.knockouts.sf[i] = pickKnockoutWinner(a, b);
        }
        if (overwrite || !this.knockouts.final) {
            const a = this.knockouts.sf[0];
            const b = this.knockouts.sf[1];
            if (a && b) this.knockouts.final = pickKnockoutWinner(a, b);
        }
        this.renderKnockouts();
    }

    clearGroup(g) {
        this.groupStage[g] = GROUP_MATCH_PAIRS.map(([i, j]) => ({ ai: i, bi: j, score: [null, null] }));
        this.renderGroups();
        for (const g2 of Object.keys(WC_GROUPS)) this.renderStandings(g2);
        this.save();
        this.renderKnockouts();
        this.updateChampion();
    }

    clearAll() {
        if (!confirm('Clear every prediction? This cannot be undone.')) return;
        this.groupStage = this.emptyGroupStage();
        this.knockouts = this.emptyKnockouts();
        this.bracketSignature = null;
        this.renderAll();
        this.save();
    }

    // ----- Persistence -----
    save() {
        try {
            localStorage.setItem(WC_SAVE_KEY, JSON.stringify({
                groupStage: this.groupStage,
                knockouts: this.knockouts,
                bracketSignature: this.bracketSignature
            }));
        } catch (e) { /* ignore */ }
    }

    load() {
        try {
            const raw = localStorage.getItem(WC_SAVE_KEY);
            if (!raw) return;
            const data = JSON.parse(raw);
            if (data.groupStage) this.groupStage = data.groupStage;
            if (data.knockouts) this.knockouts = { ...this.emptyKnockouts(), ...data.knockouts };
            if (data.bracketSignature) this.bracketSignature = data.bracketSignature;
        } catch (e) { /* ignore */ }
    }

    renderAll() {
        this.renderGroups();
        for (const g of Object.keys(WC_GROUPS)) this.renderStandings(g);
        this.renderKnockouts();
        this.updateChampion();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(() => new WorldCupPredictor(), 100));
} else {
    setTimeout(() => new WorldCupPredictor(), 100);
}
