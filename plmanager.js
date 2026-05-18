// ==================================================================
// The Boss v4
// All 92 English professional clubs + UEFA European competitions.
// Champions League, Europa League, Conference League.
// Multi-season: squad persists across seasons.
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

// ---------- European club teams ----------
const PLM_EUR_TEAMS = [
    // ── La Liga (Spain) ─────────────────────────────────────────────
    { id: 'realmadrid',   name: 'Real Madrid',           short: 'RMA', color: '#FEBE10', text: '#fff', rating: 92, country: 'Spain'       },
    { id: 'barcelona',    name: 'Barcelona',              short: 'BAR', color: '#A50044', text: '#fff', rating: 88, country: 'Spain'       },
    { id: 'atletico',     name: 'Atletico Madrid',        short: 'ATM', color: '#CE3524', text: '#fff', rating: 85, country: 'Spain'       },
    { id: 'villarreal',   name: 'Villarreal',             short: 'VIL', color: '#FFD700', text: '#000', rating: 78, country: 'Spain'       },
    { id: 'realsociedad', name: 'Real Sociedad',          short: 'RSO', color: '#0033A0', text: '#fff', rating: 74, country: 'Spain'       },
    { id: 'girona',       name: 'Girona',                 short: 'GIR', color: '#CD1515', text: '#fff', rating: 75, country: 'Spain'       },
    { id: 'athletic',     name: 'Athletic Club',          short: 'ATH', color: '#CC0000', text: '#fff', rating: 76, country: 'Spain'       },
    { id: 'realbetis',    name: 'Real Betis',             short: 'BET', color: '#00A650', text: '#fff', rating: 74, country: 'Spain'       },
    { id: 'sevilla',      name: 'Sevilla',                short: 'SEV', color: '#C8102E', text: '#fff', rating: 76, country: 'Spain'       },
    { id: 'celta',        name: 'Celta Vigo',             short: 'CEL', color: '#6DAEE3', text: '#fff', rating: 70, country: 'Spain'       },
    { id: 'valencia',     name: 'Valencia',               short: 'VAL', color: '#FF7F00', text: '#000', rating: 72, country: 'Spain'       },
    { id: 'osasuna',      name: 'Osasuna',                short: 'OSA', color: '#CC0000', text: '#fff', rating: 68, country: 'Spain'       },
    { id: 'getafe',       name: 'Getafe',                 short: 'GET', color: '#0057A8', text: '#fff', rating: 67, country: 'Spain'       },
    { id: 'mallorca',     name: 'Mallorca',               short: 'MAL', color: '#CC0000', text: '#fff', rating: 66, country: 'Spain'       },
    { id: 'alaves',       name: 'Deportivo Alaves',       short: 'ALA', color: '#0057A8', text: '#fff', rating: 64, country: 'Spain'       },
    { id: 'leganes',      name: 'Leganes',                short: 'LEG', color: '#004EA8', text: '#fff', rating: 63, country: 'Spain'       },
    { id: 'espanyol',     name: 'Espanyol',               short: 'ESP', color: '#0046AD', text: '#fff', rating: 65, country: 'Spain'       },
    { id: 'laspalmas',    name: 'Las Palmas',             short: 'LPA', color: '#FFD700', text: '#000', rating: 62, country: 'Spain'       },
    { id: 'rayo',         name: 'Rayo Vallecano',         short: 'RAY', color: '#CC0000', text: '#fff', rating: 67, country: 'Spain'       },
    { id: 'valladolid',   name: 'Real Valladolid',        short: 'VLD', color: '#6600CC', text: '#fff', rating: 61, country: 'Spain'       },
    // ── Bundesliga (Germany) ────────────────────────────────────────
    { id: 'bayernmunich', name: 'Bayern Munich',          short: 'BAY', color: '#DC052D', text: '#fff', rating: 90, country: 'Germany'     },
    { id: 'leverkusen',   name: 'Bayer Leverkusen',       short: 'LEV', color: '#E32221', text: '#fff', rating: 86, country: 'Germany'     },
    { id: 'dortmund',     name: 'Borussia Dortmund',      short: 'BVB', color: '#FDE100', text: '#000', rating: 84, country: 'Germany'     },
    { id: 'rbleipzig',    name: 'RB Leipzig',             short: 'RBL', color: '#DD0741', text: '#fff', rating: 83, country: 'Germany'     },
    { id: 'vfbstuttgart', name: 'VfB Stuttgart',          short: 'STU', color: '#E32221', text: '#fff', rating: 80, country: 'Germany'     },
    { id: 'frankfurt',    name: 'Eintracht Frankfurt',    short: 'EFR', color: '#E2001A', text: '#fff', rating: 79, country: 'Germany'     },
    { id: 'hoffenheim',   name: 'TSG Hoffenheim',         short: 'HOF', color: '#1261AD', text: '#fff', rating: 74, country: 'Germany'     },
    { id: 'gladbach',     name: 'Borussia M\'gladbach',   short: 'BMG', color: '#000000', text: '#fff', rating: 76, country: 'Germany'     },
    { id: 'wolfsburg',    name: 'VfL Wolfsburg',          short: 'WOB', color: '#65B32E', text: '#fff', rating: 75, country: 'Germany'     },
    { id: 'unionberlin',  name: 'Union Berlin',           short: 'UNB', color: '#CC0000', text: '#fff', rating: 72, country: 'Germany'     },
    { id: 'freiburg',     name: 'SC Freiburg',            short: 'SCF', color: '#CC0000', text: '#000', rating: 74, country: 'Germany'     },
    { id: 'mainz',        name: 'FSV Mainz 05',           short: 'M05', color: '#CC0000', text: '#fff', rating: 70, country: 'Germany'     },
    { id: 'werderbremen', name: 'Werder Bremen',          short: 'SVW', color: '#1D6337', text: '#fff', rating: 71, country: 'Germany'     },
    { id: 'augsburg',     name: 'FC Augsburg',            short: 'FCA', color: '#CC0000', text: '#fff', rating: 67, country: 'Germany'     },
    { id: 'heidenheim',   name: 'FC Heidenheim',          short: 'FCH', color: '#CC0000', text: '#fff', rating: 65, country: 'Germany'     },
    { id: 'bochum',       name: 'VfL Bochum',             short: 'BOC', color: '#1B4F9B', text: '#fff', rating: 63, country: 'Germany'     },
    { id: 'stpauli',      name: 'FC St. Pauli',           short: 'STP', color: '#8B4513', text: '#fff', rating: 64, country: 'Germany'     },
    { id: 'holstein',     name: 'Holstein Kiel',          short: 'KIE', color: '#CC0000', text: '#fff', rating: 62, country: 'Germany'     },
    // ── Serie A (Italy) ─────────────────────────────────────────────
    { id: 'inter',        name: 'Inter Milan',            short: 'INT', color: '#010E80', text: '#fff', rating: 87, country: 'Italy'       },
    { id: 'acmilan',      name: 'AC Milan',               short: 'MIL', color: '#FB090B', text: '#fff', rating: 84, country: 'Italy'       },
    { id: 'juventus',     name: 'Juventus',               short: 'JUV', color: '#000000', text: '#fff', rating: 83, country: 'Italy'       },
    { id: 'atalanta',     name: 'Atalanta',               short: 'ATA', color: '#1E90FF', text: '#fff', rating: 82, country: 'Italy'       },
    { id: 'napoli',       name: 'Napoli',                 short: 'NAP', color: '#12A0C5', text: '#fff', rating: 83, country: 'Italy'       },
    { id: 'roma',         name: 'AS Roma',                short: 'ROM', color: '#8B1A1A', text: '#FFD700', rating: 80, country: 'Italy'   },
    { id: 'lazio',        name: 'Lazio',                  short: 'LAZ', color: '#87CEEB', text: '#003', rating: 79,  country: 'Italy'      },
    { id: 'fiorentina',   name: 'Fiorentina',             short: 'FIO', color: '#6600CC', text: '#fff', rating: 77, country: 'Italy'       },
    { id: 'bologna',      name: 'Bologna',                short: 'BOL', color: '#CE1E29', text: '#fff', rating: 75, country: 'Italy'       },
    { id: 'torino',       name: 'Torino',                 short: 'TOR', color: '#8B0000', text: '#fff', rating: 72, country: 'Italy'       },
    { id: 'udinese',      name: 'Udinese',                short: 'UDI', color: '#000000', text: '#fff', rating: 68, country: 'Italy'       },
    { id: 'sassuolo',     name: 'Sassuolo',               short: 'SAS', color: '#00AA44', text: '#000', rating: 70, country: 'Italy'       },
    { id: 'genoa',        name: 'Genoa',                  short: 'GEN', color: '#CC0000', text: '#fff', rating: 67, country: 'Italy'       },
    { id: 'lecce',        name: 'US Lecce',               short: 'LEC', color: '#FFD700', text: '#CC0000', rating: 63, country: 'Italy'  },
    { id: 'cagliari',     name: 'Cagliari',               short: 'CAG', color: '#CC0000', text: '#fff', rating: 64, country: 'Italy'       },
    { id: 'empoli',       name: 'Empoli',                 short: 'EMP', color: '#1B75BB', text: '#fff', rating: 63, country: 'Italy'       },
    { id: 'verona',       name: 'Hellas Verona',          short: 'VER', color: '#FFD700', text: '#003', rating: 62, country: 'Italy'       },
    { id: 'monza',        name: 'AC Monza',               short: 'MON', color: '#CC0000', text: '#fff', rating: 65, country: 'Italy'       },
    { id: 'parma',        name: 'Parma',                  short: 'PAR', color: '#FFD700', text: '#000', rating: 64, country: 'Italy'       },
    { id: 'como',         name: 'Como 1907',              short: 'COM', color: '#004EA8', text: '#fff', rating: 62, country: 'Italy'       },
    // ── Ligue 1 (France) ────────────────────────────────────────────
    { id: 'psg',          name: 'Paris Saint-Germain',    short: 'PSG', color: '#004170', text: '#fff', rating: 89, country: 'France'      },
    { id: 'monaco',       name: 'Monaco',                 short: 'MON', color: '#CE1126', text: '#fff', rating: 78, country: 'France'      },
    { id: 'lille',        name: 'Lille',                  short: 'LIL', color: '#C61C23', text: '#fff', rating: 76, country: 'France'      },
    { id: 'lyon',         name: 'Olympique Lyonnais',     short: 'LYO', color: '#0032A0', text: '#fff', rating: 75, country: 'France'      },
    { id: 'marseille',    name: 'Olympique Marseille',    short: 'OM',  color: '#009FDF', text: '#fff', rating: 76, country: 'France'      },
    { id: 'nice',         name: 'OGC Nice',               short: 'NIC', color: '#000000', text: '#e00', rating: 73, country: 'France'      },
    { id: 'rennes',       name: 'Stade Rennais',          short: 'REN', color: '#CC0000', text: '#000', rating: 72, country: 'France'      },
    { id: 'brest',        name: 'Stade Brestois',         short: 'SBR', color: '#DA0202', text: '#fff', rating: 72, country: 'France'      },
    { id: 'lens',         name: 'RC Lens',                short: 'RCL', color: '#FFD700', text: '#CC0000', rating: 74, country: 'France' },
    { id: 'strasbourg',   name: 'Strasbourg',             short: 'STR', color: '#005BA7', text: '#fff', rating: 68, country: 'France'      },
    { id: 'toulouse',     name: 'Toulouse',               short: 'TOU', color: '#6600CC', text: '#fff', rating: 67, country: 'France'      },
    { id: 'reims',        name: 'Reims',                  short: 'REI', color: '#CC0000', text: '#fff', rating: 66, country: 'France'      },
    { id: 'nantes',       name: 'FC Nantes',              short: 'FCN', color: '#FFD700', text: '#000', rating: 65, country: 'France'      },
    { id: 'montpellier',  name: 'Montpellier HSC',        short: 'MTP', color: '#0033A0', text: '#fff', rating: 64, country: 'France'      },
    { id: 'havre',        name: 'Le Havre AC',            short: 'LHA', color: '#0057A8', text: '#fff', rating: 62, country: 'France'      },
    { id: 'auxerre',      name: 'AJ Auxerre',             short: 'AJA', color: '#0033A0', text: '#fff', rating: 63, country: 'France'      },
    { id: 'angers',       name: 'Angers SCO',             short: 'ANG', color: '#000000', text: '#fff', rating: 61, country: 'France'      },
    { id: 'saintetienne', name: 'Saint-Etienne',          short: 'STE', color: '#007B3A', text: '#fff', rating: 63, country: 'France'      },
    // ── Portugal ────────────────────────────────────────────────────
    { id: 'benfica',      name: 'Benfica',                short: 'BEN', color: '#E11D28', text: '#fff', rating: 80, country: 'Portugal'    },
    { id: 'porto',        name: 'FC Porto',               short: 'POR', color: '#0046AE', text: '#fff', rating: 79, country: 'Portugal'    },
    { id: 'sporting',     name: 'Sporting CP',            short: 'SPO', color: '#006600', text: '#fff', rating: 78, country: 'Portugal'    },
    { id: 'braga',        name: 'Sporting Braga',         short: 'BRA', color: '#CC0000', text: '#fff', rating: 74, country: 'Portugal'    },
    { id: 'guimaraes',    name: 'Vitoria Guimaraes',      short: 'GUI', color: '#000000', text: '#fff', rating: 67, country: 'Portugal'    },
    // ── Netherlands ─────────────────────────────────────────────────
    { id: 'psv',          name: 'PSV Eindhoven',          short: 'PSV', color: '#E31E24', text: '#fff', rating: 80, country: 'Netherlands' },
    { id: 'ajax',         name: 'Ajax',                   short: 'AJX', color: '#D2001A', text: '#fff', rating: 77, country: 'Netherlands' },
    { id: 'feyenoord',    name: 'Feyenoord',              short: 'FEY', color: '#C8102E', text: '#fff', rating: 78, country: 'Netherlands' },
    { id: 'az',           name: 'AZ Alkmaar',             short: 'AZ',  color: '#CC0000', text: '#fff', rating: 72, country: 'Netherlands' },
    { id: 'twente',       name: 'FC Twente',              short: 'FCT', color: '#CC0000', text: '#fff', rating: 70, country: 'Netherlands' },
    // ── Belgium ─────────────────────────────────────────────────────
    { id: 'clubbrugge',   name: 'Club Brugge',            short: 'BRU', color: '#1A73B8', text: '#fff', rating: 75, country: 'Belgium'     },
    { id: 'anderlecht',   name: 'Anderlecht',             short: 'AND', color: '#6C0E6D', text: '#fff', rating: 71, country: 'Belgium'     },
    { id: 'genk',         name: 'KRC Genk',               short: 'GNK', color: '#004499', text: '#fff', rating: 69, country: 'Belgium'     },
    // ── Turkey ──────────────────────────────────────────────────────
    { id: 'galatasaray',  name: 'Galatasaray',            short: 'GAL', color: '#F5A623', text: '#000', rating: 77, country: 'Turkey'      },
    { id: 'fenerbahce',   name: 'Fenerbahce',             short: 'FEN', color: '#FFD700', text: '#003', rating: 75, country: 'Turkey'      },
    { id: 'besiktas',     name: 'Besiktas',               short: 'BJK', color: '#000000', text: '#fff', rating: 72, country: 'Turkey'      },
    { id: 'trabzonspor',  name: 'Trabzonspor',            short: 'TRA', color: '#8B0000', text: '#fff', rating: 69, country: 'Turkey'      },
    // ── Scotland ────────────────────────────────────────────────────
    { id: 'celtic',       name: 'Celtic',                 short: 'CEL', color: '#16A950', text: '#fff', rating: 74, country: 'Scotland'    },
    { id: 'rangers',      name: 'Rangers',                short: 'RAN', color: '#1B458F', text: '#fff', rating: 72, country: 'Scotland'    },
    // ── Other Europe ────────────────────────────────────────────────
    { id: 'shakhtar',     name: 'Shakhtar Donetsk',       short: 'SHA', color: '#FF6B00', text: '#000', rating: 74, country: 'Ukraine'     },
    { id: 'redstar',      name: 'Red Star Belgrade',      short: 'RSB', color: '#CC0000', text: '#fff', rating: 73, country: 'Serbia'      },
    { id: 'youngboys',    name: 'Young Boys',             short: 'YBY', color: '#FDD800', text: '#000', rating: 70, country: 'Switzerland' },
    { id: 'sturmgraz',    name: 'Sturm Graz',             short: 'STG', color: '#000000', text: '#fff', rating: 70, country: 'Austria'     },
    { id: 'rapidwien',    name: 'Rapid Wien',             short: 'RAP', color: '#006633', text: '#fff', rating: 67, country: 'Austria'     },
    { id: 'dinamozagreb', name: 'Dinamo Zagreb',          short: 'DZG', color: '#0000CD', text: '#fff', rating: 71, country: 'Croatia'     },
    { id: 'slovan',       name: 'Slovan Bratislava',      short: 'SLV', color: '#0044AA', text: '#fff', rating: 68, country: 'Slovakia'    },
    { id: 'sparta',       name: 'Sparta Prague',          short: 'SPA', color: '#AA0000', text: '#fff', rating: 72, country: 'Czech Rep'   },
    { id: 'slavia',       name: 'Slavia Prague',          short: 'SLA', color: '#CC0000', text: '#fff', rating: 70, country: 'Czech Rep'   },
    { id: 'olympiakos',   name: 'Olympiacos',             short: 'OLY', color: '#CC0000', text: '#fff', rating: 72, country: 'Greece'      },
    { id: 'paok',         name: 'PAOK',                   short: 'PAO', color: '#000000', text: '#fff', rating: 69, country: 'Greece'      },
    { id: 'basel',        name: 'FC Basel',               short: 'BAS', color: '#BB2222', text: '#fff', rating: 71, country: 'Switzerland' },
    { id: 'ferencvaros',  name: 'Ferencvaros',            short: 'FER', color: '#006633', text: '#fff', rating: 70, country: 'Hungary'     },
    { id: 'rosenborg',    name: 'Rosenborg',              short: 'RBK', color: '#000000', text: '#fff', rating: 65, country: 'Norway'      },
];
const PLM_EUR_TEAMS_BY_ID = Object.fromEntries(PLM_EUR_TEAMS.map(t => [t.id, t]));

