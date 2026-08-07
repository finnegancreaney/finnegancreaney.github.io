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
        const spending = {}, need = {}, quality = {}, taxes = {};
        CH_DEPTS.forEach(d => { spending[d.key] = d.start; need[d.key] = d.start; quality[d.key] = d.quality; });
        CH_TAXES.forEach(t => { taxes[t.key] = t.start; });

        this.state = {
            year: CH_START_YEAR,
            gdp: 2800,
            debt: 2600,
            gilt: 4.0,
            growth: 1.6,
            inflation: 2.4,
            unemployment: 4.2,
            approval: 45,
            extraRevenue: 0,       // permanent gains, e.g. the HMRC crackdown
            lastDeficit: 100,
            spending, need, quality, taxes,
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
        const interest = s.debt * s.gilt / 100;
        const spending = departments + interest + s.oneOffCost;
        return { revenue, departments, interest, spending, deficit: spending - revenue };
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
                <p>There is a general election every ${CH_TERM_LENGTH} years. Lose it and you are finished.
                Survive ${CH_MAX_YEARS} years and you become the longest-serving Chancellor in history.</p>
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

            <div class="ch-summary" id="ch-summary"></div>
            <p class="ch-hint">Departments need more money every year just to stand still — inflation and an ageing
            population see to that. A frozen budget is a cut.</p>`;

        CH_DEPTS.forEach(d => {
            const sl = this.root.querySelector('#ch-sl-' + d.key);
            sl.addEventListener('input', () => {
                s.spending[d.key] = parseInt(sl.value, 10);
                this.root.querySelector('#ch-val-' + d.key).textContent = chMoney(s.spending[d.key]);
                this.updateSummary();
            });
        });
        CH_TAXES.forEach(t => {
            const sl = this.root.querySelector('#ch-sl-' + t.key);
            sl.addEventListener('input', () => {
                s.taxes[t.key] = parseInt(sl.value, 10);
                this.root.querySelector('#ch-val-' + t.key).textContent = s.taxes[t.key] + t.unit;
                this.root.querySelector('#ch-yield-' + t.key).textContent = 'raises ' + chMoney(this.taxYield(t));
                this.updateSummary();
            });
        });
        this.updateSummary();
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

        // Pick this year's news, then let any decisions resolve before we
        // simulate — the player's answers change the numbers.
        this.pendingEvents = this.pickEvents();
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
        let growth = 1.6 + s.shockGrowth;
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
        let inflation = 2.0 + s.shockInflation;
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
        s.approval = chClamp(s.approval + (chClamp(target, 0, 100) - s.approval) * 0.45, 0, 100);

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
        if (years >= CH_MAX_YEARS) return this.renderGameOver('legend');

        this.renderBudget();
    }

    renderElection() {
        const s = this.state;
        const won = s.approval >= 40;
        const years = s.year - CH_START_YEAR;
        if (!won) return this.renderGameOver('defeated');
        if (years >= CH_MAX_YEARS) return this.renderGameOver('legend');

        this.root.innerHTML = `
            <div class="ch-endcard win">
                <div class="ch-end-icon">🗳️</div>
                <h3>General Election: your party wins</h3>
                <p>On ${Math.round(s.approval)}% approval the country has given you another
                ${CH_TERM_LENGTH} years. The Prime Minister keeps you at the Treasury.</p>
                <p class="ch-end-sub">${years} years served · debt ${Math.round(s.debt / s.gdp * 100)}% of GDP ·
                services ${Math.round(this.avgQuality())}/100</p>
                <button class="ch-btn ch-btn-primary" id="ch-next-term">Back to work 📕</button>
            </div>`;
        this.root.querySelector('#ch-next-term').addEventListener('click', () => this.renderBudget());
    }

    renderGameOver(reason) {
        const s = this.state;
        const years = s.year - CH_START_YEAR;
        this.saveBest();
        const cards = {
            sacked:    { icon: '📦', title: 'You have been sacked', win: false,
                         text: `With approval at ${Math.round(s.approval)}% the Prime Minister needed a scapegoat. You were it.` },
            defeated:  { icon: '🗳️', title: 'Voted out', win: false,
                         text: `Your party lost the general election on ${Math.round(s.approval)}% approval. The new government has other plans.` },
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
    qualityClass(q) { return q >= 65 ? 'good' : q >= 45 ? 'mid' : 'bad'; }
    approvalClass(a) { return a >= 45 ? 'good' : a >= 30 ? 'mid' : 'bad'; }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(() => new Chancellor(document.getElementById('ch-root')), 100));
} else {
    setTimeout(() => new Chancellor(document.getElementById('ch-root')), 100);
}
