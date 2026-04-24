// ==================================================================
// Premier League Manager — pick a club, play the season.
//
// Session 1 scope:
// - 20 PL teams with procedurally-generated squads of 11 players each.
// - Full 38-match fixture list (double round-robin).
// - Probabilistic match simulation with event-based text commentary.
// - League table auto-updated after each match.
// - localStorage save so the season resumes between visits.
//
// Later sessions can add: tactics/formation picker, substitutions,
// transfer windows, multi-season, cup competitions, training.
// ==================================================================

// ---------- Teams (2023-24 classic PL lineup) ----------
// Ratings are a rough overall strength 60-90; influences match outcomes.
const PLM_TEAMS = [
    { id: 'arsenal',        name: 'Arsenal',              short: 'ARS', color: '#EF0107', text: '#ffffff', rating: 85 },
    { id: 'astonvilla',     name: 'Aston Villa',          short: 'AVL', color: '#670E36', text: '#ffffff', rating: 80 },
    { id: 'bournemouth',    name: 'Bournemouth',          short: 'BOU', color: '#DA291C', text: '#ffffff', rating: 72 },
    { id: 'brentford',      name: 'Brentford',            short: 'BRE', color: '#E30613', text: '#ffffff', rating: 73 },
    { id: 'brighton',       name: 'Brighton & Hove Albion',short:'BHA', color: '#0057B8', text: '#ffffff', rating: 76 },
    { id: 'burnley',        name: 'Burnley',              short: 'BUR', color: '#6C1D45', text: '#ffffff', rating: 68 },
    { id: 'chelsea',        name: 'Chelsea',              short: 'CHE', color: '#034694', text: '#ffffff', rating: 78 },
    { id: 'crystalpalace',  name: 'Crystal Palace',       short: 'CRY', color: '#1B458F', text: '#ffffff', rating: 74 },
    { id: 'everton',        name: 'Everton',              short: 'EVE', color: '#003399', text: '#ffffff', rating: 72 },
    { id: 'fulham',         name: 'Fulham',               short: 'FUL', color: '#000000', text: '#ffffff', rating: 73 },
    { id: 'leeds',          name: 'Leeds United',         short: 'LEE', color: '#FFCD00', text: '#1D428A', rating: 72 },
    { id: 'liverpool',      name: 'Liverpool',            short: 'LIV', color: '#C8102E', text: '#ffffff', rating: 85 },
    { id: 'mancity',        name: 'Manchester City',      short: 'MCI', color: '#6CABDD', text: '#1c2c5b', rating: 87 },
    { id: 'manunited',      name: 'Manchester United',    short: 'MUN', color: '#DA291C', text: '#ffffff', rating: 78 },
    { id: 'newcastle',      name: 'Newcastle United',     short: 'NEW', color: '#241F20', text: '#ffffff', rating: 80 },
    { id: 'nforest',        name: 'Nottingham Forest',    short: 'NFO', color: '#DD0000', text: '#ffffff', rating: 72 },
    { id: 'sunderland',     name: 'Sunderland',           short: 'SUN', color: '#EB172B', text: '#ffffff', rating: 68 },
    { id: 'tottenham',      name: 'Tottenham Hotspur',    short: 'TOT', color: '#132257', text: '#ffffff', rating: 78 },
    { id: 'westham',        name: 'West Ham United',      short: 'WHU', color: '#7A263A', text: '#ffffff', rating: 74 },
    { id: 'wolves',         name: 'Wolverhampton',        short: 'WOL', color: '#FDB913', text: '#231F20', rating: 70 },
];
const PLM_TEAMS_BY_ID = Object.fromEntries(PLM_TEAMS.map(t => [t.id, t]));

// ---------- Name pools for procedural squad generation ----------
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
// Each formation has DEF/MID/FWD slot counts (GK is always 1) plus match-sim
// modifiers. atk boosts your scoring lambda; def reduces the opponent's.
const PLM_FORMATIONS = {
    '4-4-2':   { def: 4, mid: 4, fwd: 2, atk:  0,   defMod:  0,    desc: 'Balanced. The classic English shape.' },
    '4-3-3':   { def: 4, mid: 3, fwd: 3, atk: +0.10, defMod: -0.05, desc: 'Attacking. Three up top, more goals expected.' },
    '3-5-2':   { def: 3, mid: 5, fwd: 2, atk: +0.03, defMod: -0.03, desc: 'Midfield-heavy. Controls the game but thin at the back.' },
    '4-2-3-1': { def: 4, mid: 5, fwd: 1, atk: +0.03, defMod: +0.03, desc: 'Modern. One striker, creative No.10.' },
    '5-3-2':   { def: 5, mid: 3, fwd: 2, atk: -0.05, defMod: +0.08, desc: 'Defensive. Hard to break down, low on goals.' },
};
const PLM_DEFAULT_FORMATION = '4-4-2';

