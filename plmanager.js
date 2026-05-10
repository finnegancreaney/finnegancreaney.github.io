// ==================================================================
// Premier League Manager v3
// All 92 English professional clubs across 4 divisions.
// Promotion, relegation, division prize money, per-club budgets.
// ==================================================================

// ---------- All 92 teams ----------
const PLM_ALL_TEAMS = [
    // ---- Premier League ----
    { id: 'arsenal',       name: 'Arsenal',                short: 'ARS', color: '#EF0107', text: '#fff', rating: 85, division: 'premier-league' },
    { id: 'astonvilla',    name: 'Aston Villa',            short: 'AVL', color: '#670E36', text: '#fff', rating: 80, division: 'premier-league' },
    { id: 'bournemouth',   name: 'Bournemouth',            short: 'BOU', color: '#DA291C', text: '#fff', rating: 72, division: 'premier-league' },
    { id: 'brentford',     name: 'Brentford',              short: 'BRE', color: '#E30613', text: '#fff', rating: 73, division: 'premier-league' },
    { id: 'brighton',      name: 'Brighton',               short: 'BHA', color: '#0057B8', text: '#fff', rating: 76, division: 'premier-league' },
    { id: 'burnley',       name: 'Burnley',                short: 'BUR', color: '#6C1D45', text: '#fff', rating: 68, division: 'premier-league' },
    { id: 'chelsea',       name: 'Chelsea',                short: 'CHE', color: '#034694', text: '#fff', rating: 78, division: 'premier-league' },
    { id: 'crystalpalace', name: 'Crystal Palace',         short: 'CRY', color: '#1B458F', text: '#fff', rating: 74, division: 'premier-league' },
    { id: 'everton',       name: 'Everton',                short: 'EVE', color: '#003399', text: '#fff', rating: 72, division: 'premier-league' },
    { id: 'fulham',        name: 'Fulham',                 short: 'FUL', color: '#000000', text: '#fff', rating: 73, division: 'premier-league' },
    { id: 'leeds',         name: 'Leeds United',           short: 'LEE', color: '#FFCD00', text: '#1D428A', rating: 72, division: 'premier-league' },
    { id: 'liverpool',     name: 'Liverpool',              short: 'LIV', color: '#C8102E', text: '#fff', rating: 85, division: 'premier-league' },
    { id: 'mancity',       name: 'Manchester City',        short: 'MCI', color: '#6CABDD', text: '#1c2c5b', rating: 87, division: 'premier-league' },
    { id: 'manunited',     name: 'Manchester United',      short: 'MUN', color: '#DA291C', text: '#fff', rating: 78, division: 'premier-league' },
    { id: 'newcastle',     name: 'Newcastle United',       short: 'NEW', color: '#241F20', text: '#fff', rating: 80, division: 'premier-league' },
    { id: 'nforest',       name: 'Nottingham Forest',      short: 'NFO', color: '#DD0000', text: '#fff', rating: 72, division: 'premier-league' },
    { id: 'sunderland',    name: 'Sunderland',             short: 'SUN', color: '#EB172B', text: '#fff', rating: 68, division: 'premier-league' },
    { id: 'tottenham',     name: 'Tottenham Hotspur',      short: 'TOT', color: '#132257', text: '#fff', rating: 78, division: 'premier-league' },
    { id: 'westham',       name: 'West Ham United',        short: 'WHU', color: '#7A263A', text: '#fff', rating: 74, division: 'premier-league' },
    { id: 'wolves',        name: 'Wolverhampton',          short: 'WOL', color: '#FDB913', text: '#231F20', rating: 70, division: 'premier-league' },
    // ---- Championship ----
    { id: 'birmingham',    name: 'Birmingham City',        short: 'BIR', color: '#0000CD', text: '#fff', rating: 64, division: 'championship' },
    { id: 'blackburn',     name: 'Blackburn Rovers',       short: 'BBR', color: '#009EE0', text: '#fff', rating: 66, division: 'championship' },
    { id: 'bristolcity',   name: 'Bristol City',           short: 'BRC', color: '#C8102E', text: '#fff', rating: 65, division: 'championship' },
    { id: 'charlton',      name: 'Charlton Athletic',      short: 'CHA', color: '#C8102E', text: '#fff', rating: 63, division: 'championship' },
    { id: 'coventry',      name: 'Coventry City',          short: 'COV', color: '#59CBFF', text: '#003087', rating: 68, division: 'championship' },
    { id: 'derby',         name: 'Derby County',           short: 'DER', color: '#0E0E0E', text: '#fff', rating: 65, division: 'championship' },
    { id: 'hull',          name: 'Hull City',              short: 'HUL', color: '#F5A12D', text: '#000', rating: 67, division: 'championship' },
    { id: 'ipswich',       name: 'Ipswich Town',           short: 'IPS', color: '#003087', text: '#fff', rating: 70, division: 'championship' },
    { id: 'leicester',     name: 'Leicester City',         short: 'LEI', color: '#003090', text: '#fff', rating: 76, division: 'championship' },
    { id: 'middlesbrough', name: 'Middlesbrough',          short: 'MBR', color: '#C8102E', text: '#fff', rating: 70, division: 'championship' },
    { id: 'millwall',      name: 'Millwall',               short: 'MIL', color: '#001C58', text: '#fff', rating: 67, division: 'championship' },
    { id: 'norwich',       name: 'Norwich City',           short: 'NOR', color: '#00A650', text: '#FFF200', rating: 69, division: 'championship' },
    { id: 'oxford',        name: 'Oxford United',          short: 'OXF', color: '#FFD200', text: '#000', rating: 66, division: 'championship' },
    { id: 'portsmouth',    name: 'Portsmouth',             short: 'POM', color: '#001489', text: '#fff', rating: 67, division: 'championship' },
    { id: 'prestonne',     name: 'Preston North End',      short: 'PNE', color: '#004B87', text: '#fff', rating: 66, division: 'championship' },
    { id: 'qpr',           name: 'Queens Park Rangers',    short: 'QPR', color: '#004B8D', text: '#fff', rating: 65, division: 'championship' },
    { id: 'sheffieldu',    name: 'Sheffield United',       short: 'SHU', color: '#EC2227', text: '#000', rating: 69, division: 'championship' },
    { id: 'sheffieldw',    name: 'Sheffield Wednesday',    short: 'SHW', color: '#003366', text: '#fff', rating: 65, division: 'championship' },
    { id: 'southampton',   name: 'Southampton',            short: 'SOT', color: '#C8102E', text: '#fff', rating: 72, division: 'championship' },
    { id: 'stoke',         name: 'Stoke City',             short: 'STK', color: '#E03A3E', text: '#fff', rating: 66, division: 'championship' },
    { id: 'swansea',       name: 'Swansea City',           short: 'SWA', color: '#000000', text: '#fff', rating: 66, division: 'championship' },
    { id: 'watford',       name: 'Watford',                short: 'WAT', color: '#FBEE23', text: '#000', rating: 68, division: 'championship' },
    { id: 'westbrom',      name: 'West Bromwich Albion',   short: 'WBA', color: '#122F67', text: '#fff', rating: 68, division: 'championship' },
    { id: 'wrexham',       name: 'Wrexham',                short: 'WRX', color: '#DC241F', text: '#fff', rating: 65, division: 'championship' },
    // ---- League One ----
    { id: 'wimbledon',     name: 'AFC Wimbledon',          short: 'WIM', color: '#0000FF', text: '#fff', rating: 59, division: 'league-one' },
    { id: 'barnsley',      name: 'Barnsley',               short: 'BAR', color: '#C8102E', text: '#fff', rating: 62, division: 'league-one' },
    { id: 'blackpool',     name: 'Blackpool',              short: 'BPL', color: '#F47920', text: '#fff', rating: 62, division: 'league-one' },
    { id: 'bolton',        name: 'Bolton Wanderers',       short: 'BOL', color: '#FFFFFF', text: '#000', rating: 65, division: 'league-one' },
    { id: 'bradford',      name: 'Bradford City',          short: 'BFC', color: '#A7154B', text: '#fff', rating: 59, division: 'league-one' },
    { id: 'burton',        name: 'Burton Albion',          short: 'BAL', color: '#FFD200', text: '#000', rating: 60, division: 'league-one' },
    { id: 'cardiff',       name: 'Cardiff City',           short: 'CAR', color: '#0070B5', text: '#fff', rating: 67, division: 'league-one' },
    { id: 'doncaster',     name: 'Doncaster Rovers',       short: 'DON', color: '#CC0000', text: '#fff', rating: 59, division: 'league-one' },
    { id: 'exeter',        name: 'Exeter City',            short: 'EXE', color: '#C8102E', text: '#fff', rating: 62, division: 'league-one' },
    { id: 'huddersfield',  name: 'Huddersfield Town',      short: 'HUD', color: '#0E63AD', text: '#fff', rating: 64, division: 'league-one' },
    { id: 'leytonorient',  name: 'Leyton Orient',          short: 'LEO', color: '#CC0000', text: '#fff', rating: 62, division: 'league-one' },
    { id: 'lincoln',       name: 'Lincoln City',           short: 'LIN', color: '#CF0000', text: '#fff', rating: 61, division: 'league-one' },
    { id: 'luton',         name: 'Luton Town',             short: 'LUT', color: '#F78F1E', text: '#fff', rating: 67, division: 'league-one' },
    { id: 'mansfield',     name: 'Mansfield Town',         short: 'MAN', color: '#FFF200', text: '#003087', rating: 64, division: 'league-one' },
    { id: 'northampton',   name: 'Northampton Town',       short: 'NTN', color: '#8B0000', text: '#fff', rating: 60, division: 'league-one' },
    { id: 'peterborough',  name: 'Peterborough United',    short: 'PBR', color: '#0000FF', text: '#fff', rating: 64, division: 'league-one' },
    { id: 'plymouth',      name: 'Plymouth Argyle',        short: 'PLY', color: '#007F3F', text: '#fff', rating: 65, division: 'league-one' },
    { id: 'portvale',      name: 'Port Vale',              short: 'PVA', color: '#000000', text: '#fff', rating: 59, division: 'league-one' },
    { id: 'reading',       name: 'Reading',                short: 'REA', color: '#004494', text: '#fff', rating: 63, division: 'league-one' },
    { id: 'rotherham',     name: 'Rotherham United',       short: 'ROT', color: '#CC0000', text: '#fff', rating: 63, division: 'league-one' },
    { id: 'stevenage',     name: 'Stevenage',              short: 'STE', color: '#CC0000', text: '#fff', rating: 60, division: 'league-one' },
    { id: 'stockport',     name: 'Stockport County',       short: 'SKC', color: '#00A0E2', text: '#fff', rating: 64, division: 'league-one' },
    { id: 'wigan',         name: 'Wigan Athletic',         short: 'WIG', color: '#005291', text: '#fff', rating: 62, division: 'league-one' },
    { id: 'wycombe',       name: 'Wycombe Wanderers',      short: 'WYC', color: '#00A0E3', text: '#000', rating: 59, division: 'league-one' },
    // ---- League Two ----
    { id: 'accrington',    name: 'Accrington Stanley',     short: 'ACC', color: '#CC0000', text: '#fff', rating: 56, division: 'league-two' },
    { id: 'barnet',        name: 'Barnet',                 short: 'BNT', color: '#F0A500', text: '#000', rating: 57, division: 'league-two' },
    { id: 'barrow',        name: 'Barrow',                 short: 'BRW', color: '#002B5C', text: '#fff', rating: 56, division: 'league-two' },
    { id: 'bromley',       name: 'Bromley',                short: 'BRO', color: '#000080', text: '#fff', rating: 55, division: 'league-two' },
    { id: 'cambridge',     name: 'Cambridge United',       short: 'CAM', color: '#F5A623', text: '#000', rating: 61, division: 'league-two' },
    { id: 'cheltenham',    name: 'Cheltenham Town',        short: 'CHT', color: '#C8102E', text: '#fff', rating: 57, division: 'league-two' },
    { id: 'chesterfield',  name: 'Chesterfield',           short: 'CHE', color: '#00A4E4', text: '#fff', rating: 60, division: 'league-two' },
    { id: 'colchester',    name: 'Colchester United',      short: 'COL', color: '#00498C', text: '#fff', rating: 58, division: 'league-two' },
    { id: 'crawley',       name: 'Crawley Town',           short: 'CRA', color: '#CC0000', text: '#fff', rating: 57, division: 'league-two' },
    { id: 'crewe',         name: 'Crewe Alexandra',        short: 'CRE', color: '#CC0000', text: '#fff', rating: 59, division: 'league-two' },
    { id: 'fleetwood',     name: 'Fleetwood Town',         short: 'FLE', color: '#CC0000', text: '#fff', rating: 56, division: 'league-two' },
    { id: 'gillingham',    name: 'Gillingham',             short: 'GIL', color: '#003087', text: '#fff', rating: 57, division: 'league-two' },
    { id: 'grimsby',       name: 'Grimsby Town',           short: 'GRI', color: '#000000', text: '#fff', rating: 58, division: 'league-two' },
    { id: 'harrogate',     name: 'Harrogate Town',         short: 'HAR', color: '#FFD700', text: '#000', rating: 56, division: 'league-two' },
    { id: 'mkdons',        name: 'MK Dons',                short: 'MKD', color: '#FFD700', text: '#003087', rating: 62, division: 'league-two' },
    { id: 'newport',       name: 'Newport County',         short: 'NPC', color: '#F5A623', text: '#000', rating: 55, division: 'league-two' },
    { id: 'nottscounty',   name: 'Notts County',           short: 'NCO', color: '#000000', text: '#fff', rating: 61, division: 'league-two' },
    { id: 'oldham',        name: 'Oldham Athletic',        short: 'OLD', color: '#003DB7', text: '#fff', rating: 55, division: 'league-two' },
    { id: 'salford',       name: 'Salford City',           short: 'SAL', color: '#CC0000', text: '#fff', rating: 60, division: 'league-two' },
    { id: 'shrewsbury',    name: 'Shrewsbury Town',        short: 'SHR', color: '#003087', text: '#fff', rating: 59, division: 'league-two' },
    { id: 'swindon',       name: 'Swindon Town',           short: 'SWI', color: '#CC0000', text: '#fff', rating: 59, division: 'league-two' },
    { id: 'tranmere',      name: 'Tranmere Rovers',        short: 'TRA', color: '#003087', text: '#fff', rating: 57, division: 'league-two' },
    { id: 'walsall',       name: 'Walsall',                short: 'WAL', color: '#CC0000', text: '#fff', rating: 58, division: 'league-two' },
    { id: 'bristolrovers', name: 'Bristol Rovers',         short: 'BRV', color: '#005891', text: '#fff', rating: 61, division: 'league-two' },
];

