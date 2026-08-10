// ==================================================================
// Chancellor Simulator — run the UK Budget. Set department spending and
// tax rates each year, then live with the consequences: growth, inflation,
// debt, public services and your approval rating. Survive the elections.
// ==================================================================

const CH_SAVE_KEY = 'chancellor_best_v1';
const CH_START_YEAR = 2026;
const CH_TERM_LENGTH = 5;      // general election every 5 budgets
const CH_MAX_YEARS = 20;       // survive 4 full terms to win

// Departments. `need` is what it costs to stand still — it grows every year
// with inflation and an ageing population, so a frozen budget is a real cut.
const CH_DEPTS = [
    { key: 'nhs',       icon: '🏥', name: 'NHS & Social Care',       start: 230, min: 100, max: 420, quality: 62, qLabel: 'NHS' },
    { key: 'welfare',   icon: '👵', name: 'Welfare & Pensions',      start: 340, min: 180, max: 520, quality: 58, qLabel: 'Living standards' },
    { key: 'education', icon: '🎓', name: 'Schools & Colleges',      start: 120, min: 50,  max: 240, quality: 60, qLabel: 'Schools' },
    { key: 'defence',   icon: '🛡️', name: 'Defence',                 start: 60,  min: 20,  max: 180, quality: 60, qLabel: 'Armed forces' },
    { key: 'police',    icon: '🚓', name: 'Police & Justice',        start: 35,  min: 10,  max: 100, quality: 57, qLabel: 'Safety' },
    { key: 'transport', icon: '🚄', name: 'Transport & Infrastructure', start: 50, min: 10, max: 150, quality: 55, qLabel: 'Infrastructure' },
    { key: 'energy',    icon: '🌱', name: 'Energy & Environment',    start: 30,  min: 0,   max: 110, quality: 52, qLabel: 'Green record' },
    { key: 'councils',  icon: '🏛️', name: 'Local Councils',          start: 90,  min: 40,  max: 180, quality: 55, qLabel: 'Local services' },
    { key: 'aid',       icon: '🌍', name: 'Foreign Aid & Diplomacy', start: 20,  min: 0,   max: 70,  quality: 60, qLabel: 'Global standing' }
];

// Taxes. `perPoint` is calibrated so the default rates raise roughly the real
// UK take. `anger` is approval lost per point above the starting rate,
// `drag` is GDP growth lost per point above it.
const CH_TAXES = [
    { key: 'income', icon: '💷', name: 'Income Tax (basic rate)', start: 20, min: 10, max: 50,  unit: '%',   perPoint: 16.16, anger: 1.1,  drag: 0.035 },
    { key: 'ni',     icon: '🧾', name: 'National Insurance',      start: 8,  min: 0,  max: 25,  unit: '%',   perPoint: 23.60, anger: 1.4,  drag: 0.045 },
    { key: 'vat',    icon: '🛒', name: 'VAT',                     start: 20, min: 0,  max: 30,  unit: '%',   perPoint: 10.63, anger: 1.0,  drag: 0.030 },
    { key: 'corp',   icon: '🏢', name: 'Corporation Tax',         start: 25, min: 10, max: 45,  unit: '%',   perPoint: 4.65,  anger: 0.25, drag: 0.060 },
    { key: 'fuel',   icon: '⛽', name: 'Fuel Duty',               start: 53, min: 0,  max: 100, unit: 'p/l', perPoint: 1.943, anger: 0.35, drag: 0.012 }
];

const CH_OTHER_RECEIPTS = 140;  // council tax, licences, dividends — not yours to set

// Regions. Seats total 650, roughly matching the real Commons. `drift` is the
// pull of agglomeration: left alone, the South keeps pulling away from the rest,
// which is the problem every levelling-up fund has been aimed at.
const CH_REGIONS = [
    { key: 'nw',  name: 'North West',            seats: 75,  prosperity: 48, approval: 44, drift: -0.35 },
    { key: 'ney', name: 'North East & Yorkshire', seats: 81,  prosperity: 42, approval: 42, drift: -0.40 },
    { key: 'mid', name: 'Midlands',              seats: 106, prosperity: 50, approval: 45, drift: -0.25 },
    { key: 'se',  name: 'London, South & East',  seats: 281, prosperity: 68, approval: 48, drift: +0.30 },
    { key: 'sc',  name: 'Scotland',              seats: 57,  prosperity: 52, approval: 41, drift: -0.20 },
    { key: 'wni', name: 'Wales & N. Ireland',    seats: 50,  prosperity: 44, approval: 44, drift: -0.30 }
];
const CH_SEATS_TOTAL = CH_REGIONS.reduce((n, r) => n + r.seats, 0);
const CH_MAJORITY = Math.floor(CH_SEATS_TOTAL / 2) + 1;

// Capital projects: multi-year commitments that keep costing whether you like it
// or not, then pay off after they open. `overrun` is the annual chance of a
// cost blowout — the bigger and more tunnel-heavy the scheme, the likelier it is.
const CH_PROJECTS = [
    { id: 'hsr', icon: '🚄', name: 'High-speed rail to the North', regions: ['nw', 'ney'],
      cost: 9, years: 8, prosperity: 16, quality: { transport: 8 }, growth: 0.20, overrun: 0.30,
      blurb: 'London to Manchester in an hour. Vast, slow, and historically impossible to keep on budget.' },
    { id: 'npr', icon: '🌉', name: 'Northern Powerhouse Rail', regions: ['ney', 'nw'],
      cost: 5, years: 6, prosperity: 11, quality: { transport: 5 }, growth: 0.12, overrun: 0.25,
      blurb: 'Joins up Liverpool, Manchester, Leeds and Hull so the North works as one economy.' },
    { id: 'metro', icon: '🚇', name: 'Metro extensions: Manchester & Leeds', regions: ['nw', 'ney'],
      cost: 3, years: 5, prosperity: 9, quality: { transport: 3 }, overrun: 0.20,
      blurb: 'Trams and light rail. Unglamorous, cheap, and it changes daily life quickly.' },
    { id: 'm6', icon: '🛣️', name: 'Midlands motorway upgrade', regions: ['mid'],
      cost: 3, years: 4, prosperity: 8, quality: { transport: 4 }, overrun: 0.20,
      blurb: 'Freight moves faster through the middle of the country.' },
    { id: 'sizewell', icon: '⚛️', name: 'Sizewell C nuclear plant', regions: ['se'],
      cost: 4, years: 9, prosperity: 6, quality: { energy: 12 }, inflation: -0.30, overrun: 0.30,
      blurb: 'A decade to build, then decades of cheap power. Bills fall once it opens.' },
    { id: 'wind', icon: '🌬️', name: 'North Sea wind farms', regions: ['sc'],
      cost: 3, years: 6, prosperity: 9, quality: { energy: 9 }, inflation: -0.20, overrun: 0.15,
      blurb: 'Turbines off the Scottish coast, and the supply chain jobs that come with them.' },
    { id: 'steel', icon: '🏭', name: 'Green steel plant, Port Talbot', regions: ['wni'],
      cost: 2, years: 5, prosperity: 10, quality: { energy: 3 }, overrun: 0.20,
      blurb: 'Saves a town built around one industry, and cleans it up at the same time.' },
    { id: 'heathrow', icon: '✈️', name: 'Third runway at Heathrow', regions: ['se'],
      cost: 3, years: 6, prosperity: 7, growth: 0.18, quality: { energy: -7 }, overrun: 0.25,
      blurb: 'Good for trade and the South East. Your green record will not survive it.' },
    { id: 'broadband', icon: '📡', name: 'National gigabit broadband', regions: 'all',
      cost: 2, years: 5, prosperity: 2, growth: 0.15, overrun: 0.15,
      blurb: 'Fibre to every village. Helps everywhere, but helps remote places most.' },
    { id: 'hospitals', icon: '🏥', name: 'Forty new hospitals', regions: 'all',
      cost: 6, years: 6, prosperity: 1, quality: { nhs: 12 }, overrun: 0.35,
      blurb: 'Announced easily, built slowly. The NHS quality gain is permanent.' },
    { id: 'newtowns', icon: '🏘️', name: 'New towns housing programme', regions: 'all',
      cost: 5, years: 7, prosperity: 2, growth: 0.12, overrun: 0.25,
      blurb: 'Somewhere for people to live. Pays back over a generation, not a term.' },
    { id: 'colleges', icon: '🎓', name: 'Technical colleges network', regions: 'all',
      cost: 2, years: 4, prosperity: 2, quality: { education: 7 }, overrun: 0.10,
      blurb: 'Cheap, quick, and the skills feed straight back into growth.' }
];

const chClamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const chMoney = v => (v < 0 ? '−' : '') + '£' + Math.abs(Math.round(v)) + 'bn';
const chPct = (v, dp = 1) => v.toFixed(dp) + '%';

// ---------------------------------------------------------------- events
// Each event may just apply effects, or offer the Chancellor a choice.
// `when` gates an event on the state of the country so the story fits.
const CH_EVENTS = [
    {
        id: 'oil', headline: 'Oil price shock hits the pumps',
        body: 'A crisis in the Gulf has sent oil to $140 a barrel. Drivers are furious and prices are climbing.',
        apply: s => { s.shockInflation += 2.2; s.shockGrowth -= 0.8; },
        choices: [
            { label: 'Cut fuel duty by 5p', detail: 'Costs about £9bn, but motorists will notice.',
              apply: s => { s.oneOffCost += 9; s.taxes.fuel = chClamp(s.taxes.fuel - 5, 0, 100); s.approval += 4; } },
            { label: 'Hold firm', detail: 'Save the money and take the criticism.',
              apply: s => { s.approval -= 5; } }
        ]
    },
    {
        id: 'nhswinter', headline: 'Winter crisis in A&E', weight: 2,
        when: s => s.quality.nhs < 56,
        body: 'Ambulances are queuing outside hospitals and the front pages are brutal.',
        choices: [
            { label: 'Emergency £15bn rescue package', detail: 'Straight onto the deficit, but it steadies the ship.',
              apply: s => { s.oneOffCost += 15; s.quality.nhs += 8; s.approval += 2; } },
            { label: 'Tell them to manage', detail: 'No new money. Brace for the headlines.',
              apply: s => { s.quality.nhs -= 5; s.approval -= 7; } }
        ]
    },
    {
        id: 'techboom', headline: 'AI investment boom lands in the North',
        body: 'Three global firms have chosen the UK for their new research campuses.',
        apply: s => { s.shockGrowth += 1.2; s.approval += 2; }
    },
    {
        id: 'strike', headline: 'Teachers vote for national strike', weight: 2,
        when: s => s.quality.education < 54,
        body: 'Schools across the country are set to close unless pay is settled.',
        choices: [
            { label: 'Fund a 6% pay rise', detail: 'Adds £9bn to the schools bill for good.',
              apply: s => { s.need.education += 9; s.quality.education += 6; s.approval += 1; } },
            { label: 'Refuse to negotiate', detail: 'Hold the line on public sector pay.',
              apply: s => { s.quality.education -= 5; s.approval -= 5; } }
        ]
    },
    {
        id: 'war', headline: 'War breaks out in Eastern Europe',
        body: 'NATO allies are asking Britain to step up. Defence costs are about to rise whatever you do.',
        apply: s => { s.need.defence += 8; },
        choices: [
            { label: 'Send £12bn of military aid', detail: 'Britain leads. Allies notice.',
              apply: s => { s.oneOffCost += 12; s.quality.aid += 9; s.quality.defence += 3; s.approval += 2; } },
            { label: 'Stay out of it', detail: 'Keep the money at home.',
              apply: s => { s.quality.aid -= 11; s.approval -= 2; } }
        ]
    },
    {
        id: 'floods', headline: 'Floods devastate the Midlands',
        body: 'Thousands of homes are under water and councils say they cannot cope.',
        choices: [
            { label: 'Emergency flood fund (£6bn)', detail: 'Money to councils within the week.',
              apply: s => { s.oneOffCost += 6; s.quality.councils += 4; s.approval += 3; } },
            { label: 'Leave it to local councils', detail: 'They have their own budgets.',
              apply: s => { s.quality.councils -= 6; s.approval -= 6; } }
        ]
    },
    {
        id: 'markets', headline: 'Markets take fright at your borrowing', weight: 2,
        when: s => s.lastDeficit > 130 || s.debt / s.gdp > 1.1,
        body: 'Gilt yields have spiked. Lending to Britain just got more expensive.',
        apply: s => { s.shockGilt += 0.9; s.shockGrowth -= 0.5; s.approval -= 3; }
    },
    {
        id: 'receipts', headline: 'Corporation tax receipts beat the forecast',
        body: 'Company profits came in far above what the OBR expected.',
        apply: s => { s.oneOffRevenue += 20; s.approval += 1; }
    },
    {
        id: 'pandemic', headline: 'New virus spreading fast',
        body: 'Scientists want restrictions. Business wants to stay open. You have hours to decide.',
        choices: [
            { label: 'Fund a £40bn support package', detail: 'Pay wages, protect the NHS, blow a hole in the books.',
              apply: s => { s.oneOffCost += 40; s.shockGrowth -= 1.4; s.quality.nhs += 3; s.approval += 5; } },
            { label: 'Keep the country open', detail: 'Protect the economy and hope for the best.',
              apply: s => { s.shockGrowth -= 0.5; s.quality.nhs -= 9; s.approval -= 7; } }
        ]
    },
    {
        id: 'rail', headline: 'New high-speed line opens ahead of schedule',
        when: s => s.quality.transport > 66,
        body: 'Journey times are down and business investment is following the track.',
        apply: s => { s.shockGrowth += 0.8; s.approval += 4; }
    },
    {
        id: 'prisons', headline: 'Prisons full — courts told to delay sentencing',
        when: s => s.quality.police < 50,
        body: 'There is nowhere left to put offenders and the police are furious.',
        apply: s => { s.quality.police -= 4; s.approval -= 5; }
    },
    {
        id: 'triplelock', headline: 'Pensioners demand the triple lock is honoured',
        body: 'Inflation was high, so the guarantee means a big rise in the state pension.',
        choices: [
            { label: 'Honour the triple lock', detail: 'Adds £14bn a year to the pensions bill for good.',
              apply: s => { s.need.welfare += 14; s.quality.welfare += 4; s.approval += 4; } },
            { label: 'Suspend it this year', detail: 'Saves a fortune. Pensioners vote.',
              apply: s => { s.quality.welfare -= 5; s.approval -= 9; } }
        ]
    },
    {
        id: 'hmrc', headline: 'Report finds billions lost to tax avoidance',
        body: 'HMRC says it could collect far more if it had the staff to chase it.',
        choices: [
            { label: 'Fund an HMRC crackdown (£2bn)', detail: 'Raises about £12bn a year from then on.',
              apply: s => { s.oneOffCost += 2; s.extraRevenue += 12; s.approval += 3; } },
            { label: 'Not a priority', detail: 'Leave HMRC as it is.',
              apply: s => { s.approval -= 1; } }
        ]
    },
    {
        id: 'green', headline: 'British breakthrough in cheap clean energy',
        when: s => s.quality.energy > 66,
        body: 'Years of investment have paid off — energy bills are falling.',
        apply: s => { s.shockInflation -= 0.8; s.shockGrowth += 0.5; s.approval += 4; }
    },
    {
        id: 'boe', headline: 'Bank of England raises interest rates again',
        when: s => s.inflation > 4,
        body: 'The Governor blames your Budget. Mortgage holders blame you.',
        apply: s => { s.shockGilt += 0.7; s.shockGrowth -= 0.7; s.approval -= 4; }
    },
    {
        id: 'recession', headline: 'Recession sweeps across Europe',
        body: 'Our biggest trading partners have stopped buying.',
        apply: s => { s.shockGrowth -= 1.3; s.revenueMultiplier -= 0.03; }
    },
    {
        id: 'worldcup', headline: 'England win the World Cup!',
        body: 'The country has not stopped celebrating. Even your press coverage is warm.',
        apply: s => { s.approval += 6; s.shockGrowth += 0.2; }
    },
    {
        id: 'cyber', headline: 'Cyber attack shuts down hospital systems',
        when: s => s.quality.nhs < 62,
        body: 'Operations have been cancelled nationwide while systems are rebuilt.',
        choices: [
            { label: 'Fund a £3bn cyber defence programme', detail: 'Fix it properly, and be seen to act.',
              apply: s => { s.oneOffCost += 3; s.quality.nhs += 2; s.approval += 2; } },
            { label: 'Say it is an operational matter', detail: 'Not a Treasury problem.',
              apply: s => { s.quality.nhs -= 4; s.approval -= 5; } }
        ]
    },
    {
        id: 'housing', headline: 'House prices hit a record high',
        body: 'Anyone under 35 has given up. Anyone over 55 is delighted.',
        apply: s => { s.approval -= 2; s.shockGrowth += 0.2; }
    },
    {
        id: 'factory', headline: 'Car plant closure threatens 4,000 jobs', weight: 2,
        body: 'A major employer in the North East says it will move production abroad unless the government helps.',
        choices: [
            { label: 'Bail out the plant (£4bn)', detail: 'Keeps the jobs, for now.',
              apply: s => { s.oneOffCost += 4; s.regions.ney.approval += 6; s.regions.ney.glow += 3; } },
            { label: 'Let the market decide', detail: 'Saves the money. The town will not forgive it.',
              apply: s => { s.regions.ney.prosperity -= 5; s.regions.ney.approval -= 10; } }
        ]
    },
    {
        id: 'gap', headline: 'Watchdog: regional divide is the widest on record', weight: 2,
        when: s => s.regions.se.prosperity - Math.min(s.regions.nw.prosperity, s.regions.ney.prosperity,
                                                      s.regions.wni.prosperity) > 26,
        body: 'A damning report says the gap between London and the rest of the country has never been wider.',
        apply: s => {
            ['nw', 'ney', 'mid', 'wni', 'sc'].forEach(k => { s.regions[k].approval -= 5; });
            s.regions.se.approval -= 1;
        }
    },
    {
        id: 'barnett', headline: 'Row over Scotland\'s funding settlement',
        body: 'Holyrood says the Barnett formula has short-changed Scotland and wants more.',
        choices: [
            { label: 'Top up the settlement (£5bn)', detail: 'Buys peace in Scotland. Wales and NI will want the same.',
              apply: s => { s.oneOffCost += 5; s.regions.sc.approval += 8; s.regions.wni.approval -= 4; } },
            { label: 'The formula is the formula', detail: 'Defend the existing settlement.',
              apply: s => { s.regions.sc.approval -= 9; } }
        ]
    },
    {
        id: 'scandal', headline: 'Your Budget speech leaks the night before',
        body: 'Every measure is on the front pages before you stand up. The Speaker is not impressed.',
        apply: s => { s.approval -= 4; }
    }
];