// Helper — find any team (English or European)
function plmGetTeam(id) {
    return PLM_ALL_TEAMS_BY_ID[id] || PLM_EUR_TEAMS_BY_ID[id] || null;
}

// 2024/25 UCL teams (actual participants)
const PLM_UCL_ENGLISH_S1  = ['mancity','arsenal','liverpool','astonvilla'];
const PLM_UCL_EUR_S1      = ['realmadrid','barcelona','atletico','girona','bayernmunich','leverkusen','dortmund','rbleipzig','vfbstuttgart','inter','acmilan','juventus','atalanta','bologna','psg','monaco','brest','lille','celtic','benfica','psv','clubbrugge','feyenoord','sporting','galatasaray','shakhtar','redstar','youngboys','sturmgraz','dinamozagreb','slovan','sparta'];

// UEL & UECL initial English participants (approx 2024/25)
const PLM_UEL_ENGLISH_S1  = ['tottenham','manunited','chelsea'];
const PLM_UEL_EUR_S1      = ['roma','lazio','porto','ajax','rangers','fenerbahce','lyon','olympiakos','anderlecht','villarreal','frankfurt','braga'];

const PLM_UECL_ENGLISH_S1 = ['newcastle','westham'];
const PLM_UECL_EUR_S1     = ['fiorentina','realsociedad','hoffenheim','youngboys','sturmgraz','ferencvaros'];

// European prize money (£M)
const PLM_EUR_PRIZES = { ucl: 80, uel: 40, uecl: 25 };
const PLM_EUR_LABELS = { ucl: '⭐ Champions League', uel: '🟠 Europa League', uecl: '🟡 Conference League' };

// Real UEFA coefficient spots per country (non-English leagues)
// Format: { ucl, uel, uecl } = how many clubs from each league qualify
const PLM_COUNTRY_SPOTS = {
    'Spain':        { ucl: 4, uel: 2, uecl: 1 },
    'Germany':      { ucl: 4, uel: 2, uecl: 1 },
    'Italy':        { ucl: 4, uel: 2, uecl: 1 },
    'France':       { ucl: 2, uel: 2, uecl: 2 },
    'Portugal':     { ucl: 2, uel: 2, uecl: 1 },
    'Netherlands':  { ucl: 1, uel: 2, uecl: 1 },
    'Belgium':      { ucl: 1, uel: 1, uecl: 1 },
    'Turkey':       { ucl: 1, uel: 1, uecl: 1 },
    'Scotland':     { ucl: 1, uel: 1, uecl: 0 },
    'Ukraine':      { ucl: 1, uel: 0, uecl: 1 },
    'Serbia':       { ucl: 1, uel: 0, uecl: 0 },
    'Switzerland':  { ucl: 0, uel: 1, uecl: 1 },
    'Austria':      { ucl: 0, uel: 1, uecl: 1 },
    'Croatia':      { ucl: 0, uel: 1, uecl: 1 },
    'Slovakia':     { ucl: 0, uel: 0, uecl: 1 },
    'Czech Rep':    { ucl: 0, uel: 1, uecl: 1 },
    'Greece':       { ucl: 0, uel: 1, uecl: 1 },
    'Hungary':      { ucl: 0, uel: 0, uecl: 1 },
};

// ---------- European domestic league configs ----------
const PLM_EUR_LEAGUES = {
    'la-liga':    { name: 'La Liga',         matchdays: 38, janTrigger: 20, country: 'Spain'       },
    'bundesliga': { name: 'Bundesliga',      matchdays: 34, janTrigger: 18, country: 'Germany'     },
    'serie-a':    { name: 'Serie A',         matchdays: 38, janTrigger: 20, country: 'Italy'       },
    'ligue-1':    { name: 'Ligue 1',         matchdays: 34, janTrigger: 18, country: 'France'      },
    'eur-other':  { name: 'European League', matchdays: 34, janTrigger: 18, country: null           },
};
const PLM_COUNTRY_TO_LEAGUE = {
    'Spain':       'la-liga',    'Germany':      'bundesliga', 'Italy':       'serie-a',
    'France':      'ligue-1',    'Portugal':     'eur-other',  'Netherlands': 'eur-other',
    'Belgium':     'eur-other',  'Turkey':       'eur-other',  'Scotland':    'eur-other',
    'Ukraine':     'eur-other',  'Serbia':       'eur-other',  'Switzerland': 'eur-other',
    'Austria':     'eur-other',  'Croatia':      'eur-other',  'Slovakia':    'eur-other',
    'Czech Rep':   'eur-other',  'Greece':       'eur-other',  'Hungary':     'eur-other',
    'Norway':      'eur-other',
};
const PLM_BIG5_COUNTRIES = new Set(['Spain','Germany','Italy','France']);
// Prize money (£M) for European domestic leagues
const PLM_EUR_PRIZE_MONEY = {
    'la-liga':    [50,40,35,28,22,18,15,12,10,9,8,7,6,5,4,4,3,3,2,2],
    'bundesliga': [45,36,30,25,20,16,13,10,8,7,7,6,5,5,4,3,3,2],
    'serie-a':    [48,38,32,26,21,17,14,11,9,8,7,6,5,4,4,3,3,2,2,2],
    'ligue-1':    [40,32,27,22,18,14,11,9,7,6,6,5,4,4,3,3,2,2],
    'eur-other':  [30,24,20,16,12,9,7,6,5,4,4,3,3,2,2,2,1,1],
};
// Realistic transfer budgets (£M) for every European club
const PLM_EUR_TEAM_BUDGETS = {
    // La Liga — Real/Atletico huge, Barcelona constrained, rest modest
    realmadrid: 200, barcelona: 80,  atletico: 90,   villarreal: 30,
    athletic:    20, sevilla:   15,  girona:   20,   realsociedad: 15,
    realbetis:   18, valencia:  10,  celta:     8,   osasuna:   6,
    getafe:       5, mallorca:   6,  alaves:    4,   leganes:   3,
    espanyol:     6, laspalmas:  3,  rayo:      5,   valladolid: 2,
    // Bundesliga — Bayern/Leverkusen/Dortmund top, rest much smaller
    bayernmunich: 150, leverkusen: 80,  dortmund: 70,   rbleipzig: 65,
    vfbstuttgart:  35, frankfurt:  30,  gladbach:  25,  wolfsburg: 25,
    hoffenheim:    20, freiburg:   15,  unionberlin: 12, werderbremen: 12,
    mainz:         10, augsburg:    8,  heidenheim:  6,  bochum:    4,
    stpauli:        4, holstein:    3,
    // Serie A — Inter/Milan/Napoli/Juve top, mid-table modest, bottom very small
    inter:   80, acmilan:  70,  juventus: 60,  napoli:    70,
    atalanta: 50, roma:    45,  lazio:    30,  fiorentina: 25,
    bologna:  20, torino:  15,  udinese:  10,  sassuolo:   8,
    genoa:     8, lecce:    5,  cagliari:  5,  empoli:     5,
    verona:    4, monza:   12,  parma:     5,  como:      15,
    // Ligue 1 — PSG and Monaco enormous, rest very modest
    psg:   200, monaco:  80,  marseille: 40,  lille:     25,
    lyon:   30, nice:    30,  rennes:    20,  lens:      18,
    brest:  12, strasbourg: 10, toulouse: 8,  reims:      6,
    nantes:  6, montpellier: 5, havre:    3,  auxerre:    4,
    angers:  3, saintetienne: 4,
    // Portugal
    benfica: 45, porto: 40, sporting: 35, braga: 12, guimaraes: 6,
    // Netherlands
    psv: 40, ajax: 30, feyenoord: 28, az: 12, twente: 8,
    // Belgium
    clubbrugge: 18, anderlecht: 12, genk: 8,
    // Turkey
    galatasaray: 30, fenerbahce: 25, besiktas: 10, trabzonspor: 8,
    // Scotland — small budgets
    celtic: 20, rangers: 15,
    // Others
    shakhtar: 15, redstar: 10, youngboys: 8, basel: 8,
    sturmgraz: 5, rapidwien: 5, dinamozagreb: 8, slovan: 4,
    sparta: 10, slavia: 8, olympiakos: 10, paok: 6,
    ferencvaros: 5, rosenborg: 3,
};
function plmEurBudget(teamId) {
    return PLM_EUR_TEAM_BUDGETS[teamId] ?? 5;
}
function plmIsEurTeam(id) { return !!PLM_EUR_TEAMS_BY_ID[id]; }

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
    // European leagues → treat as premier-league quality for the free agent pool
    const div = (PLM_EUR_LEAGUES && PLM_EUR_LEAGUES[divisionId]) ? 'premier-league' : (divisionId || 'premier-league');
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
    // Strong rating-based weighting: cube of (rating/70) so an 85 scores ~2x more than a 65
    const pool = xi.map(p => ({ p, w: (weights[p.pos] || 1) * Math.pow(Math.max(40, p.rating) / 70, 3) }));
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
    // Rating-driven expected goals: an 85 vs 60 should be a stomp, an 85 vs 80 a tight game
    const HOME_BONUS = 3;
    const homeRating = plmAvgRating(homeXI) + HOME_BONUS;
    const awayRating = plmAvgRating(awayXI);
    const diff = homeRating - awayRating;
    const BASE_GOALS = 1.45;
    const RATING_COEF = 0.07; // each rating-point gap shifts expected goals by 0.07 each side
    const lambdaHome = Math.max(0.08, (BASE_GOALS + diff * RATING_COEF) * (1 + hForm.atk) * (1 - aForm.defMod));
    const lambdaAway = Math.max(0.08, (BASE_GOALS - diff * RATING_COEF) * (1 + aForm.atk) * (1 - hForm.defMod));
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