const PLM_ALL_TEAMS_BY_ID = Object.fromEntries(PLM_ALL_TEAMS.map(t => [t.id, t]));

// Legacy references used by shared helpers
const PLM_TEAMS = PLM_ALL_TEAMS.filter(t => t.division === 'premier-league');
const PLM_TEAMS_BY_ID = Object.fromEntries(PLM_TEAMS.map(t => [t.id, t]));

// ---------- Division config ----------
const PLM_DIVISIONS = {
    'premier-league': { name: 'Premier League',   matchdays: 38, janTrigger: 20 },
    'championship':   { name: 'Championship',     matchdays: 46, janTrigger: 24 },
    'league-one':     { name: 'League One',       matchdays: 46, janTrigger: 24 },
    'league-two':     { name: 'League Two',       matchdays: 46, janTrigger: 24 },
};
const PLM_DIV_ORDER = ['premier-league', 'championship', 'league-one', 'league-two'];

// ---------- Initial division composition ----------
const PLM_INITIAL_DIVISIONS = {
    'premier-league': ['arsenal','astonvilla','bournemouth','brentford','brighton','burnley','chelsea','crystalpalace','everton','fulham','leeds','liverpool','mancity','manunited','newcastle','nforest','sunderland','tottenham','westham','wolves'],
    'championship':   ['birmingham','blackburn','bristolcity','charlton','coventry','derby','hull','ipswich','leicester','middlesbrough','millwall','norwich','oxford','portsmouth','prestonne','qpr','sheffieldu','sheffieldw','southampton','stoke','swansea','watford','westbrom','wrexham'],
    'league-one':     ['wimbledon','barnsley','blackpool','bolton','bradford','burton','cardiff','doncaster','exeter','huddersfield','leytonorient','lincoln','luton','mansfield','northampton','peterborough','plymouth','portvale','reading','rotherham','stevenage','stockport','wigan','wycombe'],
    'league-two':     ['accrington','barnet','barrow','bromley','cambridge','cheltenham','chesterfield','colchester','crawley','crewe','fleetwood','gillingham','grimsby','harrogate','mkdons','newport','nottscounty','oldham','salford','shrewsbury','swindon','tranmere','walsall','bristolrovers'],
};

