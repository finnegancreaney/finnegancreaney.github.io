// ==================================================================
// Premier League Manager v2
// New: realistic team budgets, summer + January transfer windows,
//      player buy/sell UI, AI transfers, end-of-season prize money.
// ==================================================================

const PLM_TEAMS = [
    { id: 'arsenal',        name: 'Arsenal',               short: 'ARS', color: '#EF0107', text: '#ffffff', rating: 85 },
    { id: 'astonvilla',     name: 'Aston Villa',           short: 'AVL', color: '#670E36', text: '#ffffff', rating: 80 },
    { id: 'bournemouth',    name: 'Bournemouth',           short: 'BOU', color: '#DA291C', text: '#ffffff', rating: 72 },
    { id: 'brentford',      name: 'Brentford',             short: 'BRE', color: '#E30613', text: '#ffffff', rating: 73 },
    { id: 'brighton',       name: 'Brighton & Hove Albion',short: 'BHA', color: '#0057B8', text: '#ffffff', rating: 76 },
    { id: 'burnley',        name: 'Burnley',               short: 'BUR', color: '#6C1D45', text: '#ffffff', rating: 68 },
    { id: 'chelsea',        name: 'Chelsea',               short: 'CHE', color: '#034694', text: '#ffffff', rating: 78 },
    { id: 'crystalpalace',  name: 'Crystal Palace',        short: 'CRY', color: '#1B458F', text: '#ffffff', rating: 74 },
    { id: 'everton',        name: 'Everton',               short: 'EVE', color: '#003399', text: '#ffffff', rating: 72 },
    { id: 'fulham',         name: 'Fulham',                short: 'FUL', color: '#000000', text: '#ffffff', rating: 73 },
    { id: 'leeds',          name: 'Leeds United',          short: 'LEE', color: '#FFCD00', text: '#1D428A', rating: 72 },
    { id: 'liverpool',      name: 'Liverpool',             short: 'LIV', color: '#C8102E', text: '#ffffff', rating: 85 },
    { id: 'mancity',        name: 'Manchester City',       short: 'MCI', color: '#6CABDD', text: '#1c2c5b', rating: 87 },
    { id: 'manunited',      name: 'Manchester United',     short: 'MUN', color: '#DA291C', text: '#ffffff', rating: 78 },
    { id: 'newcastle',      name: 'Newcastle United',      short: 'NEW', color: '#241F20', text: '#ffffff', rating: 80 },
    { id: 'nforest',        name: 'Nottingham Forest',     short: 'NFO', color: '#DD0000', text: '#ffffff', rating: 72 },
    { id: 'sunderland',     name: 'Sunderland',            short: 'SUN', color: '#EB172B', text: '#ffffff', rating: 68 },
    { id: 'tottenham',      name: 'Tottenham Hotspur',     short: 'TOT', color: '#132257', text: '#ffffff', rating: 78 },
    { id: 'westham',        name: 'West Ham United',       short: 'WHU', color: '#7A263A', text: '#ffffff', rating: 74 },
    { id: 'wolves',         name: 'Wolverhampton',         short: 'WOL', color: '#FDB913', text: '#231F20', rating: 70 },
];
const PLM_TEAMS_BY_ID = Object.fromEntries(PLM_TEAMS.map(t => [t.id, t]));

// ---------- Transfer budgets (£M, approx. real 2025-26) ----------
const PLM_TEAM_BUDGETS = {
    mancity:      200, chelsea:      180, liverpool:    130,
    arsenal:      110, manunited:     90, newcastle:     80,
    tottenham:     70, astonvilla:    65, brighton:      50,
    westham:       45, fulham:        35, crystalpalace: 30,
    brentford:     28, bournemouth:   28, everton:       25,
    nforest:       25, wolves:        20, leeds:         18,
    burnley:       15, sunderland:    12,
};

// ---------- Prize money per finishing position (£M, index 0 = 1st) ----------
const PLM_PRIZE_MONEY = [
    160, 150, 140, 130, 120, 112, 104, 96, 90, 84,
     78,  72,  66,  60,  54,  48,  42, 36, 30, 24,
];

// ---------- Player market value (£M) ----------
function plmPlayerValue(rating) {
    if (rating >= 90) return Math.round(80 + (rating - 90) * 15);
    if (rating >= 85) return Math.round(40 + (rating - 85) * 8);
    if (rating >= 80) return Math.round(20 + (rating - 80) * 4);
    if (rating >= 75) return Math.round(10 + (rating - 75) * 2);
    if (rating >= 70) return Math.round(5  + (rating - 70) * 1);
    if (rating >= 65) return Math.round(2  + (rating - 65) * 0.6);
    return Math.max(1, Math.round((rating - 60) * 0.4 + 0.5));
}