class Chancellor {
    constructor(root) {
        this.root = root;
        if (!this.root) return;
        this.best = this.loadBest();
        this.renderIntro();
    }

    loadBest() {
        try {
            const raw = JSON.parse(localStorage.getItem(CH_SAVE_KEY));
            if (raw && Number.isFinite(raw.years)) return raw;
        } catch (e) { /* corrupt save — start fresh */ }
        return { years: 0, approval: 0 };
    }

    saveBest() {
        const years = this.state.year - CH_START_YEAR;
        if (years > this.best.years ||
            (years === this.best.years && this.state.approval > this.best.approval)) {
            this.best = { years, approval: Math.round(this.state.approval) };
            // Storage can be blocked (private browsing) — never let that stop the game.
            try { localStorage.setItem(CH_SAVE_KEY, JSON.stringify(this.best)); } catch (e) { /* ignore */ }
        }
    }

    // ------------------------------------------------------------ state
    newGame() {
        const spending = {}, need = {}, quality = {}, taxes = {}, regions = {};
        CH_DEPTS.forEach(d => { spending[d.key] = d.start; need[d.key] = d.start; quality[d.key] = d.quality; });
        CH_TAXES.forEach(t => { taxes[t.key] = t.start; });
        CH_REGIONS.forEach(r => { regions[r.key] = { prosperity: r.prosperity, approval: r.approval, glow: 0, built: 0 }; });

        this.view = 'budget';
        this.lastResult = 0;
        this.state = {
            year: CH_START_YEAR,
            endless: false,        // set once the player chooses to carry on past 20 years
            gdp: 2800,
            debt: 2600,
            gilt: 4.0,
            growth: 1.6,
            inflation: 2.4,
            unemployment: 4.2,
            approval: 45,
            extraRevenue: 0,       // permanent gains, e.g. the HMRC crackdown
            lastDeficit: 100,
            spending, need, quality, taxes, regions,
            active: [],            // projects under construction
            completed: [],         // ids of projects that have opened
            projectGrowth: 0,      // permanent growth won from finished projects
            projectInflation: 0,   // permanent price effect (cheap energy, mostly)
            history: [],
            seenEvents: []
        };
        this.resetYearShocks();
    }

    // Per-year modifiers that events write into, cleared before each Budget.
    resetYearShocks() {
        const s = this.state;
        s.shockGrowth = 0;
        s.shockInflation = 0;
        s.shockGilt = 0;
        s.oneOffCost = 0;
        s.oneOffRevenue = 0;
        s.revenueMultiplier = 1;
    }

    // ------------------------------------------------------------ sums
    gdpFactor() { return this.state.gdp / 2800; }

    taxYield(t) {
        const rate = this.state.taxes[t.key];
        const frac = rate / t.max;
        const efficiency = 1 - 0.45 * frac * frac;   // high rates leak: avoidance, less activity
        return t.perPoint * rate * efficiency * this.gdpFactor();
    }

    totals() {
        const s = this.state;
        const taxRevenue = CH_TAXES.reduce((sum, t) => sum + this.taxYield(t), 0);
        const revenue = (taxRevenue + CH_OTHER_RECEIPTS * this.gdpFactor() + s.extraRevenue) * s.revenueMultiplier
                        + s.oneOffRevenue;
        const departments = CH_DEPTS.reduce((sum, d) => sum + s.spending[d.key], 0);
        const projects = s.active.reduce((sum, p) => sum + p.cost, 0);
        const interest = s.debt * s.gilt / 100;
        const spending = departments + projects + interest + s.oneOffCost;
        return { revenue, departments, projects, interest, spending, deficit: spending - revenue };
    }