// ---------- Budgets (£M) — all 92 clubs ----------
const PLM_TEAM_BUDGETS = {
    // Premier League
    mancity: 200, chelsea: 180, liverpool: 130, arsenal: 110, manunited: 90,
    newcastle: 80, tottenham: 70, astonvilla: 65, brighton: 50, westham: 45,
    fulham: 35, crystalpalace: 30, brentford: 28, bournemouth: 28, everton: 25,
    nforest: 25, wolves: 20, leeds: 18, burnley: 15, sunderland: 12,
    // Championship
    leicester: 20, southampton: 15, sheffieldu: 10, ipswich: 12, middlesbrough: 8,
    coventry: 8, norwich: 8, watford: 7, westbrom: 10, hull: 7,
    prestonne: 6, swansea: 6, millwall: 6, derby: 5, stoke: 5,
    oxford: 5, portsmouth: 5, qpr: 4, sheffieldw: 4, blackburn: 4,
    birmingham: 3, bristolcity: 3, charlton: 2, wrexham: 4,
    // League One
    luton: 3, cardiff: 2.5, plymouth: 2, bolton: 2, stockport: 2,
    peterborough: 1.5, mansfield: 1.5, rotherham: 1.5, reading: 1.5, exeter: 1.2,
    huddersfield: 1.2, barnsley: 1, blackpool: 1, bradford: 0.8, burton: 0.8,
    doncaster: 0.7, leytonorient: 1, lincoln: 0.8, northampton: 0.6, portvale: 0.5,
    stevenage: 0.7, wigan: 1, wimbledon: 0.5, wycombe: 0.5,
    // League Two
    mkdons: 1, nottscounty: 0.8, cambridge: 0.7, chesterfield: 0.6, bristolrovers: 0.6,
    crewe: 0.5, shrewsbury: 0.5, swindon: 0.5, salford: 0.8, gillingham: 0.4,
    grimsby: 0.4, colchester: 0.4, walsall: 0.4, cheltenham: 0.3, barnet: 0.5,
    barrow: 0.3, bromley: 0.3, crawley: 0.3, fleetwood: 0.3, harrogate: 0.3,
    newport: 0.2, oldham: 0.3, tranmere: 0.3, accrington: 0.2,
};