// Auto-pick the best XI for a squad and formation. Excludes suspended or
// injured players (they can't play). If a position doesn't have enough
// available players, fills from whatever is left (will produce an XI < 11
// in extreme cases — the UI surfaces this).
function plmAutoPickXI(squad, formationKey) {
    const f = PLM_FORMATIONS[formationKey] || PLM_FORMATIONS[PLM_DEFAULT_FORMATION];
    const byPos = { GK: [], DEF: [], MID: [], FWD: [] };
    const available = (squad || []).filter(plmIsAvailable);
    for (const p of available) if (byPos[p.pos]) byPos[p.pos].push(p);
    for (const k of Object.keys(byPos)) byPos[k].sort((a, b) => b.rating - a.rating);
    const xi = [];
    const pick = (pos, n) => {
        for (let i = 0; i < n; i++) {
            if (byPos[pos][i]) xi.push(byPos[pos][i]);
        }
    };
    pick('GK', 1);
    pick('DEF', f.def);
    pick('MID', f.mid);
    pick('FWD', f.fwd);
    if (xi.length < 11) {
        const have = new Set(xi.map(p => p.id));
        const extras = available.filter(p => !have.has(p.id))
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 11 - xi.length);
        xi.push(...extras);
    }
    return xi.slice(0, 11);
}

// ---------- Fixture generation (double round-robin, 38 match days) ----------
function plmGenerateFixtures(teams) {
    // Classic round-robin (Berger tables). 20 teams → 19 match days in one half,
    // 38 total for double round-robin. Each match day has 10 matches.
    const ids = teams.map(t => t.id);
    if (ids.length % 2 !== 0) ids.push(null);
    const n = ids.length;
    const rounds = n - 1;
    const half = n / 2;
    const arr = ids.slice();
    // First half of season: each team plays each other once (home/away distributed).
    const firstHalf = [];
    for (let r = 0; r < rounds; r++) {
        const matches = [];
        for (let i = 0; i < half; i++) {
            const a = arr[i];
            const b = arr[n - 1 - i];
            if (a && b) {
                // Alternate home/away across rounds.
                if ((r + i) % 2 === 0) matches.push({ home: a, away: b });
                else matches.push({ home: b, away: a });
            }
        }
        firstHalf.push(matches);
        // Rotate all but the first element.
        arr.splice(1, 0, arr.pop());
    }
    // Second half: reverse home/away.
    const secondHalf = firstHalf.map(round =>
        round.map(m => ({ home: m.away, away: m.home }))
    );
    return [...firstHalf, ...secondHalf];
}

// ---------- Procedural squad generation ----------
// 11 players: 1 GK, 4 DEF, 4 MID, 2 FWD. Ratings centred on team rating.
// Uses a seeded PRNG so the same team always gets the same squad this session.
function plmMakePRNG(seedStr) {
    let h = 2166136261;
    for (let i = 0; i < seedStr.length; i++) {
        h = (h ^ seedStr.charCodeAt(i)) * 16777619 >>> 0;
    }
    return () => {
        h = (h * 1103515245 + 12345) >>> 0;
        return (h & 0x7fffffff) / 0x7fffffff;
    };
}

// Build the in-memory squad for a team from the PLM_SQUADS data file.
// Adds an `id` field (`teamId_index`) so players can be referenced by ID in
// the XI picker + localStorage save, and initialises season stats.
//
// If the data file is missing (e.g. network error), falls back to a tiny
// procedural squad just so the game still loads.
function plmGenerateSquad(team) {
    const raw = (typeof PLM_SQUADS !== 'undefined' && PLM_SQUADS[team.id])
        ? PLM_SQUADS[team.id]
        : null;
    if (!raw) return plmFallbackSquad(team);
    return raw.map((p, i) => ({
        id: `${team.id}_${i}`,
        name: p.name,
        pos: p.pos,
        rating: p.rating,
        goals: 0,
        assists: 0,
        yellows: 0,      // season yellow cards
        reds: 0,         // season red cards
        suspended: 0,    // matches still to serve (0 = available)
        injured: 0,      // matches still injured  (0 = available)
    }));
}

function plmFallbackSquad(team) {
    // Used only if plmanager-data.js failed to load. Generates 16 plausible
    // placeholder players so the game still works.
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
                goals: 0, assists: 0,
                yellows: 0, reds: 0, suspended: 0, injured: 0,
            });
        }
    }
    return squad;
}

// ---------- Availability ----------
const PLM_YELLOW_BAN_THRESHOLD = 5;   // every 5 yellows = +1 match ban
const PLM_RED_BAN_MATCHES = 2;        // straight red = 2 match ban
const PLM_INJURY_CHANCE_PER_MATCH = 0.08; // ~1 in 12 matches has an injury
// Weighted injury durations: most are short knocks, rare long lay-offs.
// Mean ≈ 2 matches out. Individual player expected to miss ~1-2 matches per season.
const PLM_INJURY_DURATIONS = [1, 1, 1, 1, 1, 2, 2, 2, 3, 4, 6];

function plmIsAvailable(p) {
    return p && p.suspended <= 0 && p.injured <= 0;
}

function plmUnavailabilityReason(p) {
    if (!p) return null;
    if (p.suspended > 0) return `🚫 suspended (${p.suspended})`;
    if (p.injured > 0) return `🤕 injured (${p.injured})`;
    return null;
}