// ---------- Free agent pool ----------
function plmUniqueId(prefix) {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 99999)}`;
}

function plmMakeFreeAgent(pos, rating) {
    const fn = PLM_FIRST_NAMES[Math.floor(Math.random() * PLM_FIRST_NAMES.length)];
    const ln = PLM_LAST_NAMES[Math.floor(Math.random() * PLM_LAST_NAMES.length)];
    return {
        id: plmUniqueId('fa'),
        name: `${fn} ${ln}`,
        pos, rating,
        value: plmPlayerValue(rating),
        goals: 0, assists: 0,
        yellows: 0, reds: 0, suspended: 0, injured: 0,
    };
}

function plmGenerateFreeAgentPool() {
    const posBag = ['GK','DEF','DEF','DEF','DEF','MID','MID','MID','FWD','FWD','FWD'];
    const bands = [
        { min: 88, max: 92, count: 4  },
        { min: 83, max: 87, count: 8  },
        { min: 78, max: 82, count: 12 },
        { min: 73, max: 77, count: 14 },
        { min: 68, max: 72, count: 12 },
        { min: 63, max: 67, count: 8  },
        { min: 58, max: 62, count: 4  },
    ];
    const pool = [];
    for (const { min, max, count } of bands) {
        for (let i = 0; i < count; i++) {
            const pos    = posBag[Math.floor(Math.random() * posBag.length)];
            const rating = min + Math.floor(Math.random() * (max - min + 1));
            pool.push(plmMakeFreeAgent(pos, rating));
        }
    }
    return pool;
}

// ---------- Name pools ----------
const PLM_FIRST_NAMES = [
    'James','Harry','Jack','Oliver','George','Charlie','Daniel','Leo','Noah','Lucas',
    'Max','Finn','Luke','Riley','Archie','Ethan','Alfie','Thomas','Oscar','William',
    'David','Paul','Andy','Marcus','Raheem','Bukayo','Reece','Kyle','Declan','Kalvin',
    'Mason','Phil','Jordan','Kieran','Ben','Eric','Joe','Ollie','Rhys','Cole',
    'Marcus','Tyrone','Dominic','Ivan','Martin','Scott','Mark','Peter','Ryan','Adam',
    'Connor','Josh','Nathan','Sam','Tyler','Aaron','Jacob','Robbie','Owen','Sean',
];
const PLM_LAST_NAMES = [
    'Smith','Jones','Taylor','Brown','Williams','Wilson','Johnson','Davies','Robinson',
    'Wright','Thompson','Evans','Walker','White','Harris','Lewis','Martin','Clarke',
    'Jackson','Turner','King','Moore','Hall','Bell','Wood','Green','Hughes','Edwards',
    'Cooper','Ward','Phillips','Campbell','Parker','Collins','Murphy','Bennett','Gray',
    'Rogers','Mitchell','Young','Hunt','Reid','Kelly','Morris','Watson','Foster',
    'Carter','Shaw','Baker','Stevens','Price','Butler','Richardson','Fox','Hayes',
    'Chapman','Morgan','Owens','Matthews','Marshall','Holmes','Palmer','Lane',
];

// ---------- Formations ----------
const PLM_FORMATIONS = {
    '4-4-2':   { def: 4, mid: 4, fwd: 2, atk:  0,    defMod:  0,    desc: 'Balanced. The classic English shape.' },
    '4-3-3':   { def: 4, mid: 3, fwd: 3, atk: +0.10, defMod: -0.05, desc: 'Attacking. Three up top, more goals expected.' },
    '3-5-2':   { def: 3, mid: 5, fwd: 2, atk: +0.03, defMod: -0.03, desc: 'Midfield-heavy. Controls the game but thin at the back.' },
    '4-2-3-1': { def: 4, mid: 5, fwd: 1, atk: +0.03, defMod: +0.03, desc: 'Modern. One striker, creative No.10.' },
    '5-3-2':   { def: 5, mid: 3, fwd: 2, atk: -0.05, defMod: +0.08, desc: 'Defensive. Hard to break down, low on goals.' },
};
const PLM_DEFAULT_FORMATION = '4-4-2';

function plmAutoPickXI(squad, formationKey) {
    const f = PLM_FORMATIONS[formationKey] || PLM_FORMATIONS[PLM_DEFAULT_FORMATION];
    const byPos = { GK: [], DEF: [], MID: [], FWD: [] };
    const available = (squad || []).filter(plmIsAvailable);
    for (const p of available) if (byPos[p.pos]) byPos[p.pos].push(p);
    for (const k of Object.keys(byPos)) byPos[k].sort((a, b) => b.rating - a.rating);
    const xi = [];
    const pick = (pos, n) => { for (let i = 0; i < n; i++) if (byPos[pos][i]) xi.push(byPos[pos][i]); };
    pick('GK', 1); pick('DEF', f.def); pick('MID', f.mid); pick('FWD', f.fwd);
    if (xi.length < 11) {
        const have = new Set(xi.map(p => p.id));
        const extras = available.filter(p => !have.has(p.id))
            .sort((a, b) => b.rating - a.rating).slice(0, 11 - xi.length);
        xi.push(...extras);
    }
    return xi.slice(0, 11);
}

// ---------- Fixture generation ----------
function plmGenerateFixtures(teams) {
    const ids = teams.map(t => t.id);
    if (ids.length % 2 !== 0) ids.push(null);
    const n = ids.length, rounds = n - 1, half = n / 2;
    const arr = ids.slice();
    const firstHalf = [];
    for (let r = 0; r < rounds; r++) {
        const matches = [];
        for (let i = 0; i < half; i++) {
            const a = arr[i], b = arr[n - 1 - i];
            if (a && b) {
                if ((r + i) % 2 === 0) matches.push({ home: a, away: b });
                else matches.push({ home: b, away: a });
            }
        }
        firstHalf.push(matches);
        arr.splice(1, 0, arr.pop());
    }
    const secondHalf = firstHalf.map(round => round.map(m => ({ home: m.away, away: m.home })));
    return [...firstHalf, ...secondHalf];
}

// ---------- Squad generation ----------
function plmMakePRNG(seedStr) {
    let h = 2166136261;
    for (let i = 0; i < seedStr.length; i++) h = (h ^ seedStr.charCodeAt(i)) * 16777619 >>> 0;
    return () => { h = (h * 1103515245 + 12345) >>> 0; return (h & 0x7fffffff) / 0x7fffffff; };
}

function plmGenerateSquad(team) {
    const raw = (typeof PLM_SQUADS !== 'undefined' && PLM_SQUADS[team.id]) ? PLM_SQUADS[team.id] : null;
    if (!raw) return plmFallbackSquad(team);
    return raw.map((p, i) => ({
        id: `${team.id}_${i}`,
        name: p.name, pos: p.pos, rating: p.rating,
        goals: 0, assists: 0, yellows: 0, reds: 0, suspended: 0, injured: 0,
    }));
}

function plmFallbackSquad(team) {
    const rng = plmMakePRNG(team.id);
    const pickFrom = arr => arr[Math.floor(rng() * arr.length)];
    const roles = [
        { pos: 'GK',  count: 2, modifier: -3 },
        { pos: 'DEF', count: 5, modifier: -2 },
        { pos: 'MID', count: 5, modifier:  0 },
        { pos: 'FWD', count: 4, modifier: +3 },
    ];
    const squad = [];
    let i = 0;
    for (const role of roles) {
        for (let n = 0; n < role.count; n++) {
            squad.push({
                id: `${team.id}_${i++}`,
                name: `${pickFrom(PLM_FIRST_NAMES)} ${pickFrom(PLM_LAST_NAMES)}`,
                pos: role.pos,
                rating: Math.max(55, Math.min(92, team.rating + role.modifier + Math.floor(rng() * 9) - 4)),
                goals: 0, assists: 0, yellows: 0, reds: 0, suspended: 0, injured: 0,
            });
        }
    }
    return squad;
}

// ---------- Availability ----------
const PLM_YELLOW_BAN_THRESHOLD = 5;
const PLM_RED_BAN_MATCHES = 2;
const PLM_INJURY_CHANCE_PER_MATCH = 0.08;
const PLM_INJURY_DURATIONS = [1, 1, 1, 1, 1, 2, 2, 2, 3, 4, 6];

function plmIsAvailable(p) { return p && p.suspended <= 0 && p.injured <= 0; }
function plmUnavailabilityReason(p) {
    if (!p) return null;
    if (p.suspended > 0) return `🚫 suspended (${p.suspended})`;
    if (p.injured   > 0) return `🤕 injured (${p.injured})`;
    return null;
}

// ---------- Match simulation ----------
function plmPoissonSample(lambda) {
    const L = Math.exp(-lambda); let k = 0, p = 1;
    do { k++; p *= Math.random(); } while (p > L);
    return k - 1;
}
function plmAvgRating(xi) { return xi.reduce((s, p) => s + p.rating, 0) / xi.length; }
function plmPickGoalscorer(xi) {
    const weights = { FWD: 6, MID: 3, DEF: 1, GK: 0.05 };
    const pool = xi.map(p => ({ p, w: (weights[p.pos] || 1) * (p.rating / 75) }));
    const total = pool.reduce((s, x) => s + x.w, 0);
    let r = Math.random() * total;
    for (const x of pool) { r -= x.w; if (r <= 0) return x.p; }
    return pool[0].p;
}
function plmPickBookedPlayer(xi) {
    const weights = { FWD: 1, MID: 2, DEF: 3, GK: 0.2 };
    const pool = xi.map(p => ({ p, w: weights[p.pos] || 1 }));
    const total = pool.reduce((s, x) => s + x.w, 0);
    let r = Math.random() * total;
    for (const x of pool) { r -= x.w; if (r <= 0) return x.p; }
    return pool[0].p;
}

function plmSimulateMatch(homeTeam, homeXI, awayTeam, awayXI, homeFormation, awayFormation) {
    const hForm = PLM_FORMATIONS[homeFormation] || PLM_FORMATIONS[PLM_DEFAULT_FORMATION];
    const aForm = PLM_FORMATIONS[awayFormation] || PLM_FORMATIONS[PLM_DEFAULT_FORMATION];
    const homeRating = plmAvgRating(homeXI) + 3;
    const awayRating = plmAvgRating(awayXI);
    const lambdaHome = Math.max(0.2, (homeRating / 40) * (1 + hForm.atk) * (1 - aForm.defMod));
    const lambdaAway = Math.max(0.2, (awayRating / 40) * (1 + aForm.atk) * (1 - hForm.defMod));
    const hs = plmPoissonSample(lambdaHome);
    const as = plmPoissonSample(lambdaAway);

    const goalEntries = [];
    for (let i = 0; i < hs; i++) goalEntries.push({ side: 'home', min: 1 + Math.floor(Math.random() * 89) });
    for (let i = 0; i < as; i++) goalEntries.push({ side: 'away', min: 1 + Math.floor(Math.random() * 89) });
    goalEntries.sort((a, b) => a.min - b.min);

    const events = [];
    let hScore = 0, aScore = 0, htH = 0, htA = 0;
    for (const g of goalEntries) {
        const team = g.side === 'home' ? homeTeam : awayTeam;
        const xi   = g.side === 'home' ? homeXI   : awayXI;
        const scorer = plmPickGoalscorer(xi);
        scorer.goals = (scorer.goals || 0) + 1;
        if (g.side === 'home') hScore++; else aScore++;
        if (g.min <= 45) { htH = hScore; htA = aScore; }
        events.push({ min: g.min, type: 'goal',
            text: `⚽ ${g.min}' GOAL! ${scorer.name} (${team.short}) scores. ${homeTeam.short} ${hScore} - ${aScore} ${awayTeam.short}` });
    }

    const banEvents = [];
    const cardCount = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < cardCount; i++) {
        const side = Math.random() < 0.5 ? 'home' : 'away';
        const team = side === 'home' ? homeTeam : awayTeam;
        const xi   = side === 'home' ? homeXI   : awayXI;
        const player = plmPickBookedPlayer(xi);
        const min = 5 + Math.floor(Math.random() * 85);
        player.yellows = (player.yellows || 0) + 1;
        events.push({ min, type: 'yellow', text: `🟨 ${min}' ${player.name} (${team.short}) booked.` });
        if (player.yellows % PLM_YELLOW_BAN_THRESHOLD === 0) {
            player.suspended = (player.suspended || 0) + 1;
            banEvents.push({ min: 91, type: 'ban',
                text: `⛔ ${player.name} (${team.short}) earns a one-match ban — ${player.yellows} yellows.` });
        }
    }
    if (Math.random() < 0.08) {
        const side = Math.random() < 0.5 ? 'home' : 'away';
        const team = side === 'home' ? homeTeam : awayTeam;
        const xi   = side === 'home' ? homeXI   : awayXI;
        const player = plmPickBookedPlayer(xi);
        const min = 30 + Math.floor(Math.random() * 60);
        player.reds = (player.reds || 0) + 1;
        player.suspended = (player.suspended || 0) + PLM_RED_BAN_MATCHES;
        events.push({ min, type: 'red',
            text: `🟥 ${min}' RED CARD — ${player.name} (${team.short}) sent off! ${PLM_RED_BAN_MATCHES}-match ban.` });
    }
    if (Math.random() < PLM_INJURY_CHANCE_PER_MATCH) {
        const side = Math.random() < 0.5 ? 'home' : 'away';
        const team = side === 'home' ? homeTeam : awayTeam;
        const xi   = side === 'home' ? homeXI   : awayXI;
        const candidates = xi.filter(p => p.pos !== 'GK');
        const victim = candidates[Math.floor(Math.random() * candidates.length)] || xi[0];
        const min = 10 + Math.floor(Math.random() * 75);
        const dur = PLM_INJURY_DURATIONS[Math.floor(Math.random() * PLM_INJURY_DURATIONS.length)];
        victim.injured = (victim.injured || 0) + dur;
        events.push({ min, type: 'injury',
            text: `🤕 ${min}' ${victim.name} (${team.short}) limps off — out for ${dur} match${dur === 1 ? '' : 'es'}.` });
    }
    events.push(...banEvents);
    events.sort((a, b) => a.min - b.min);
    const timeline = [
        { min: 0,  type: 'kickoff', text: `🏟️ Kick-off: ${homeTeam.name} vs ${awayTeam.name}` },
        ...events.filter(e => e.min <= 45),
        { min: 45, type: 'ht',      text: `⏸️ Half-time: ${homeTeam.short} ${htH} - ${htA} ${awayTeam.short}` },
        ...events.filter(e => e.min > 45),
        { min: 90, type: 'ft',      text: `⏹️ Full-time: ${homeTeam.short} ${hScore} - ${aScore} ${awayTeam.short}` },
    ];
    return { homeScore: hScore, awayScore: aScore, timeline };
}