// ---------- Prize money per finishing position (£M) ----------
const PLM_DIVISION_PRIZE_MONEY = {
    'premier-league': [160,150,140,130,120,112,104,96,90,84,78,72,66,60,54,48,42,36,30,24],
    'championship':   [15,13,11,9,8,7,6.5,6,5.5,5,4.5,4,3.5,3,2.5,2.5,2,2,1.5,1.5,1.5,1.5,1,1],
    'league-one':     [2,1.7,1.5,1.3,1.1,1,0.9,0.8,0.8,0.7,0.7,0.6,0.6,0.5,0.5,0.5,0.4,0.4,0.4,0.3,0.3,0.3,0.2,0.2],
    'league-two':     [0.5,0.4,0.35,0.3,0.25,0.25,0.2,0.2,0.18,0.18,0.15,0.15,0.15,0.15,0.12,0.12,0.1,0.1,0.1,0.08,0.08,0.08,0.05,0.05],
};

// ---------- Player market value (£M) ----------
function plmPlayerValue(rating) {
    if (rating >= 90) return Math.round(80 + (rating - 90) * 15);
    if (rating >= 85) return Math.round(40 + (rating - 85) * 8);
    if (rating >= 80) return Math.round(20 + (rating - 80) * 4);
    if (rating >= 75) return Math.round(10 + (rating - 75) * 2);
    if (rating >= 70) return Math.round(5  + (rating - 70) * 1);
    if (rating >= 65) return Math.round(2  + (rating - 65) * 0.6);
    if (rating >= 60) return Math.max(1, Math.round((rating - 60) * 0.4 + 0.5));
    return 1;
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
        goals: 0, assists: 0, yellows: 0, reds: 0, suspended: 0, injured: 0,
    };
}

