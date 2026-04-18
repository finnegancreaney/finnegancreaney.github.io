// ==================================================================
// Battle Simulator
// ==================================================================

const GRID_W = 10;
const GRID_H = 12;
const TILE = 50;
const TICK_MS = 80;
const MAX_BATTLE_TICKS = 600;
const LOG_MAX_ENTRIES = 100;
const SAVE_KEY = 'battleSimState_v2';
const SELL_REFUND = 0.5;
const UPGRADE_MAX = 5;

const UNIT_TYPES = {
    barbarian: { hp: 50,  dmg: 8,  range: 1, speed: 0.09, cooldown: 10, cost: 50,  icon: '🗡️', color: '#d35400' },
    archer:    { hp: 30,  dmg: 12, range: 3, speed: 0.10, cooldown: 10, cost: 75,  icon: '🏹', color: '#27ae60' },
    dragon:    { hp: 150, dmg: 25, range: 5, speed: 0.14, cooldown: 12, cost: 200, icon: '🐉', color: '#c0392b' },
    wizard:    { hp: 60,  dmg: 30, range: 4, speed: 0.08, cooldown: 14, cost: 150, icon: '🧙', color: '#8e44ad' }
};

const BUILDING_TYPES = {
    townhall:       { size: 3, hp: 250, dmg: 0,  range: 0, cooldown: 0,  cost: 1000, icon: '🏰', color: '#f1c40f' },
    barracks:       { size: 3, hp: 100, dmg: 0,  range: 0, cooldown: 0,  cost: 500,  icon: '🛡️', color: '#95a5a6' },
    'archer-tower': { size: 2, hp: 80,  dmg: 15, range: 5, cooldown: 10, cost: 800,  icon: '🏹', color: '#3498db' },
    cannon:         { size: 3, hp: 120, dmg: 30, range: 6, cooldown: 15, cost: 1200, icon: '🔫', color: '#7f8c8d' },
    wall:           { size: 1, hp: 100, dmg: 0,  range: 0, cooldown: 0,  cost: 100,  icon: '🧱', color: '#6d4c2e' },
    storage:        { size: 2, hp: 60,  dmg: 0,  range: 0, cooldown: 0,  cost: 600,  icon: '📦', color: '#e67e22' }
};

const UPGRADE_COSTS = {
    barbarian: 300,
    archer:    400,
    dragon:    600,
    wizard:    450,
    tower:     500,
    wall:      200
};

class BattleSimulator {
    constructor() {
        this.canvas = document.getElementById('battleCanvas');
        if (!this.canvas) {
            console.error('Battle canvas not found!');
            return;
        }
        this.ctx = this.canvas.getContext('2d');

        // Persistent state
        this.gold = 15000;
        this.elixir = 10000;
        this.buildings = [];
        this.units = [];
        this.upgrades = { barbarian: 0, archer: 0, dragon: 0, wizard: 0, tower: 0, wall: 0 };
        this.stats = { battles: 0, attackerWins: 0, defenderWins: 0 };

        // Transient
        this.selectedBuilding = null;
        this.hoveredTile = null;
        this.isAttacking = false;
        this.battleTick = 0;
        this.battleUnits = [];
        this.battleBuildings = [];
        this.attackFlashes = [];
        this._battleInterval = null;

        this.load();
        this.setupEventListeners();
        this.updateUI();
        this.addLog(`🎮 Ready! ${this.buildings.length} buildings saved. ${this.units.length} units trained.`, 'defense');
        this.startRenderLoop();
    }