// ---------- Table ----------
function plmEmptyTable() {
    const t = {};
    for (const team of PLM_TEAMS) t[team.id] = { id: team.id, P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 };
    return t;
}
function plmApplyResult(table, homeId, awayId, hs, as) {
    const H = table[homeId], A = table[awayId];
    H.P++; A.P++;
    H.GF += hs; H.GA += as; A.GF += as; A.GA += hs;
    H.GD = H.GF - H.GA; A.GD = A.GF - A.GA;
    if (hs > as) { H.W++; A.L++; H.Pts += 3; }
    else if (hs < as) { A.W++; H.L++; A.Pts += 3; }
    else { H.D++; A.D++; H.Pts++; A.Pts++; }
}
function plmSortedTable(table) {
    return Object.values(table).sort((a, b) => b.Pts - a.Pts || b.GD - a.GD || b.GF - a.GF);
}

// ---------- Status badge ----------
function plmStatusBadge(p) {
    const bits = [];
    if (p.suspended > 0) bits.push(`<span class="plm-badge badge-sus">🚫${p.suspended}</span>`);
    if (p.injured   > 0) bits.push(`<span class="plm-badge badge-inj">🤕${p.injured}</span>`);
    if (p.reds      > 0) bits.push(`<span class="plm-badge badge-red">🟥${p.reds}</span>`);
    if (p.yellows   >= 4) bits.push(`<span class="plm-badge badge-yel">🟨${p.yellows}</span>`);
    return bits.length ? ` ${bits.join(' ')}` : '';
}

// ---------- Save key (v2 — new state shape) ----------
const PLM_SAVE_KEY = 'plm_save_v2';

// ---------- Game class ----------
class PLManager {
    constructor() {
        this.rootEl = document.getElementById('plm-root');
        if (!this.rootEl) return;
        this.squads = {};
        for (const team of PLM_TEAMS) this.squads[team.id] = plmGenerateSquad(team);
        this._tFilter = 'all';
        this._pFilter = 'all';
        this.load();
        this.render();
    }

    // ---- persistence ----
    load() {
        try {
            const raw = localStorage.getItem(PLM_SAVE_KEY);
            this.state = raw ? JSON.parse(raw) : null;
        } catch (e) { this.state = null; }
        if (this.state && (!this.state.playerTeam || !this.state.fixtures)) this.state = null;
        if (this.state) {
            const known = new Set(PLM_TEAMS.map(t => t.id));
            const ok = this.state.fixtures.every(r => r.every(fx => known.has(fx.home) && known.has(fx.away)));
            if (!known.has(this.state.playerTeam) || !ok) {
                localStorage.removeItem(PLM_SAVE_KEY);
                this.state = null;
            }
        }
    }
    save() {
        try { localStorage.setItem(PLM_SAVE_KEY, JSON.stringify(this.state)); } catch (e) {}
    }