// ---------- Match simulation ----------
// Poisson-like scoring based on relative team strengths.
function plmPoissonSample(lambda) {
    const L = Math.exp(-lambda);
    let k = 0, p = 1;
    do { k++; p *= Math.random(); } while (p > L);
    return k - 1;
}

function plmAvgRating(xi) {
    const total = xi.reduce((s, p) => s + p.rating, 0);
    return total / xi.length;
}

function plmPickGoalscorer(xi) {
    // Weight by position: FWD most likely, MID some, DEF rare, GK almost never.
    const weights = { FWD: 6, MID: 3, DEF: 1, GK: 0.05 };
    const pool = [];
    for (const p of xi) {
        const w = (weights[p.pos] || 1) * (p.rating / 75);
        pool.push({ p, w });
    }
    const total = pool.reduce((s, x) => s + x.w, 0);
    let r = Math.random() * total;
    for (const x of pool) { r -= x.w; if (r <= 0) return x.p; }
    return pool[0].p;
}

function plmPickBookedPlayer(xi) {
    // Defenders + midfielders most likely to get cards. GK very rarely.
    const weights = { FWD: 1, MID: 2, DEF: 3, GK: 0.2 };
    const pool = [];
    for (const p of xi) pool.push({ p, w: weights[p.pos] || 1 });
    const total = pool.reduce((s, x) => s + x.w, 0);
    let r = Math.random() * total;
    for (const x of pool) { r -= x.w; if (r <= 0) return x.p; }
    return pool[0].p;
}

function plmSimulateMatch(homeTeam, homeXI, awayTeam, awayXI, homeFormation, awayFormation) {
    const hForm = PLM_FORMATIONS[homeFormation] || PLM_FORMATIONS[PLM_DEFAULT_FORMATION];
    const aForm = PLM_FORMATIONS[awayFormation] || PLM_FORMATIONS[PLM_DEFAULT_FORMATION];
    const homeRating = plmAvgRating(homeXI) + 3;  // home advantage
    const awayRating = plmAvgRating(awayXI);
    // Expected goals scale — top PL match ~1.5-2.5, weaker ~0.8-1.2.
    // Formation: attacker's +atk boosts their scoring; defender's +def suppresses it.
    const lambdaHome = Math.max(0.2, (homeRating / 40) * (1 + hForm.atk) * (1 - aForm.defMod));
    const lambdaAway = Math.max(0.2, (awayRating / 40) * (1 + aForm.atk) * (1 - hForm.defMod));
    const hs = plmPoissonSample(lambdaHome);
    const as = plmPoissonSample(lambdaAway);

    // Goal times: uniform 1-89.
    const goalEntries = [];
    for (let i = 0; i < hs; i++) goalEntries.push({ side: 'home', min: 1 + Math.floor(Math.random() * 89) });
    for (let i = 0; i < as; i++) goalEntries.push({ side: 'away', min: 1 + Math.floor(Math.random() * 89) });
    goalEntries.sort((a, b) => a.min - b.min);

    // Walk goals in order, updating the running tally in each commentary line.
    const events = [];
    let hScore = 0, aScore = 0, htH = 0, htA = 0;
    for (const g of goalEntries) {
        const team = g.side === 'home' ? homeTeam : awayTeam;
        const xi = g.side === 'home' ? homeXI : awayXI;
        const scorer = plmPickGoalscorer(xi);
        scorer.goals = (scorer.goals || 0) + 1;
        if (g.side === 'home') hScore++; else aScore++;
        if (g.min <= 45) { htH = hScore; htA = aScore; }
        events.push({ min: g.min, type: 'goal',
            text: `⚽ ${g.min}' GOAL! ${scorer.name} (${team.short}) scores. ${homeTeam.short} ${hScore} - ${aScore} ${awayTeam.short}` });
    }

    // Yellow cards — 2-4 per match. Update player stats + trigger bans.
    const banEvents = [];
    const cardCount = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < cardCount; i++) {
        const side = Math.random() < 0.5 ? 'home' : 'away';
        const team = side === 'home' ? homeTeam : awayTeam;
        const xi = side === 'home' ? homeXI : awayXI;
        const player = plmPickBookedPlayer(xi);
        const min = 5 + Math.floor(Math.random() * 85);
        player.yellows = (player.yellows || 0) + 1;
        events.push({ min, type: 'yellow', text: `🟨 ${min}' ${player.name} (${team.short}) booked.` });
        // Hit a 5/10/15 threshold? One-match ban. (Applied AFTER this match, so
        // suspended=1 means they miss the next match.)
        if (player.yellows % PLM_YELLOW_BAN_THRESHOLD === 0) {
            player.suspended = (player.suspended || 0) + 1;
            banEvents.push({ min: 91, type: 'ban',
                text: `⛔ ${player.name} (${team.short}) earns a one-match ban — ${player.yellows} yellows this season.` });
        }
    }
    // Rare red card (~8% per match) = 2-match ban.
    if (Math.random() < 0.08) {
        const side = Math.random() < 0.5 ? 'home' : 'away';
        const team = side === 'home' ? homeTeam : awayTeam;
        const xi = side === 'home' ? homeXI : awayXI;
        const player = plmPickBookedPlayer(xi);
        const min = 30 + Math.floor(Math.random() * 60);
        player.reds = (player.reds || 0) + 1;
        player.suspended = (player.suspended || 0) + PLM_RED_BAN_MATCHES;
        events.push({ min, type: 'red',
            text: `🟥 ${min}' RED CARD — ${player.name} (${team.short}) sent off! ${PLM_RED_BAN_MATCHES}-match ban.` });
    }
    // Injury event (~20% per match).
    if (Math.random() < PLM_INJURY_CHANCE_PER_MATCH) {
        const side = Math.random() < 0.5 ? 'home' : 'away';
        const team = side === 'home' ? homeTeam : awayTeam;
        const xi = side === 'home' ? homeXI : awayXI;
        // Any XI player can go down — weight slightly toward outfield (GK rarely).
        const candidates = xi.filter(p => p.pos !== 'GK');
        const victim = candidates[Math.floor(Math.random() * candidates.length)] || xi[0];
        const min = 10 + Math.floor(Math.random() * 75);
        const dur = PLM_INJURY_DURATIONS[Math.floor(Math.random() * PLM_INJURY_DURATIONS.length)];
        victim.injured = (victim.injured || 0) + dur;
        events.push({ min, type: 'injury',
            text: `🤕 ${min}' ${victim.name} (${team.short}) limps off — out for ${dur} match${dur === 1 ? '' : 'es'}.` });
    }

    // Ban announcements happen after the final whistle.
    events.push(...banEvents);
    events.sort((a, b) => a.min - b.min);

    const timeline = [
        { min: 0, type: 'kickoff', text: `🏟️ Kick-off: ${homeTeam.name} vs ${awayTeam.name}` },
        ...events.filter(e => e.min <= 45),
        { min: 45, type: 'ht', text: `⏸️ Half-time: ${homeTeam.short} ${htH} - ${htA} ${awayTeam.short}` },
        ...events.filter(e => e.min > 45),
        { min: 90, type: 'ft', text: `⏹️ Full-time: ${homeTeam.short} ${hScore} - ${aScore} ${awayTeam.short}` },
    ];
    return { homeScore: hScore, awayScore: aScore, timeline };
}