function plmGenerateFreeAgentPool(divisionId) {
    const div = divisionId || 'premier-league';
    let bands;
    if (div === 'premier-league') {
        bands = [
            { min: 88, max: 92, count: 4 }, { min: 83, max: 87, count: 8 },
            { min: 78, max: 82, count: 12 }, { min: 73, max: 77, count: 14 },
            { min: 68, max: 72, count: 12 }, { min: 63, max: 67, count: 8 },
            { min: 58, max: 62, count: 4 },
        ];
    } else if (div === 'championship') {
        bands = [
            { min: 73, max: 78, count: 6 }, { min: 68, max: 72, count: 12 },
            { min: 63, max: 67, count: 14 }, { min: 58, max: 62, count: 10 },
        ];
    } else if (div === 'league-one') {
        bands = [
            { min: 66, max: 70, count: 6 }, { min: 62, max: 65, count: 12 },
            { min: 57, max: 61, count: 10 },
        ];
    } else {
        bands = [
            { min: 62, max: 65, count: 6 }, { min: 57, max: 61, count: 12 },
            { min: 53, max: 56, count: 8 },
        ];
    }
    const posBag = ['GK','DEF','DEF','DEF','DEF','MID','MID','MID','FWD','FWD','FWD'];
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
    const ids = teams.map(t => (typeof t === 'string' ? t : t.id));
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
        { pos: 'DEF', count: 6, modifier: -2 },
        { pos: 'MID', count: 6, modifier:  0 },
        { pos: 'FWD', count: 4, modifier: +2 },
    ];
    const squad = [];
    let i = 0;
    for (const role of roles) {
        for (let n = 0; n < role.count; n++) {
            squad.push({
                id: `${team.id}_${i++}`,
                name: `${pickFrom(PLM_FIRST_NAMES)} ${pickFrom(PLM_LAST_NAMES)}`,
                pos: role.pos,
                rating: Math.max(48, Math.min(92, team.rating + role.modifier + Math.floor(rng() * 9) - 4)),
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
function plmEmptyTable(teamIds) {
    const t = {};
    for (const id of teamIds) t[id] = { id, P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 };
    return t;
}
function plmApplyResult(table, homeId, awayId, hs, as) {
    const H = table[homeId], A = table[awayId];
    if (!H || !A) return;
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

// ---------- Save key ----------
const PLM_SAVE_KEY = 'plm_save_v3';

// ---------- Game class ----------
class PLManager {
    constructor() {
        this.rootEl = document.getElementById('plm-root');
        if (!this.rootEl) return;
        this.squads = {};
        for (const team of PLM_ALL_TEAMS) this.squads[team.id] = plmGenerateSquad(team);
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
        if (this.state && (!this.state.playerTeam || !this.state.fixtures || !this.state.divisionId)) this.state = null;
        if (this.state) {
            const known = new Set(PLM_ALL_TEAMS.map(t => t.id));
            if (!known.has(this.state.playerTeam)) {
                localStorage.removeItem(PLM_SAVE_KEY);
                this.state = null;
            }
        }
    }
    save() {
        try { localStorage.setItem(PLM_SAVE_KEY, JSON.stringify(this.state)); } catch (e) {}
    }

    // ---- new game ----
    newGame(playerTeamId, carryoverBudgets = null, newDivisions = null, forceDivId = null) {
        const currentDivisions = newDivisions || JSON.parse(JSON.stringify(PLM_INITIAL_DIVISIONS));

        // Determine the player's division
        let divisionId = forceDivId;
        if (!divisionId) {
            for (const [divId, ids] of Object.entries(currentDivisions)) {
                if (ids.includes(playerTeamId)) { divisionId = divId; break; }
            }
        }
        if (!divisionId) divisionId = 'premier-league';

        const divisionTeamIds = currentDivisions[divisionId];
        const divisionTeamObjects = divisionTeamIds.map(id => PLM_ALL_TEAMS_BY_ID[id]).filter(Boolean);

        // Build budgets for all 92 teams
        const allBudgets = {};
        for (const team of PLM_ALL_TEAMS) {
            allBudgets[team.id] = carryoverBudgets
                ? (carryoverBudgets[team.id] ?? PLM_TEAM_BUDGETS[team.id] ?? 1)
                : (PLM_TEAM_BUDGETS[team.id] ?? 1);
        }

        this.state = {
            playerTeam:         playerTeamId,
            season:             1,
            matchDay:           1,
            divisionId,
            divisionTeamIds,
            currentDivisions,
            fixtures:           plmGenerateFixtures(divisionTeamObjects),
            results:            [],
            table:              plmEmptyTable(divisionTeamIds),
            screen:             'transferWindow',
            transferWindowType: 'summer',
            lastMatch:          null,
            formation:          PLM_DEFAULT_FORMATION,
            xi:                 [],
            allBudgets,
            freeAgents:         plmGenerateFreeAgentPool(divisionId),
            transferLog:        [],
            janWindowDone:      false,
            prizeAwarded:       false,
        };

        // Re-generate squads for teams in this division
        for (const id of divisionTeamIds) {
            const team = PLM_ALL_TEAMS_BY_ID[id];
            if (team) this.squads[id] = plmGenerateSquad(team);
        }

        this.state.xi = plmAutoPickXI(this.squads[playerTeamId], PLM_DEFAULT_FORMATION).map(p => p.id);
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
    playerTeam()      { return PLM_ALL_TEAMS_BY_ID[this.state.playerTeam]; }
    budget()          { return this.state.allBudgets ? (this.state.allBudgets[this.state.playerTeam] || 0) : 0; }
    divConfig()       { return PLM_DIVISIONS[this.state.divisionId] || PLM_DIVISIONS['premier-league']; }

    // ---- AI transfer logic ----
    doAITransfers(windowType) {
        const log  = [];
        const fas  = this.state.freeAgents;
        const divTeamIds = this.state.divisionTeamIds || [];
        const aiTeams = divTeamIds
            .filter(id => id !== this.state.playerTeam)
            .map(id => PLM_ALL_TEAMS_BY_ID[id]).filter(Boolean);

        for (let i = aiTeams.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [aiTeams[i], aiTeams[j]] = [aiTeams[j], aiTeams[i]];
        }
        for (const team of aiTeams) {
            const squad = this.squads[team.id];
            const sellChance = windowType === 'summer' ? 0.85 : 0.65;
            if (Math.random() < sellChance && squad.length > 14) {
                const weakest = squad.filter(p => p.pos !== 'GK').sort((a, b) => a.rating - b.rating)[0];
                if (weakest) {
                    const sp = Math.round(plmPlayerValue(weakest.rating) * (0.8 + Math.random() * 0.2));
                    this.state.allBudgets[team.id] = (this.state.allBudgets[team.id] || 0) + sp;
                    squad.splice(squad.indexOf(weakest), 1);
                    fas.push({ ...weakest, id: plmUniqueId('fa'), value: Math.round(plmPlayerValue(weakest.rating)) });
                    log.push(`💰 ${team.name} sell ${weakest.name} (${weakest.pos} ${weakest.rating}) for £${sp}m`);
                }
            }
            const maxBuys = windowType === 'summer' ? (Math.random() < 0.4 ? 2 : 1) : 1;
            let bought = 0;
            const affordable = fas
                .filter(p => p.value > 0 && p.value <= (this.state.allBudgets[team.id] || 0))
                .sort((a, b) => b.rating - a.rating);
            for (const fa of affordable) {
                if (bought >= maxBuys || squad.length >= 23) break;
                if (fa.value > (this.state.allBudgets[team.id] || 0)) continue;
                this.state.allBudgets[team.id] -= fa.value;
                fas.splice(fas.indexOf(fa), 1);
                squad.push({ ...fa, id: plmUniqueId(team.id),
                    goals: 0, assists: 0, yellows: 0, reds: 0, suspended: 0, injured: 0 });
                log.push(`✍️ ${team.name} sign ${fa.name} (${fa.pos} ${fa.rating}) for £${fa.value}m`);
                bought++;
            }
        }
        this.state.transferLog = [...(this.state.transferLog || []), ...log];
    }

    // ---- Player buys from another club ----
    buyFromClub(playerId, sellingTeamId) {
        const sellingSquad = this.squads[sellingTeamId];
        const idx = sellingSquad ? sellingSquad.findIndex(p => p.id === playerId) : -1;
        if (idx < 0) return;
        const player = sellingSquad[idx];
        const value  = plmPlayerValue(player.rating);
        const squad  = this.squads[this.state.playerTeam];
        if (value > this.budget() || squad.length >= 25) return;

        sellingSquad.splice(idx, 1);
        squad.push({ ...player });

        this.state.allBudgets[this.state.playerTeam] -= value;
        this.state.allBudgets[sellingTeamId] = (this.state.allBudgets[sellingTeamId] || 0) + Math.round(value * 0.9);

        const sellingTeam = PLM_ALL_TEAMS_BY_ID[sellingTeamId];
        this.state.transferLog.push(`✍️ You sign ${player.name} from ${sellingTeam.name} for £${value}m`);
        this.save();
        this.renderTransferWindow();
    }

    // ---- Player sells ----
    sellPlayer(playerId) {
        const squad = this.squads[this.state.playerTeam];
        if (squad.length <= 14) return;
        const idx = squad.findIndex(p => p.id === playerId);
        if (idx < 0) return;
        const sold = squad.splice(idx, 1)[0];
        const sp   = Math.round(plmPlayerValue(sold.rating) * 0.9);
        this.state.allBudgets[this.state.playerTeam] = (this.state.allBudgets[this.state.playerTeam] || 0) + sp;
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
            const home = PLM_ALL_TEAMS_BY_ID[fx.home], away = PLM_ALL_TEAMS_BY_ID[fx.away];
            if (!home || !away) continue;
            const homeXI = this.getXIFor(home.id), awayXI = this.getXIFor(away.id);
            const sim = plmSimulateMatch(home, homeXI, away, awayXI,
                this.getFormationFor(home.id), this.getFormationFor(away.id));
            plmApplyResult(this.state.table, home.id, away.id, sim.homeScore, sim.awayScore);
            this.state.results.push({ matchDay: md, home: home.id, away: away.id, hs: sim.homeScore, as: sim.awayScore });
            if (home.id === this.state.playerTeam || away.id === this.state.playerTeam)
                playerResult = { fixture: fx, ...sim, home, away };
        }
        for (const teamId of Object.keys(this.squads))
            for (const p of this.squads[teamId]) { if (p.suspended > 0) p.suspended--; if (p.injured > 0) p.injured--; }

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

        const totalMD = this.divConfig().matchdays;
        if (this.state.matchDay > totalMD) {
            this.state.screen = 'seasonEnd';
        } else {
            this.state.screen = 'matchResult';
        }
        this.save();
        this.render();
    }

    // ---- Simulate other 3 divisions (rating + noise based) ----
    simulateOtherDivisions() {
        const results = {};
        for (const [divId, teamIds] of Object.entries(this.state.currentDivisions)) {
            if (divId === this.state.divisionId) continue;
            const scored = teamIds.map(id => {
                const team = PLM_ALL_TEAMS_BY_ID[id];
                return { id, score: (team ? team.rating : 60) + (Math.random() - 0.5) * 22 };
            });
            results[divId] = scored.sort((a, b) => b.score - a.score).map(r => r.id);
        }
        return results;
    }

    // ---- Calculate new divisions after promotion/relegation ----
    calculateNewDivisions(playerSortedIds, otherDivResults) {
        const sorted = { ...otherDivResults, [this.state.divisionId]: playerSortedIds };

        const pl = sorted['premier-league'] || [];
        const ch = sorted['championship']   || [];
        const l1 = sorted['league-one']     || [];
        const l2 = sorted['league-two']     || [];

        const playoffWinner = (arr, start, end) => {
            const candidates = arr.slice(start, end + 1).filter(Boolean);
            if (!candidates.length) return null;
            const weights = [40, 30, 20, 10].slice(0, candidates.length);
            const total = weights.reduce((a, b) => a + b, 0);
            let r = Math.random() * total;
            for (let i = 0; i < candidates.length; i++) { r -= weights[i]; if (r <= 0) return candidates[i]; }
            return candidates[0];
        };

        // Promotion from lower divisions
        const l2AutoUp   = l2.slice(0, 3);
        const l2Playoff  = playoffWinner(l2, 3, 6);
        const l1AutoUp   = l1.slice(0, 2);
        const l1Playoff  = playoffWinner(l1, 2, 5);
        const chAutoUp   = ch.slice(0, 2);
        const chPlayoff  = playoffWinner(ch, 2, 5);

        // Relegation
        const plRel  = pl.slice(-3);
        const chRel  = ch.slice(-3);
        const l1Rel  = l1.slice(-4);
        this._l2Bottom2 = l2.slice(-2); // these get £0 budget

        const l2PromoSet = new Set([...l2AutoUp, l2Playoff].filter(Boolean));
        const l1PromoSet = new Set([...l1AutoUp, l1Playoff].filter(Boolean));
        const chPromoSet = new Set([...chAutoUp, chPlayoff].filter(Boolean));
        const plRelSet   = new Set(plRel);
        const chRelSet   = new Set(chRel);
        const l1RelSet   = new Set(l1Rel);

        const next = {
            'premier-league': [
                ...pl.filter(id => !plRelSet.has(id)),
                ...chAutoUp, ...(chPlayoff ? [chPlayoff] : []),
            ],
            'championship': [
                ...ch.filter(id => !chPromoSet.has(id) && !chRelSet.has(id)),
                ...plRel,
                ...l1AutoUp, ...(l1Playoff ? [l1Playoff] : []),
            ],
            'league-one': [
                ...l1.filter(id => !l1PromoSet.has(id) && !l1RelSet.has(id)),
                ...chRel,
                ...l2AutoUp, ...(l2Playoff ? [l2Playoff] : []),
            ],
            'league-two': [
                ...l2.filter(id => !l2PromoSet.has(id)),
                ...l1Rel,
            ],
        };
        return next;
    }

    // ---- rendering ----
    render() {
        if (!this.rootEl) return;
        if (!this.state) return this.renderTeamSelect();
        if (!this.state.formation)    this.state.formation    = PLM_DEFAULT_FORMATION;
        if (!this.state.divisionId)   this.state.divisionId   = 'premier-league';
        if (!this.state.divisionTeamIds) this.state.divisionTeamIds = PLM_INITIAL_DIVISIONS['premier-league'];
        if (!this.state.xi)           this.state.xi           = plmAutoPickXI(this.squads[this.state.playerTeam], this.state.formation).map(p => p.id);
        if (!this.state.allBudgets)   this.state.allBudgets   = Object.fromEntries(PLM_ALL_TEAMS.map(t => [t.id, PLM_TEAM_BUDGETS[t.id] || 1]));
        if (!this.state.freeAgents)   this.state.freeAgents   = plmGenerateFreeAgentPool(this.state.divisionId);
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
        const sections = PLM_DIV_ORDER.map(divId => {
            const div   = PLM_DIVISIONS[divId];
            const teams = PLM_ALL_TEAMS.filter(t => t.division === divId);
            const cards = teams.map(t => {
                const budget = PLM_TEAM_BUDGETS[t.id] || 1;
                const budgetStr = budget < 1 ? `£${(budget * 1000).toFixed(0)}k` : `£${budget}m`;
                return `<button class="plm-team-card" data-team="${t.id}"
                    style="background:${t.color};color:${t.text}">
                    <span class="plm-team-name">${t.name}</span>
                    <span class="plm-team-meta">OVR <b>${t.rating}</b> · <b>${budgetStr}</b></span>
                </button>`;
            }).join('');
            return `<div class="plm-div-section">
                <h3 class="plm-div-header">${div.name}</h3>
                <div class="plm-team-grid">${cards}</div>
            </div>`;
        }).join('');

        this.rootEl.innerHTML = `
            <div class="plm-select">
                <h2 class="plm-select-h">Pick your club</h2>
                <p class="plm-select-sub">Choose from all 92 English professional clubs across 4 divisions. Win promotion, avoid relegation!</p>
                ${sections}
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

        const tFilter = this._tFilter || 'all';
        const pFilter = this._pFilter || 'all';

        // Market = other clubs in same division
        const allMarket = [];
        for (const id of (this.state.divisionTeamIds || [])) {
            if (id === this.state.playerTeam) continue;
            const t = PLM_ALL_TEAMS_BY_ID[id];
            if (!t) continue;
            for (const p of (this.squads[id] || [])) {
                allMarket.push({ ...p, sellingTeamId: id, sellingTeam: t, value: plmPlayerValue(p.rating) });
            }
        }
        allMarket.sort((a, b) => b.rating - a.rating);
        const filtered = allMarket.filter(p =>
            (tFilter === 'all' || p.sellingTeamId === tFilter) &&
            (pFilter === 'all' || p.pos === pFilter)
        );

        const divTeams = (this.state.divisionTeamIds || [])
            .filter(id => id !== this.state.playerTeam)
            .map(id => PLM_ALL_TEAMS_BY_ID[id]).filter(Boolean);

        const teamOpts = [{ id: 'all', name: 'All Clubs' }, ...divTeams]
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

        const budgetDisplay = budget < 1 ? `£${(budget * 1000).toFixed(0)}k` : `£${Math.round(budget)}m`;

        this.rootEl.innerHTML = `
            <div class="plm-transfer">
                <header class="plm-header" style="background:${team.color};color:${team.text}">
                    <div>
                        <div class="plm-hdr-small">${windowLabel} · Season ${this.state.season} · ${PLM_DIVISIONS[this.state.divisionId].name}</div>
                        <div class="plm-hdr-name">${team.name}</div>
                    </div>
                    <div class="plm-hdr-right">
                        <div class="plm-hdr-small">Transfer Budget</div>
                        <div class="plm-hdr-name">${budgetDisplay}</div>
                    </div>
                </header>
                <div class="plm-transfer-body">
                    <div class="plm-transfer-cols">
                        <section class="plm-transfer-section">
                            <h3>🛒 Buy Players <span class="plm-budget-chip">${budgetDisplay} left</span></h3>
                            <div class="plm-transfer-filters" style="display:flex;gap:8px;margin-bottom:8px">
                                <select id="plm-tfilter">${teamOpts}</select>
                                <select id="plm-pfilter">${posOpts}</select>
                            </div>
                            <p class="plm-transfer-hint">${filtered.length} player${filtered.length !== 1 ? 's' : ''} shown · Squad ${squad.length}/25</p>
                            <div class="plm-transfer-scroll">
                                <table class="plm-squad">
                                    <thead><tr><th>Pos</th><th>Name</th><th>Rtg</th><th>Fee</th></tr></thead>
                                    <tbody>${buyRows || '<tr><td colspan="4" style="text-align:center;padding:12px;color:#888">No players match your filters.</td></tr>'}</tbody>
                                </table>
                            </div>
                        </section>
                        <section class="plm-transfer-section">
                            <h3>💰 Sell Players</h3>
                            <p class="plm-transfer-hint">Min squad 14 · You have ${squad.length} · Sale price = 90% of value</p>
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

    // ---- Dashboard ----
    renderDashboard() {
        const team     = this.playerTeam();
        const fx       = this.playerFixture();
        const isHome   = fx && fx.home === team.id;
        const opponent = fx ? PLM_ALL_TEAMS_BY_ID[isHome ? fx.away : fx.home] : null;
        const venue    = isHome ? 'vs' : '@';
        const budget   = this.budget();
        const budgetDisplay = budget < 1 ? `£${(budget * 1000).toFixed(0)}k` : `£${Math.round(budget)}m`;
        const totalMD  = this.divConfig().matchdays;
        const divName  = this.divConfig().name;

        this.rootEl.innerHTML = `
            <div class="plm-dashboard">
                <header class="plm-header" style="background:${team.color};color:${team.text}">
                    <div>
                        <div class="plm-hdr-small">${divName} · Season ${this.state.season}</div>
                        <div class="plm-hdr-name">${team.name}</div>
                    </div>
                    <div class="plm-hdr-right">
                        <div class="plm-hdr-small">MD ${this.state.matchDay}/${totalMD} · Budget ${budgetDisplay}</div>
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
        const opp = fx ? PLM_ALL_TEAMS_BY_ID[fx.home === team.id ? fx.away : fx.home] : null;
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

        const janTrigger = this.divConfig().janTrigger;
        const janHint = (this.state.matchDay === janTrigger && !this.state.janWindowDone)
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
            if (this.state.matchDay === janTrigger && !this.state.janWindowDone) {
                const extra = plmGenerateFreeAgentPool(this.state.divisionId).slice(0, 20);
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
        const team     = this.playerTeam();
        const divName  = this.divConfig().name;
        const sorted   = plmSortedTable(this.state.table);
        const yourPos  = sorted.findIndex(r => r.id === team.id) + 1;
        const divPrize = PLM_DIVISION_PRIZE_MONEY[this.state.divisionId] || PLM_DIVISION_PRIZE_MONEY['league-two'];
        const divTeams = this.state.divisionTeamIds.length;

        // Award prize money once
        let promoRelInfo = null;
        if (!this.state.prizeAwarded) {
            for (let i = 0; i < sorted.length; i++) {
                const prize = divPrize[i] || divPrize[divPrize.length - 1] || 0;
                this.state.allBudgets[sorted[i].id] = (this.state.allBudgets[sorted[i].id] || 0) + prize;
            }

            // Calculate promo/rel
            const otherDivResults = this.simulateOtherDivisions();
            const playerSortedIds = sorted.map(r => r.id);
            const newDivisions    = this.calculateNewDivisions(playerSortedIds, otherDivResults);

            // Zero budgets for L2 bottom 2
            if (this._l2Bottom2) {
                for (const id of this._l2Bottom2) {
                    this.state.allBudgets[id] = 0;
                }
            }

            this.state.prizeAwarded  = true;
            this.state.newDivisions  = newDivisions;
            this.state.otherDivSorted = otherDivResults;
            this.save();
        }

        const newDivisions = this.state.newDivisions || null;

        // Find player's new division
        let newDivId = this.state.divisionId;
        if (newDivisions) {
            for (const [divId, ids] of Object.entries(newDivisions)) {
                if (ids.includes(this.state.playerTeam)) { newDivId = divId; break; }
            }
        }
        const promoted  = newDivId !== this.state.divisionId && PLM_DIV_ORDER.indexOf(newDivId) < PLM_DIV_ORDER.indexOf(this.state.divisionId);
        const relegated = newDivId !== this.state.divisionId && PLM_DIV_ORDER.indexOf(newDivId) > PLM_DIV_ORDER.indexOf(this.state.divisionId);

        const yourPrize  = divPrize[yourPos - 1] || divPrize[divPrize.length - 1] || 0;
        const nextBudget = this.state.allBudgets[this.state.playerTeam] || 0;
        const nextBudgetDisplay = nextBudget < 1 ? `£${(nextBudget * 1000).toFixed(0)}k` : `£${Math.round(nextBudget)}m`;

        const ordinal = n => { const s=['th','st','nd','rd'], v=n%100; return n+(s[(v-20)%10]||s[v]||s[0]); };

        let verdict;
        if      (promoted && yourPos === 1)   verdict = `🏆 CHAMPIONS of ${divName} — and promoted!`;
        else if (promoted)                     verdict = `🎉 Promoted to ${PLM_DIVISIONS[newDivId].name}! Finished ${ordinal(yourPos)}.`;
        else if (relegated)                    verdict = `💀 Relegated to ${PLM_DIVISIONS[newDivId].name}. Finished ${ordinal(yourPos)}.`;
        else if (yourPos === 1)                verdict = `🏆 CHAMPIONS of ${divName}!`;
        else if (this.state.divisionId === 'premier-league' && yourPos <= 4)  verdict = `✨ Champions League qualification — ${ordinal(yourPos)}!`;
        else if (this.state.divisionId === 'premier-league' && yourPos <= 7)  verdict = `🥈 European qualification — ${ordinal(yourPos)}.`;
        else                                   verdict = `Finished ${ordinal(yourPos)} in ${divName}.`;

        // Promotion/relegation summary for player's division
        let moveLines = '';
        if (newDivisions) {
            const divId = this.state.divisionId;
            const curIds = this.state.divisionTeamIds;
            const nextIds = newDivisions[divId] || [];
            const relIds  = curIds.filter(id => !nextIds.includes(id));
            const promIds = nextIds.filter(id => !curIds.includes(id));
            if (relIds.length || promIds.length) {
                const relNames = relIds.map(id => PLM_ALL_TEAMS_BY_ID[id]?.name || id).join(', ');
                const promNames = promIds.map(id => PLM_ALL_TEAMS_BY_ID[id]?.name || id).join(', ');
                moveLines = `
                    <div class="plm-promo-box">
                        ${promIds.length ? `<p>⬆️ <b>Promoted in:</b> ${promNames}</p>` : ''}
                        ${relIds.length  ? `<p>⬇️ <b>Relegated out:</b> ${relNames}</p>` : ''}
                    </div>`;
            }
        }

        const prizeRows = sorted.map((r, i) => {
            const t     = PLM_ALL_TEAMS_BY_ID[r.id];
            const prize = divPrize[i] || divPrize[divPrize.length - 1] || 0;
            const cls   = r.id === this.state.playerTeam ? 'me' : '';
            return `<tr class="${cls}"><td>${i+1}</td><td>${t ? t.name : r.id}</td><td>${r.Pts}pts</td><td>£${prize}m</td></tr>`;
        }).join('');

        this.rootEl.innerHTML = `
            <div class="plm-season-end">
                <h2>Season ${this.state.season} · Full Time · ${divName}</h2>
                <p class="plm-verdict-big">${verdict}</p>

                <div class="plm-prize-box">
                    <div class="plm-prize-pos">${ordinal(yourPos)} place</div>
                    <div class="plm-prize-amount">£${yourPrize}m prize money</div>
                    <div class="plm-prize-sub">Budget for next season: <b>${nextBudgetDisplay}</b>
                        ${newDivId !== this.state.divisionId ? ` (${PLM_DIVISIONS[newDivId].name})` : ''}</div>
                </div>

                ${moveLines}

                <details class="plm-prize-details">
                    <summary>Prize money breakdown</summary>
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
            const savedBudgets = { ...this.state.allBudgets };
            const newDivs      = this.state.newDivisions || null;
            this.newGame(teamId, savedBudgets, newDivs, newDivId);
            this.state.season = season;
            this.save();
            this.render();
        });
        this.rootEl.querySelector('#plm-reset').addEventListener('click', () => this.quitSave());
    }

    // ---- Shared HTML helpers ----
    tableHtml() {
        const sorted  = plmSortedTable(this.state.table);
        const divId   = this.state.divisionId;
        const divSize = (this.state.divisionTeamIds || []).length;

        const rows = sorted.map((r, i) => {
            const team = PLM_ALL_TEAMS_BY_ID[r.id];
            const pos  = i + 1;
            let cls = '';
            if (divId === 'premier-league') {
                if (pos <= 4) cls = 'pos-cl';
                else if (pos <= 7) cls = 'pos-eur';
                else if (pos >= divSize - 2) cls = 'pos-rel';
            } else if (divId === 'championship') {
                if (pos <= 2) cls = 'pos-cl';
                else if (pos <= 6) cls = 'pos-eur';
                else if (pos >= divSize - 2) cls = 'pos-rel';
            } else if (divId === 'league-one') {
                if (pos <= 2) cls = 'pos-cl';
                else if (pos <= 6) cls = 'pos-eur';
                else if (pos >= divSize - 3) cls = 'pos-rel';
            } else {
                if (pos <= 3) cls = 'pos-cl';
                else if (pos <= 7) cls = 'pos-eur';
                else if (pos >= divSize - 1) cls = 'pos-rel';
            }
            const highlight = r.id === this.state.playerTeam ? 'me' : '';
            return `<tr class="${cls} ${highlight}">
                <td class="plm-tbl-pos">${pos}</td>
                <td class="plm-tbl-team"><span class="plm-tbl-dot" style="background:${team ? team.color : '#999'}"></span>${team ? team.short : r.id}</td>
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