    // ------------------------------------------------------------ screens
    renderIntro() {
        const b = this.best.years > 0
            ? `<p class="ch-best">Best so far: <strong>${this.best.years} years</strong> in office, ending on ${this.best.approval}% approval.</p>`
            : '';
        this.root.innerHTML = `
            <div class="ch-intro">
                <div class="ch-door">🏛️</div>
                <h3>Number 11 Downing Street</h3>
                <p>The Prime Minister has just made you <strong>Chancellor of the Exchequer</strong>. Every year you must
                stand up in the Commons and deliver a Budget: how much each department gets, and how much tax people pay.</p>
                <p>Spend too little and hospitals, schools and the army fall apart. Spend too much and the debt spirals
                and the markets turn on you. Tax too hard and growth stalls and voters revolt.</p>
                <p>You also decide <strong>where</strong> the money goes. Six regions each have their own prosperity
                and their own opinion of you, and elections are won on ${CH_SEATS_TOTAL} seats rather than a national
                average — so you can be popular in the South and still lose. Big building projects are the only way to
                close the gap, but they cost money every year for up to a decade before they open, and they go over
                budget more often than not.</p>
                <p>There is a general election every ${CH_TERM_LENGTH} years. Lose it and you are finished.
                Survive ${CH_MAX_YEARS} years and you become the longest-serving Chancellor in history — then carry
                on as long as you can and set your own record.</p>
                ${b}
                <button class="ch-btn ch-btn-primary" id="ch-start">Take the red box 📕</button>
            </div>`;
        this.root.querySelector('#ch-start').addEventListener('click', () => {
            this.newGame();
            this.renderBudget();
        });
    }

    renderBudget() {
        const s = this.state;
        const term = Math.floor((s.year - CH_START_YEAR) / CH_TERM_LENGTH) + 1;
        const toElection = CH_TERM_LENGTH - ((s.year - CH_START_YEAR) % CH_TERM_LENGTH);

        this.root.innerHTML = `
            <div class="ch-topbar">
                <div class="ch-topbar-left">
                    <span class="ch-year">Budget ${s.year}</span>
                    <span class="ch-term">Term ${term} · election in ${toElection} ${toElection === 1 ? 'year' : 'years'}</span>
                </div>
                <div class="ch-approval-pill ${this.approvalClass(s.approval)}">
                    Approval ${Math.round(s.approval)}%
                </div>
            </div>

            <div class="ch-dash">
                ${this.statCard('📈', 'Growth', chPct(s.growth), s.growth >= 1 ? 'good' : s.growth >= 0 ? 'mid' : 'bad')}
                ${this.statCard('🔥', 'Inflation', chPct(s.inflation), s.inflation <= 3 ? 'good' : s.inflation <= 5 ? 'mid' : 'bad')}
                ${this.statCard('👷', 'Unemployment', chPct(s.unemployment), s.unemployment <= 5 ? 'good' : s.unemployment <= 7 ? 'mid' : 'bad')}
                ${this.statCard('🏦', 'National debt', Math.round(s.debt / s.gdp * 100) + '% of GDP', s.debt / s.gdp < 1 ? 'good' : s.debt / s.gdp < 1.4 ? 'mid' : 'bad')}
                ${this.statCard('💸', 'Borrowing cost', chPct(s.gilt, 2), s.gilt < 4.5 ? 'good' : s.gilt < 6 ? 'mid' : 'bad')}
                ${this.statCard('🏥', 'Public services', Math.round(this.avgQuality()) + '/100', this.avgQuality() >= 60 ? 'good' : this.avgQuality() >= 45 ? 'mid' : 'bad')}
            </div>

            <div class="ch-viewtabs">
                <button class="ch-viewtab" data-view="budget">💷 Spending &amp; Taxes</button>
                <button class="ch-viewtab" data-view="regions">🗺️ Regions</button>
                <button class="ch-viewtab" data-view="projects">🏗️ Projects${s.active.length ? ` <span class="ch-tab-badge">${s.active.length}</span>` : ''}</button>
            </div>

            <div id="ch-view"></div>
            <div class="ch-summary" id="ch-summary"></div>`;

        this.root.querySelectorAll('.ch-viewtab').forEach(btn => {
            btn.addEventListener('click', () => { this.view = btn.dataset.view; this.renderView(); });
        });
        this.renderView();
    }

    // Swaps the middle of the Budget screen without disturbing the header or
    // the running totals underneath it.
    renderView() {
        const s = this.state;
        this.root.querySelectorAll('.ch-viewtab').forEach(b => {
            b.classList.toggle('active', b.dataset.view === this.view);
        });
        const el = this.root.querySelector('#ch-view');

        if (this.view === 'regions') {
            el.innerHTML = this.regionsView();
        } else if (this.view === 'projects') {
            el.innerHTML = this.projectsView();
            el.querySelectorAll('[data-start]').forEach(btn => {
                btn.addEventListener('click', () => this.startProject(btn.dataset.start));
            });
            el.querySelectorAll('[data-cancel]').forEach(btn => {
                btn.addEventListener('click', () => this.cancelProject(btn.dataset.cancel));
            });
        } else {
            el.innerHTML = `
                <div class="ch-cols">
                    <section class="ch-col">
                        <h3 class="ch-col-title">Departmental spending</h3>
                        ${CH_DEPTS.map(d => this.deptRow(d)).join('')}
                    </section>
                    <section class="ch-col">
                        <h3 class="ch-col-title">Taxes</h3>
                        ${CH_TAXES.map(t => this.taxRow(t)).join('')}
                        <div class="ch-note">Other receipts (council tax, licences, fines):
                            <strong>${chMoney(CH_OTHER_RECEIPTS * this.gdpFactor() + s.extraRevenue)}</strong></div>
                    </section>
                </div>
                <p class="ch-hint">Departments need more money every year just to stand still — inflation and an ageing
                population see to that. A frozen budget is a cut.</p>`;

            CH_DEPTS.forEach(d => {
                const sl = el.querySelector('#ch-sl-' + d.key);
                sl.addEventListener('input', () => {
                    s.spending[d.key] = parseInt(sl.value, 10);
                    el.querySelector('#ch-val-' + d.key).textContent = chMoney(s.spending[d.key]);
                    this.updateSummary();
                });
            });
            CH_TAXES.forEach(t => {
                const sl = el.querySelector('#ch-sl-' + t.key);
                sl.addEventListener('input', () => {
                    s.taxes[t.key] = parseInt(sl.value, 10);
                    el.querySelector('#ch-val-' + t.key).textContent = s.taxes[t.key] + t.unit;
                    el.querySelector('#ch-yield-' + t.key).textContent = 'raises ' + chMoney(this.taxYield(t));
                    this.updateSummary();
                });
            });
        }
        this.updateSummary();
    }

    regionsView() {
        const s = this.state;
        const gap = Math.round(s.regions.se.prosperity - this.poorestRegion().prosperity);
        return `
            <section class="ch-col">
                <h3 class="ch-col-title">The country, region by region</h3>
                <div class="ch-region-head">
                    <span>Region</span><span>Prosperity</span><span>Approval</span><span>Seats</span><span>Built</span>
                </div>
                ${CH_REGIONS.map(r => {
                    const reg = s.regions[r.key];
                    const seats = this.seatsFor(r, reg.approval);
                    return `<div class="ch-region-row">
                        <span class="ch-region-name">${r.name}</span>
                        <span class="ch-region-prosp">
                            <span class="ch-qbar"><span class="ch-qfill ${this.qualityClass(reg.prosperity)}"
                                style="width:${chClamp(reg.prosperity, 0, 100)}%"></span></span>
                            ${Math.round(reg.prosperity)}
                        </span>
                        <span class="ch-region-app ${this.approvalClass(reg.approval)}">${Math.round(reg.approval)}%</span>
                        <span class="ch-region-seats">${seats}<small>/${r.seats}</small></span>
                        <span class="ch-region-built">${reg.built || '–'}</span>
                    </div>`;
                }).join('')}
                <div class="ch-region-total">
                    Projected: <strong>${this.projectedSeats()}</strong> of ${CH_SEATS_TOTAL} seats
                    — ${this.projectedSeats() >= CH_MAJORITY
                        ? '<span class="ch-win">you would win the election</span>'
                        : `<span class="ch-lose">you would lose (${CH_MAJORITY} needed)</span>`}
                </div>
                <p class="ch-hint">Elections are won on seats, not on the national average. London and the South
                hold ${s.regions.se ? Math.round(281 / CH_SEATS_TOTAL * 100) : 43}% of them, so you can be popular
                there and still lose. The prosperity gap between the South and the poorest region is
                <strong>${gap} points</strong>, and it widens on its own unless you build something.</p>
            </section>`;
    }