// ---------- Table ----------
function plmEmptyTable() {
    const t = {};
    for (const team of PLM_TEAMS) {
        t[team.id] = { id: team.id, P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 };
    }
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
    return Object.values(table).sort((a, b) =>
        b.Pts - a.Pts || b.GD - a.GD || b.GF - a.GF
    );
}

// ---------- Game class ----------
const PLM_SAVE_KEY = 'plm_save_v1';

class PLManager {
    constructor() {
        this.rootEl = document.getElementById('plm-root');
        if (!this.rootEl) return;
        this.squads = {};
        for (const team of PLM_TEAMS) this.squads[team.id] = plmGenerateSquad(team);
        this.load();
        this.render();
    }

    // ---- state / persistence ----
    load() {
        try {
            const raw = localStorage.getItem(PLM_SAVE_KEY);
            this.state = raw ? JSON.parse(raw) : null;
        } catch (e) {
            this.state = null;
        }
        // Shape check.
        if (this.state && (!this.state.playerTeam || !this.state.fixtures)) this.state = null;
        // The 2025-26 squad update removed Luton / Sheffield Utd and added Leeds /
        // Sunderland. If an older save references a team ID we no longer know
        // about, wipe it and send the user back to team-select.
        if (this.state) {
            const known = new Set(PLM_TEAMS.map(t => t.id));
            const fixturesValid = this.state.fixtures.every(round =>
                round.every(fx => known.has(fx.home) && known.has(fx.away))
            );
            if (!known.has(this.state.playerTeam) || !fixturesValid) {
                console.warn('[PLManager] stale save (team roster changed) — starting fresh');
                localStorage.removeItem(PLM_SAVE_KEY);
                this.state = null;
            }
        }
    }

    save() {
        try { localStorage.setItem(PLM_SAVE_KEY, JSON.stringify(this.state)); } catch (e) {}
    }

    newGame(playerTeamId) {
        this.state = {
            playerTeam: playerTeamId,
            season: 1,
            matchDay: 1,
            fixtures: plmGenerateFixtures(PLM_TEAMS),
            results: [],           // array of { matchDay, home, away, hs, as }
            table: plmEmptyTable(),
            screen: 'dashboard',
            lastMatch: null,        // most recent match result + timeline
            formation: PLM_DEFAULT_FORMATION,
            xi: [],                 // array of player IDs — empty means auto-pick
        };
        // Refresh squads with fresh stats (0 goals etc) for the new season.
        for (const team of PLM_TEAMS) this.squads[team.id] = plmGenerateSquad(team);
        // Seed the player's XI to the auto-pick so they always have something ready.
        this.state.xi = plmAutoPickXI(this.squads[playerTeamId], PLM_DEFAULT_FORMATION).map(p => p.id);
        this.save();
    }