    // ----- Persistence -----
    save() {
        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify({
                gold: this.gold,
                elixir: this.elixir,
                buildings: this.buildings,
                units: this.units,
                upgrades: this.upgrades,
                stats: this.stats
            }));
        } catch (err) {
            console.warn('Could not save state:', err);
        }
    }

    load() {
        try {
            const raw = localStorage.getItem(SAVE_KEY);
            if (!raw) return;
            const data = JSON.parse(raw);
            this.gold = data.gold ?? this.gold;
            this.elixir = data.elixir ?? this.elixir;
            this.buildings = Array.isArray(data.buildings) ? data.buildings : [];
            this.units = Array.isArray(data.units) ? data.units : [];
            this.upgrades = { ...this.upgrades, ...(data.upgrades || {}) };
            this.stats = { ...this.stats, ...(data.stats || {}) };
        } catch (err) {
            console.warn('Could not load state:', err);
        }
    }

    // ----- Event listeners -----
    setupEventListeners() {
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        this.canvas.addEventListener('contextmenu', (e) => this.handleCanvasRightClick(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleCanvasHover(e));
        this.canvas.addEventListener('mouseleave', () => { this.hoveredTile = null; });

        document.querySelectorAll('.building-item').forEach(item => {
            item.addEventListener('click', () => this.selectBuilding(item.dataset.building));
        });

        document.querySelectorAll('.train-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const unitType = btn.dataset.unit;
                const input = document.getElementById(`${unitType}-count`);
                const count = parseInt(input.value, 10) || 0;
                this.trainUnits(unitType, count);
            });
        });

        document.querySelectorAll('.upgrade-btn').forEach(btn => {
            btn.addEventListener('click', () => this.purchaseUpgrade(btn.dataset.upgrade));
        });

        document.getElementById('clearBase').addEventListener('click', () => this.clearBase());
        document.getElementById('randomLayout').addEventListener('click', () => this.randomLayout());
        document.getElementById('testAttack').addEventListener('click', () => this.startBattle());

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(btn.dataset.tab).classList.add('active');
            });
        });
    }

    // ----- Canvas input -----
    pixelToTile(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        return {
            x: Math.floor(((e.clientX - rect.left) * scaleX) / TILE),
            y: Math.floor(((e.clientY - rect.top) * scaleY) / TILE)
        };
    }

    handleCanvasClick(e) {
        if (this.isAttacking) return;
        if (!this.selectedBuilding) {
            this.addLog('Select a building first.', 'attack');
            return;
        }
        const { x, y } = this.pixelToTile(e);
        this.placeBuilding(this.selectedBuilding, x, y);
    }

    handleCanvasRightClick(e) {
        e.preventDefault();
        if (this.isAttacking) return;
        const { x, y } = this.pixelToTile(e);
        const target = this.buildings.find(b =>
            x >= b.x && x < b.x + b.size && y >= b.y && y < b.y + b.size
        );
        if (!target) return;
        const refund = Math.floor(BUILDING_TYPES[target.type].cost * SELL_REFUND);
        this.buildings = this.buildings.filter(b => b !== target);
        this.gold += refund;
        this.addLog(`Sold ${target.type} for ${refund}🪙`, 'defense');
        this.updateUI();
        this.save();
    }

    handleCanvasHover(e) {
        this.hoveredTile = this.pixelToTile(e);
    }

    // ----- Selection / placement -----
    selectBuilding(type) {
        this.selectedBuilding = type;
        document.querySelectorAll('.building-item').forEach(item => {
            const active = item.dataset.building === type;
            item.style.opacity = active ? '1' : '0.6';
            item.style.outline = active ? '2px solid #667eea' : 'none';
        });
    }

    placeBuilding(type, x, y) {
        const def = BUILDING_TYPES[type];
        if (!def) return;
        if (this.gold < def.cost) { this.addLog('Not enough gold!', 'attack'); return; }
        if (!this.canPlaceBuilding(x, y, def.size)) { this.addLog('Cannot place here!', 'attack'); return; }

        let hp = def.hp;
        if (type === 'wall') hp += 50 * this.upgrades.wall;

        this.gold -= def.cost;
        this.buildings.push({ type, x, y, size: def.size, hp, maxHp: hp });
        this.updateUI();
        this.addLog(`Placed ${type} (${def.cost}🪙)`, 'defense');
        this.save();
    }

    canPlaceBuilding(x, y, size) {
        for (let bx = x; bx < x + size; bx++) {
            for (let by = y; by < y + size; by++) {
                if (bx < 0 || bx >= GRID_W || by < 0 || by >= GRID_H) return false;
                for (const b of this.buildings) {
                    if (bx >= b.x && bx < b.x + b.size && by >= b.y && by < b.y + b.size) return false;
                }
            }
        }
        return true;
    }

    // ----- Training / upgrades -----
    trainUnits(type, count) {
        if (this.isAttacking) { this.addLog('Wait for battle to end.', 'attack'); return; }
        if (count <= 0) return;
        const def = UNIT_TYPES[type];
        const totalCost = def.cost * count;
        if (this.elixir < totalCost) { this.addLog('Not enough elixir!', 'attack'); return; }

        this.elixir -= totalCost;
        const bonus = (this.upgrades[type] || 0) * 5;
        for (let i = 0; i < count; i++) {
            this.units.push({
                type,
                hp: def.hp,
                maxHp: def.hp,
                dmg: def.dmg + bonus,
                range: def.range,
                speed: def.speed,
                icon: def.icon
            });
        }
        document.getElementById(`${type}-count`).value = 0;
        this.updateUI();
        this.addLog(`Trained ${count} ${type}(s)`, 'defense');
        this.save();
    }

    purchaseUpgrade(type) {
        const cost = UPGRADE_COSTS[type];
        if (cost == null) return;
        if ((this.upgrades[type] || 0) >= UPGRADE_MAX) { this.addLog('Already max level!', 'attack'); return; }
        if (this.elixir < cost) { this.addLog('Not enough elixir!', 'attack'); return; }

        this.elixir -= cost;
        this.upgrades[type] = (this.upgrades[type] || 0) + 1;
        this.updateUI();
        this.addLog(`Upgraded ${type} → level ${this.upgrades[type]}`, 'defense');
        this.save();
    }

    // ----- Base controls -----
    clearBase() {
        if (this.isAttacking) return;
        const refund = this.buildings.reduce((sum, b) =>
            sum + Math.floor(BUILDING_TYPES[b.type].cost * SELL_REFUND), 0);
        this.buildings = [];
        this.gold += refund;
        this.addLog(`Base cleared. Refunded ${refund}🪙`, 'defense');
        this.updateUI();
        this.save();
    }

    randomLayout() {
        if (this.isAttacking) return;
        if (this.gold < 500) { this.addLog('Need 500🪙 for random layout.', 'attack'); return; }
        this.gold -= 500;
        this.buildings = [];
        const types = ['townhall', 'archer-tower', 'cannon', 'wall', 'storage', 'barracks', 'wall', 'wall'];
        for (let i = 0; i < 15; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            const size = BUILDING_TYPES[type].size;
            for (let attempt = 0; attempt < 20; attempt++) {
                const x = Math.floor(Math.random() * (GRID_W - size + 1));
                const y = Math.floor(Math.random() * (GRID_H - size + 1));
                if (this.canPlaceBuilding(x, y, size)) {
                    let hp = BUILDING_TYPES[type].hp;
                    if (type === 'wall') hp += 50 * this.upgrades.wall;
                    this.buildings.push({ type, x, y, size, hp, maxHp: hp });
                    break;
                }
            }
        }
        this.addLog('Random layout generated.', 'defense');
        this.updateUI();
        this.save();
    }

    // ----- Battle -----
    startBattle() {
        if (this.isAttacking) return;
        if (this.units.length === 0) { this.addLog('No units to attack with!', 'attack'); return; }
        if (this.buildings.length === 0) { this.addLog('No base to attack!', 'attack'); return; }

        this.isAttacking = true;
        this.battleTick = 0;
        this.attackFlashes = [];
        this.stats.battles++;

        this.battleBuildings = this.buildings.map(b => ({ ...b, cooldown: 0, hp: b.maxHp }));
        this.battleUnits = this.units.map(u => ({
            ...u,
            x: 0.5 + Math.random() * (GRID_W - 1),
            y: 0,
            cooldown: 0
        }));

        this.addLog(`🎬 Battle start! ${this.battleUnits.length} units vs ${this.battleBuildings.length} buildings`, 'attack');
        this._battleInterval = setInterval(() => this.battleStep(), TICK_MS);
    }

    battleStep() {
        this.battleTick++;
        const towerMult = 1 + 0.2 * this.upgrades.tower;

        // Units: move + attack
        for (const u of this.battleUnits) {
            if (u.hp <= 0) continue;
            if (u.cooldown > 0) u.cooldown--;

            const target = this.findNearestBuilding(u);
            if (!target) continue;

            const tcx = target.x + target.size / 2 - 0.5;
            const tcy = target.y + target.size / 2 - 0.5;
            const dx = tcx - u.x;
            const dy = tcy - u.y;
            const dist = Math.hypot(dx, dy);

            // Attack range is measured edge-to-center; subtract half size
            const effRange = u.range + target.size / 2 - 0.5;

            if (dist <= effRange) {
                if (u.cooldown <= 0) {
                    target.hp -= u.dmg;
                    u.cooldown = UNIT_TYPES[u.type].cooldown;
                    this.attackFlashes.push({
                        from: { x: u.x + 0.5, y: u.y + 0.5 },
                        to:   { x: target.x + target.size / 2, y: target.y + target.size / 2 },
                        kind: 'unit', ttl: 3
                    });
                }
            } else if (dist > 0) {
                u.x += (dx / dist) * u.speed;
                u.y += (dy / dist) * u.speed;
            }
        }

        // Buildings: attack in range
        for (const b of this.battleBuildings) {
            if (b.hp <= 0) continue;
            const def = BUILDING_TYPES[b.type];
            if (def.dmg <= 0) continue;
            if (b.cooldown > 0) b.cooldown--;

            const bx = b.x + b.size / 2 - 0.5;
            const by = b.y + b.size / 2 - 0.5;
            const target = this.findNearestUnitFrom(bx, by);
            if (!target) continue;

            const dist = Math.hypot(target.x - bx, target.y - by);
            if (dist <= def.range && b.cooldown <= 0) {
                target.hp -= def.dmg * towerMult;
                b.cooldown = def.cooldown;
                this.attackFlashes.push({
                    from: { x: b.x + b.size / 2, y: b.y + b.size / 2 },
                    to:   { x: target.x + 0.5, y: target.y + 0.5 },
                    kind: 'building', ttl: 3
                });
            }
        }

        // Cleanup dead
        const deadUnits = this.battleUnits.filter(u => u.hp <= 0);
        const deadBldgs = this.battleBuildings.filter(b => b.hp <= 0);
        this.battleUnits = this.battleUnits.filter(u => u.hp > 0);
        this.battleBuildings = this.battleBuildings.filter(b => b.hp > 0);
        for (const b of deadBldgs) this.addLog(`💥 ${b.type} destroyed!`, 'damage');
        if (deadUnits.length > 0 && this.battleTick % 10 === 0) {
            this.addLog(`${deadUnits.length} unit(s) fell this tick.`, 'damage');
        }

        this.attackFlashes = this.attackFlashes.filter(f => --f.ttl > 0);

        // End conditions
        const hadTownHall = this.buildings.some(b => b.type === 'townhall');
        const townHallAlive = this.battleBuildings.some(b => b.type === 'townhall');

        if (this.battleUnits.length === 0) { this.endBattle('defense'); return; }
        if (hadTownHall && !townHallAlive) { this.endBattle('attack'); return; }
        if (this.battleBuildings.length === 0) { this.endBattle('attack'); return; }
        if (this.battleTick >= MAX_BATTLE_TICKS) {
            const destroyedPct = 1 - this.battleBuildings.length / this.buildings.length;
            this.endBattle(destroyedPct >= 0.5 ? 'attack' : 'defense');
        }
    }

    findNearestBuilding(u) {
        let best = null, bestD = Infinity;
        for (const b of this.battleBuildings) {
            if (b.hp <= 0) continue;
            const d = Math.hypot(u.x - (b.x + b.size / 2 - 0.5), u.y - (b.y + b.size / 2 - 0.5));
            if (d < bestD) { bestD = d; best = b; }
        }
        return best;
    }

    findNearestUnitFrom(bx, by) {
        let best = null, bestD = Infinity;
        for (const u of this.battleUnits) {
            if (u.hp <= 0) continue;
            const d = Math.hypot(u.x - bx, u.y - by);
            if (d < bestD) { bestD = d; best = u; }
        }
        return best;
    }

    endBattle(winner) {
        clearInterval(this._battleInterval);
        this._battleInterval = null;
        this.isAttacking = false;

        if (winner === 'attack') {
            this.stats.attackerWins++;
            this.gold += 2000;
            this.elixir += 1000;
            this.addLog('🔴 BASE DESTROYED! Your army broke through. +2000🪙 +1000⚡', 'attack');
        } else {
            this.stats.defenderWins++;
            this.gold += 500;
            this.addLog('🟢 BASE HELD! Defenses succeeded. +500🪙', 'defense');
        }

        this.units = [];
        this.battleUnits = [];
        this.battleBuildings = [];
        this.attackFlashes = [];
        this.updateUI();
        this.save();
    }

    // ----- Logging + UI -----
    addLog(message, type = '') {
        const logEl = document.getElementById('battleLog');
        if (!logEl) return;
        const entry = document.createElement('p');
        entry.className = `log-entry ${type}`;
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logEl.appendChild(entry);
        while (logEl.children.length > LOG_MAX_ENTRIES) logEl.removeChild(logEl.firstChild);
        logEl.scrollTop = logEl.scrollHeight;
    }

    updateUI() {
        const set = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };

        document.querySelectorAll('[id$="-gold"]').forEach(e => e.textContent = Math.floor(this.gold));
        document.querySelectorAll('[id$="-elixir"]').forEach(e => e.textContent = Math.floor(this.elixir));

        const townhall = this.buildings.find(b => b.type === 'townhall');
        document.querySelectorAll('[id$="-hp"]').forEach(e => e.textContent = townhall ? Math.floor(townhall.hp) : 0);

        set('total-units', this.units.length);
        set('army-power', this.units.reduce((s, u) => s + u.dmg, 0));

        Object.keys(this.upgrades).forEach(key => set(`${key}-level`, this.upgrades[key]));
    }

    // ----- Render -----
    startRenderLoop() {
        const loop = () => { this.render(); requestAnimationFrame(loop); };
        requestAnimationFrame(loop);
    }

    render() {
        const page = document.getElementById('battle');
        if (!page || !page.classList.contains('active')) return;

        const { ctx, canvas } = this;
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#87CEEB');
        grad.addColorStop(1, '#E0F6FF');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = 'rgba(0,0,0,0.08)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= GRID_W; i++) {
            ctx.beginPath();
            ctx.moveTo(i * TILE, 0); ctx.lineTo(i * TILE, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i <= GRID_H; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * TILE); ctx.lineTo(canvas.width, i * TILE);
            ctx.stroke();
        }

        if (!this.isAttacking && this.hoveredTile && this.selectedBuilding) {
            const sz = BUILDING_TYPES[this.selectedBuilding].size;
            const ok = this.canPlaceBuilding(this.hoveredTile.x, this.hoveredTile.y, sz);
            ctx.fillStyle = ok ? 'rgba(46, 204, 113, 0.28)' : 'rgba(231, 76, 60, 0.28)';
            ctx.fillRect(this.hoveredTile.x * TILE, this.hoveredTile.y * TILE, sz * TILE, sz * TILE);
        }

        // Tower ranges (idle)
        if (!this.isAttacking) {
            ctx.strokeStyle = 'rgba(231, 76, 60, 0.25)';
            ctx.fillStyle = 'rgba(231, 76, 60, 0.05)';
            ctx.setLineDash([4, 3]);
            for (const b of this.buildings) {
                const def = BUILDING_TYPES[b.type];
                if (def.range > 0) {
                    const cx = (b.x + b.size / 2) * TILE;
                    const cy = (b.y + b.size / 2) * TILE;
                    ctx.beginPath();
                    ctx.arc(cx, cy, def.range * TILE, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.fill();
                }
            }
            ctx.setLineDash([]);
        }

        const buildings = this.isAttacking ? this.battleBuildings : this.buildings;
        for (const b of buildings) this.drawBuilding(b);

        if (this.isAttacking) {
            for (const u of this.battleUnits) this.drawUnit(u);

            ctx.lineWidth = 2;
            for (const f of this.attackFlashes) {
                ctx.strokeStyle = f.kind === 'unit' ? 'rgba(241, 196, 15, 0.9)' : 'rgba(231, 76, 60, 0.9)';
                ctx.beginPath();
                ctx.moveTo(f.from.x * TILE, f.from.y * TILE);
                ctx.lineTo(f.to.x * TILE, f.to.y * TILE);
                ctx.stroke();
            }

            ctx.font = 'bold 13px Arial';
            ctx.fillStyle = '#fff';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            const text = `Tick ${this.battleTick}/${MAX_BATTLE_TICKS}  |  Units: ${this.battleUnits.length}  |  Buildings: ${this.battleBuildings.length}`;
            ctx.strokeText(text, 6, 6);
            ctx.fillText(text, 6, 6);
        }
    }

    drawBuilding(b) {
        const { ctx } = this;
        const def = BUILDING_TYPES[b.type];
        const px = b.x * TILE;
        const py = b.y * TILE;
        const sz = b.size * TILE;

        ctx.fillStyle = def.color;
        ctx.fillRect(px + 3, py + 3, sz - 6, sz - 6);
        ctx.strokeStyle = b.type === 'townhall' ? '#d4a017' : '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(px + 3, py + 3, sz - 6, sz - 6);

        ctx.font = `${sz * 0.5}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.fillText(def.icon, px + sz / 2, py + sz / 2);

        const hpPct = b.hp / b.maxHp;
        if (hpPct < 1) {
            ctx.fillStyle = '#333';
            ctx.fillRect(px + 4, py - 6, sz - 8, 4);
            ctx.fillStyle = hpPct > 0.5 ? '#27ae60' : hpPct > 0.25 ? '#f39c12' : '#e74c3c';
            ctx.fillRect(px + 4, py - 6, (sz - 8) * Math.max(0, hpPct), 4);
        }
    }

    drawUnit(u) {
        const { ctx } = this;
        const def = UNIT_TYPES[u.type];
        const cx = (u.x + 0.5) * TILE;
        const cy = (u.y + 0.5) * TILE;

        ctx.fillStyle = def.color;
        ctx.beginPath();
        ctx.arc(cx, cy, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.fillText(def.icon, cx, cy);

        const hpPct = u.hp / u.maxHp;
        ctx.fillStyle = '#333';
        ctx.fillRect(cx - 13, cy - 20, 26, 3);
        ctx.fillStyle = hpPct > 0.5 ? '#27ae60' : hpPct > 0.25 ? '#f39c12' : '#e74c3c';
        ctx.fillRect(cx - 13, cy - 20, 26 * Math.max(0, hpPct), 3);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(() => new BattleSimulator(), 100));
} else {
    setTimeout(() => new BattleSimulator(), 100);
}