    // ---- new game ----
    newGame(playerTeamId, carryoverBudgets = null) {
        const budgets = {};
        for (const team of PLM_TEAMS) {
            budgets[team.id] = carryoverBudgets
                ? (carryoverBudgets[team.id] ?? PLM_TEAM_BUDGETS[team.id] ?? 20)
                : (PLM_TEAM_BUDGETS[team.id] ?? 20);
        }
        this.state = {
            playerTeam:       playerTeamId,
            season:           1,
            matchDay:         1,
            fixtures:         plmGenerateFixtures(PLM_TEAMS),
            results:          [],
            table:            plmEmptyTable(),
            screen:           'transferWindow',
            transferWindowType: 'summer',
            lastMatch:        null,
            formation:        PLM_DEFAULT_FORMATION,
            xi:               [],
            budgets,
            freeAgents:       plmGenerateFreeAgentPool(),
            transferLog:      [],
            janWindowDone:    false,
            prizeAwarded:     false,
        };
        for (const team of PLM_TEAMS) this.squads[team.id] = plmGenerateSquad(team);
        this.state.xi = plmAutoPickXI(this.squads[playerTeamId], PLM_DEFAULT_FORMATION).map(p => p.id);
        // AI teams do their summer business before the player gets the window.
        this.doAITransfers('summer');
        this.save();
    }

    quitSave() {
        if (!confirm('Quit the current season and pick a new team? This erases your save.')) return;
        localStorage.removeItem(PLM_SAVE_KEY);
        this.state = null;
        this.render();
    }

    // ---- helpers ----
    currentFixtures() { return this.state ? (this.state.fixtures[this.state.matchDay - 1] || []) : []; }
    playerFixture()   { return this.currentFixtures().find(m => m.home === this.state.playerTeam || m.away === this.state.playerTeam); }
    playerTeam()      { return PLM_TEAMS_BY_ID[this.state.playerTeam]; }
    budget()          { return this.state.budgets ? (this.state.budgets[this.state.playerTeam] || 0) : 0; }

    // ---- AI transfer logic ----
    doAITransfers(windowType) {
        const log  = [];
        const fas  = this.state.freeAgents;
        const aiTeams = PLM_TEAMS.filter(t => t.id !== this.state.playerTeam);
        // Shuffle so teams compete fairly for the best free agents.
        for (let i = aiTeams.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [aiTeams[i], aiTeams[j]] = [aiTeams[j], aiTeams[i]];
        }
        for (const team of aiTeams) {
            const squad = this.squads[team.id];
            const sellChance = windowType === 'summer' ? 0.85 : 0.65;
            // --- Sell worst non-GK player ---
            if (Math.random() < sellChance && squad.length > 14) {
                const weakest = squad.filter(p => p.pos !== 'GK').sort((a, b) => a.rating - b.rating)[0];
                if (weakest) {
                    const sp = Math.round(plmPlayerValue(weakest.rating) * (0.8 + Math.random() * 0.2));
                    this.state.budgets[team.id] = (this.state.budgets[team.id] || 0) + sp;
                    squad.splice(squad.indexOf(weakest), 1);
                    fas.push({ ...weakest, id: plmUniqueId('fa'), value: Math.round(plmPlayerValue(weakest.rating)) });
                    log.push(`💰 ${team.name} sell ${weakest.name} (${weakest.pos} ${weakest.rating}) for £${sp}m`);
                }
            }
            // --- Buy 1-2 players (1 in January) ---
            const maxBuys = windowType === 'summer' ? (Math.random() < 0.4 ? 2 : 1) : 1;
            let bought = 0;
            const affordable = fas
                .filter(p => p.value > 0 && p.value <= (this.state.budgets[team.id] || 0))
                .sort((a, b) => b.rating - a.rating);
            for (const fa of affordable) {
                if (bought >= maxBuys || squad.length >= 23) break;
                if (fa.value > (this.state.budgets[team.id] || 0)) continue;
                this.state.budgets[team.id] -= fa.value;
                fas.splice(fas.indexOf(fa), 1);
                squad.push({ ...fa, id: plmUniqueId(team.id),
                    goals: 0, assists: 0, yellows: 0, reds: 0, suspended: 0, injured: 0 });
                log.push(`✍️ ${team.name} sign ${fa.name} (${fa.pos} ${fa.rating}) for £${fa.value}m`);
                bought++;
            }
        }
        this.state.transferLog = [...(this.state.transferLog || []), ...log];
    }

    // ---- Player buys a free agent ----
    buyPlayer(faId) {
        const fas   = this.state.freeAgents || [];
        const fa    = fas.find(p => p.id === faId);
        if (!fa) return;
        const budget = this.budget();
        const squad  = this.squads[this.state.playerTeam];
        if (fa.value > budget || squad.length >= 25) return;
        this.state.budgets[this.state.playerTeam] -= fa.value;
        fas.splice(fas.indexOf(fa), 1);
        squad.push({ ...fa, id: plmUniqueId(this.state.playerTeam),
            goals: 0, assists: 0, yellows: 0, reds: 0, suspended: 0, injured: 0 });
        this.state.transferLog.push(`✍️ You sign ${fa.name} (${fa.pos} ${fa.rating}) for £${fa.value}m`);
        this.save();
        this.renderTransferWindow();
    }

    // ---- Player sells one of their players ----
    sellPlayer(playerId) {
        const squad = this.squads[this.state.playerTeam];
        if (squad.length <= 14) return;
        const idx = squad.findIndex(p => p.id === playerId);
        if (idx < 0) return;
        const sold = squad.splice(idx, 1)[0];
        const sp   = Math.round(plmPlayerValue(sold.rating) * 0.9);
        this.state.budgets[this.state.playerTeam] = (this.state.budgets[this.state.playerTeam] || 0) + sp;
        if (this.state.xi) this.state.xi = this.state.xi.filter(id => id !== playerId);
        this.state.freeAgents.push({ ...sold, id: plmUniqueId('fa'), value: Math.round(plmPlayerValue(sold.rating)) });
        this.state.transferLog.push(`💰 You sell ${sold.name} (${sold.pos} ${sold.rating}) for £${sp}m`);
        this.save();
        this.renderTransferWindow();
    }

    // ---- match-day execution ----
    getXIFor(teamId) {
        if (teamId === this.state.playerTeam && this.state.xi && this.state.xi.length === 11) {
            const squad  = this.squads[teamId];
            const byId   = Object.fromEntries(squad.map(p => [p.id, p]));
            const resolved = this.state.xi.map(id => byId[id]).filter(Boolean);
            if (resolved.length === 11) return resolved;
        }
        const formation = teamId === this.state.playerTeam
            ? (this.state.formation || PLM_DEFAULT_FORMATION) : PLM_DEFAULT_FORMATION;
        return plmAutoPickXI(this.squads[teamId], formation);
    }
    getFormationFor(teamId) {
        if (teamId === this.state.playerTeam && this.state.formation) return this.state.formation;
        return PLM_DEFAULT_FORMATION;
    }