    quitSave() {
        if (!confirm('Quit the current season and pick a new team? This erases your save.')) return;
        localStorage.removeItem(PLM_SAVE_KEY);
        this.state = null;
        this.render();
    }

    // ---- helpers ----
    currentFixtures() {
        if (!this.state) return [];
        return this.state.fixtures[this.state.matchDay - 1] || [];
    }

    playerFixture() {
        return this.currentFixtures().find(m =>
            m.home === this.state.playerTeam || m.away === this.state.playerTeam
        );
    }

    playerTeam() { return PLM_TEAMS_BY_ID[this.state.playerTeam]; }

    // ---- match-day execution ----
    // Look up a team's XI + formation for a match day. For the player's team,
    // use their chosen XI/formation if set; for AI teams (and as a fallback)
    // auto-pick the best 11 for a default formation.
    getXIFor(teamId) {
        if (teamId === this.state.playerTeam && this.state.xi && this.state.xi.length === 11) {
            // state.xi stores player IDs; resolve back to player objects.
            const squad = this.squads[teamId];
            const byId = Object.fromEntries(squad.map(p => [p.id, p]));
            const resolved = this.state.xi.map(id => byId[id]).filter(Boolean);
            if (resolved.length === 11) return resolved;
        }
        // Auto-pick fallback.
        const formation = teamId === this.state.playerTeam
            ? (this.state.formation || PLM_DEFAULT_FORMATION)
            : PLM_DEFAULT_FORMATION;
        return plmAutoPickXI(this.squads[teamId], formation);
    }

    getFormationFor(teamId) {
        if (teamId === this.state.playerTeam && this.state.formation) return this.state.formation;
        return PLM_DEFAULT_FORMATION;
    }