// ---------- Real player squads (2024/25 season basis) ----------
// Squad rosters with real names. Clubs not listed fall back to plmFallbackSquad (generated names).
const PLM_SQUADS = {
    // ============ TOP TIER CLUBS ============
    realmadrid: [
        { name: 'Thibaut Courtois',   pos: 'GK',  rating: 89 },
        { name: 'Andriy Lunin',       pos: 'GK',  rating: 79 },
        { name: 'Dani Carvajal',      pos: 'DEF', rating: 86 },
        { name: 'Lucas Vazquez',      pos: 'DEF', rating: 78 },
        { name: 'Eder Militao',       pos: 'DEF', rating: 85 },
        { name: 'Antonio Rudiger',    pos: 'DEF', rating: 86 },
        { name: 'David Alaba',        pos: 'DEF', rating: 83 },
        { name: 'Ferland Mendy',      pos: 'DEF', rating: 82 },
        { name: 'Fran Garcia',        pos: 'DEF', rating: 77 },
        { name: 'Aurelien Tchouameni',pos: 'MID', rating: 85 },
        { name: 'Eduardo Camavinga',  pos: 'MID', rating: 84 },
        { name: 'Federico Valverde',  pos: 'MID', rating: 87 },
        { name: 'Jude Bellingham',    pos: 'MID', rating: 89 },
        { name: 'Luka Modric',        pos: 'MID', rating: 85 },
        { name: 'Arda Guler',         pos: 'MID', rating: 80 },
        { name: 'Brahim Diaz',        pos: 'MID', rating: 81 },
        { name: 'Vinicius Jr',        pos: 'FWD', rating: 91 },
        { name: 'Kylian Mbappe',      pos: 'FWD', rating: 92 },
        { name: 'Rodrygo',            pos: 'FWD', rating: 87 },
        { name: 'Endrick',            pos: 'FWD', rating: 80 },
    ],
    barcelona: [
        { name: 'Marc-Andre ter Stegen', pos: 'GK',  rating: 87 },
        { name: 'Inaki Pena',            pos: 'GK',  rating: 78 },
        { name: 'Jules Kounde',          pos: 'DEF', rating: 85 },
        { name: 'Ronald Araujo',         pos: 'DEF', rating: 85 },
        { name: 'Pau Cubarsi',           pos: 'DEF', rating: 83 },
        { name: 'Andreas Christensen',   pos: 'DEF', rating: 82 },
        { name: 'Alejandro Balde',       pos: 'DEF', rating: 83 },
        { name: 'Hector Fort',           pos: 'DEF', rating: 76 },
        { name: 'Frenkie de Jong',       pos: 'MID', rating: 85 },
        { name: 'Pedri',                 pos: 'MID', rating: 87 },
        { name: 'Gavi',                  pos: 'MID', rating: 84 },
        { name: 'Dani Olmo',             pos: 'MID', rating: 85 },
        { name: 'Marc Casado',           pos: 'MID', rating: 79 },
        { name: 'Fermin Lopez',          pos: 'MID', rating: 80 },
        { name: 'Robert Lewandowski',    pos: 'FWD', rating: 87 },
        { name: 'Lamine Yamal',          pos: 'FWD', rating: 87 },
        { name: 'Raphinha',              pos: 'FWD', rating: 85 },
        { name: 'Ferran Torres',         pos: 'FWD', rating: 80 },
        { name: 'Ansu Fati',             pos: 'FWD', rating: 78 },
    ],
    atletico: [
        { name: 'Jan Oblak',         pos: 'GK',  rating: 87 },
        { name: 'Juan Musso',        pos: 'GK',  rating: 78 },
        { name: 'Jose Maria Gimenez',pos: 'DEF', rating: 83 },
        { name: 'Robin Le Normand',  pos: 'DEF', rating: 83 },
        { name: 'Cesar Azpilicueta', pos: 'DEF', rating: 79 },
        { name: 'Reinildo Mandava',  pos: 'DEF', rating: 79 },
        { name: 'Nahuel Molina',     pos: 'DEF', rating: 81 },
        { name: 'Javi Galan',        pos: 'DEF', rating: 78 },
        { name: 'Clement Lenglet',   pos: 'DEF', rating: 80 },
        { name: 'Rodrigo De Paul',   pos: 'MID', rating: 83 },
        { name: 'Koke',              pos: 'MID', rating: 82 },
        { name: 'Conor Gallagher',   pos: 'MID', rating: 81 },
        { name: 'Pablo Barrios',     pos: 'MID', rating: 79 },
        { name: 'Marcos Llorente',   pos: 'MID', rating: 82 },
        { name: 'Samuel Lino',       pos: 'MID', rating: 80 },
        { name: 'Antoine Griezmann', pos: 'FWD', rating: 86 },
        { name: 'Alvaro Morata',     pos: 'FWD', rating: 82 },
        { name: 'Julian Alvarez',    pos: 'FWD', rating: 85 },
        { name: 'Angel Correa',      pos: 'FWD', rating: 80 },
    ],
    bayernmunich: [
        { name: 'Manuel Neuer',       pos: 'GK',  rating: 87 },
        { name: 'Sven Ulreich',       pos: 'GK',  rating: 76 },
        { name: 'Joshua Kimmich',     pos: 'DEF', rating: 87 },
        { name: 'Dayot Upamecano',    pos: 'DEF', rating: 84 },
        { name: 'Kim Min-jae',        pos: 'DEF', rating: 84 },
        { name: 'Eric Dier',          pos: 'DEF', rating: 80 },
        { name: 'Alphonso Davies',    pos: 'DEF', rating: 85 },
        { name: 'Sacha Boey',         pos: 'DEF', rating: 78 },
        { name: 'Hiroki Ito',         pos: 'DEF', rating: 79 },
        { name: 'Leon Goretzka',      pos: 'MID', rating: 83 },
        { name: 'Aleksandar Pavlovic',pos: 'MID', rating: 81 },
        { name: 'Joao Palhinha',      pos: 'MID', rating: 83 },
        { name: 'Konrad Laimer',      pos: 'MID', rating: 81 },
        { name: 'Jamal Musiala',      pos: 'MID', rating: 88 },
        { name: 'Thomas Muller',      pos: 'FWD', rating: 82 },
        { name: 'Harry Kane',         pos: 'FWD', rating: 89 },
        { name: 'Leroy Sane',         pos: 'FWD', rating: 85 },
        { name: 'Kingsley Coman',     pos: 'FWD', rating: 84 },
        { name: 'Serge Gnabry',       pos: 'FWD', rating: 82 },
        { name: 'Michael Olise',      pos: 'FWD', rating: 84 },
    ],
    psg: [
        { name: 'Gianluigi Donnarumma', pos: 'GK',  rating: 87 },
        { name: 'Matvey Safonov',       pos: 'GK',  rating: 79 },
        { name: 'Achraf Hakimi',        pos: 'DEF', rating: 86 },
        { name: 'Marquinhos',           pos: 'DEF', rating: 86 },
        { name: 'Lucas Beraldo',        pos: 'DEF', rating: 78 },
        { name: 'Willian Pacho',        pos: 'DEF', rating: 81 },
        { name: 'Nuno Mendes',          pos: 'DEF', rating: 83 },
        { name: 'Lucas Hernandez',      pos: 'DEF', rating: 83 },
        { name: 'Presnel Kimpembe',     pos: 'DEF', rating: 80 },
        { name: 'Vitinha',              pos: 'MID', rating: 85 },
        { name: 'Joao Neves',           pos: 'MID', rating: 83 },
        { name: 'Warren Zaire-Emery',   pos: 'MID', rating: 82 },
        { name: 'Fabian Ruiz',          pos: 'MID', rating: 84 },
        { name: 'Lee Kang-in',          pos: 'MID', rating: 80 },
        { name: 'Ousmane Dembele',      pos: 'FWD', rating: 85 },
        { name: 'Bradley Barcola',      pos: 'FWD', rating: 84 },
        { name: 'Marco Asensio',        pos: 'FWD', rating: 82 },
        { name: 'Goncalo Ramos',        pos: 'FWD', rating: 82 },
        { name: 'Randal Kolo Muani',    pos: 'FWD', rating: 81 },
        { name: 'Khvicha Kvaratskhelia',pos: 'FWD', rating: 86 },
    ],
    // ============ PREMIER LEAGUE TOP 6 ============
    mancity: [
        { name: 'Ederson',             pos: 'GK',  rating: 88 },
        { name: 'Stefan Ortega',       pos: 'GK',  rating: 80 },
        { name: 'Kyle Walker',         pos: 'DEF', rating: 84 },
        { name: 'Ruben Dias',          pos: 'DEF', rating: 88 },
        { name: 'John Stones',         pos: 'DEF', rating: 84 },
        { name: 'Manuel Akanji',       pos: 'DEF', rating: 83 },
        { name: 'Nathan Ake',          pos: 'DEF', rating: 82 },
        { name: 'Josko Gvardiol',      pos: 'DEF', rating: 84 },
        { name: 'Rico Lewis',          pos: 'DEF', rating: 79 },
        { name: 'Rodri',               pos: 'MID', rating: 91 },
        { name: 'Mateo Kovacic',       pos: 'MID', rating: 83 },
        { name: 'Bernardo Silva',      pos: 'MID', rating: 87 },
        { name: 'Kevin De Bruyne',     pos: 'MID', rating: 88 },
        { name: 'Phil Foden',          pos: 'MID', rating: 88 },
        { name: 'Ilkay Gundogan',      pos: 'MID', rating: 84 },
        { name: 'Erling Haaland',      pos: 'FWD', rating: 91 },
        { name: 'Jeremy Doku',         pos: 'FWD', rating: 83 },
        { name: 'Savinho',             pos: 'FWD', rating: 80 },
        { name: 'Jack Grealish',       pos: 'FWD', rating: 84 },
    ],
    liverpool: [
        { name: 'Alisson',             pos: 'GK',  rating: 89 },
        { name: 'Caoimhin Kelleher',   pos: 'GK',  rating: 80 },
        { name: 'Trent Alexander-Arnold', pos: 'DEF', rating: 86 },
        { name: 'Conor Bradley',       pos: 'DEF', rating: 78 },
        { name: 'Virgil van Dijk',     pos: 'DEF', rating: 89 },
        { name: 'Ibrahima Konate',     pos: 'DEF', rating: 84 },
        { name: 'Joe Gomez',           pos: 'DEF', rating: 80 },
        { name: 'Andy Robertson',      pos: 'DEF', rating: 85 },
        { name: 'Kostas Tsimikas',     pos: 'DEF', rating: 79 },
        { name: 'Alexis Mac Allister', pos: 'MID', rating: 85 },
        { name: 'Dominik Szoboszlai',  pos: 'MID', rating: 83 },
        { name: 'Ryan Gravenberch',    pos: 'MID', rating: 81 },
        { name: 'Curtis Jones',        pos: 'MID', rating: 79 },
        { name: 'Wataru Endo',         pos: 'MID', rating: 79 },
        { name: 'Mohamed Salah',       pos: 'FWD', rating: 90 },
        { name: 'Luis Diaz',           pos: 'FWD', rating: 84 },
        { name: 'Cody Gakpo',          pos: 'FWD', rating: 82 },
        { name: 'Diogo Jota',          pos: 'FWD', rating: 83 },
        { name: 'Darwin Nunez',        pos: 'FWD', rating: 82 },
        { name: 'Federico Chiesa',     pos: 'FWD', rating: 81 },
    ],
    arsenal: [
        { name: 'David Raya',          pos: 'GK',  rating: 85 },
        { name: 'Neto',                pos: 'GK',  rating: 78 },
        { name: 'Ben White',           pos: 'DEF', rating: 83 },
        { name: 'William Saliba',      pos: 'DEF', rating: 87 },
        { name: 'Gabriel Magalhaes',   pos: 'DEF', rating: 85 },
        { name: 'Riccardo Calafiori',  pos: 'DEF', rating: 81 },
        { name: 'Jurrien Timber',      pos: 'DEF', rating: 81 },
        { name: 'Oleksandr Zinchenko', pos: 'DEF', rating: 80 },
        { name: 'Takehiro Tomiyasu',   pos: 'DEF', rating: 79 },
        { name: 'Declan Rice',         pos: 'MID', rating: 87 },
        { name: 'Martin Odegaard',     pos: 'MID', rating: 87 },
        { name: 'Mikel Merino',        pos: 'MID', rating: 82 },
        { name: 'Thomas Partey',       pos: 'MID', rating: 82 },
        { name: 'Jorginho',            pos: 'MID', rating: 80 },
        { name: 'Bukayo Saka',         pos: 'FWD', rating: 88 },
        { name: 'Kai Havertz',         pos: 'FWD', rating: 84 },
        { name: 'Gabriel Martinelli',  pos: 'FWD', rating: 83 },
        { name: 'Gabriel Jesus',       pos: 'FWD', rating: 82 },
        { name: 'Leandro Trossard',    pos: 'FWD', rating: 82 },
        { name: 'Raheem Sterling',     pos: 'FWD', rating: 82 },
    ],
    chelsea: [
        { name: 'Robert Sanchez',      pos: 'GK',  rating: 79 },
        { name: 'Filip Jorgensen',     pos: 'GK',  rating: 76 },
        { name: 'Reece James',         pos: 'DEF', rating: 84 },
        { name: 'Malo Gusto',          pos: 'DEF', rating: 79 },
        { name: 'Levi Colwill',        pos: 'DEF', rating: 81 },
        { name: 'Wesley Fofana',       pos: 'DEF', rating: 82 },
        { name: 'Tosin Adarabioyo',    pos: 'DEF', rating: 79 },
        { name: 'Marc Cucurella',      pos: 'DEF', rating: 81 },
        { name: 'Benoit Badiashile',   pos: 'DEF', rating: 79 },
        { name: 'Moises Caicedo',      pos: 'MID', rating: 84 },
        { name: 'Enzo Fernandez',      pos: 'MID', rating: 84 },
        { name: 'Romeo Lavia',         pos: 'MID', rating: 80 },
        { name: 'Cole Palmer',         pos: 'MID', rating: 87 },
        { name: 'Christopher Nkunku',  pos: 'MID', rating: 82 },
        { name: 'Nicolas Jackson',     pos: 'FWD', rating: 81 },
        { name: 'Pedro Neto',          pos: 'FWD', rating: 82 },
        { name: 'Noni Madueke',        pos: 'FWD', rating: 80 },
        { name: 'Mykhailo Mudryk',     pos: 'FWD', rating: 80 },
        { name: 'Jadon Sancho',        pos: 'FWD', rating: 80 },
        { name: 'Joao Felix',          pos: 'FWD', rating: 80 },
    ],
    manunited: [
        { name: 'Andre Onana',         pos: 'GK',  rating: 82 },
        { name: 'Altay Bayindir',      pos: 'GK',  rating: 75 },
        { name: 'Diogo Dalot',         pos: 'DEF', rating: 81 },
        { name: 'Noussair Mazraoui',   pos: 'DEF', rating: 81 },
        { name: 'Lisandro Martinez',   pos: 'DEF', rating: 84 },
        { name: 'Matthijs de Ligt',    pos: 'DEF', rating: 83 },
        { name: 'Harry Maguire',       pos: 'DEF', rating: 80 },
        { name: 'Luke Shaw',           pos: 'DEF', rating: 81 },
        { name: 'Tyrell Malacia',      pos: 'DEF', rating: 76 },
        { name: 'Casemiro',            pos: 'MID', rating: 82 },
        { name: 'Manuel Ugarte',       pos: 'MID', rating: 81 },
        { name: 'Bruno Fernandes',     pos: 'MID', rating: 86 },
        { name: 'Mason Mount',         pos: 'MID', rating: 80 },
        { name: 'Christian Eriksen',   pos: 'MID', rating: 79 },
        { name: 'Kobbie Mainoo',       pos: 'MID', rating: 80 },
        { name: 'Marcus Rashford',     pos: 'FWD', rating: 82 },
        { name: 'Alejandro Garnacho',  pos: 'FWD', rating: 82 },
        { name: 'Rasmus Hojlund',      pos: 'FWD', rating: 80 },
        { name: 'Joshua Zirkzee',      pos: 'FWD', rating: 79 },
        { name: 'Amad Diallo',         pos: 'FWD', rating: 79 },
    ],
    tottenham: [
        { name: 'Guglielmo Vicario',   pos: 'GK',  rating: 83 },
        { name: 'Fraser Forster',      pos: 'GK',  rating: 75 },
        { name: 'Pedro Porro',         pos: 'DEF', rating: 82 },
        { name: 'Djed Spence',         pos: 'DEF', rating: 76 },
        { name: 'Cristian Romero',     pos: 'DEF', rating: 85 },
        { name: 'Micky van de Ven',    pos: 'DEF', rating: 82 },
        { name: 'Radu Dragusin',       pos: 'DEF', rating: 78 },
        { name: 'Destiny Udogie',      pos: 'DEF', rating: 80 },
        { name: 'Ben Davies',          pos: 'DEF', rating: 78 },
        { name: 'Yves Bissouma',       pos: 'MID', rating: 80 },
        { name: 'Rodrigo Bentancur',   pos: 'MID', rating: 81 },
        { name: 'James Maddison',      pos: 'MID', rating: 84 },
        { name: 'Pape Matar Sarr',     pos: 'MID', rating: 79 },
        { name: 'Dejan Kulusevski',    pos: 'MID', rating: 82 },
        { name: 'Brennan Johnson',     pos: 'FWD', rating: 79 },
        { name: 'Son Heung-min',       pos: 'FWD', rating: 86 },
        { name: 'Dominic Solanke',     pos: 'FWD', rating: 81 },
        { name: 'Richarlison',         pos: 'FWD', rating: 80 },
        { name: 'Timo Werner',         pos: 'FWD', rating: 78 },
    ],
    newcastle: [
        { name: 'Nick Pope',           pos: 'GK',  rating: 81 },
        { name: 'Martin Dubravka',     pos: 'GK',  rating: 76 },
        { name: 'Kieran Trippier',     pos: 'DEF', rating: 81 },
        { name: 'Tino Livramento',     pos: 'DEF', rating: 78 },
        { name: 'Sven Botman',         pos: 'DEF', rating: 81 },
        { name: 'Fabian Schar',        pos: 'DEF', rating: 80 },
        { name: 'Dan Burn',            pos: 'DEF', rating: 78 },
        { name: 'Lewis Hall',          pos: 'DEF', rating: 77 },
        { name: 'Bruno Guimaraes',     pos: 'MID', rating: 86 },
        { name: 'Sean Longstaff',      pos: 'MID', rating: 78 },
        { name: 'Joelinton',           pos: 'MID', rating: 81 },
        { name: 'Sandro Tonali',       pos: 'MID', rating: 82 },
        { name: 'Joe Willock',         pos: 'MID', rating: 78 },
        { name: 'Lewis Miley',         pos: 'MID', rating: 76 },
        { name: 'Alexander Isak',      pos: 'FWD', rating: 86 },
        { name: 'Anthony Gordon',      pos: 'FWD', rating: 83 },
        { name: 'Harvey Barnes',       pos: 'FWD', rating: 79 },
        { name: 'Jacob Murphy',        pos: 'FWD', rating: 77 },
        { name: 'Callum Wilson',       pos: 'FWD', rating: 79 },
    ],
    // ============ SERIE A TOP ============
    inter: [
        { name: 'Yann Sommer',         pos: 'GK',  rating: 84 },
        { name: 'Josep Martinez',      pos: 'GK',  rating: 76 },
        { name: 'Denzel Dumfries',     pos: 'DEF', rating: 81 },
        { name: 'Matteo Darmian',      pos: 'DEF', rating: 79 },
        { name: 'Alessandro Bastoni',  pos: 'DEF', rating: 85 },
        { name: 'Francesco Acerbi',    pos: 'DEF', rating: 82 },
        { name: 'Stefan de Vrij',      pos: 'DEF', rating: 80 },
        { name: 'Federico Dimarco',    pos: 'DEF', rating: 83 },
        { name: 'Yann Bisseck',        pos: 'DEF', rating: 78 },
        { name: 'Hakan Calhanoglu',    pos: 'MID', rating: 85 },
        { name: 'Nicolo Barella',      pos: 'MID', rating: 86 },
        { name: 'Henrikh Mkhitaryan',  pos: 'MID', rating: 81 },
        { name: 'Davide Frattesi',     pos: 'MID', rating: 80 },
        { name: 'Piotr Zielinski',     pos: 'MID', rating: 82 },
        { name: 'Kristjan Asllani',    pos: 'MID', rating: 76 },
        { name: 'Lautaro Martinez',    pos: 'FWD', rating: 88 },
        { name: 'Marcus Thuram',       pos: 'FWD', rating: 85 },
        { name: 'Marko Arnautovic',    pos: 'FWD', rating: 78 },
        { name: 'Mehdi Taremi',        pos: 'FWD', rating: 82 },
        { name: 'Joaquin Correa',      pos: 'FWD', rating: 76 },
    ],
    acmilan: [
        { name: 'Mike Maignan',        pos: 'GK',  rating: 87 },
        { name: 'Marco Sportiello',    pos: 'GK',  rating: 75 },
        { name: 'Theo Hernandez',      pos: 'DEF', rating: 85 },
        { name: 'Davide Calabria',     pos: 'DEF', rating: 78 },
        { name: 'Fikayo Tomori',       pos: 'DEF', rating: 81 },
        { name: 'Malick Thiaw',        pos: 'DEF', rating: 80 },
        { name: 'Strahinja Pavlovic',  pos: 'DEF', rating: 79 },
        { name: 'Emerson Royal',       pos: 'DEF', rating: 78 },
        { name: 'Matteo Gabbia',       pos: 'DEF', rating: 77 },
        { name: 'Tijjani Reijnders',   pos: 'MID', rating: 82 },
        { name: 'Youssouf Fofana',     pos: 'MID', rating: 81 },
        { name: 'Ismael Bennacer',     pos: 'MID', rating: 80 },
        { name: 'Yunus Musah',         pos: 'MID', rating: 78 },
        { name: 'Ruben Loftus-Cheek',  pos: 'MID', rating: 80 },
        { name: 'Christian Pulisic',   pos: 'FWD', rating: 83 },
        { name: 'Rafael Leao',         pos: 'FWD', rating: 86 },
        { name: 'Alvaro Morata',       pos: 'FWD', rating: 82 },
        { name: 'Tammy Abraham',       pos: 'FWD', rating: 78 },
        { name: 'Noah Okafor',         pos: 'FWD', rating: 77 },
        { name: 'Samuel Chukwueze',    pos: 'FWD', rating: 78 },
    ],
    juventus: [
        { name: 'Michele Di Gregorio', pos: 'GK',  rating: 81 },
        { name: 'Mattia Perin',        pos: 'GK',  rating: 76 },
        { name: 'Andrea Cambiaso',     pos: 'DEF', rating: 81 },
        { name: 'Federico Gatti',      pos: 'DEF', rating: 80 },
        { name: 'Bremer',              pos: 'DEF', rating: 84 },
        { name: 'Pierre Kalulu',       pos: 'DEF', rating: 79 },
        { name: 'Danilo',              pos: 'DEF', rating: 80 },
        { name: 'Juan Cabal',          pos: 'DEF', rating: 77 },
        { name: 'Manuel Locatelli',    pos: 'MID', rating: 82 },
        { name: 'Khephren Thuram',     pos: 'MID', rating: 80 },
        { name: 'Douglas Luiz',        pos: 'MID', rating: 82 },
        { name: 'Teun Koopmeiners',    pos: 'MID', rating: 83 },
        { name: 'Weston McKennie',     pos: 'MID', rating: 78 },
        { name: 'Nico Gonzalez',       pos: 'MID', rating: 81 },
        { name: 'Dusan Vlahovic',      pos: 'FWD', rating: 84 },
        { name: 'Kenan Yildiz',        pos: 'FWD', rating: 79 },
        { name: 'Francisco Conceicao', pos: 'FWD', rating: 80 },
        { name: 'Timothy Weah',        pos: 'FWD', rating: 77 },
        { name: 'Samuel Mbangula',     pos: 'FWD', rating: 76 },
    ],
};