    playMatchDay() {
        const md = this.state.matchDay;
        let playerResult = null;
        for (const fx of this.currentFixtures()) {
            const home = PLM_TEAMS_BY_ID[fx.home], away = PLM_TEAMS_BY_ID[fx.away];
            const homeXI = this.getXIFor(home.id), awayXI = this.getXIFor(away.id);
            const sim = plmSimulateMatch(home, homeXI, away, awayXI,
                this.getFormationFor(home.id), this.getFormationFor(away.id));
            plmApplyResult(this.state.table, home.id, away.id, sim.homeScore, sim.awayScore);
            this.state.results.push({ matchDay: md, home: home.id, away: away.id, hs: sim.homeScore, as: sim.awayScore });
            if (home.id === this.state.playerTeam || away.id === this.state.playerTeam)
                playerResult = { fixture: fx, ...sim, home, away };
        }
        // Tick suspension / injury counters.
        for (const teamId of Object.keys(this.squads))
            for (const p of this.squads[teamId]) { if (p.suspended > 0) p.suspended--; if (p.injured > 0) p.injured--; }
        // Auto-fill any gaps in the player's XI.
        if (this.state.xi) {
            const squad  = this.squads[this.state.playerTeam];
            const byId   = Object.fromEntries(squad.map(p => [p.id, p]));
            const limits = this.xiLimitsFor(this.state.formation);
            const kept   = { GK: [], DEF: [], MID: [], FWD: [] };
            for (const id of this.state.xi) {
                const p = byId[id];
                if (p && plmIsAvailable(p)) kept[p.pos].push(p);
            }
            const inXI = new Set(this.state.xi.filter(id => { const p = byId[id]; return p && plmIsAvailable(p); }));
            for (const pos of ['GK','DEF','MID','FWD']) {
                const want = limits[pos] - kept[pos].length;
                if (want <= 0) continue;
                const subs = squad.filter(p => p.pos === pos && plmIsAvailable(p) && !inXI.has(p.id))
                    .sort((a, b) => b.rating - a.rating).slice(0, want);
                kept[pos].push(...subs);
                for (const s of subs) inXI.add(s.id);
            }
            this.state.xi = [...kept.GK, ...kept.DEF, ...kept.MID, ...kept.FWD].map(p => p.id);
        }

        this.state.lastMatch = playerResult;
        this.state.matchDay++;

        if (this.state.matchDay > this.state.fixtures.length) {
            this.state.screen = 'seasonEnd';
        } else {
            this.state.screen = 'matchResult';
        }
        this.save();
        this.render();
    }

    // ---- rendering ----
    render() {
        if (!this.rootEl) return;
        if (!this.state) return this.renderTeamSelect();
        // Patch old/missing fields.
        if (!this.state.formation)    this.state.formation    = PLM_DEFAULT_FORMATION;
        if (!this.state.xi)           this.state.xi           = plmAutoPickXI(this.squads[this.state.playerTeam], this.state.formation).map(p => p.id);
        if (!this.state.budgets)      this.state.budgets      = Object.fromEntries(PLM_TEAMS.map(t => [t.id, PLM_TEAM_BUDGETS[t.id] || 20]));
        if (!this.state.freeAgents)   this.state.freeAgents   = plmGenerateFreeAgentPool();
        if (!this.state.transferLog)  this.state.transferLog  = [];
        switch (this.state.screen) {
            case 'transferWindow': return this.renderTransferWindow();
            case 'pickxi':         return this.renderPickXI();
            case 'matchResult':    return this.renderMatchResult();
            case 'seasonEnd':      return this.renderSeasonEnd();
            default:               return this.renderDashboard();
        }
    }

    // ---- Team select ----
    renderTeamSelect() {
        const cards = PLM_TEAMS.map(t => {
            const budget = PLM_TEAM_BUDGETS[t.id] || 20;
            return `
                <button class="plm-team-card" data-team="${t.id}"
                        style="background:${t.color};color:${t.text}">
                    <span class="plm-team-name">${t.name}</span>
                    <span class="plm-team-meta">OVR <b>${t.rating}</b> · Budget <b>£${budget}m</b></span>
                </button>`;
        }).join('');
        this.rootEl.innerHTML = `
            <div class="plm-select">
                <h2 class="plm-select-h">Pick your club</h2>
                <p class="plm-select-sub">Take charge and play through a 38-match Premier League season. Each club has a realistic transfer budget.</p>
                <div class="plm-team-grid">${cards}</div>
            </div>`;
        this.rootEl.querySelectorAll('.plm-team-card').forEach(el =>
            el.addEventListener('click', () => { this.newGame(el.getAttribute('data-team')); this.render(); })
        );
    }

    // ---- Transfer window ----
    renderTransferWindow() {
        const team   = this.playerTeam();
        const squad  = this.squads[this.state.playerTeam];
        const budget = this.budget();
        const windowType  = this.state.transferWindowType || 'summer';
        const windowLabel = windowType === 'summer' ? '☀️ Summer Transfer Window' : '❄️ January Transfer Window';
        const closeLabel  = windowType === 'summer' ? 'Begin Season →' : 'Close Window & Continue →';
        const recentLog   = (this.state.transferLog || []).slice(-25);

        // Build the market from other clubs' real squads.
        const tFilter = this._tFilter || 'all';
        const pFilter = this._pFilter || 'all';
        const allMarket = [];
        for (const t of PLM_TEAMS) {
            if (t.id === this.state.playerTeam) continue;
            for (const p of this.squads[t.id]) {
                allMarket.push({ ...p, sellingTeamId: t.id, sellingTeam: t, value: plmPlayerValue(p.rating) });
            }
        }
        allMarket.sort((a, b) => b.rating - a.rating);
        const filtered = allMarket.filter(p =>
            (tFilter === 'all' || p.sellingTeamId === tFilter) &&
            (pFilter === 'all' || p.pos === pFilter)
        );

        const teamOpts = [{ id: 'all', name: 'All Clubs' },
            ...PLM_TEAMS.filter(t => t.id !== this.state.playerTeam)]
            .map(t => `<option value="${t.id}" ${t.id === tFilter ? 'selected' : ''}>${t.name}</option>`)
            .join('');
        const posOpts = [['all','All Positions'],['GK','GK'],['DEF','DEF'],['MID','MID'],['FWD','FWD']]
            .map(([v, l]) => `<option value="${v}" ${v === pFilter ? 'selected' : ''}>${l}</option>`)
            .join('');

        const buyRows = filtered.map(p => {
            const canAfford = p.value <= budget;
            const canBuy    = canAfford && squad.length < 25;
            const badge     = `<span class="plm-market-club" style="background:${p.sellingTeam.color};color:${p.sellingTeam.text}">${p.sellingTeam.short}</span>`;
            const btn       = canBuy
                ? `<button class="plm-xfer-btn plm-buy-btn" data-pid="${p.id}" data-tid="${p.sellingTeamId}">Buy £${p.value}m</button>`
                : `<span class="plm-xfer-price">£${p.value}m</span>`;
            return `<tr class="${canAfford ? '' : 'plm-fa-unaffordable'}">
                <td class="plm-sq-pos pos-${p.pos}">${p.pos}</td>
                <td class="plm-sq-name">${p.name} ${badge}</td>
                <td class="plm-sq-rating">${p.rating}</td>
                <td>${btn}</td>
            </tr>`;
        }).join('');

        const sellRows = [...squad].sort((a, b) => a.rating - b.rating).map(p => {
            const sp      = Math.round(plmPlayerValue(p.rating) * 0.9);
            const canSell = squad.length > 14;
            const btn     = canSell
                ? `<button class="plm-xfer-btn plm-sell-btn" data-pid="${p.id}">Sell £${sp}m</button>`
                : `<span class="plm-xfer-price">Min squad</span>`;
            return `<tr>
                <td class="plm-sq-pos pos-${p.pos}">${p.pos}</td>
                <td class="plm-sq-name">${p.name}${plmStatusBadge(p)}</td>
                <td class="plm-sq-rating">${p.rating}</td>
                <td>${btn}</td>
            </tr>`;
        }).join('');

        this.rootEl.innerHTML = `
            <div class="plm-transfer">
                <header class="plm-header" style="background:${team.color};color:${team.text}">
                    <div>
                        <div class="plm-hdr-small">${windowLabel} · Season ${this.state.season}</div>
                        <div class="plm-hdr-name">${team.name}</div>
                    </div>
                    <div class="plm-hdr-right">
                        <div class="plm-hdr-small">Transfer Budget</div>
                        <div class="plm-hdr-name">£${budget}m</div>
                    </div>
                </header>

                <div class="plm-transfer-body">
                    <div class="plm-transfer-cols">

                        <section class="plm-transfer-section">
                            <h3>🛒 Buy Players <span class="plm-budget-chip">£${budget}m left</span></h3>
                            <div class="plm-transfer-filters">
                                <select id="plm-tfilter">${teamOpts}</select>
                                <select id="plm-pfilter">${posOpts}</select>
                            </div>
                            <p class="plm-transfer-hint">
                                ${filtered.length} player${filtered.length !== 1 ? 's' : ''} shown · Squad ${squad.length}/25 · Dimmed = over budget
                            </p>
                            <div class="plm-transfer-scroll">
                                <table class="plm-squad">
                                    <thead><tr><th>Pos</th><th>Name</th><th>Rtg</th><th>Fee</th></tr></thead>
                                    <tbody>${buyRows || '<tr><td colspan="4" style="text-align:center;padding:12px;color:#888">No players match your filters.</td></tr>'}</tbody>
                                </table>
                            </div>
                        </section>

                        <section class="plm-transfer-section">
                            <h3>💰 Sell Players</h3>
                            <p class="plm-transfer-hint">Min squad 14 · You have ${squad.length} · Sale price = 90% of market value</p>
                            <div class="plm-transfer-scroll">
                                <table class="plm-squad">
                                    <thead><tr><th>Pos</th><th>Name</th><th>Rtg</th><th>Fee</th></tr></thead>
                                    <tbody>${sellRows}</tbody>
                                </table>
                            </div>
                        </section>
                    </div>

                    <section class="plm-transfer-section plm-transfer-news">
                        <h3>📰 Transfer News</h3>
                        <ul class="plm-transfer-log">
                            ${recentLog.length
                                ? [...recentLog].reverse().map(l => `<li>${l}</li>`).join('')
                                : '<li style="color:#888">No transfers yet this window.</li>'}
                        </ul>
                    </section>
                </div>

                <div class="plm-transfer-footer">
                    <button class="plm-play-btn" id="plm-close-window">${closeLabel}</button>
                </div>
            </div>`;

        this.rootEl.querySelector('#plm-tfilter').addEventListener('change', e => {
            this._tFilter = e.target.value; this.renderTransferWindow();
        });
        this.rootEl.querySelector('#plm-pfilter').addEventListener('change', e => {
            this._pFilter = e.target.value; this.renderTransferWindow();
        });
        this.rootEl.querySelectorAll('.plm-buy-btn').forEach(btn =>
            btn.addEventListener('click', () =>
                this.buyFromClub(btn.getAttribute('data-pid'), btn.getAttribute('data-tid')))
        );
        this.rootEl.querySelectorAll('.plm-sell-btn').forEach(btn =>
            btn.addEventListener('click', () => this.sellPlayer(btn.getAttribute('data-pid')))
        );
        this.rootEl.querySelector('#plm-close-window').addEventListener('click', () => {
            if (this.state.transferWindowType === 'january') this.state.janWindowDone = true;
            this._tFilter = 'all';
            this._pFilter = 'all';
            this.state.screen = 'dashboard';
            this.save();
            this.render();
        });
    }