    playMatchDay() {
        const md = this.state.matchDay;
        const fixtures = this.currentFixtures();
        let playerResult = null;
        for (const fx of fixtures) {
            const home = PLM_TEAMS_BY_ID[fx.home];
            const away = PLM_TEAMS_BY_ID[fx.away];
            const homeXI = this.getXIFor(home.id);
            const awayXI = this.getXIFor(away.id);
            const homeFm = this.getFormationFor(home.id);
            const awayFm = this.getFormationFor(away.id);
            const sim = plmSimulateMatch(home, homeXI, away, awayXI, homeFm, awayFm);
            plmApplyResult(this.state.table, home.id, away.id, sim.homeScore, sim.awayScore);
            this.state.results.push({
                matchDay: md,
                home: home.id, away: away.id,
                hs: sim.homeScore, as: sim.awayScore,
            });
            if (home.id === this.state.playerTeam || away.id === this.state.playerTeam) {
                playerResult = { fixture: fx, ...sim, home, away };
            }
        }

        // Tick down everyone's suspension / injury counters by 1 match.
        // Done after the match itself so a ban/injury earned THIS match stays
        // in place for at least the next one.
        for (const teamId of Object.keys(this.squads)) {
            for (const p of this.squads[teamId]) {
                if (p.suspended > 0) p.suspended--;
                if (p.injured   > 0) p.injured--;
            }
        }

        // Drop any now-unavailable players and auto-fill their slots with the
        // best available substitutes of the same position, so the user's next
        // pick-XI screen always starts with a full 11 (they can still re-pick).
        if (this.state.xi) {
            const squad = this.squads[this.state.playerTeam];
            const byId = Object.fromEntries(squad.map(p => [p.id, p]));
            const limits = this.xiLimitsFor(this.state.formation);
            const kept = { GK: [], DEF: [], MID: [], FWD: [] };
            for (const id of this.state.xi) {
                const p = byId[id];
                if (p && plmIsAvailable(p)) kept[p.pos].push(p);
            }
            const inXI = new Set(this.state.xi.filter(id => {
                const p = byId[id];
                return p && plmIsAvailable(p);
            }));
            for (const pos of ['GK', 'DEF', 'MID', 'FWD']) {
                const want = limits[pos] - kept[pos].length;
                if (want <= 0) continue;
                const subs = squad.filter(p => p.pos === pos && plmIsAvailable(p) && !inXI.has(p.id))
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, want);
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
        // Defensive: older saves may not have xi/formation fields.
        if (!this.state.formation) this.state.formation = PLM_DEFAULT_FORMATION;
        if (!this.state.xi) this.state.xi = plmAutoPickXI(this.squads[this.state.playerTeam], this.state.formation).map(p => p.id);
        switch (this.state.screen) {
            case 'pickxi':      return this.renderPickXI();
            case 'matchResult': return this.renderMatchResult();
            case 'seasonEnd':   return this.renderSeasonEnd();
            default:            return this.renderDashboard();
        }
    }

    renderTeamSelect() {
        const cards = PLM_TEAMS.map(t => `
            <button class="plm-team-card" data-team="${t.id}"
                    style="background:${t.color};color:${t.text}">
                <span class="plm-team-name">${t.name}</span>
                <span class="plm-team-meta">OVR <b>${t.rating}</b></span>
            </button>
        `).join('');
        this.rootEl.innerHTML = `
            <div class="plm-select">
                <h2 class="plm-select-h">Pick your club</h2>
                <p class="plm-select-sub">Take charge and play through a 38-match Premier League season.</p>
                <div class="plm-team-grid">${cards}</div>
            </div>
        `;
        this.rootEl.querySelectorAll('.plm-team-card').forEach(el => {
            el.addEventListener('click', () => {
                this.newGame(el.getAttribute('data-team'));
                this.render();
            });
        });
    }

    renderDashboard() {
        const team = this.playerTeam();
        const fx = this.playerFixture();
        const isHome = fx && fx.home === team.id;
        const opponent = fx ? PLM_TEAMS_BY_ID[isHome ? fx.away : fx.home] : null;
        const venue = isHome ? 'vs' : '@';

        this.rootEl.innerHTML = `
            <div class="plm-dashboard">
                <header class="plm-header"
                        style="background:${team.color};color:${team.text}">
                    <div>
                        <div class="plm-hdr-small">You are managing</div>
                        <div class="plm-hdr-name">${team.name}</div>
                    </div>
                    <div class="plm-hdr-right">
                        <div class="plm-hdr-small">Match day</div>
                        <div class="plm-hdr-name">${this.state.matchDay} / 38</div>
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
                </section>
                ` : ''}

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
            </div>
        `;
        const play = this.rootEl.querySelector('#plm-play');
        if (play) play.addEventListener('click', () => {
            this.state.screen = 'pickxi';
            this.save();
            this.render();
        });
        const reset = this.rootEl.querySelector('#plm-reset');
        if (reset) reset.addEventListener('click', () => this.quitSave());
    }

    // ---- Pick-XI screen ----
    // State helpers: state.xi is an array of player IDs (up to 11).
    xiPlayers() {
        const squad = this.squads[this.state.playerTeam];
        const byId = Object.fromEntries(squad.map(p => [p.id, p]));
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
        const counts = this.xiCountByPos();
        return counts[pos] < limits[pos];
    }

    togglePlayerInXI(player) {
        const xi = this.state.xi = this.state.xi || [];
        const idx = xi.indexOf(player.id);
        if (idx >= 0) {
            xi.splice(idx, 1);           // remove
        } else if (!plmIsAvailable(player)) {
            return;                      // suspended / injured — can't pick
        } else if (this.xiHasSlotFor(player.pos)) {
            xi.push(player.id);          // add if slot free
        } else {
            return;                      // full for this position
        }
        this.save();
        this.renderPickXI();
    }

    changeFormation(newFormation) {
        this.state.formation = newFormation;
        // Current XI may break limits — prune any players over the new limits
        // (keep highest-rated for each position).
        const limits = this.xiLimitsFor(newFormation);
        const squad = this.squads[this.state.playerTeam];
        const byId = Object.fromEntries(squad.map(p => [p.id, p]));
        const kept = { GK: [], DEF: [], MID: [], FWD: [] };
        for (const id of (this.state.xi || [])) {
            const p = byId[id];
            if (!p) continue;
            kept[p.pos].push(p);
        }
        for (const pos of Object.keys(kept)) {
            kept[pos].sort((a, b) => b.rating - a.rating);
            kept[pos] = kept[pos].slice(0, limits[pos]);
        }
        this.state.xi = [...kept.GK, ...kept.DEF, ...kept.MID, ...kept.FWD].map(p => p.id);
        this.save();
        this.renderPickXI();
    }

    autoPickXI() {
        this.state.xi = plmAutoPickXI(
            this.squads[this.state.playerTeam],
            this.state.formation,
        ).map(p => p.id);
        this.save();
        this.renderPickXI();
    }

    renderPickXI() {
        const team = this.playerTeam();
        const squad = this.squads[this.state.playerTeam];
        const xi = this.xiPlayers();
        const xiIds = new Set(xi.map(p => p.id));
        const limits = this.xiLimitsFor(this.state.formation);
        const counts = this.xiCountByPos();
        const isReady = xi.length === 11;

        // Formation dropdown
        const formationOpts = Object.keys(PLM_FORMATIONS).map(key =>
            `<option value="${key}" ${key === this.state.formation ? 'selected' : ''}>${key}</option>`
        ).join('');

        // XI by position
        const xiByPos = { GK: [], DEF: [], MID: [], FWD: [] };
        for (const p of xi) xiByPos[p.pos].push(p);
        const renderSlot = (p) =>
            `<li class="plm-xi-slot"><button class="plm-xi-btn" data-pid="${p.id}">
                <span class="plm-xi-rating">${p.rating}</span>
                <span class="plm-xi-name">${p.name}</span>
                <span class="plm-xi-remove">✕</span>
            </button></li>`;
        const renderEmptySlots = (pos, n) => {
            const have = xiByPos[pos].length;
            const missing = n - have;
            return Array.from({ length: Math.max(0, missing) }, () =>
                `<li class="plm-xi-slot empty">+ ${pos}</li>`).join('');
        };

        const renderPosRow = (pos, label) => `
            <div class="plm-xi-row">
                <div class="plm-xi-row-label"><span class="plm-sq-pos pos-${pos}">${pos}</span>
                    <span class="plm-xi-count">${counts[pos]}/${limits[pos]}</span></div>
                <ul class="plm-xi-slots">
                    ${xiByPos[pos].map(renderSlot).join('')}
                    ${renderEmptySlots(pos, limits[pos])}
                </ul>
            </div>
        `;

        // Squad list grouped by position, dimming picked players
        const squadByPos = { GK: [], DEF: [], MID: [], FWD: [] };
        for (const p of squad) if (squadByPos[p.pos]) squadByPos[p.pos].push(p);
        for (const k of Object.keys(squadByPos)) squadByPos[k].sort((a, b) => b.rating - a.rating);
        const renderSquadRow = (p) => {
            const inXI = xiIds.has(p.id);
            const unavailable = !plmIsAvailable(p);
            const canPick = inXI || (!unavailable && this.xiHasSlotFor(p.pos));
            const cls = [
                'plm-squad-pick',
                inXI ? 'picked' : '',
                unavailable ? 'unavailable' : (!canPick ? 'full' : ''),
            ].filter(Boolean).join(' ');
            const action = unavailable ? '🚫' : (inXI ? '−' : '+');
            const badge = plmStatusBadge(p);
            return `<tr class="${cls}" data-pid="${p.id}">
                <td class="plm-sq-pos pos-${p.pos}">${p.pos}</td>
                <td class="plm-sq-name">${p.name}${badge}</td>
                <td class="plm-sq-rating">${p.rating}</td>
                <td class="plm-sq-goals">${p.goals ? '⚽' + p.goals : ''}</td>
                <td class="plm-squad-action">${action}</td>
            </tr>`;
        };
        const squadRows = ['GK', 'DEF', 'MID', 'FWD']
            .flatMap(pos => squadByPos[pos].map(renderSquadRow))
            .join('');

        const fx = this.playerFixture();
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
                        ${renderPosRow('GK')}
                        ${renderPosRow('DEF')}
                        ${renderPosRow('MID')}
                        ${renderPosRow('FWD')}
                    </div>
                    <div class="plm-col">
                        <h3>Squad (click to add / remove)</h3>
                        <table class="plm-squad plm-squad-picker">${squadRows}</table>
                    </div>
                </section>
            </div>
        `;

        this.rootEl.querySelector('#plm-back').addEventListener('click', () => {
            this.state.screen = 'dashboard';
            this.save();
            this.render();
        });
        this.rootEl.querySelector('#plm-formation').addEventListener('change', (e) => {
            this.changeFormation(e.target.value);
        });
        this.rootEl.querySelector('#plm-autopick').addEventListener('click', () => this.autoPickXI());
        const kickoff = this.rootEl.querySelector('#plm-kickoff');
        if (kickoff && !kickoff.disabled) {
            kickoff.addEventListener('click', () => this.playMatchDay());
        }
        // Clicking an XI slot removes the player.
        this.rootEl.querySelectorAll('.plm-xi-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const pid = btn.getAttribute('data-pid');
                const squad = this.squads[this.state.playerTeam];
                const p = squad.find(x => x.id === pid);
                if (p) this.togglePlayerInXI(p);
            });
        });
        // Clicking a squad row toggles the player in the XI.
        this.rootEl.querySelectorAll('.plm-squad-pick').forEach(row => {
            row.addEventListener('click', () => {
                const pid = row.getAttribute('data-pid');
                const squad = this.squads[this.state.playerTeam];
                const p = squad.find(x => x.id === pid);
                if (p) this.togglePlayerInXI(p);
            });
        });
    }

    renderMatchResult() {
        const res = this.state.lastMatch;
        if (!res) { this.state.screen = 'dashboard'; return this.render(); }
        const team = this.playerTeam();
        const events = res.timeline.map(ev => {
            const cls = { goal: 'ev-goal', yellow: 'ev-yellow', red: 'ev-red',
                          ht: 'ev-ht', ft: 'ev-ft', kickoff: 'ev-kickoff',
                          injury: 'ev-injury', ban: 'ev-ban' }[ev.type] || '';
            return `<li class="plm-ev ${cls}">${ev.text}</li>`;
        }).join('');

        const won = (res.home.id === team.id && res.homeScore > res.awayScore)
                 || (res.away.id === team.id && res.awayScore > res.homeScore);
        const lost = (res.home.id === team.id && res.homeScore < res.awayScore)
                  || (res.away.id === team.id && res.awayScore < res.homeScore);
        const verdict = won ? '🎉 You won!' : lost ? '😞 You lost.' : '🤝 Draw.';

        this.rootEl.innerHTML = `
            <div class="plm-match">
                <h2 class="plm-match-title">
                    ${res.home.short} <span class="plm-score">${res.homeScore} - ${res.awayScore}</span> ${res.away.short}
                </h2>
                <p class="plm-match-verdict">${verdict}</p>
                <ol class="plm-timeline">${events}</ol>
                <button class="plm-play-btn" id="plm-continue">Continue ▶</button>
            </div>
        `;
        this.rootEl.querySelector('#plm-continue').addEventListener('click', () => {
            this.state.screen = 'dashboard';
            this.save();
            this.render();
        });
    }

    renderSeasonEnd() {
        const team = this.playerTeam();
        const sorted = plmSortedTable(this.state.table);
        const yourPos = sorted.findIndex(r => r.id === team.id) + 1;
        const ordinal = n => {
            const s = ['th','st','nd','rd'], v = n % 100;
            return n + (s[(v-20)%10] || s[v] || s[0]);
        };
        let verdict;
        if (yourPos === 1) verdict = `🏆 CHAMPIONS! ${team.name} win the Premier League!`;
        else if (yourPos <= 4) verdict = `✨ Champions League qualification — finished ${ordinal(yourPos)}.`;
        else if (yourPos <= 7) verdict = `🥈 European qualification — finished ${ordinal(yourPos)}.`;
        else if (yourPos >= 18) verdict = `💀 Relegation — finished ${ordinal(yourPos)}. Unlucky.`;
        else verdict = `Finished ${ordinal(yourPos)}. Mid-table.`;

        this.rootEl.innerHTML = `
            <div class="plm-season-end">
                <h2>Season ${this.state.season} · Full Time</h2>
                <p class="plm-verdict-big">${verdict}</p>
                ${this.tableHtml()}
                <button class="plm-play-btn" id="plm-next-season">Start Season ${this.state.season + 1} ▶</button>
                <button class="plm-reset-btn" id="plm-reset">Pick a different club</button>
            </div>
        `;
        this.rootEl.querySelector('#plm-next-season').addEventListener('click', () => {
            // Keep the player's team, reset the fixture list + table.
            const teamId = this.state.playerTeam;
            const season = this.state.season + 1;
            this.newGame(teamId);
            this.state.season = season;
            this.save();
            this.render();
        });
        this.rootEl.querySelector('#plm-reset').addEventListener('click', () => this.quitSave());
    }

    tableHtml() {
        const sorted = plmSortedTable(this.state.table);
        const rows = sorted.map((r, i) => {
            const team = PLM_TEAMS_BY_ID[r.id];
            const pos = i + 1;
            const cls = pos <= 4 ? 'pos-cl' : pos <= 6 ? 'pos-eur' : pos >= 18 ? 'pos-rel' : '';
            const highlight = r.id === this.state.playerTeam ? 'me' : '';
            return `
                <tr class="${cls} ${highlight}">
                    <td class="plm-tbl-pos">${pos}</td>
                    <td class="plm-tbl-team">
                        <span class="plm-tbl-dot" style="background:${team.color}"></span>
                        ${team.short}
                    </td>
                    <td>${r.P}</td>
                    <td>${r.W}</td>
                    <td>${r.D}</td>
                    <td>${r.L}</td>
                    <td>${r.GF}:${r.GA}</td>
                    <td>${r.GD > 0 ? '+' : ''}${r.GD}</td>
                    <td><b>${r.Pts}</b></td>
                </tr>`;
        }).join('');
        return `
            <table class="plm-table">
                <thead><tr>
                    <th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th>
                    <th>GF:GA</th><th>GD</th><th>Pts</th>
                </tr></thead>
                <tbody>${rows}</tbody>
            </table>
        `;
    }

    squadHtml(teamId) {
        const squad = this.squads[teamId];
        // Group by position for readability.
        const groups = { GK: [], DEF: [], MID: [], FWD: [] };
        for (const p of squad) groups[p.pos].push(p);
        const rows = [];
        for (const pos of ['GK','DEF','MID','FWD']) {
            for (const p of groups[pos]) {
                const cls = plmIsAvailable(p) ? '' : 'unavailable';
                rows.push(`
                    <tr class="${cls}">
                        <td class="plm-sq-pos pos-${p.pos}">${p.pos}</td>
                        <td class="plm-sq-name">${p.name}${plmStatusBadge(p)}</td>
                        <td class="plm-sq-rating">${p.rating}</td>
                        <td class="plm-sq-goals">${p.goals ? '⚽' + p.goals : ''}</td>
                    </tr>
                `);
            }
        }
        return `<table class="plm-squad">${rows.join('')}</table>`;
    }
}

// Compact status badges shown next to a player's name.
function plmStatusBadge(p) {
    const bits = [];
    if (p.suspended > 0) bits.push(`<span class="plm-badge badge-sus">🚫${p.suspended}</span>`);
    if (p.injured > 0)   bits.push(`<span class="plm-badge badge-inj">🤕${p.injured}</span>`);
    if (p.reds > 0)      bits.push(`<span class="plm-badge badge-red">🟥${p.reds}</span>`);
    if (p.yellows >= 4)  bits.push(`<span class="plm-badge badge-yel">🟨${p.yellows}</span>`);
    return bits.length ? ` ${bits.join(' ')}` : '';
}

// ---------- Boot (lazy init on first tab open) ----------
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