// ---------- Game class ----------
class PLManager {
    constructor() {
        this.rootEl = document.getElementById('plm-root');
        if (!this.rootEl) return;
        this.squads = {};
        for (const team of PLM_ALL_TEAMS) this.squads[team.id] = plmGenerateSquad(team);
        for (const team of PLM_EUR_TEAMS) this.squads[team.id] = plmGenerateSquad(team);
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
            const known = new Set([...PLM_ALL_TEAMS, ...PLM_EUR_TEAMS].map(t => t.id));
            if (!known.has(this.state.playerTeam)) {
                localStorage.removeItem(PLM_SAVE_KEY);
                this.state = null;
            }
        }
    }
    save() {
        try { localStorage.setItem(PLM_SAVE_KEY, JSON.stringify(this.state)); } catch (e) {}
    }

    // ---- European league helpers ----
    _getEurLeagueId(eurTeam) {
        return PLM_BIG5_COUNTRIES.has(eurTeam.country)
            ? (PLM_COUNTRY_TO_LEAGUE[eurTeam.country] || 'eur-other')
            : 'eur-other';
    }
    _getEurLeagueTeamIds(eurTeam, leagueId) {
        if (PLM_BIG5_COUNTRIES.has(eurTeam.country)) {
            return PLM_EUR_TEAMS.filter(t => t.country === eurTeam.country).map(t => t.id);
        }
        // eur-other: top 18 non-big5 teams by rating
        return PLM_EUR_TEAMS
            .filter(t => !PLM_BIG5_COUNTRIES.has(t.country))
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 18)
            .map(t => t.id);
    }

    // ---- new game ----
    newGame(playerTeamId, carryoverBudgets = null, newDivisions = null, forceDivId = null) {
        const currentDivisions = newDivisions
            ? JSON.parse(JSON.stringify(newDivisions))
            : JSON.parse(JSON.stringify(PLM_INITIAL_DIVISIONS));

        // Determine the player's division
        let divisionId = forceDivId;
        if (!divisionId) {
            for (const [divId, ids] of Object.entries(currentDivisions)) {
                if (ids.includes(playerTeamId)) { divisionId = divId; break; }
            }
        }
        // Handle European clubs — ensure their domestic league is in currentDivisions
        const _eurTeamObj = PLM_EUR_TEAMS_BY_ID[playerTeamId];
        if (_eurTeamObj) {
            const _lid = this._getEurLeagueId(_eurTeamObj);
            if (!currentDivisions[_lid]) {
                currentDivisions[_lid] = this._getEurLeagueTeamIds(_eurTeamObj, _lid);
            }
            if (!divisionId) divisionId = _lid;
        }
        if (!divisionId) divisionId = 'premier-league';

        const divisionTeamIds = currentDivisions[divisionId] || PLM_INITIAL_DIVISIONS['premier-league'];
        const divisionTeamObjects = divisionTeamIds.map(id => plmGetTeam(id)).filter(Boolean);

        // Build budgets for all 92 English + all European teams
        const allBudgets = {};
        for (const team of PLM_ALL_TEAMS) {
            allBudgets[team.id] = carryoverBudgets
                ? (carryoverBudgets[team.id] ?? PLM_TEAM_BUDGETS[team.id] ?? 1)
                : (PLM_TEAM_BUDGETS[team.id] ?? 1);
        }
        for (const team of PLM_EUR_TEAMS) {
            allBudgets[team.id] = carryoverBudgets
                ? (carryoverBudgets[team.id] ?? plmEurBudget(team.id))
                : plmEurBudget(team.id);
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
            const team = plmGetTeam(id);
            if (team) this.squads[id] = plmGenerateSquad(team);
        }

        this.state.xi = plmAutoPickXI(this.squads[playerTeamId], PLM_DEFAULT_FORMATION).map(p => p.id);
        // Init cups
        this.state.facup      = this._initFACup();
        this.state.carabaocup = this._initCarabaoCup();
        this.state.cupContext  = null;
        // Init European competitions
        this.state.ucl  = this._initEuropean('ucl',  carryoverBudgets);
        this.state.uel  = this._initEuropean('uel',  carryoverBudgets);
        this.state.uecl = this._initEuropean('uecl', carryoverBudgets);
        this.state.eurContext = null;
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
    playerTeam()      { return plmGetTeam(this.state.playerTeam); }
    budget()          { return this.state.allBudgets ? (this.state.allBudgets[this.state.playerTeam] || 0) : 0; }
    divConfig()       { return PLM_DIVISIONS[this.state.divisionId] || PLM_EUR_LEAGUES[this.state.divisionId] || PLM_DIVISIONS['premier-league']; }

    // ---- AI transfer logic ----
    doAITransfers(windowType) {
        const log  = [];
        const fas  = this.state.freeAgents;
        const divTeamIds = this.state.divisionTeamIds || [];
        const aiTeams = divTeamIds
            .filter(id => id !== this.state.playerTeam)
            .map(id => plmGetTeam(id)).filter(Boolean);

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

    // ---- Negotiation flow ----
    startNegotiation(playerId, sellingTeamId) {
        const sellingSquad = this.squads[sellingTeamId];
        const idx = sellingSquad ? sellingSquad.findIndex(p => p.id === playerId) : -1;
        if (idx < 0) return;
        const player = sellingSquad[idx];
        const fee = plmPlayerValue(player.rating);
        const bonusDemand = Math.max(1, Math.round(fee * 0.4));
        const wageDemand  = Math.max(5, Math.round(player.rating * 1.5));
        this.state.pendingTransfer = {
            playerId, sellingTeamId,
            playerSnap: { name: player.name, pos: player.pos, rating: player.rating },
            fee, bonusDemand, wageDemand,
            offeredBonus: bonusDemand,
            offeredWage:  wageDemand,
            result: null,
            attempts: 0,
            message: null,
        };
        this.state.screen = 'negotiate';
        this.save();
        this.render();
    }

    submitOffer(offeredBonus, offeredWage) {
        const pt = this.state.pendingTransfer;
        if (!pt || pt.result === 'accepted') return;
        pt.offeredBonus = Math.max(0, Math.round(offeredBonus));
        pt.offeredWage  = Math.max(1, Math.round(offeredWage));
        pt.attempts++;

        const bonusRatio = pt.offeredBonus / Math.max(1, pt.bonusDemand);
        const wageRatio  = pt.offeredWage  / Math.max(1, pt.wageDemand);
        const totalRatio = (bonusRatio + wageRatio) / 2;

        let acceptProb;
        if      (totalRatio >= 1.0)  acceptProb = 0.97;
        else if (totalRatio >= 0.9)  acceptProb = 0.78;
        else if (totalRatio >= 0.8)  acceptProb = 0.50;
        else if (totalRatio >= 0.7)  acceptProb = 0.25;
        else if (totalRatio >= 0.55) acceptProb = 0.10;
        else                          acceptProb = 0.02;
        // Each repeated attempt nudges chance up slightly (negotiation fatigue)
        acceptProb = Math.min(0.98, acceptProb + 0.05 * Math.max(0, pt.attempts - 1));

        if (Math.random() < acceptProb) {
            pt.result  = 'accepted';
            pt.message = '✅ Deal agreed!';
            this.completeTransfer();
        } else {
            pt.result  = 'rejected';
            pt.message = totalRatio < 0.7
                ? '❌ Player insulted. "I\'m worth far more than that."'
                : '❌ Player rejected your offer. Try a better one.';
        }
        this.save();
        this.renderNegotiation();
    }

    completeTransfer() {
        const pt = this.state.pendingTransfer;
        if (!pt || pt.result !== 'accepted') return;
        const sellingSquad = this.squads[pt.sellingTeamId];
        const idx = sellingSquad ? sellingSquad.findIndex(p => p.id === pt.playerId) : -1;
        if (idx < 0) { pt.result = 'rejected'; pt.message = '❌ Player no longer available.'; return; }

        const player = sellingSquad[idx];
        const totalUpfront = pt.fee + pt.offeredBonus;
        const squad = this.squads[this.state.playerTeam];
        if (totalUpfront > this.budget() || squad.length >= 25) {
            pt.result  = 'rejected';
            pt.message = squad.length >= 25 ? '❌ Squad full (25 max).' : '❌ You cannot afford the upfront cost.';
            return;
        }

        sellingSquad.splice(idx, 1);
        squad.push({ ...player, wage: pt.offeredWage });
        this.state.allBudgets[this.state.playerTeam] -= totalUpfront;
        this.state.allBudgets[pt.sellingTeamId] = (this.state.allBudgets[pt.sellingTeamId] || 0) + Math.round(pt.fee * 0.9);

        const sellingTeam = plmGetTeam(pt.sellingTeamId);
        this.state.transferLog.push(
            `✍️ You sign ${player.name} from ${sellingTeam?.name || pt.sellingTeamId} — £${pt.fee}m fee + £${pt.offeredBonus}m bonus · £${pt.offeredWage}k/wk`
        );
    }

    cancelNegotiation() {
        this.state.pendingTransfer = null;
        this.state.screen = 'transferWindow';
        this.save();
        this.render();
    }

    returnFromTransfer() {
        this.state.pendingTransfer = null;
        this.state.screen = 'transferWindow';
        this.save();
        this.render();
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
        if (this.state.eurContext) return this.playEurMatch();
        if (this.state.cupContext) return this.playCupMatch();
        const md = this.state.matchDay;
        let playerResult = null;
        for (const fx of this.currentFixtures()) {
            const home = plmGetTeam(fx.home), away = plmGetTeam(fx.away);
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
            case 'negotiate':      return this.renderNegotiation();
            case 'pickxi':         return this.renderPickXI();
            case 'matchResult':    return this.renderMatchResult();
            case 'seasonEnd':      return this.renderSeasonEnd();
            default:               return this.renderDashboard();
        }
    }

    // ---- Team select ----
    renderTeamSelect() {
        const _makeCard = (t, budget, budgetIsEur) => {
            const b = budgetIsEur ? budget : (budget || 1);
            const budgetStr = b < 1 ? `£${(b * 1000).toFixed(0)}k` : `£${Math.round(b)}m`;
            const eurBadge = PLM_UCL_ENGLISH_S1.includes(t.id) || PLM_UCL_EUR_S1.includes(t.id) ? '⭐'
                           : PLM_UEL_ENGLISH_S1.includes(t.id) || PLM_UEL_EUR_S1.includes(t.id) ? '🟠'
                           : PLM_UECL_ENGLISH_S1.includes(t.id) || PLM_UECL_EUR_S1.includes(t.id) ? '🟡' : '';
            return `<button class="plm-team-card" data-team="${t.id}"
                style="background:${t.color};color:${t.text}">
                <span class="plm-team-name">${t.name} ${eurBadge}</span>
                <span class="plm-team-meta">OVR <b>${t.rating}</b> · <b>${budgetStr}</b></span>
            </button>`;
        };

        // English divisions
        const engSections = PLM_DIV_ORDER.map(divId => {
            const div   = PLM_DIVISIONS[divId];
            const teams = PLM_ALL_TEAMS.filter(t => t.division === divId);
            const cards = teams.map(t => _makeCard(t, PLM_TEAM_BUDGETS[t.id] || 1, false)).join('');
            return `<div class="plm-div-section">
                <h3 class="plm-div-header">🏴󠁧󠁢󠁥󠁮󠁧󠁿 ${div.name}</h3>
                <div class="plm-team-grid">${cards}</div>
            </div>`;
        }).join('');

        // European sections: big-5 leagues then eur-other
        const eurLeagueSections = [
            { leagueId: 'la-liga',    label: '🇪🇸 La Liga',    country: 'Spain'   },
            { leagueId: 'bundesliga', label: '🇩🇪 Bundesliga',  country: 'Germany' },
            { leagueId: 'serie-a',    label: '🇮🇹 Serie A',     country: 'Italy'   },
            { leagueId: 'ligue-1',    label: '🇫🇷 Ligue 1',     country: 'France'  },
        ].map(({ leagueId, label, country }) => {
            const teams = PLM_EUR_TEAMS.filter(t => t.country === country).sort((a, b) => b.rating - a.rating);
            const cards = teams.map(t => _makeCard(t, plmEurBudget(t.id), true)).join('');
            return `<div class="plm-div-section">
                <h3 class="plm-div-header">${label}</h3>
                <div class="plm-team-grid">${cards}</div>
            </div>`;
        }).join('');

        // European League (all non-big-5, top 18 by rating)
        const eurOtherTeams = PLM_EUR_TEAMS
            .filter(t => !PLM_BIG5_COUNTRIES.has(t.country))
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 18);
        // Plus the rest still selectable (just outside top-18)
        const eurOtherRest = PLM_EUR_TEAMS
            .filter(t => !PLM_BIG5_COUNTRIES.has(t.country))
            .sort((a, b) => b.rating - a.rating)
            .slice(18);
        const eurOtherCards = [...eurOtherTeams, ...eurOtherRest]
            .map(t => _makeCard(t, plmEurBudget(t.id), true)).join('');
        const eurOtherSection = `<div class="plm-div-section">
            <h3 class="plm-div-header">🌍 European League <span style="font-size:.8em;font-weight:normal;opacity:.7">(Portugal · Netherlands · Belgium · Turkey · Scotland & more)</span></h3>
            <div class="plm-team-grid">${eurOtherCards}</div>
        </div>`;

        this.rootEl.innerHTML = `
            <div class="plm-select">
                <h2 class="plm-select-h">⚽ The Boss</h2>
                <p class="plm-select-sub">Manage any club from England's 92 or Europe's top leagues. Compete in Europe, win cups, and build a dynasty across multiple seasons!</p>
                <p class="plm-select-sub" style="font-size:.8em;color:#888">⭐ = UCL · 🟠 = UEL · 🟡 = UECL (based on 2024/25)</p>
                ${engSections}
                ${eurLeagueSections}
                ${eurOtherSection}
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

        // Market = all major-league clubs (top flight) OR same division (lower English leagues)
        const isTopFlight = this.state.divisionId === 'premier-league' || !!PLM_EUR_LEAGUES[this.state.divisionId];
        let marketTeamIds;
        if (isTopFlight) {
            // Cross-league market: PL + Championship + all European clubs
            marketTeamIds = [
                ...PLM_INITIAL_DIVISIONS['premier-league'],
                ...PLM_INITIAL_DIVISIONS['championship'],
                ...PLM_EUR_TEAMS.map(t => t.id),
            ];
        } else {
            marketTeamIds = this.state.divisionTeamIds || [];
        }

        const allMarket = [];
        for (const id of marketTeamIds) {
            if (id === this.state.playerTeam) continue;
            const t = plmGetTeam(id);
            if (!t) continue;
            for (const p of (this.squads[id] || [])) {
                allMarket.push({ ...p, sellingTeamId: id, sellingTeam: t, value: plmPlayerValue(p.rating) });
            }
        }
        allMarket.sort((a, b) => b.rating - a.rating);
        let filtered = allMarket.filter(p =>
            (tFilter === 'all' || p.sellingTeamId === tFilter) &&
            (pFilter === 'all' || p.pos === pFilter)
        );
        // Cap display to avoid massive UI when no team filter
        const totalFiltered = filtered.length;
        if (tFilter === 'all' && filtered.length > 250) {
            filtered = filtered.slice(0, 250);
        }

        const divTeams = marketTeamIds
            .filter(id => id !== this.state.playerTeam)
            .map(id => plmGetTeam(id)).filter(Boolean)
            .sort((a, b) => b.rating - a.rating);

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
                        <div class="plm-hdr-small">${windowLabel} · Season ${this.state.season} · ${(PLM_DIVISIONS[this.state.divisionId] || PLM_EUR_LEAGUES[this.state.divisionId] || {}).name || this.state.divisionId}</div>
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
                this.startNegotiation(btn.getAttribute('data-pid'), btn.getAttribute('data-tid')))
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

    // ---- Salary negotiation ----
    renderNegotiation() {
        const pt = this.state.pendingTransfer;
        if (!pt) { this.state.screen = 'transferWindow'; return this.render(); }

        const sellingTeam = plmGetTeam(pt.sellingTeamId);
        const team        = this.playerTeam();
        const budget      = this.budget();
        const budgetDisp  = budget < 1 ? `£${(budget * 1000).toFixed(0)}k` : `£${Math.round(budget)}m`;
        const totalUpfront = pt.fee + pt.offeredBonus;
        const canAfford    = totalUpfront <= budget;
        const acceptedView = pt.result === 'accepted';

        this.rootEl.innerHTML = `
            <div class="plm-transfer">
                <header class="plm-header" style="background:${team.color};color:${team.text}">
                    <div>
                        <div class="plm-hdr-small">💬 Salary Negotiation · Budget ${budgetDisp}</div>
                        <div class="plm-hdr-name">${pt.playerSnap.name}</div>
                    </div>
                    <div class="plm-hdr-right">
                        <div class="plm-hdr-small">${pt.playerSnap.pos} · OVR ${pt.playerSnap.rating}</div>
                        <div class="plm-hdr-name">from ${sellingTeam?.name || pt.sellingTeamId}</div>
                    </div>
                </header>
                <div class="plm-transfer-body">
                    <section class="plm-transfer-section">
                        <h3>📋 The Deal</h3>
                        <table class="plm-squad" style="margin-bottom:12px">
                            <tr><td><b>Transfer fee</b> (to ${sellingTeam?.short || 'club'})</td><td style="text-align:right"><b>£${pt.fee}m</b> <span style="opacity:.6;font-size:.85em">(fixed)</span></td></tr>
                            <tr><td>Player demands signing bonus</td><td style="text-align:right">£${pt.bonusDemand}m</td></tr>
                            <tr><td>Player demands weekly wage</td><td style="text-align:right">£${pt.wageDemand}k/wk</td></tr>
                        </table>
                        <h3 style="margin-top:18px">💰 Your Offer</h3>
                        <div style="display:flex;flex-direction:column;gap:10px;max-width:420px">
                            <label style="display:flex;justify-content:space-between;align-items:center;gap:10px">
                                <span>Signing bonus (£m)</span>
                                <input type="number" id="plm-offer-bonus" value="${pt.offeredBonus}" min="0" max="${pt.bonusDemand * 2}" step="1"
                                    style="width:100px;padding:6px;border:1px solid #ccc;border-radius:4px" />
                            </label>
                            <label style="display:flex;justify-content:space-between;align-items:center;gap:10px">
                                <span>Weekly wage (£k/wk)</span>
                                <input type="number" id="plm-offer-wage" value="${pt.offeredWage}" min="1" max="${pt.wageDemand * 2}" step="5"
                                    style="width:100px;padding:6px;border:1px solid #ccc;border-radius:4px" />
                            </label>
                        </div>
                        <p style="margin-top:14px;font-weight:bold;font-size:1.05em">
                            Total upfront cost: £${totalUpfront}m
                            ${canAfford ? '' : ' <span style="color:#c00">⚠️ Over budget!</span>'}
                        </p>
                        ${pt.message ? `
                            <div style="margin-top:14px;padding:12px;border-radius:6px;font-weight:bold;
                                background:${acceptedView ? '#e6f9e6' : '#fee'};color:${acceptedView ? '#080' : '#c00'}">
                                ${pt.message}
                            </div>
                        ` : ''}
                    </section>
                </div>
                <div class="plm-transfer-footer" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">
                    ${acceptedView ? `
                        <button class="plm-play-btn" id="plm-back-market">← Back to Transfer Market</button>
                    ` : `
                        <button class="plm-reset-btn" id="plm-walk-away">🚶 Walk Away</button>
                        <button class="plm-play-btn" id="plm-make-offer" ${canAfford ? '' : 'disabled'} style="background:#0066cc">💬 Make Offer</button>
                        <button class="plm-play-btn" id="plm-accept-demand" ${(pt.fee + pt.bonusDemand) <= budget ? '' : 'disabled'} style="background:#0a8a00">💰 Accept Demands</button>
                    `}
                </div>
            </div>`;

        if (acceptedView) {
            this.rootEl.querySelector('#plm-back-market').addEventListener('click', () => this.returnFromTransfer());
        } else {
            this.rootEl.querySelector('#plm-walk-away').addEventListener('click', () => this.cancelNegotiation());
            const offerBtn  = this.rootEl.querySelector('#plm-make-offer');
            const acceptBtn = this.rootEl.querySelector('#plm-accept-demand');
            if (offerBtn && !offerBtn.disabled) offerBtn.addEventListener('click', () => {
                const b = parseFloat(this.rootEl.querySelector('#plm-offer-bonus').value) || 0;
                const w = parseFloat(this.rootEl.querySelector('#plm-offer-wage').value) || 0;
                this.submitOffer(b, w);
            });
            if (acceptBtn && !acceptBtn.disabled) acceptBtn.addEventListener('click', () => {
                this.submitOffer(pt.bonusDemand, pt.wageDemand);
            });
        }
    }

    // ---- Rating helpers ----
    squadAvg(teamId) {
        const s = this.squads[teamId] || [];
        if (!s.length) return 0;
        return s.reduce((a, p) => a + p.rating, 0) / s.length;
    }
    xiAvg(teamId) {
        const xi = this.getXIFor(teamId);
        if (!xi.length) return 0;
        return xi.reduce((a, p) => a + p.rating, 0) / xi.length;
    }

    // ---- Dashboard ----
    renderDashboard() {
        const team     = this.playerTeam();
        const fx       = this.playerFixture();
        const isHome   = fx && fx.home === team.id;
        const opponent = fx ? plmGetTeam(isHome ? fx.away : fx.home) : null;
        const venue    = isHome ? 'vs' : '@';
        const budget   = this.budget();
        const budgetDisplay = budget < 1 ? `£${(budget * 1000).toFixed(0)}k` : `£${Math.round(budget)}m`;
        const totalMD  = this.divConfig().matchdays;
        const divName  = this.divConfig().name;

        const yourSquadAvg = this.squadAvg(team.id).toFixed(1);
        const yourXIAvg    = this.xiAvg(team.id).toFixed(1);
        const oppSquadAvg  = opponent ? this.squadAvg(opponent.id).toFixed(1) : '0.0';
        const oppXIAvg     = opponent ? this.xiAvg(opponent.id).toFixed(1)    : '0.0';

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
                    <div class="plm-next-sub">${isHome ? 'Home' : 'Away'} · ${opponent.name}</div>
                    <div class="plm-next-ratings" style="display:flex;justify-content:center;gap:18px;margin-top:8px;font-size:.92em;flex-wrap:wrap">
                        <span><b>${team.short}</b> · Squad ${yourSquadAvg} · <b>XI ${yourXIAvg}</b></span>
                        <span style="opacity:.7">vs</span>
                        <span><b>${opponent.short}</b> · Squad ${oppSquadAvg} · <b>XI ${oppXIAvg}</b></span>
                    </div>
                </section>` : ''}

                ${this._cupStatusHtml()}
                ${this._eurStatusHtml()}

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

        const cup = this.state.cupContext ? this.state[this.state.cupContext.cupName]
                  : this.state.eurContext  ? this.state[this.state.eurContext.comp] : null;
        let fx, opp, vsText, matchLabel;
        if (this.state.eurContext) {
            const cf = this.state.eurContext.fixture;
            const isHome = cf.home === this.state.playerTeam;
            opp = plmGetTeam(isHome ? cf.away : cf.home);
            vsText = opp ? `${isHome ? 'vs' : '@'} ${opp.name} (${opp.country || ''})` : '';
            matchLabel = `${cup?.name || 'UEFA'} · ${this.state.eurContext.roundName}`;
        } else if (this.state.cupContext) {
            const cf = this.state.cupContext.fixture;
            const isHome = cf.home === this.state.playerTeam;
            opp = plmGetTeam(isHome ? cf.away : cf.home);
            vsText = opp ? `${isHome ? 'vs' : '@'} ${opp.name}` : '';
            matchLabel = `${cup?.name || 'Cup'} · ${this.state.cupContext.roundName}`;
        } else {
            fx  = this.playerFixture();
            opp = fx ? PLM_ALL_TEAMS_BY_ID[fx.home === team.id ? fx.away : fx.home] : null;
            vsText = opp ? `${fx.home === team.id ? 'vs' : '@'} ${opp.name}` : '';
            matchLabel = `Match Day ${this.state.matchDay}`;
        }

        this.rootEl.innerHTML = `
            <div class="plm-pickxi">
                <header class="plm-pickxi-hdr" style="background:${team.color};color:${team.text}">
                    <div>
                        <div class="plm-hdr-small">${matchLabel} · ${vsText}</div>
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
                        <h3>Your XI — ${this.state.formation}
                            <span style="font-size:.7em;opacity:.7;font-weight:normal">
                                · Avg ${xi.length ? (xi.reduce((s,p)=>s+p.rating,0)/xi.length).toFixed(1) : '-'}
                                · Squad ${(squad.reduce((s,p)=>s+p.rating,0)/squad.length).toFixed(1)}
                            </span>
                        </h3>
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
        if (kickoff && !kickoff.disabled) kickoff.addEventListener('click', () => {
            if (this.state.eurContext) this.playEurMatch();
            else this.playMatchDay();
        });
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

        const isCupMatch = !!res.isCupMatch;
        const matchTitle = isCupMatch
            ? `${res.cupDisplayName || 'Cup'} · ${res.roundName}`
            : `League — Match Day ${this.state.matchDay - 1}`;

        const janTrigger = this.divConfig().janTrigger;
        const janHint = (!isCupMatch && this.state.matchDay === janTrigger && !this.state.janWindowDone)
            ? '<p class="plm-jan-hint">❄️ The January Transfer Window opens now — you can buy and sell players.</p>' : '';

        const penLine = res.pens
            ? `<p class="plm-match-verdict" style="font-size:0.9em">(${res.home.id === this.state.playerTeam || res.away.id === this.state.playerTeam ? (won ? 'Won' : 'Lost') : ''} on penalties)</p>` : '';

        this.rootEl.innerHTML = `
            <div class="plm-match">
                <p style="font-size:0.8em;color:#888;margin:0 0 4px;text-align:center">${matchTitle}</p>
                <h2 class="plm-match-title">
                    ${res.home.short} <span class="plm-score">${res.homeScore} - ${res.awayScore}</span> ${res.away.short}
                </h2>
                <p class="plm-match-verdict">${verdict}</p>
                ${penLine}
                ${janHint}
                <ol class="plm-timeline">${events}</ol>
                <button class="plm-play-btn" id="plm-continue">Continue ▶</button>
            </div>`;

        this.rootEl.querySelector('#plm-continue').addEventListener('click', () => {
            // January window (league matches only)
            if (!isCupMatch && this.state.matchDay === janTrigger && !this.state.janWindowDone) {
                const extra = plmGenerateFreeAgentPool(this.state.divisionId).slice(0, 20);
                this.state.freeAgents = [...(this.state.freeAgents || []), ...extra];
                this.doAITransfers('january');
                this.state.transferWindowType = 'january';
                this.state.screen = 'transferWindow';
                this.save(); this.render(); return;
            }
            // Cup triggers (Carabao first)
            for (const cupName of ['carabaocup', 'facup']) {
                if (this._shouldTriggerCup(cupName)) {
                    const hasPlayerMatch = this.setupCupRound(cupName);
                    if (hasPlayerMatch) {
                        this.state.screen = 'pickxi';
                        this.save(); this.render(); return;
                    }
                }
            }
            // European triggers
            for (const comp of ['ucl','uel','uecl']) {
                if (this._shouldTriggerEur(comp)) {
                    const hasPlayerMatch = this.setupEurRound(comp);
                    if (hasPlayerMatch) {
                        this.state.screen = 'pickxi';
                        this.save(); this.render(); return;
                    }
                }
            }
            this.state.screen = 'dashboard';
            this.save(); this.render();
        });
    }

    // ---- Season end ----
    renderSeasonEnd() {
        const team     = this.playerTeam();
        const divName  = this.divConfig().name;
        const sorted   = plmSortedTable(this.state.table);
        const yourPos  = sorted.findIndex(r => r.id === team.id) + 1;
        const divPrize = PLM_DIVISION_PRIZE_MONEY[this.state.divisionId]
            || PLM_EUR_PRIZE_MONEY[this.state.divisionId]
            || PLM_DIVISION_PRIZE_MONEY['league-two'];
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

        const isEurTeamManaged = plmIsEurTeam(this.state.playerTeam);
        let verdict;
        if (isEurTeamManaged) {
            // European club — verdict based on domestic finish and UEFA spots
            const _eurT  = PLM_EUR_TEAMS_BY_ID[this.state.playerTeam];
            const _spots = PLM_COUNTRY_SPOTS[_eurT?.country] || { ucl: 0, uel: 0, uecl: 0 };
            const _wonUCL = this.state.ucl?.winner === this.state.playerTeam;
            const _wonUEL = this.state.uel?.winner === this.state.playerTeam;
            if      (_wonUCL)                            verdict = `🏆 CHAMPIONS LEAGUE WINNERS! Back to defend next season!`;
            else if (_wonUEL)                            verdict = `⭐ Europa League WINNERS — UCL next season!`;
            else if (yourPos === 1)                      verdict = `🏆 ${divName} CHAMPIONS! ⭐ Champions League!`;
            else if (yourPos <= _spots.ucl)              verdict = `⭐ Champions League qualification — ${ordinal(yourPos)} place!`;
            else if (yourPos <= _spots.ucl + _spots.uel) verdict = `🟠 Europa League qualification — ${ordinal(yourPos)} place.`;
            else if (yourPos <= _spots.ucl + _spots.uel + _spots.uecl) verdict = `🟡 Conference League qualification — ${ordinal(yourPos)} place.`;
            else                                         verdict = `Finished ${ordinal(yourPos)} in ${divName}.`;
        } else if (promoted && yourPos === 1) {
            verdict = `🏆 CHAMPIONS of ${divName} — and promoted!`;
        } else if (promoted) {
            verdict = `🎉 Promoted to ${(PLM_DIVISIONS[newDivId] || {}).name || newDivId}! Finished ${ordinal(yourPos)}.`;
        } else if (relegated) {
            verdict = `💀 Relegated to ${(PLM_DIVISIONS[newDivId] || {}).name || newDivId}. Finished ${ordinal(yourPos)}.`;
        } else if (yourPos === 1) {
            verdict = `🏆 CHAMPIONS of ${divName}!`;
        } else if (this.state.divisionId === 'premier-league' && yourPos <= 5) {
            verdict = `⭐ Champions League qualification — ${ordinal(yourPos)} place!`;
        } else if (this.state.divisionId === 'premier-league' && yourPos === 6) {
            verdict = `🟠 Europa League qualification — 6th place.`;
        } else if (this.state.divisionId === 'premier-league' && yourPos === 7) {
            verdict = `🟡 Conference League qualification — 7th place.`;
        } else {
            const pt = this.state.playerTeam;
            const wonUEL    = this.state.uel?.winner === pt;
            const wonFACup  = this.state.facup?.winner === pt;
            const wonCarabo = this.state.carabaocup?.winner === pt;
            if (wonUEL)         verdict = `⭐ Europa League WINNERS — into the Champions League next season!`;
            else if (wonFACup)  verdict = `🟠 FA Cup Winners — Europa League qualification!`;
            else if (wonCarabo) verdict = `🟡 Carabao Cup Winners — Conference League qualification!`;
            else                verdict = `Finished ${ordinal(yourPos)} in ${divName}.`;
        }

        // Promotion/relegation summary for player's division
        let moveLines = '';
        if (newDivisions) {
            const divId = this.state.divisionId;
            const curIds = this.state.divisionTeamIds;
            const nextIds = newDivisions[divId] || [];
            const relIds  = curIds.filter(id => !nextIds.includes(id));
            const promIds = nextIds.filter(id => !curIds.includes(id));
            if (relIds.length || promIds.length) {
                const relNames = relIds.map(id => plmGetTeam(id)?.name || id).join(', ');
                const promNames = promIds.map(id => plmGetTeam(id)?.name || id).join(', ');
                moveLines = `
                    <div class="plm-promo-box">
                        ${promIds.length ? `<p>⬆️ <b>Promoted in:</b> ${promNames}</p>` : ''}
                        ${relIds.length  ? `<p>⬇️ <b>Relegated out:</b> ${relNames}</p>` : ''}
                    </div>`;
            }
        }

        const prizeRows = sorted.map((r, i) => {
            const t     = plmGetTeam(r.id);
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
                        ${newDivId !== this.state.divisionId ? ` (${(PLM_DIVISIONS[newDivId] || PLM_EUR_LEAGUES[newDivId] || {}).name || newDivId})` : ''}</div>
                </div>

                ${moveLines}

                ${this._cupSeasonEndHtml()}
                ${this._eurSeasonEndHtml()}

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
            const teamId           = this.state.playerTeam;
            const season           = this.state.season + 1;
            const savedBudgets     = { ...this.state.allBudgets };
            const newDivs          = this.state.newDivisions || null;
            // Save player squad across seasons
            const savedSquad       = (this.squads[teamId] || []).map(p => ({ ...p }));
            const savedFormation   = this.state.formation;
            // Determine next season European qual (real UEFA rules)
            const pt = teamId;
            const eurBonuses = {
                wonUCL:    this.state.ucl?.winner  === pt,
                wonUEL:    this.state.uel?.winner  === pt,
                wonFACup:  this.state.facup?.winner === pt,
                wonCarabao:this.state.carabaocup?.winner === pt,
            };
            const nextEurQual = this._nextEurQual(yourPos, this.state.divisionId, eurBonuses);
            this.newGame(teamId, savedBudgets, newDivs, newDivId);
            // Restore squad with reset seasonal stats
            this.squads[teamId]    = savedSquad.map(p => ({
                ...p, goals: 0, assists: 0, yellows: 0, reds: 0, suspended: 0, injured: 0,
            }));
            this.state.formation   = savedFormation || PLM_DEFAULT_FORMATION;
            this.state.xi          = plmAutoPickXI(this.squads[teamId], this.state.formation).map(p => p.id);
            this.state.season      = season;
            // Override European competitions for next season
            if (newDivId === 'premier-league') {
                // English PL team — use PL finish position
                const plTeams = newDivs ? [...(newDivs['premier-league'] || [])] : [...PLM_INITIAL_DIVISIONS['premier-league']];
                this.state.ucl.survivors  = nextEurQual === 'ucl'  ? [...plTeams.slice(0,4), ...PLM_UCL_EUR_S1]  : [...PLM_UCL_EUR_S1];
                this.state.ucl.playerIn   = nextEurQual === 'ucl';
                this.state.uel.survivors  = nextEurQual === 'uel'  ? [teamId, ...PLM_UEL_EUR_S1]  : [...PLM_UEL_EUR_S1];
                this.state.uel.playerIn   = nextEurQual === 'uel';
                this.state.uecl.survivors = nextEurQual === 'uecl' ? [teamId, ...PLM_UECL_EUR_S1] : [...PLM_UECL_EUR_S1];
                this.state.uecl.playerIn  = nextEurQual === 'uecl';
            } else if (plmIsEurTeam(teamId)) {
                // European club — qual based on domestic finish + PLM_COUNTRY_SPOTS
                const _eT = PLM_EUR_TEAMS_BY_ID[teamId];
                const _sp = PLM_COUNTRY_SPOTS[_eT?.country] || { ucl: 0, uel: 0, uecl: 0 };
                let _eurQ = null;
                if      (yourPos <= _sp.ucl)                          _eurQ = 'ucl';
                else if (yourPos <= _sp.ucl + _sp.uel)                _eurQ = 'uel';
                else if (yourPos <= _sp.ucl + _sp.uel + _sp.uecl)    _eurQ = 'uecl';
                // Also check if they won UCL/UEL
                if (eurBonuses.wonUCL || eurBonuses.wonUEL) _eurQ = 'ucl';
                this.state.ucl.playerIn   = _eurQ === 'ucl';
                this.state.uel.playerIn   = _eurQ === 'uel';
                this.state.uecl.playerIn  = _eurQ === 'uecl';
                // Ensure player is in / out of survivors
                for (const comp of ['ucl','uel','uecl']) {
                    const cup = this.state[comp];
                    if (!cup) continue;
                    if (cup.playerIn && !cup.survivors.includes(teamId)) cup.survivors.push(teamId);
                    if (!cup.playerIn) cup.survivors = cup.survivors.filter(id => id !== teamId);
                }
            }
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
            const team = plmGetTeam(r.id);
            const pos  = i + 1;
            let cls = '';
            if (divId === 'premier-league') {
                if (pos <= 5) cls = 'pos-cl';
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
            } else if (divId === 'league-two') {
                if (pos <= 3) cls = 'pos-cl';
                else if (pos <= 7) cls = 'pos-eur';
                else if (pos >= divSize - 1) cls = 'pos-rel';
            } else if (PLM_EUR_LEAGUES[divId]) {
                // European domestic league — show UEFA spots
                const country = PLM_EUR_LEAGUES[divId].country;
                const spots = (country && PLM_COUNTRY_SPOTS[country]) || { ucl: 0, uel: 0, uecl: 0 };
                if (pos <= spots.ucl) cls = 'pos-cl';
                else if (pos <= spots.ucl + spots.uel) cls = 'pos-eur';
                else if (pos <= spots.ucl + spots.uel + spots.uecl) cls = 'pos-eur';
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

    // ================================================================
    // CUP COMPETITION METHODS
    // ================================================================

    _cupTriggers(totalMD) {
        const facupFracs    = [0.28, 0.40, 0.55, 0.65, 0.75, 0.87, 0.97];
        const carabaFracs   = [0.08, 0.18, 0.30, 0.45, 0.62, 0.80, 0.95];
        return {
            facup:      facupFracs.map(f  => Math.max(1, Math.round(totalMD * f))),
            carabaocup: carabaFracs.map(f => Math.max(1, Math.round(totalMD * f))),
        };
    }

    _initFACup() {
        const divs    = this.state.currentDivisions;
        const totalMD = this.divConfig().matchdays;
        const triggers = this._cupTriggers(totalMD).facup;
        const divId    = this.state.divisionId;
        // L2 teams only in R1; L1 join R2; Championship+PL join R3.
        const entryRound = { 'league-two': 0, 'league-one': 1, 'championship': 2, 'premier-league': 2 };
        const l2 = divs['league-two'] || [];
        return {
            name: 'FA Cup',
            survivors: [...l2],
            roundIdx: 0,
            roundNames: ['Round 1','Round 2','Round 3','Round 4','Quarter-Final','Semi-Final','Final'],
            triggers,
            playerIn: divId === 'league-two',
            playerEntryRound: entryRound[divId] ?? 2,
            roundInProgress: false,
            winner: null, done: false, log: [],
            pendingAISurvivors: null, pendingByeTeam: null, pendingRoundName: '',
        };
    }

    _initCarabaoCup() {
        const divs    = this.state.currentDivisions;
        const totalMD = this.divConfig().matchdays;
        const triggers = this._cupTriggers(totalMD).carabaocup;
        const divId    = this.state.divisionId;
        const ch = divs['championship'] || [];
        const l1 = divs['league-one']   || [];
        const l2 = divs['league-two']   || [];
        // Championship + L1 + L2 enter R1; PL joins R2
        return {
            name: 'Carabao Cup',
            survivors: [...ch, ...l1, ...l2],
            roundIdx: 0,
            roundNames: ['Round 1','Round 2','Round 3','Round 4','Quarter-Final','Semi-Final','Final'],
            triggers,
            playerIn: PLM_DIV_ORDER.includes(divId) && divId !== 'premier-league',
            playerEntryRound: divId === 'premier-league' ? 1 : 0,
            roundInProgress: false,
            winner: null, done: false, log: [],
            pendingAISurvivors: null, pendingByeTeam: null, pendingRoundName: '',
        };
    }

    _shouldTriggerCup(cupName) {
        const cup = this.state[cupName];
        if (!cup || cup.done || cup.roundInProgress) return false;
        if (cup.roundIdx >= cup.triggers.length) return false;
        return (this.state.matchDay - 1) >= cup.triggers[cup.roundIdx];
    }

    _simulateSingleCupMatch(homeId, awayId) {
        const home = plmGetTeam(homeId);
        const away = plmGetTeam(awayId);
        if (!home || !away) return { winner: homeId, hs: 0, as: 0, pens: false };
        if (!this.squads[homeId]) this.squads[homeId] = plmFallbackSquad(home);
        if (!this.squads[awayId]) this.squads[awayId] = plmFallbackSquad(away);
        const homeXI = plmAutoPickXI(this.squads[homeId], PLM_DEFAULT_FORMATION);
        const awayXI = plmAutoPickXI(this.squads[awayId], PLM_DEFAULT_FORMATION);
        const sim = plmSimulateMatch(home, homeXI, away, awayXI, PLM_DEFAULT_FORMATION, PLM_DEFAULT_FORMATION);
        let winner, pens = false;
        if (sim.homeScore > sim.awayScore) winner = homeId;
        else if (sim.awayScore > sim.homeScore) winner = awayId;
        else { winner = Math.random() < 0.5 ? homeId : awayId; pens = true; }
        return { winner, hs: sim.homeScore, as: sim.awayScore, pens };
    }

    setupCupRound(cupName) {
        const cup = this.state[cupName];
        if (!cup) return false;
        const roundIdx  = cup.roundIdx;
        const roundName = cup.roundNames[roundIdx] || `Round ${roundIdx + 1}`;
        cup.roundInProgress = true;

        // Add new entrants at the correct round
        const divs = this.state.currentDivisions;
        if (cupName === 'facup') {
            if (roundIdx === 1) {
                for (const id of (divs['league-one'] || []))
                    if (!cup.survivors.includes(id)) cup.survivors.push(id);
            } else if (roundIdx === 2) {
                for (const id of [...(divs['championship'] || []), ...(divs['premier-league'] || [])])
                    if (!cup.survivors.includes(id)) cup.survivors.push(id);
            }
        }
        if (cupName === 'carabaocup' && roundIdx === 1) {
            for (const id of (divs['premier-league'] || []))
                if (!cup.survivors.includes(id)) cup.survivors.push(id);
        }
        // Add player's team if this is their entry round and they're not already in
        if (roundIdx === cup.playerEntryRound && !cup.survivors.includes(this.state.playerTeam)) {
            cup.survivors.push(this.state.playerTeam);
        }
        cup.playerIn = cup.survivors.includes(this.state.playerTeam);

        if (!cup.playerIn) {
            // Auto-simulate entire round
            const pool = [...cup.survivors];
            for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
            const bye = pool.length % 2 !== 0 ? pool.shift() : null;
            const newSurvivors = bye ? [bye] : [];
            for (let i = 0; i < pool.length; i += 2) {
                const r = this._simulateSingleCupMatch(pool[i], pool[i + 1]);
                newSurvivors.push(r.winner);
                const h = plmGetTeam(pool[i]), a = plmGetTeam(pool[i + 1]);
                cup.log.push(`${roundName}: ${h?.short || pool[i]} ${r.hs}–${r.as}${r.pens ? '(p)' : ''} ${a?.short || pool[i + 1]}`);
            }
            cup.survivors = newSurvivors;
            cup.roundInProgress = false;
            cup.roundIdx++;
            if (cup.survivors.length <= 1) {
                cup.winner = cup.survivors[0] || null;
                cup.done = true;
                if (cup.winner) this._awardCupPrize(cupName, cup.winner);
            }
            this.save();
            return false;
        }

        // Draw fixtures with player in pool
        const pool = [...cup.survivors];
        for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }

        // If odd, give bye to a non-player team
        let byeTeam = null;
        if (pool.length % 2 !== 0) {
            const nonP = pool.filter(id => id !== this.state.playerTeam);
            const idx  = Math.floor(Math.random() * nonP.length);
            byeTeam    = nonP[idx];
            pool.splice(pool.indexOf(byeTeam), 1);
        }

        // Find player's fixture index
        let pIdx = -1;
        for (let i = 0; i < pool.length; i += 2) {
            if (pool[i] === this.state.playerTeam || pool[i + 1] === this.state.playerTeam) { pIdx = i; break; }
        }
        if (pIdx < 0) { cup.roundInProgress = false; return false; }

        const oppId   = pool[pIdx] === this.state.playerTeam ? pool[pIdx + 1] : pool[pIdx];
        const isHome  = Math.random() < 0.5;
        const fixture = isHome ? { home: this.state.playerTeam, away: oppId } : { home: oppId, away: this.state.playerTeam };

        // Simulate all AI matches for this round
        const aiSurvivors = [];
        for (let i = 0; i < pool.length; i += 2) {
            if (i === pIdx) continue;
            const r = this._simulateSingleCupMatch(pool[i], pool[i + 1]);
            aiSurvivors.push(r.winner);
            const h = PLM_ALL_TEAMS_BY_ID[pool[i]], a = PLM_ALL_TEAMS_BY_ID[pool[i + 1]];
            cup.log.push(`${roundName}: ${h?.short || pool[i]} ${r.hs}–${r.as}${r.pens ? '(p)' : ''} ${a?.short || pool[i + 1]}`);
        }

        cup.pendingAISurvivors = aiSurvivors;
        cup.pendingByeTeam     = byeTeam;
        cup.pendingRoundName   = roundName;
        this.state.cupContext  = { cupName, roundName, fixture };
        this.save();
        return true;
    }

    playCupMatch() {
        if (!this.state.cupContext) return;
        const { cupName, roundName, fixture } = this.state.cupContext;
        const cup  = this.state[cupName];
        const home = plmGetTeam(fixture.home);
        const away = plmGetTeam(fixture.away);
        if (!home || !away) { this.state.cupContext = null; this.render(); return; }
        if (!this.squads[fixture.home]) this.squads[fixture.home] = plmFallbackSquad(home);
        if (!this.squads[fixture.away]) this.squads[fixture.away] = plmFallbackSquad(away);

        const homeXI = this.getXIFor(home.id);
        const awayXI = this.getXIFor(away.id);
        const sim = plmSimulateMatch(home, homeXI, away, awayXI,
            this.getFormationFor(home.id), this.getFormationFor(away.id));

        let playerWon, pens = false;
        if (sim.homeScore !== sim.awayScore) {
            playerWon = sim.homeScore > sim.awayScore
                ? fixture.home === this.state.playerTeam
                : fixture.away === this.state.playerTeam;
        } else {
            // Penalty shootout — slight bias toward higher-rated XI
            const prob = (plmAvgRating(homeXI) + 2) / (plmAvgRating(homeXI) + plmAvgRating(awayXI) + 2);
            const homeWins = Math.random() < prob;
            playerWon = homeWins ? fixture.home === this.state.playerTeam : fixture.away === this.state.playerTeam;
            pens = true;
            const penWinner = homeWins ? home : away;
            sim.timeline.push({ min: 121, type: 'ft',
                text: `⚽ Goes to penalties! ${penWinner.name} win the shootout!` });
        }

        // Tick availability for both squads
        for (const tid of [fixture.home, fixture.away]) {
            for (const p of (this.squads[tid] || [])) {
                if (p.suspended > 0) p.suspended--;
                if (p.injured   > 0) p.injured--;
            }
        }

        const winner     = playerWon ? this.state.playerTeam : (fixture.home === this.state.playerTeam ? fixture.away : fixture.home);
        const aiSurvivors = cup.pendingAISurvivors || [];
        const byeTeam     = cup.pendingByeTeam || null;
        cup.survivors     = [...aiSurvivors, winner, ...(byeTeam ? [byeTeam] : [])];

        cup.log.push(`${roundName}: ${home.short} ${sim.homeScore}–${sim.awayScore}${pens ? '(p)' : ''} ${away.short}${playerWon ? ' ← YOU ✓' : ''}`);
        if (!playerWon) cup.playerIn = false;
        cup.roundIdx++;
        cup.roundInProgress    = false;
        cup.pendingAISurvivors = null;
        cup.pendingByeTeam     = null;

        if (cup.survivors.length <= 1) {
            cup.winner = cup.survivors[0] || null;
            cup.done   = true;
            if (cup.winner) this._awardCupPrize(cupName, cup.winner);
        }

        this.state.lastMatch  = { fixture, ...sim, home, away,
            isCupMatch: true, cupName, roundName, cupDisplayName: cup.name, playerWon, pens };
        this.state.screen     = 'matchResult';
        this.state.cupContext = null;
        this.save();
        this.render();
    }

    _awardCupPrize(cupName, winnerId) {
        const prize = cupName === 'facup' ? 75 : 50;
        this.state.allBudgets[winnerId] = (this.state.allBudgets[winnerId] || 0) + prize;
        const cup = this.state[cupName];
        const t   = plmGetTeam(winnerId);
        cup.log.push(`🏆 ${t?.name || winnerId} win the ${cup.name}! (+£${prize}m)`);
    }

    _cupStatusHtml() {
        const cups = [
            { key: 'facup', label: 'FA Cup', emoji: '🏆' },
            { key: 'carabaocup', label: 'Carabao Cup', emoji: '🏆' },
        ];
        const parts = cups.map(({ key, label, emoji }) => {
            const cup = this.state[key];
            if (!cup) return '';
            if (cup.done) {
                const w = PLM_ALL_TEAMS_BY_ID[cup.winner];
                const youWon = cup.winner === this.state.playerTeam;
                return `<span class="${youWon ? 'plm-cup-you' : ''}">${emoji} <b>${label}</b>: ${w?.name || '?'}${youWon ? ' — YOU! 🎉' : ''}</span>`;
            }
            if (!cup.playerIn) return `<span style="opacity:.6">${emoji} <b>${label}</b>: Eliminated</span>`;
            const next = cup.roundNames[cup.roundIdx] || 'Final';
            return `<span>${emoji} <b>${label}</b>: Still in — ${next} next</span>`;
        }).filter(Boolean).join(' &nbsp;|&nbsp; ');
        return parts ? `<div class="plm-cup-status">${parts}</div>` : '';
    }

    _cupSeasonEndHtml() {
        const cups = [
            { key: 'facup', label: 'FA Cup', prize: 75 },
            { key: 'carabaocup', label: 'Carabao Cup', prize: 50 },
        ];
        return cups.map(({ key, label, prize }) => {
            const cup = this.state[key];
            if (!cup) return '';
            const w = plmGetTeam(cup.winner);
            const youWon = cup.winner === this.state.playerTeam;
            if (youWon) {
                return `<div class="plm-cup-won-box">🏆 <b>${label} WINNER!</b> +£${prize}m prize money</div>`;
            }
            if (cup.winner) {
                return `<div class="plm-cup-result-line">🏆 ${label}: Won by ${w?.name || cup.winner}</div>`;
            }
            return `<div class="plm-cup-result-line">🏆 ${label}: Season ongoing</div>`;
        }).join('');
    }

    // ================================================================
    // EUROPEAN COMPETITION METHODS
    // ================================================================

    _getPlayerEurQual(prevSeason) {
        // Determine which European competition player qualifies for.
        // prevSeason: object with { divisionId, finishPos } or null (season 1 = use initial lists)
        const pt = this.state.playerTeam;
        if (!prevSeason) {
            if (PLM_UCL_ENGLISH_S1.includes(pt))  return 'ucl';
            if (PLM_UEL_ENGLISH_S1.includes(pt))  return 'uel';
            if (PLM_UECL_ENGLISH_S1.includes(pt)) return 'uecl';
            return null;
        }
        const { divisionId, finishPos } = prevSeason;
        if (divisionId !== 'premier-league') return null;
        if (finishPos <= 4) return 'ucl';
        if (finishPos === 5) return 'uel';
        if (finishPos <= 7) return 'uecl';
        return null;
    }

    _initEuropean(comp, carryoverBudgets) {
        // Season 1: use pre-set lists. Later seasons: determined by renderSeasonEnd override.
        const pt      = this.state.playerTeam;
        const season  = this.state.season || 1;
        const isS1    = !carryoverBudgets;

        let englishTeams, eurTeams;
        if (comp === 'ucl') {
            englishTeams = isS1 ? [...PLM_UCL_ENGLISH_S1] : [];
            eurTeams     = isS1 ? [...PLM_UCL_EUR_S1]     : [...PLM_UCL_EUR_S1];
        } else if (comp === 'uel') {
            englishTeams = isS1 ? [...PLM_UEL_ENGLISH_S1] : [];
            eurTeams     = isS1 ? [...PLM_UEL_EUR_S1]     : [...PLM_UEL_EUR_S1.slice(0, 12)];
        } else {
            englishTeams = isS1 ? [...PLM_UECL_ENGLISH_S1] : [];
            eurTeams     = isS1 ? [...PLM_UECL_EUR_S1]      : [...PLM_UECL_EUR_S1];
        }

        const playerIn   = englishTeams.includes(pt) || eurTeams.includes(pt);
        const survivors  = [...englishTeams, ...eurTeams];
        const totalMD    = this.divConfig().matchdays;
        const triggers   = this._eurTriggers(totalMD, comp);

        const roundNames = {
            ucl:  ['Round of 32','Round of 16','Quarter-Final','Semi-Final','Final'],
            uel:  ['Round of 16','Quarter-Final','Semi-Final','Final'],
            uecl: ['Quarter-Final','Semi-Final','Final'],
        }[comp];

        return {
            comp, name: PLM_EUR_LABELS[comp],
            survivors, roundIdx: 0, roundNames, triggers,
            playerIn, roundInProgress: false,
            winner: null, done: false, log: [],
            pendingAISurvivors: null, pendingByeTeam: null, pendingRoundName: '',
        };
    }

    _eurTriggers(totalMD, comp) {
        const fracs = {
            ucl:  [0.21, 0.37, 0.55, 0.74, 0.94],
            uel:  [0.26, 0.47, 0.68, 0.89],
            uecl: [0.32, 0.53, 0.84],
        }[comp] || [0.5];
        return fracs.map(f => Math.max(1, Math.round(totalMD * f)));
    }

    _shouldTriggerEur(comp) {
        const c = this.state[comp];
        if (!c || c.done || c.roundInProgress || !c.survivors || !c.survivors.length) return false;
        if (c.roundIdx >= c.triggers.length) return false;
        return (this.state.matchDay - 1) >= c.triggers[c.roundIdx];
    }

    setupEurRound(comp) {
        const cup = this.state[comp];
        if (!cup) return false;
        const roundIdx  = cup.roundIdx;
        const roundName = cup.roundNames[roundIdx] || `Round ${roundIdx + 1}`;
        cup.roundInProgress = true;

        if (!cup.playerIn) {
            // Auto-simulate whole round
            const pool = [...cup.survivors];
            for (let i = pool.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]];
            }
            const bye = pool.length % 2 !== 0 ? pool.shift() : null;
            const newSurv = bye ? [bye] : [];
            for (let i = 0; i < pool.length; i += 2) {
                const r = this._simulateSingleCupMatch(pool[i], pool[i + 1]);
                newSurv.push(r.winner);
                const h = plmGetTeam(pool[i]), a = plmGetTeam(pool[i + 1]);
                cup.log.push(`${roundName}: ${h?.short || pool[i]} ${r.hs}–${r.as}${r.pens ? '(p)' : ''} ${a?.short || pool[i + 1]}`);
            }
            cup.survivors       = newSurv;
            cup.roundInProgress = false;
            cup.roundIdx++;
            if (cup.survivors.length <= 1) {
                cup.winner = cup.survivors[0] || null;
                cup.done   = true;
                if (cup.winner) this._awardEurPrize(comp, cup.winner);
            }
            this.save();
            return false;
        }

        // Player involved
        const pool = [...cup.survivors];
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        let byeTeam = null;
        if (pool.length % 2 !== 0) {
            const nonP = pool.filter(id => id !== this.state.playerTeam);
            byeTeam    = nonP[Math.floor(Math.random() * nonP.length)];
            pool.splice(pool.indexOf(byeTeam), 1);
        }
        let pIdx = -1;
        for (let i = 0; i < pool.length; i += 2) {
            if (pool[i] === this.state.playerTeam || pool[i + 1] === this.state.playerTeam) { pIdx = i; break; }
        }
        if (pIdx < 0) { cup.roundInProgress = false; return false; }

        const oppId   = pool[pIdx] === this.state.playerTeam ? pool[pIdx + 1] : pool[pIdx];
        const isHome  = Math.random() < 0.5;
        const fixture = isHome
            ? { home: this.state.playerTeam, away: oppId }
            : { home: oppId, away: this.state.playerTeam };

        const aiSurvivors = [];
        for (let i = 0; i < pool.length; i += 2) {
            if (i === pIdx) continue;
            const r = this._simulateSingleCupMatch(pool[i], pool[i + 1]);
            aiSurvivors.push(r.winner);
            const h = plmGetTeam(pool[i]), a = plmGetTeam(pool[i + 1]);
            cup.log.push(`${roundName}: ${h?.short || pool[i]} ${r.hs}–${r.as}${r.pens ? '(p)' : ''} ${a?.short || pool[i + 1]}`);
        }

        cup.pendingAISurvivors = aiSurvivors;
        cup.pendingByeTeam     = byeTeam;
        cup.pendingRoundName   = roundName;
        this.state.eurContext  = { comp, roundName, fixture };
        this.save();
        return true;
    }

    playEurMatch() {
        if (!this.state.eurContext) return;
        const { comp, roundName, fixture } = this.state.eurContext;
        const cup  = this.state[comp];
        const home = plmGetTeam(fixture.home);
        const away = plmGetTeam(fixture.away);
        if (!home || !away) { this.state.eurContext = null; this.render(); return; }
        if (!this.squads[fixture.home]) this.squads[fixture.home] = plmFallbackSquad(home);
        if (!this.squads[fixture.away]) this.squads[fixture.away] = plmFallbackSquad(away);

        const homeXI = this.getXIFor(fixture.home);
        const awayXI = this.getXIFor(fixture.away);
        const sim    = plmSimulateMatch(home, homeXI, away, awayXI,
            this.getFormationFor(fixture.home), this.getFormationFor(fixture.away));

        let playerWon, pens = false;
        if (sim.homeScore !== sim.awayScore) {
            playerWon = sim.homeScore > sim.awayScore
                ? fixture.home === this.state.playerTeam
                : fixture.away === this.state.playerTeam;
        } else {
            const prob = (plmAvgRating(homeXI) + 2) / (plmAvgRating(homeXI) + plmAvgRating(awayXI) + 2);
            const homeWins = Math.random() < prob;
            playerWon = homeWins ? fixture.home === this.state.playerTeam : fixture.away === this.state.playerTeam;
            pens = true;
            sim.timeline.push({ min: 121, type: 'ft',
                text: `⚽ Goes to penalties! ${(homeWins ? home : away).name} win the shootout!` });
        }

        for (const tid of [fixture.home, fixture.away])
            for (const p of (this.squads[tid] || []))
                { if (p.suspended > 0) p.suspended--; if (p.injured > 0) p.injured--; }

        const winner      = playerWon ? this.state.playerTeam : (fixture.home === this.state.playerTeam ? fixture.away : fixture.home);
        const aiSurvivors = cup.pendingAISurvivors || [];
        const byeTeam     = cup.pendingByeTeam     || null;
        cup.survivors     = [...aiSurvivors, winner, ...(byeTeam ? [byeTeam] : [])];

        cup.log.push(`${roundName}: ${home.short} ${sim.homeScore}–${sim.awayScore}${pens ? '(p)' : ''} ${away.short}${playerWon ? ' ← YOU ✓' : ''}`);
        if (!playerWon) cup.playerIn = false;
        cup.roundIdx++;
        cup.roundInProgress    = false;
        cup.pendingAISurvivors = null;
        cup.pendingByeTeam     = null;

        if (cup.survivors.length <= 1) {
            cup.winner = cup.survivors[0] || null;
            cup.done   = true;
            if (cup.winner) this._awardEurPrize(comp, cup.winner);
        }

        this.state.lastMatch  = { fixture, ...sim, home, away,
            isCupMatch: true, cupName: comp, roundName, cupDisplayName: cup.name, playerWon, pens };
        this.state.screen     = 'matchResult';
        this.state.eurContext = null;
        this.save();
        this.render();
    }

    _awardEurPrize(comp, winnerId) {
        const prize = PLM_EUR_PRIZES[comp] || 0;
        this.state.allBudgets[winnerId] = (this.state.allBudgets[winnerId] || 0) + prize;
        const cup = this.state[comp];
        const t   = plmGetTeam(winnerId);
        cup.log.push(`🏆 ${t?.name || winnerId} win the ${cup.name}! (+£${prize}m)`);
    }

    _eurStatusHtml() {
        const comps = ['ucl','uel','uecl'];
        const parts = comps.map(comp => {
            const cup = this.state[comp];
            if (!cup || (!cup.playerIn && !cup.done)) return '';
            if (!cup.survivors || !cup.survivors.length) return '';
            if (cup.done) {
                const w      = plmGetTeam(cup.winner);
                const youWon = cup.winner === this.state.playerTeam;
                return `<span class="${youWon ? 'plm-cup-you' : ''}">${cup.name}: ${youWon ? '🏆 YOU! 🎉' : (w?.name || '?')}</span>`;
            }
            if (!cup.playerIn) return `<span style="opacity:.6">${cup.name}: Eliminated</span>`;
            const next = cup.roundNames[cup.roundIdx] || 'Final';
            return `<span>${cup.name}: Still in — <b>${next}</b> next</span>`;
        }).filter(Boolean).join(' &nbsp;|&nbsp; ');
        return parts ? `<div class="plm-cup-status">${parts}</div>` : '';
    }

    _eurSeasonEndHtml() {
        return ['ucl','uel','uecl'].map(comp => {
            const cup = this.state[comp];
            if (!cup) return '';
            const w      = plmGetTeam(cup.winner);
            const youWon = cup.winner === this.state.playerTeam;
            if (youWon) return `<div class="plm-cup-won-box">🏆 <b>${cup.name} WINNER!</b> +£${PLM_EUR_PRIZES[comp]}m prize money</div>`;
            if (cup.done && cup.playerIn !== undefined) {
                return `<div class="plm-cup-result-line">${cup.name}: Won by ${w?.name || cup.winner || 'N/A'}</div>`;
            }
            return '';
        }).join('');
    }

    // Determine European qual for next season — real UEFA rules
    // England gets 5 UCL spots. FA Cup → UEL. Carabao → UECL. UEL winner → UCL.
    _nextEurQual(finishPos, divisionId, bonuses) {
        if (divisionId !== 'premier-league') return null;
        const { wonUCL, wonUEL, wonFACup, wonCarabao } = bonuses || {};
        // Cup/European winner routes (highest priority)
        if (wonUCL || wonUEL) return 'ucl';
        // League finish routes (England's coefficient = 5 UCL spots)
        if (finishPos <= 5) return 'ucl';
        if (finishPos === 6) {
            if (wonFACup) return 'ucl'; // FA Cup winner already gets UEL but if 6th they'd get UEL anyway; UCL if cup winner somehow
            return 'uel';
        }
        if (finishPos === 7) return 'uecl';
        // Outside top 7 — only cup routes
        if (wonFACup)   return 'uel';
        if (wonCarabao) return 'uecl';
        return null;
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