    // ---- Buy a real player from another club ----
    buyFromClub(playerId, sellingTeamId) {
        const sellingSquad = this.squads[sellingTeamId];
        const idx = sellingSquad.findIndex(p => p.id === playerId);
        if (idx < 0) return;
        const player = sellingSquad[idx];
        const value  = plmPlayerValue(player.rating);
        const squad  = this.squads[this.state.playerTeam];
        if (value > this.budget() || squad.length >= 25) return;

        // Move player between squads.
        sellingSquad.splice(idx, 1);
        squad.push({ ...player });

        // Debit buyer, credit seller (90% of market value as fee).
        this.state.budgets[this.state.playerTeam] -= value;
        this.state.budgets[sellingTeamId] = (this.state.budgets[sellingTeamId] || 0) + Math.round(value * 0.9);

        const sellingTeam = PLM_TEAMS_BY_ID[sellingTeamId];
        this.state.transferLog.push(`✍️ You sign ${player.name} from ${sellingTeam.name} for £${value}m`);
        this.save();
        this.renderTransferWindow();
    }

    // ---- Dashboard ----
    renderDashboard() {
        const team = this.playerTeam();
        const fx   = this.playerFixture();
        const isHome   = fx && fx.home === team.id;
        const opponent = fx ? PLM_TEAMS_BY_ID[isHome ? fx.away : fx.home] : null;
        const venue    = isHome ? 'vs' : '@';
        const budget   = this.budget();

        this.rootEl.innerHTML = `
            <div class="plm-dashboard">
                <header class="plm-header" style="background:${team.color};color:${team.text}">
                    <div>
                        <div class="plm-hdr-small">You are managing</div>
                        <div class="plm-hdr-name">${team.name}</div>
                    </div>
                    <div class="plm-hdr-right">
                        <div class="plm-hdr-small">MD ${this.state.matchDay}/38 · Budget £${budget}m</div>
                        <div class="plm-hdr-name">Season ${this.state.season}</div>
                    </div>
                </header>

                ${fx ? `
                <section class="plm-next-match">
                    <h3>Next Match</h3>
                    <div class="plm-next-row">
                        <span class="plm-big">${team.short}</span>
                        <span class="plm-venue">${venue}</span>
                        <span class="plm-big" style="color:${opponent.color}">${opponent.short}</span>
                        <button class="plm-play-btn" id="plm-play">▶ Play Match</button>
                    </div>
                    <div class="plm-next-sub">${isHome ? 'Home' : 'Away'} · ${opponent.name} (OVR ${opponent.rating})</div>
                </section>` : ''}

                <section class="plm-grid">
                    <div class="plm-col">
                        <h3>League Table</h3>
                        ${this.tableHtml()}
                    </div>
                    <div class="plm-col">
                        <h3>Your Squad</h3>
                        ${this.squadHtml(team.id)}
                    </div>
                </section>

                <footer class="plm-footer">
                    <button class="plm-reset-btn" id="plm-reset">Quit season</button>
                </footer>
            </div>`;

        const play = this.rootEl.querySelector('#plm-play');
        if (play) play.addEventListener('click', () => {
            this.state.screen = 'pickxi'; this.save(); this.render();
        });
        this.rootEl.querySelector('#plm-reset').addEventListener('click', () => this.quitSave());
    }

    // ---- Pick XI ----
    xiPlayers() {
        const squad = this.squads[this.state.playerTeam];
        const byId  = Object.fromEntries(squad.map(p => [p.id, p]));
        return (this.state.xi || []).map(id => byId[id]).filter(Boolean);
    }
    xiCountByPos() {
        const counts = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
        for (const p of this.xiPlayers()) counts[p.pos]++;
        return counts;
    }
    xiLimitsFor(formationKey) {
        const f = PLM_FORMATIONS[formationKey] || PLM_FORMATIONS[PLM_DEFAULT_FORMATION];
        return { GK: 1, DEF: f.def, MID: f.mid, FWD: f.fwd };
    }
    xiHasSlotFor(pos) {
        const limits = this.xiLimitsFor(this.state.formation);
        return this.xiCountByPos()[pos] < limits[pos];
    }
    togglePlayerInXI(player) {
        const xi  = this.state.xi = this.state.xi || [];
        const idx = xi.indexOf(player.id);
        if (idx >= 0) {
            xi.splice(idx, 1);
        } else if (!plmIsAvailable(player)) {
            return;
        } else if (this.xiHasSlotFor(player.pos)) {
            xi.push(player.id);
        } else { return; }
        this.save();
        this.renderPickXI();
    }
    changeFormation(newFormation) {
        this.state.formation = newFormation;
        const limits = this.xiLimitsFor(newFormation);
        const squad  = this.squads[this.state.playerTeam];
        const byId   = Object.fromEntries(squad.map(p => [p.id, p]));
        const kept   = { GK: [], DEF: [], MID: [], FWD: [] };
        for (const id of (this.state.xi || [])) { const p = byId[id]; if (!p) continue; kept[p.pos].push(p); }
        for (const pos of Object.keys(kept)) {
            kept[pos].sort((a, b) => b.rating - a.rating);
            kept[pos] = kept[pos].slice(0, limits[pos]);
        }
        this.state.xi = [...kept.GK, ...kept.DEF, ...kept.MID, ...kept.FWD].map(p => p.id);
        this.save(); this.renderPickXI();
    }
    autoPickXI() {
        this.state.xi = plmAutoPickXI(this.squads[this.state.playerTeam], this.state.formation).map(p => p.id);
        this.save(); this.renderPickXI();
    }