    projectsView() {
        const s = this.state;
        const active = s.active.map(p => {
            const def = CH_PROJECTS.find(d => d.id === p.id);
            const pct = Math.round(p.done / p.years * 100);
            return `<div class="ch-proj ch-proj-active">
                <div class="ch-proj-head">
                    <span class="ch-proj-name">${def.icon} ${def.name}</span>
                    <span class="ch-proj-cost">${chMoney(p.cost)}/yr</span>
                </div>
                <div class="ch-proj-bar"><span class="ch-proj-fill" style="width:${pct}%"></span></div>
                <div class="ch-proj-foot">
                    <span>${p.done} of ${p.years} years${p.overran ? ' · <span class="ch-lose">over budget</span>' : ''}</span>
                    <button class="ch-mini-btn" data-cancel="${p.id}">Cancel</button>
                </div>
            </div>`;
        }).join('');

        const available = CH_PROJECTS.filter(p => !s.completed.includes(p.id) && !s.active.some(a => a.id === p.id))
            .map(p => `<div class="ch-proj">
                <div class="ch-proj-head">
                    <span class="ch-proj-name">${p.icon} ${p.name}</span>
                    <span class="ch-proj-cost">${chMoney(p.cost)}/yr × ${p.years}</span>
                </div>
                <p class="ch-proj-blurb">${p.blurb}</p>
                <div class="ch-proj-foot">
                    <span class="ch-proj-where">${this.regionLabel(p.regions)} · +${p.prosperity} prosperity${
                        p.overrun >= 0.3 ? ' · <span class="ch-lose">high overrun risk</span>' : ''}</span>
                    <button class="ch-mini-btn ch-mini-go" data-start="${p.id}">Start</button>
                </div>
            </div>`).join('');

        return `
            <div class="ch-cols">
                <section class="ch-col">
                    <h3 class="ch-col-title">Under construction</h3>
                    ${active || '<p class="ch-hint" style="text-align:left">Nothing being built. The regions notice.</p>'}
                    ${s.completed.length ? `<div class="ch-note">Opened so far: ${s.completed.map(id => {
                        const d = CH_PROJECTS.find(p => p.id === id); return d.icon + ' ' + d.name;
                    }).join(', ')}</div>` : ''}
                </section>
                <section class="ch-col">
                    <h3 class="ch-col-title">Available to start</h3>
                    ${available || '<p class="ch-hint" style="text-align:left">You have built everything there is to build.</p>'}
                </section>
            </div>
            <p class="ch-hint">Projects cost money every year until they open, whether you can afford them or not.
            Cancelling wastes everything already spent and the region will not forget it.</p>`;
    }

    startProject(id) {
        const def = CH_PROJECTS.find(p => p.id === id);
        if (!def || this.state.active.some(a => a.id === id) || this.state.completed.includes(id)) return;
        this.state.active.push({ id, cost: def.cost, years: def.years, done: 0, overran: false });
        this.renderBudget();
    }

    cancelProject(id) {
        const s = this.state;
        const i = s.active.findIndex(a => a.id === id);
        if (i < 0) return;
        const def = CH_PROJECTS.find(p => p.id === id);
        s.active.splice(i, 1);
        this.regionsOf(def).forEach(key => {
            s.regions[key].approval = chClamp(s.regions[key].approval - 9, 0, 100);
            s.regions[key].glow -= 4;
        });
        this.syncApproval();
        this.renderBudget();
    }

    statCard(icon, label, value, tone) {
        return `<div class="ch-stat ch-tone-${tone}">
            <span class="ch-stat-icon">${icon}</span>
            <span class="ch-stat-label">${label}</span>
            <span class="ch-stat-value">${value}</span>
        </div>`;
    }

    deptRow(d) {
        const s = this.state;
        const spend = s.spending[d.key];
        const q = s.quality[d.key];
        return `<div class="ch-row">
            <div class="ch-row-head">
                <span class="ch-row-name">${d.icon} ${d.name}</span>
                <span class="ch-row-val" id="ch-val-${d.key}">${chMoney(spend)}</span>
            </div>
            <input type="range" class="ch-slider" id="ch-sl-${d.key}"
                   min="${d.min}" max="${d.max}" step="5" value="${spend}">
            <div class="ch-row-foot">
                <span class="ch-qwrap"><span class="ch-qbar"><span class="ch-qfill ${this.qualityClass(q)}"
                    style="width:${chClamp(q, 0, 100)}%"></span></span>${d.qLabel} ${Math.round(q)}</span>
                <span class="ch-need">standstill ${chMoney(s.need[d.key])}</span>
            </div>
        </div>`;
    }

    taxRow(t) {
        const rate = this.state.taxes[t.key];
        return `<div class="ch-row">
            <div class="ch-row-head">
                <span class="ch-row-name">${t.icon} ${t.name}</span>
                <span class="ch-row-val" id="ch-val-${t.key}">${rate}${t.unit}</span>
            </div>
            <input type="range" class="ch-slider ch-slider-tax" id="ch-sl-${t.key}"
                   min="${t.min}" max="${t.max}" step="1" value="${rate}">
            <div class="ch-row-foot">
                <span class="ch-yield" id="ch-yield-${t.key}">raises ${chMoney(this.taxYield(t))}</span>
                <span class="ch-need">was ${t.start}${t.unit}</span>
            </div>
        </div>`;
    }

    updateSummary() {
        const t = this.totals();
        const el = this.root.querySelector('#ch-summary');
        if (!el) return;
        const surplus = t.deficit <= 0;
        const scale = chClamp(Math.abs(t.deficit) / 250 * 100, 2, 100);
        el.innerHTML = `
            <div class="ch-sum-grid">
                <div class="ch-sum"><span class="ch-sum-label">Money in</span><span class="ch-sum-value in">${chMoney(t.revenue)}</span></div>
                <div class="ch-sum"><span class="ch-sum-label">Departments</span><span class="ch-sum-value out">${chMoney(t.departments)}</span></div>
                <div class="ch-sum"><span class="ch-sum-label">Projects</span><span class="ch-sum-value out">${chMoney(t.projects)}</span></div>
                <div class="ch-sum"><span class="ch-sum-label">Debt interest</span><span class="ch-sum-value out">${chMoney(t.interest)}</span></div>
                <div class="ch-sum"><span class="ch-sum-label">${surplus ? 'Surplus' : 'Borrowing'}</span>
                    <span class="ch-sum-value ${surplus ? 'in' : 'out'}">${chMoney(Math.abs(t.deficit))}</span></div>
            </div>
            <div class="ch-deficit-bar"><span class="ch-deficit-fill ${surplus ? 'in' : 'out'}" style="width:${scale}%"></span></div>
            <button class="ch-btn ch-btn-primary" id="ch-deliver">Deliver the Budget 📜</button>`;
        el.querySelector('#ch-deliver').addEventListener('click', () => this.deliverBudget());
    }

    // ------------------------------------------------------------ the year
    deliverBudget() {
        this.resetYearShocks();
        const s = this.state;
        this.report = { headlines: [], notes: [], before: this.snapshot() };

        // Cost blowouts come first — they are decisions about money you have
        // already committed — then the year's news. Both resolve before we
        // simulate, because the player's answers change the numbers.
        this.pendingEvents = this.pickOverruns().concat(this.pickEvents());
        this.resolveNextEvent();
    }

    snapshot() {
        const s = this.state;
        return { growth: s.growth, inflation: s.inflation, unemployment: s.unemployment,
                 approval: s.approval, debtRatio: s.debt / s.gdp * 100, quality: this.avgQuality() };
    }

    pickEvents() {
        const s = this.state;
        const pool = [];
        CH_EVENTS.forEach(e => {
            if (e.when && !e.when(s)) return;
            if (s.seenEvents.filter(id => id === e.id).length >= 2) return;  // don't flog the same story
            for (let i = 0; i < (e.weight || 1); i++) pool.push(e);
        });
        const picked = [];
        const count = Math.random() < 0.35 ? 2 : 1;
        while (picked.length < count && pool.length) {
            const e = pool[Math.floor(Math.random() * pool.length)];
            if (!picked.includes(e)) picked.push(e);
            if (pool.every(p => picked.includes(p))) break;
        }
        return picked;
    }

    // A project that has started can blow its budget. Bigger, tunnel-heavier
    // schemes do it more often — which is why the cheap ones are often the
    // better buy even though they sound less impressive.
    pickOverruns() {
        const s = this.state;
        const out = [];
        s.active.forEach(p => {
            if (p.overran || p.done === 0) return;     // no blowout before a spade goes in
            const def = CH_PROJECTS.find(d => d.id === p.id);
            if (Math.random() > def.overrun * 0.55) return;
            p.overran = true;
            const extra = Math.round(p.cost * 0.4);
            out.push({
                id: 'overrun_' + p.id,
                headline: `${def.name} is over budget`,
                body: `The contractors say it cannot be finished at the agreed price. ${Math.round(p.done)} years
                       and ${chMoney(p.done * p.cost)} have already gone into it.`,
                choices: [
                    { label: 'Fund the overrun',
                      detail: `Costs rise to ${chMoney(p.cost + extra)} a year and it opens two years late.`,
                      apply: st => { p.cost += extra; p.years += 2; st.approval -= 2; } },
                    { label: 'Cancel it',
                      detail: 'Everything spent so far is wasted, and the region will not forget.',
                      apply: st => {
                          st.active = st.active.filter(a => a.id !== p.id);
                          this.regionsOf(def).forEach(key => {
                              st.regions[key].approval = chClamp(st.regions[key].approval - 12, 0, 100);
                              st.regions[key].glow -= 6;
                          });
                          this.syncApproval();
                      } }
                ]
            });
        });
        return out;
    }

    resolveNextEvent() {
        const e = this.pendingEvents.shift();
        if (!e) return this.simulateYear();

        this.state.seenEvents.push(e.id);
        if (e.apply) e.apply(this.state);
        this.report.headlines.push(e.headline);

        if (!e.choices) {
            this.report.notes.push(e.body);
            return this.resolveNextEvent();
        }
        this.renderDecision(e);
    }

    renderDecision(e) {
        this.root.innerHTML = `
            <div class="ch-decision">
                <span class="ch-breaking">Breaking</span>
                <h3>${e.headline}</h3>
                <p class="ch-decision-body">${e.body}</p>
                <div class="ch-choices">
                    ${e.choices.map((c, i) => `
                        <button class="ch-choice" data-i="${i}">
                            <span class="ch-choice-label">${c.label}</span>
                            <span class="ch-choice-detail">${c.detail}</span>
                        </button>`).join('')}
                </div>
            </div>`;
        this.root.querySelectorAll('.ch-choice').forEach(btn => {
            btn.addEventListener('click', () => {
                const c = e.choices[parseInt(btn.dataset.i, 10)];
                c.apply(this.state);
                this.report.notes.push(`${e.body} <em>You chose: ${c.label}.</em>`);
                this.resolveNextEvent();
            });
        });
    }

    simulateYear() {
        const s = this.state;
        const t = this.totals();

        // --- growth: infrastructure and schools help, taxes and debt drag ---
        let growth = 1.6 + s.shockGrowth + s.projectGrowth;
        growth += (s.quality.transport - 55) / 55 * 0.7;
        growth += (s.quality.education - 60) / 60 * 0.5;
        growth += (s.quality.energy - 52) / 60 * 0.2;
        CH_TAXES.forEach(tax => { growth -= (s.taxes[tax.key] - tax.start) * tax.drag; });
        growth -= Math.max(0, s.debt / s.gdp - 1.0) * 2.0;
        growth += (Math.random() - 0.5) * 1.6;
        growth = chClamp(growth, -6, 6);

        // --- inflation: borrowing and VAT push it up, a weak economy pulls it down.
        // Borrowing heats prices faster than a surplus cools them, so you cannot
        // simply hoard a surplus and deflate the debt away. ---
        const deficitPressure = t.deficit / s.gdp * 100 - 3.0;
        let inflation = 2.0 + s.shockInflation + s.projectInflation;
        inflation += deficitPressure > 0 ? deficitPressure * 0.30 : deficitPressure * 0.12;
        inflation += (s.taxes.vat - 20) * 0.15;
        inflation += growth * 0.15;
        inflation += (Math.random() - 0.5) * 0.8;
        inflation = chClamp(inflation, 0, 18);

        // --- unemployment tracks growth with a lag, drifting back to the
        // natural rate when growth is steady ---
        let unemployment = s.unemployment
            + (1.8 - growth) * 0.45
            + (4.5 - s.unemployment) * 0.25
            - (s.quality.education - 60) / 200;
        unemployment = chClamp(unemployment, 2.5, 16);

        // --- public services: measured against what standing still costs ---
        const qChanges = {};
        CH_DEPTS.forEach(d => {
            const ratio = s.spending[d.key] / Math.max(1, s.need[d.key]);
            const before = s.quality[d.key];
            let q = before + chClamp((ratio - 1) * 45, -14, 14) - 1.2;   // services decay if you only stand still
            s.quality[d.key] = chClamp(q, 0, 100);
            qChanges[d.key] = s.quality[d.key] - before;
        });

        // --- projects: another year of building, and anything that opens now ---
        s.active.forEach(p => { p.done++; });
        s.active.filter(p => p.done >= p.years).forEach(p => {
            const def = CH_PROJECTS.find(d => d.id === p.id);
            s.completed.push(def.id);
            this.regionsOf(def).forEach(key => {
                const reg = s.regions[key];
                reg.prosperity = chClamp(reg.prosperity + def.prosperity, 0, 100);
                reg.glow += 9;
                reg.built++;
            });
            if (def.quality) {
                Object.keys(def.quality).forEach(k => {
                    s.quality[k] = chClamp(s.quality[k] + def.quality[k], 0, 100);
                });
            }
            if (def.growth) s.projectGrowth += def.growth;
            if (def.inflation) s.projectInflation += def.inflation;
            this.report.headlines.push(`${def.name} opens`);
            this.report.notes.push(`After ${p.years} years of building, ${def.name.toLowerCase()} is finally open.`);
        });
        s.active = s.active.filter(p => p.done < p.years);

        // --- the books ---
        s.debt += t.deficit;
        s.lastDeficit = t.deficit;
        s.gdp = s.gdp * (1 + growth / 100) * (1 + inflation / 100);   // cash GDP: real growth plus prices

        const debtRatio = s.debt / s.gdp;
        let gilt = 3.2 + Math.max(0, debtRatio - 0.9) * 4.0 + Math.max(0, inflation - 2) * 0.35 + s.shockGilt;
        s.gilt = chClamp(s.gilt * 0.4 + gilt * 0.6, 1.5, 15);           // yields move gradually

        // --- next year's standstill costs rise with prices and demand ---
        // Prices plus an ageing population — demand grows about as fast as the
        // economy does, so real-terms growth in the budget is the price of standing still.
        CH_DEPTS.forEach(d => { s.need[d.key] *= (1 + Math.max(0, inflation) / 100 + 0.014); });

        // --- approval ---
        let target = 50;
        target += (this.avgQuality() - 60) * 0.55;
        CH_TAXES.forEach(tax => { target -= (s.taxes[tax.key] - tax.start) * tax.anger; });
        target += growth * 2.2;
        target -= Math.max(0, unemployment - 4.5) * 2.2;
        target -= Math.max(0, inflation - 3) * 2.6;
        target -= Math.max(0, debtRatio - 1.1) * 12;
        // A visibly divided country costs you votes everywhere, including in the
        // rich part — which is why building only where you are already popular
        // is not the easy win it looks like.
        const gap = s.regions.se.prosperity - this.poorestRegion().prosperity;
        target -= Math.max(0, gap - 24) * 0.20;
        target = chClamp(target, 0, 100);

        // --- regions: national mood, then how it lands locally ---
        const rChanges = {};
        CH_REGIONS.forEach(r => {
            const reg = s.regions[r.key];
            const before = reg.prosperity;
            let p = before + (growth - 1.5) * 0.35 + r.drift + (s.quality.transport - 55) / 90;
            p += s.active.filter(a => this.regionsOf(CH_PROJECTS.find(d => d.id === a.id)).includes(r.key)).length * 0.3;
            reg.prosperity = chClamp(p, 5, 100);
            rChanges[r.key] = reg.prosperity - before;

            // A region judges you on how it is doing, not on the national average.
            const rTarget = target + (reg.prosperity - 50) * 0.30 + rChanges[r.key] * 2.5 + reg.glow;
            reg.approval = chClamp(reg.approval + (chClamp(rTarget, 0, 100) - reg.approval) * 0.45, 0, 100);
            reg.glow *= 0.5;    // the goodwill from opening something fades
        });
        this.syncApproval();
        this.report.rChanges = rChanges;

        s.growth = growth;
        s.inflation = inflation;
        s.unemployment = unemployment;
        s.history.push({ year: s.year, deficit: t.deficit, approval: s.approval, growth });

        this.report.qChanges = qChanges;
        this.report.totals = t;
        this.report.after = this.snapshot();
        this.saveBest();

        this.renderResults();
    }