    renderPickXI() {
        const team   = this.playerTeam();
        const squad  = this.squads[this.state.playerTeam];
        const xi     = this.xiPlayers();
        const xiIds  = new Set(xi.map(p => p.id));
        const limits = this.xiLimitsFor(this.state.formation);
        const counts = this.xiCountByPos();
        const isReady = xi.length === 11;

        const formationOpts = Object.keys(PLM_FORMATIONS).map(key =>
            `<option value="${key}" ${key === this.state.formation ? 'selected' : ''}>${key}</option>`
        ).join('');

        const xiByPos = { GK: [], DEF: [], MID: [], FWD: [] };
        for (const p of xi) xiByPos[p.pos].push(p);
        const renderSlot = p =>
            `<li class="plm-xi-slot"><button class="plm-xi-btn" data-pid="${p.id}">
                <span class="plm-xi-rating">${p.rating}</span>
                <span class="plm-xi-name">${p.name}</span>
                <span class="plm-xi-remove">✕</span>
            </button></li>`;
        const renderEmptySlots = (pos, n) => {
            const missing = n - xiByPos[pos].length;
            return Array.from({ length: Math.max(0, missing) }, () =>
                `<li class="plm-xi-slot empty">+ ${pos}</li>`).join('');
        };
        const renderPosRow = (pos) => `
            <div class="plm-xi-row">
                <div class="plm-xi-row-label"><span class="plm-sq-pos pos-${pos}">${pos}</span>
                    <span class="plm-xi-count">${counts[pos]}/${limits[pos]}</span></div>
                <ul class="plm-xi-slots">
                    ${xiByPos[pos].map(renderSlot).join('')}
                    ${renderEmptySlots(pos, limits[pos])}
                </ul>
            </div>`;

        const squadByPos = { GK: [], DEF: [], MID: [], FWD: [] };
        for (const p of squad) if (squadByPos[p.pos]) squadByPos[p.pos].push(p);
        for (const k of Object.keys(squadByPos)) squadByPos[k].sort((a, b) => b.rating - a.rating);

        const renderSquadRow = p => {
            const inXI       = xiIds.has(p.id);
            const unavailable = !plmIsAvailable(p);
            const canPick    = inXI || (!unavailable && this.xiHasSlotFor(p.pos));
            const cls  = ['plm-squad-pick', inXI ? 'picked' : '', unavailable ? 'unavailable' : (!canPick ? 'full' : '')].filter(Boolean).join(' ');
            const action = unavailable ? '🚫' : (inXI ? '−' : '+');
            return `<tr class="${cls}" data-pid="${p.id}">
                <td class="plm-sq-pos pos-${p.pos}">${p.pos}</td>
                <td class="plm-sq-name">${p.name}${plmStatusBadge(p)}</td>
                <td class="plm-sq-rating">${p.rating}</td>
                <td class="plm-sq-goals">${p.goals ? '⚽' + p.goals : ''}</td>
                <td class="plm-squad-action">${action}</td>
            </tr>`;
        };
        const squadRows = ['GK','DEF','MID','FWD'].flatMap(pos => squadByPos[pos].map(renderSquadRow)).join('');

        const fx  = this.playerFixture();
        const opp = fx ? PLM_TEAMS_BY_ID[fx.home === team.id ? fx.away : fx.home] : null;
        const vsText = opp ? `${fx.home === team.id ? 'vs' : '@'} ${opp.name}` : '';

        this.rootEl.innerHTML = `
            <div class="plm-pickxi">
                <header class="plm-pickxi-hdr" style="background:${team.color};color:${team.text}">
                    <div>
                        <div class="plm-hdr-small">Match day ${this.state.matchDay} · ${vsText}</div>
                        <div class="plm-hdr-name">Pick Your XI</div>
                    </div>
                    <button class="plm-reset-btn" id="plm-back">← Back</button>
                </header>
                <div class="plm-pickxi-controls">
                    <label class="plm-form-label">Formation
                        <select id="plm-formation">${formationOpts}</select>
                    </label>
                    <p class="plm-form-desc">${PLM_FORMATIONS[this.state.formation].desc}</p>
                    <div class="plm-pickxi-actions">
                        <button class="plm-reset-btn" id="plm-autopick">🎯 Auto-pick best XI</button>
                        <button class="plm-play-btn" id="plm-kickoff" ${isReady ? '' : 'disabled'}>
                            ▶ Play Match (${xi.length}/11)
                        </button>
                    </div>
                </div>
                <section class="plm-pickxi-grid">
                    <div class="plm-col">
                        <h3>Your XI — ${this.state.formation}</h3>
                        ${renderPosRow('GK')}${renderPosRow('DEF')}${renderPosRow('MID')}${renderPosRow('FWD')}
                    </div>
                    <div class="plm-col">
                        <h3>Squad (click to add / remove)</h3>
                        <table class="plm-squad plm-squad-picker">${squadRows}</table>
                    </div>
                </section>
            </div>`;

        this.rootEl.querySelector('#plm-back').addEventListener('click', () => { this.state.screen = 'dashboard'; this.save(); this.render(); });
        this.rootEl.querySelector('#plm-formation').addEventListener('change', e => this.changeFormation(e.target.value));
        this.rootEl.querySelector('#plm-autopick').addEventListener('click', () => this.autoPickXI());
        const kickoff = this.rootEl.querySelector('#plm-kickoff');
        if (kickoff && !kickoff.disabled) kickoff.addEventListener('click', () => this.playMatchDay());
        this.rootEl.querySelectorAll('.plm-xi-btn').forEach(btn => btn.addEventListener('click', () => {
            const p = this.squads[this.state.playerTeam].find(x => x.id === btn.getAttribute('data-pid'));
            if (p) this.togglePlayerInXI(p);
        }));
        this.rootEl.querySelectorAll('.plm-squad-pick').forEach(row => row.addEventListener('click', () => {
            const p = this.squads[this.state.playerTeam].find(x => x.id === row.getAttribute('data-pid'));
            if (p) this.togglePlayerInXI(p);
        }));
    }