    // ------------------------------------------------------------ results
    renderResults() {
        const s = this.state;
        const r = this.report;
        const lead = r.headlines[0] || this.autoHeadline();
        const delta = (a, b, dp = 1, invert = false) => {
            const d = b - a;
            const cls = (invert ? -d : d) > 0.05 ? 'up' : (invert ? -d : d) < -0.05 ? 'down' : 'flat';
            const sign = d > 0 ? '+' : '';
            return `<span class="ch-delta ${cls}">${sign}${d.toFixed(dp)}</span>`;
        };

        this.root.innerHTML = `
            <div class="ch-paper">
                <div class="ch-paper-masthead">
                    <span>The Daily Ledger</span>
                    <span>${s.year} Budget</span>
                </div>
                <h3 class="ch-paper-lead">${lead}</h3>
                ${r.headlines.slice(1).map(h => `<h4 class="ch-paper-sub">${h}</h4>`).join('')}
                ${r.notes.map(n => `<p class="ch-paper-body">${n}</p>`).join('')}
                <p class="ch-paper-body">You ${r.totals.deficit > 0 ? 'borrowed' : 'ran a surplus of'}
                    <strong>${chMoney(Math.abs(r.totals.deficit))}</strong>, taking the national debt to
                    <strong>${Math.round(s.debt / s.gdp * 100)}% of GDP</strong>.</p>
            </div>

            <div class="ch-results-grid">
                <div class="ch-result"><span>Growth</span><strong>${chPct(s.growth)}</strong>${delta(r.before.growth, r.after.growth)}</div>
                <div class="ch-result"><span>Inflation</span><strong>${chPct(s.inflation)}</strong>${delta(r.before.inflation, r.after.inflation, 1, true)}</div>
                <div class="ch-result"><span>Unemployment</span><strong>${chPct(s.unemployment)}</strong>${delta(r.before.unemployment, r.after.unemployment, 1, true)}</div>
                <div class="ch-result"><span>Debt</span><strong>${Math.round(r.after.debtRatio)}%</strong>${delta(r.before.debtRatio, r.after.debtRatio, 0, true)}</div>
                <div class="ch-result"><span>Services</span><strong>${Math.round(r.after.quality)}</strong>${delta(r.before.quality, r.after.quality, 0)}</div>
                <div class="ch-result"><span>Approval</span><strong>${Math.round(s.approval)}%</strong>${delta(r.before.approval, r.after.approval, 0)}</div>
            </div>

            <div class="ch-dept-changes">
                ${CH_DEPTS.map(d => {
                    const c = this.report.qChanges[d.key];
                    const cls = c > 0.5 ? 'up' : c < -0.5 ? 'down' : 'flat';
                    return `<span class="ch-chip ${cls}">${d.icon} ${d.qLabel} ${c > 0 ? '+' : ''}${c.toFixed(0)}</span>`;
                }).join('')}
            </div>

            <div class="ch-dept-changes">
                ${CH_REGIONS.map(r => {
                    const c = (this.report.rChanges || {})[r.key] || 0;
                    const cls = c > 0.05 ? 'up' : c < -0.05 ? 'down' : 'flat';
                    return `<span class="ch-chip ${cls}">🗺️ ${r.name} ${c > 0 ? '+' : ''}${c.toFixed(1)}</span>`;
                }).join('')}
            </div>

            <p class="ch-seatline">If an election were held now you would win
                <strong>${this.projectedSeats()}</strong> of ${CH_SEATS_TOTAL} seats
                (${CH_MAJORITY} needed for a majority).</p>

            <button class="ch-btn ch-btn-primary" id="ch-next">Continue →</button>`;

        this.root.querySelector('#ch-next').addEventListener('click', () => this.endYear());
    }

    autoHeadline() {
        const s = this.state;
        if (s.inflation > 7) return 'Prices soar as inflation runs out of control';
        if (s.growth > 3) return 'Britain booming — fastest growth in a generation';
        if (s.growth < 0) return 'Britain slides into recession';
        if (s.debt / s.gdp > 1.4) return 'Debt mountain grows as Chancellor borrows again';
        if (this.avgQuality() > 70) return 'Public services transformed, says watchdog';
        if (this.avgQuality() < 45) return 'Services crumbling after years of squeeze';
        return 'Chancellor delivers a steady-as-she-goes Budget';
    }

    endYear() {
        const s = this.state;
        s.year++;
        const years = s.year - CH_START_YEAR;

        if (s.debt / s.gdp > 2.0) return this.renderGameOver('bankrupt');
        if (s.approval < 20) return this.renderGameOver('sacked');
        if (years % CH_TERM_LENGTH === 0) return this.renderElection();
        if (!s.endless && years >= CH_MAX_YEARS) return this.renderMilestone();

        this.renderBudget();
    }