    // ---- Match result ----
    renderMatchResult() {
        const res = this.state.lastMatch;
        if (!res) { this.state.screen = 'dashboard'; return this.render(); }
        const team   = this.playerTeam();
        const events = res.timeline.map(ev => {
            const cls = { goal:'ev-goal', yellow:'ev-yellow', red:'ev-red', ht:'ev-ht', ft:'ev-ft',
                          kickoff:'ev-kickoff', injury:'ev-injury', ban:'ev-ban' }[ev.type] || '';
            return `<li class="plm-ev ${cls}">${ev.text}</li>`;
        }).join('');
        const won  = (res.home.id === team.id && res.homeScore > res.awayScore) || (res.away.id === team.id && res.awayScore > res.homeScore);
        const lost = (res.home.id === team.id && res.homeScore < res.awayScore) || (res.away.id === team.id && res.awayScore < res.homeScore);
        const verdict = won ? '🎉 You won!' : lost ? '😞 You lost.' : '🤝 Draw.';

        // Show a hint if January window is about to open.
        const janHint = (this.state.matchDay === 20 && !this.state.janWindowDone)
            ? '<p class="plm-jan-hint">❄️ The January Transfer Window opens now — you can buy and sell players.</p>' : '';

        this.rootEl.innerHTML = `
            <div class="plm-match">
                <h2 class="plm-match-title">
                    ${res.home.short} <span class="plm-score">${res.homeScore} - ${res.awayScore}</span> ${res.away.short}
                </h2>
                <p class="plm-match-verdict">${verdict}</p>
                ${janHint}
                <ol class="plm-timeline">${events}</ol>
                <button class="plm-play-btn" id="plm-continue">Continue ▶</button>
            </div>`;

        this.rootEl.querySelector('#plm-continue').addEventListener('click', () => {
            // Open January window if this was match day 19 (matchDay now = 20).
            if (this.state.matchDay === 20 && !this.state.janWindowDone) {
                const extra = plmGenerateFreeAgentPool().slice(0, 20);
                this.state.freeAgents = [...(this.state.freeAgents || []), ...extra];
                this.doAITransfers('january');
                this.state.transferWindowType = 'january';
                this.state.screen = 'transferWindow';
            } else {
                this.state.screen = 'dashboard';
            }
            this.save();
            this.render();
        });
    }

    // ---- Season end ----
    renderSeasonEnd() {
        const team   = this.playerTeam();
        const sorted = plmSortedTable(this.state.table);
        const yourPos = sorted.findIndex(r => r.id === team.id) + 1;

        // Award prize money once.
        if (!this.state.prizeAwarded) {
            for (let i = 0; i < sorted.length; i++) {
                const prize = PLM_PRIZE_MONEY[i] || 24;
                this.state.budgets[sorted[i].id] = (this.state.budgets[sorted[i].id] || 0) + prize;
            }
            this.state.prizeAwarded = true;
            this.save();
        }

        const yourPrize  = PLM_PRIZE_MONEY[yourPos - 1] || 24;
        const nextBudget = this.budget();

        const ordinal = n => { const s = ['th','st','nd','rd'], v = n % 100; return n + (s[(v-20)%10] || s[v] || s[0]); };
        let verdict;
        if      (yourPos === 1)    verdict = `🏆 CHAMPIONS! ${team.name} win the Premier League!`;
        else if (yourPos <= 4)     verdict = `✨ Champions League qualification — finished ${ordinal(yourPos)}.`;
        else if (yourPos <= 7)     verdict = `🥈 European qualification — finished ${ordinal(yourPos)}.`;
        else if (yourPos >= 18)    verdict = `💀 Relegated — finished ${ordinal(yourPos)}.`;
        else                       verdict = `Finished ${ordinal(yourPos)}.`;

        // Prize money breakdown for the table.
        const prizeRows = sorted.map((r, i) => {
            const t     = PLM_TEAMS_BY_ID[r.id];
            const prize = PLM_PRIZE_MONEY[i] || 24;
            const cls   = r.id === this.state.playerTeam ? 'me' : '';
            return `<tr class="${cls}"><td>${i+1}</td><td>${t.name}</td><td>${r.Pts}pts</td><td>£${prize}m</td></tr>`;
        }).join('');

        this.rootEl.innerHTML = `
            <div class="plm-season-end">
                <h2>Season ${this.state.season} · Full Time</h2>
                <p class="plm-verdict-big">${verdict}</p>

                <div class="plm-prize-box">
                    <div class="plm-prize-pos">${ordinal(yourPos)} place</div>
                    <div class="plm-prize-amount">£${yourPrize}m prize money</div>
                    <div class="plm-prize-sub">Transfer budget for next season: <b>£${nextBudget}m</b></div>
                </div>

                <details class="plm-prize-details">
                    <summary>View prize money for all clubs</summary>
                    <table class="plm-table" style="margin-top:8px">
                        <thead><tr><th>#</th><th>Club</th><th>Points</th><th>Prize</th></tr></thead>
                        <tbody>${prizeRows}</tbody>
                    </table>
                </details>

                <h3 style="margin-top:18px">Final Table</h3>
                ${this.tableHtml()}

                <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:20px">
                    <button class="plm-play-btn" id="plm-next-season">Start Season ${this.state.season + 1} ▶</button>
                    <button class="plm-reset-btn" id="plm-reset">Pick a different club</button>
                </div>
            </div>`;

        this.rootEl.querySelector('#plm-next-season').addEventListener('click', () => {
            const teamId       = this.state.playerTeam;
            const season       = this.state.season + 1;
            const savedBudgets = { ...this.state.budgets }; // carry prize money into next season
            this.newGame(teamId, savedBudgets);
            this.state.season = season;
            this.save();
            this.render();
        });
        this.rootEl.querySelector('#plm-reset').addEventListener('click', () => this.quitSave());
    }

    // ---- Shared HTML helpers ----
    tableHtml() {
        const sorted = plmSortedTable(this.state.table);
        const rows   = sorted.map((r, i) => {
            const team = PLM_TEAMS_BY_ID[r.id];
            const pos  = i + 1;
            const cls  = pos <= 4 ? 'pos-cl' : pos <= 6 ? 'pos-eur' : pos >= 18 ? 'pos-rel' : '';
            const highlight = r.id === this.state.playerTeam ? 'me' : '';
            return `<tr class="${cls} ${highlight}">
                <td class="plm-tbl-pos">${pos}</td>
                <td class="plm-tbl-team"><span class="plm-tbl-dot" style="background:${team.color}"></span>${team.short}</td>
                <td>${r.P}</td><td>${r.W}</td><td>${r.D}</td><td>${r.L}</td>
                <td>${r.GF}:${r.GA}</td>
                <td>${r.GD > 0 ? '+' : ''}${r.GD}</td>
                <td><b>${r.Pts}</b></td>
            </tr>`;
        }).join('');
        return `<table class="plm-table">
            <thead><tr><th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF:GA</th><th>GD</th><th>Pts</th></tr></thead>
            <tbody>${rows}</tbody>
        </table>`;
    }

    squadHtml(teamId) {
        const squad  = this.squads[teamId];
        const groups = { GK: [], DEF: [], MID: [], FWD: [] };
        for (const p of squad) groups[p.pos].push(p);
        const rows = [];
        for (const pos of ['GK','DEF','MID','FWD']) {
            for (const p of groups[pos]) {
                rows.push(`<tr class="${plmIsAvailable(p) ? '' : 'unavailable'}">
                    <td class="plm-sq-pos pos-${p.pos}">${p.pos}</td>
                    <td class="plm-sq-name">${p.name}${plmStatusBadge(p)}</td>
                    <td class="plm-sq-rating">${p.rating}</td>
                    <td class="plm-sq-goals">${p.goals ? '⚽' + p.goals : ''}</td>
                </tr>`);
            }
        }
        return `<table class="plm-squad">${rows.join('')}</table>`;
    }
}

// ---------- Boot ----------
(function boot() {
    let inst = null;
    const maybeInit = () => {
        const page = document.getElementById('plmanager');
        if (!page || !page.classList.contains('active')) return;
        if (!inst) inst = new PLManager();
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', maybeInit);
    } else {
        maybeInit();
    }
    const origSwitch = window.switchTab;
    window.switchTab = function (tabName) {
        if (typeof origSwitch === 'function') origSwitch(tabName);
        if (tabName === 'plmanager') requestAnimationFrame(() => requestAnimationFrame(maybeInit));
    };
})();