    renderElection() {
        const s = this.state;
        const seats = this.projectedSeats();
        const won = seats >= CH_MAJORITY;
        const years = s.year - CH_START_YEAR;
        this.lastResult = seats;
        if (!won) return this.renderGameOver('defeated');
        if (!s.endless && years >= CH_MAX_YEARS) return this.renderMilestone();

        this.root.innerHTML = `
            <div class="ch-endcard win">
                <div class="ch-end-icon">🗳️</div>
                <h3>General Election: your party wins</h3>
                <p>You take <strong>${seats}</strong> of ${CH_SEATS_TOTAL} seats on ${Math.round(s.approval)}%
                approval — a majority of ${seats - (CH_SEATS_TOTAL - seats)}. The Prime Minister keeps you
                at the Treasury for another ${CH_TERM_LENGTH} years.</p>
                ${this.seatChart()}
                <p class="ch-end-sub">${years} years served · debt ${Math.round(s.debt / s.gdp * 100)}% of GDP ·
                services ${Math.round(this.avgQuality())}/100</p>
                <button class="ch-btn ch-btn-primary" id="ch-next-term">Back to work 📕</button>
            </div>`;
        this.root.querySelector('#ch-next-term').addEventListener('click', () => this.renderBudget());
    }

    seatChart() {
        const s = this.state;
        return `<div class="ch-seatchart">
            ${CH_REGIONS.map(r => {
                const won = this.seatsFor(r, s.regions[r.key].approval);
                const pct = Math.round(won / r.seats * 100);
                return `<div class="ch-seatrow">
                    <span class="ch-seatname">${r.name}</span>
                    <span class="ch-seatbar"><span class="ch-seatfill ${pct >= 50 ? 'win' : 'lose'}"
                        style="width:${pct}%"></span></span>
                    <span class="ch-seatnum">${won}/${r.seats}</span>
                </div>`;
            }).join('')}
        </div>`;
    }

    // Reaching CH_MAX_YEARS is the win — but instead of ending the game, we
    // celebrate it and let the player carry on into endless mode to see how
    // long they can really last. Elections and disasters still apply; there is
    // just no finish line any more.
    renderMilestone() {
        const s = this.state;
        const years = s.year - CH_START_YEAR;
        this.saveBest();
        this.root.innerHTML = `
            <div class="ch-endcard win">
                <div class="ch-end-icon">🏆</div>
                <h3>${years} years — you've done it!</h3>
                <p>You are the <strong>longest-serving Chancellor in history</strong>. Four elections won and you are
                still standing at the Treasury. They will name a room after you.</p>
                <p>But the red box is still on your desk. You can retire a legend right now — or stay in office and see
                just how long you can keep the country running. There is no finish line from here: the job only ends
                when the voters, the markets, or the Prime Minister decide it does.</p>
                <div class="ch-final">
                    <div><span>Years in office</span><strong>${years}</strong></div>
                    <div><span>Approval</span><strong>${Math.round(s.approval)}%</strong></div>
                    <div><span>Debt</span><strong>${Math.round(s.debt / s.gdp * 100)}%</strong></div>
                    <div><span>Services</span><strong>${Math.round(this.avgQuality())}/100</strong></div>
                </div>
                <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin-top:6px;">
                    <button class="ch-btn ch-btn-primary" id="ch-carry">Carry on in office →</button>
                    <button class="ch-btn" id="ch-retire"
                        style="background:transparent; color:var(--muted); border:1px solid var(--border);">Retire a legend 🏆</button>
                </div>
            </div>`;
        this.root.querySelector('#ch-carry').addEventListener('click', () => {
            s.endless = true;
            this.renderBudget();
        });
        this.root.querySelector('#ch-retire').addEventListener('click', () => this.renderGameOver('legend'));
    }

    renderGameOver(reason) {
        const s = this.state;
        const years = s.year - CH_START_YEAR;
        this.saveBest();
        const cards = {
            sacked:    { icon: '📦', title: 'You have been sacked', win: false,
                         text: `With approval at ${Math.round(s.approval)}% the Prime Minister needed a scapegoat. You were it.` },
            defeated:  { icon: '🗳️', title: 'Voted out', win: false,
                         text: `Your party took only ${this.lastResult} of ${CH_SEATS_TOTAL} seats — ${CH_MAJORITY} were
                                needed. ${this.weakestRegionName()} turned against you. The new government has other plans.` },
            bankrupt:  { icon: '📉', title: 'The markets have revolted', win: false,
                         text: `Debt reached ${Math.round(s.debt / s.gdp * 100)}% of GDP. Nobody will lend to Britain at any price, and you are out.` },
            legend:    { icon: '🏆', title: 'The longest-serving Chancellor in history', win: true,
                         text: `${CH_MAX_YEARS} years, four elections, and you are still standing. They will name a room after you.` }
        };
        const c = cards[reason];
        this.root.innerHTML = `
            <div class="ch-endcard ${c.win ? 'win' : 'lose'}">
                <div class="ch-end-icon">${c.icon}</div>
                <h3>${c.title}</h3>
                <p>${c.text}</p>
                <div class="ch-final">
                    <div><span>Years in office</span><strong>${years}</strong></div>
                    <div><span>Final approval</span><strong>${Math.round(s.approval)}%</strong></div>
                    <div><span>Debt</span><strong>${Math.round(s.debt / s.gdp * 100)}%</strong></div>
                    <div><span>Services</span><strong>${Math.round(this.avgQuality())}/100</strong></div>
                </div>
                <p class="ch-end-sub">Best run: ${this.best.years} years on ${this.best.approval}% approval.</p>
                <button class="ch-btn ch-btn-primary" id="ch-again">Try again</button>
            </div>`;
        this.root.querySelector('#ch-again').addEventListener('click', () => {
            this.newGame();
            this.renderBudget();
        });
    }

    // ------------------------------------------------------------ helpers
    avgQuality() {
        const s = this.state;
        return CH_DEPTS.reduce((sum, d) => sum + s.quality[d.key], 0) / CH_DEPTS.length;
    }

    regionsOf(def) {
        return def.regions === 'all' ? CH_REGIONS.map(r => r.key) : def.regions;
    }

    regionLabel(regions) {
        if (regions === 'all') return 'Nationwide';
        return regions.map(k => CH_REGIONS.find(r => r.key === k).name).join(' & ');
    }

    // First past the post amplifies swing: a few points of approval either side
    // of the mid-forties decides far more seats than it looks like it should.
    seatsFor(r, approval) {
        return Math.round(r.seats * chClamp(0.5 + (approval - 40) * 0.022, 0, 1));
    }

    projectedSeats() {
        return CH_REGIONS.reduce((n, r) => n + this.seatsFor(r, this.state.regions[r.key].approval), 0);
    }

    // The headline approval figure is the seat-weighted national mood.
    syncApproval() {
        const s = this.state;
        const total = CH_REGIONS.reduce((n, r) => n + r.seats * s.regions[r.key].approval, 0);
        s.approval = chClamp(total / CH_SEATS_TOTAL, 0, 100);
    }

    weakestRegionName() {
        const s = this.state;
        return CH_REGIONS.reduce((a, b) =>
            s.regions[a.key].approval <= s.regions[b.key].approval ? a : b).name;
    }

    poorestRegion() {
        const s = this.state;
        return CH_REGIONS.map(r => s.regions[r.key]).reduce((a, b) => a.prosperity <= b.prosperity ? a : b);
    }
    qualityClass(q) { return q >= 65 ? 'good' : q >= 45 ? 'mid' : 'bad'; }
    approvalClass(a) { return a >= 45 ? 'good' : a >= 30 ? 'mid' : 'bad'; }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(() => new Chancellor(document.getElementById('ch-root')), 100));
} else {
    setTimeout(() => new Chancellor(document.getElementById('ch-root')), 100);
}
