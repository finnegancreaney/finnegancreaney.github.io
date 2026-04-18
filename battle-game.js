class BattleSimulator {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Resources - INCREASED STARTING AMOUNTS
        this.gold = 15000;
        this.elixir = 10000;
        this.baseHP = 100;
        this.maxBaseHP = 100;
        
        // Game state
        this.buildings = [];
        this.units = [];
        this.selectedBuilding = null;
        this.gridSize = 50;
        this.battleLog = [];
        this.isAttacking = false;
        this.battleUnits = [];
        
        // Upgrades
        this.upgrades = {
            barbarian: 0,
            archer: 0,
            tower: 0,
            wall: 0
        };
        
        // Unit definitions
        this.unitTypes = {
            barbarian: { hp: 50, dmg: 8, range: 1, cost: 50, icon: '🗡️' },
            archer: { hp: 30, dmg: 12, range: 3, cost: 75, icon: '🏹' },
            dragon: { hp: 150, dmg: 25, range: 5, cost: 200, icon: '🐉' },
            wizard: { hp: 60, dmg: 30, range: 4, cost: 150, icon: '🧙' }
        };
        
        // Building definitions
        this.buildingTypes = {
            townhall: { size: 3, hp: 200, dmg: 0, range: 0, cost: 1000, icon: '🏰' },
            barracks: { size: 3, hp: 100, dmg: 0, range: 0, cost: 500, icon: '🛡️' },
            'archer-tower': { size: 2, hp: 80, dmg: 15, range: 5, cost: 800, icon: '🏹' },
            cannon: { size: 3, hp: 120, dmg: 30, range: 6, cost: 1200, icon: '🔫' },
            wall: { size: 1, hp: 100, dmg: 0, range: 0, cost: 100, icon: '🧱' },
            storage: { size: 2, hp: 60, dmg: 0, range: 0, cost: 600, icon: '📦' }
        };
        
        this.setupEventListeners();
        this.addLog('🎮 Welcome! You have 15000🪙 and 10000⚡ to start!', 'defense');
        this.render();
    }
    
    setupEventListeners() {
        // Canvas click to place buildings
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleCanvasHover(e));
        
        // Building selection
        document.querySelectorAll('.building-item').forEach(item => {
            item.querySelector('.select-btn').addEventListener('click', () => {
                const building = item.dataset.building;
                this.selectBuilding(building);
            });
        });
        
        // Unit training
        document.querySelectorAll('.train-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const unitType = btn.dataset.unit;
                const count = parseInt(document.getElementById(`${unitType}-count`).value);
                this.trainUnits(unitType, count);
            });
        });
        
        // Upgrades
        document.querySelectorAll('.upgrade-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const upgradeType = btn.dataset.upgrade;
                this.purchaseUpgrade(upgradeType);
            });
        });
        
        // Canvas controls
        document.getElementById('clearBase').addEventListener('click', () => this.clearBase());
        document.getElementById('randomLayout').addEventListener('click', () => this.randomLayout());
        document.getElementById('testAttack').addEventListener('click', () => this.testAttack());
        
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                
                btn.classList.add('active');
                document.getElementById(btn.dataset.tab).classList.add('active');
            });
        });
    }
    
    selectBuilding(type) {
        this.selectedBuilding = type;
        document.querySelectorAll('.building-item').forEach(item => {
            item.style.opacity = item.dataset.building === type ? '1' : '0.5';
        });
    }
    
    handleCanvasClick(e) {
        if (!this.selectedBuilding) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / this.gridSize);
        const y = Math.floor((e.clientY - rect.top) / this.gridSize);
        
        this.placeBuilding(this.selectedBuilding, x, y);
    }
    
    handleCanvasHover(e) {
        this.hoveredTile = null;
        if (this.selectedBuilding) {
            const rect = this.canvas.getBoundingClientRect();
            this.hoveredTile = {
                x: Math.floor((e.clientX - rect.left) / this.gridSize),
                y: Math.floor((e.clientY - rect.top) / this.gridSize)
            };
        }
    }
    
    placeBuilding(type, x, y) {
        const buildingData = this.buildingTypes[type];
        if (!buildingData) return;
        
        // Check if affordable
        if (this.gold < buildingData.cost) {
            this.addLog('Not enough gold!', 'attack');
            return;
        }
        
        // Check if placement is valid
        if (!this.canPlaceBuilding(x, y, buildingData.size)) {
            this.addLog('Cannot place building here!', 'attack');
            return;
        }
        
        this.gold -= buildingData.cost;
        this.buildings.push({
            type,
            x,
            y,
            size: buildingData.size,
            hp: buildingData.hp,
            maxHp: buildingData.hp,
            icon: buildingData.icon
        });
        
        this.updateUI();
        this.addLog(`Placed ${type}!`, 'defense');
    }
    
    canPlaceBuilding(x, y, size) {
        for (let bx = x; bx < x + size; bx++) {
            for (let by = y; by < y + size; by++) {
                if (bx < 0 || bx >= 10 || by < 0 || by >= 12) return false;
                
                for (let building of this.buildings) {
                    if (bx >= building.x && bx < building.x + building.size &&
                        by >= building.y && by < building.y + building.size) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
    trainUnits(type, count) {
        const unitData = this.unitTypes[type];
        const totalCost = unitData.cost * count;
        
        if (this.elixir < totalCost) {
            this.addLog('Not enough elixir!', 'attack');
            return;
        }
        
        this.elixir -= totalCost;
        for (let i = 0; i < count; i++) {
            this.units.push({
                type,
                hp: unitData.hp,
                maxHp: unitData.hp,
                dmg: unitData.dmg + (this.upgrades[type] * 5),
                range: unitData.range,
                x: 2 + Math.random() * 4,
                y: 1 + Math.random() * 2,
                icon: unitData.icon
            });
        }
        
        document.getElementById(`${type}-count`).value = 0;
        this.updateUI();
        this.addLog(`Trained ${count} ${type}s!`, 'defense');
    }
    
    purchaseUpgrade(type) {
        const costs = { barbarian: 300, archer: 400, tower: 500, wall: 200 };
        if (this.elixir < costs[type]) {
            this.addLog('Not enough elixir for upgrade!', 'attack');
            return;
        }
        
        if (this.upgrades[type] >= 5) {
            this.addLog('Already max level!', 'attack');
            return;
        }
        
        this.elixir -= costs[type];
        this.upgrades[type]++;
        this.updateUI();
        this.addLog(`Upgraded ${type} to level ${this.upgrades[type]}!`, 'defense');
    }
    
    testAttack() {
        if (this.units.length === 0) {
            this.addLog('No units to attack!', 'attack');
            return;
        }
        
        this.isAttacking = true;
        this.battleLog = [];
        this.baseHP = this.maxBaseHP;
        this.battleUnits = JSON.parse(JSON.stringify(this.units));
        
        this.simulateBattle();
    }
    
    simulateBattle() {
        let round = 1;
        this.addLog('🎬 Battle Start!', 'attack');
        this.addLog(`Units: ${this.battleUnits.length} vs Towers: ${this.buildings.filter(b => b.type.includes('tower') || b.type === 'cannon').length}`, 'attack');
        
        while (this.battleUnits.length > 0 && this.baseHP > 0 && round < 100) {
            // Units attack buildings
            const defenders = this.buildings.filter(b => b.type.includes('tower') || b.type === 'cannon');
            
            if (defenders.length > 0) {
                const target = defenders[Math.floor(Math.random() * defenders.length)];
                const damage = this.battleUnits.reduce((sum, u) => sum + u.dmg, 0) / defenders.length;
                target.hp -= damage;
                this.addLog(`Units deal ${damage.toFixed(0)} damage to ${target.type}`, 'damage');
                
                if (target.hp <= 0) {
                    this.buildings = this.buildings.filter(b => b !== target);
                    this.addLog(`${target.type} destroyed!`, 'damage');
                }
            }
            
            // Buildings attack units
            defenders.forEach(building => {
                if (this.battleUnits.length > 0) {
                    const target = this.battleUnits[Math.floor(Math.random() * this.battleUnits.length)];
                    target.hp -= building.dmg;
                    
                    if (target.hp <= 0) {
                        this.battleUnits = this.battleUnits.filter(u => u !== target);
                        this.addLog(`${target.type} defeated!`, 'damage');
                    }
                }
            });
            
            // Check if all defenders destroyed
            if (this.buildings.filter(b => b.type.includes('tower') || b.type === 'cannon').length === 0) {
                this.baseHP -= 10;
                this.addLog(`Units damage base! Base HP: ${Math.max(0, this.baseHP)}`, 'damage');
            }
            
            round++;
        }
        
        if (this.baseHP <= 0) {
            this.addLog('🔴 BASE DESTROYED! Attack Success!', 'attack');
            this.gold += 2000;
            this.elixir += 1000;
            this.addLog('Earned 2000🪙 + 1000⚡ for winning!', 'defense');
        } else {
            this.addLog('🟢 BASE DEFENDED! Attack Failed!', 'defense');
        }
        
        this.updateUI();
        this.isAttacking = false;
    }
    
    clearBase() {
        this.buildings = [];
        this.gold += 500;
        this.addLog('Base cleared! Refunded 500🪙', 'defense');
        this.updateUI();
    }
    
    randomLayout() {
        this.buildings = [];
        this.gold -= 500;
        
        if (this.gold < 0) {
            this.gold += 500;
            this.addLog('Not enough gold!', 'attack');
            return;
        }
        
        // Place random buildings
        const types = ['townhall', 'archer-tower', 'cannon', 'wall', 'storage'];
        for (let i = 0; i < 8; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            let x, y, placed = false;
            
            for (let attempts = 0; attempts < 10; attempts++) {
                x = Math.floor(Math.random() * 8);
                y = Math.floor(Math.random() * 10);
                
                if (this.canPlaceBuilding(x, y, this.buildingTypes[type].size)) {
                    this.buildings.push({
                        type,
                        x,
                        y,
                        size: this.buildingTypes[type].size,
                        hp: this.buildingTypes[type].hp,
                        maxHp: this.buildingTypes[type].hp,
                        icon: this.buildingTypes[type].icon
                    });
                    placed = true;
                    break;
                }
            }
        }
        
        this.addLog('Random layout generated!', 'defense');
        this.updateUI();
    }
    
    addLog(message, type = '') {
        const timestamp = new Date().toLocaleTimeString();
        this.battleLog.push({ message, type, time: timestamp });
        
        const logElement = document.getElementById('battleLog');
        const entry = document.createElement('p');
        entry.className = `log-entry ${type}`;
        entry.textContent = `[${timestamp}] ${message}`;
        logElement.appendChild(entry);
        logElement.scrollTop = logElement.scrollHeight;
    }
    
    updateUI() {
        document.getElementById('gold').textContent = Math.floor(this.gold);
        document.getElementById('elixir').textContent = Math.floor(this.elixir);
        document.getElementById('hp').textContent = Math.floor(this.baseHP);
        
        // Update battle panel resources too
        const battleGold = document.getElementById('battle-gold');
        const battleElixir = document.getElementById('battle-elixir');
        const battleHp = document.getElementById('battle-hp');
        
        if (battleGold) battleGold.textContent = Math.floor(this.gold);
        if (battleElixir) battleElixir.textContent = Math.floor(this.elixir);
        if (battleHp) battleHp.textContent = Math.floor(this.baseHP);
        
        const totalUnits = this.units.length;
        const armyPower = this.units.reduce((sum, u) => sum + u.dmg, 0);
        document.getElementById('total-units').textContent = totalUnits;
        document.getElementById('army-power').textContent = armyPower;
        
        Object.keys(this.upgrades).forEach(key => {
            const element = document.getElementById(`${key}-level`);
            if (element) element.textContent = this.upgrades[key];
        });
    }
    
    render() {
        // Clear canvas
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#E0F6FF');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= 10; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
        }
        for (let i = 0; i <= 12; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }
        
        // Draw hovered tile
        if (this.hoveredTile && this.selectedBuilding) {
            const buildingSize = this.buildingTypes[this.selectedBuilding].size;
            this.ctx.fillStyle = 'rgba(100, 200, 100, 0.3)';
            this.ctx.fillRect(
                this.hoveredTile.x * this.gridSize,
                this.hoveredTile.y * this.gridSize,
                buildingSize * this.gridSize,
                buildingSize * this.gridSize
            );
        }
        
        // Draw buildings
        this.buildings.forEach(building => {
            const x = building.x * this.gridSize;
            const y = building.y * this.gridSize;
            const size = building.size * this.gridSize;
            
            // Building background
            this.ctx.fillStyle = '#ddd';
            this.ctx.fillRect(x, y, size, size);
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, y, size, size);
            
            // Health bar
            const healthPercent = building.hp / building.maxHp;
            this.ctx.fillStyle = healthPercent > 0.5 ? '#27ae60' : healthPercent > 0.25 ? '#f39c12' : '#e74c3c';
            this.ctx.fillRect(x + 2, y - 8, size - 4, 5);
            
            // Icon
            this.ctx.font = `${size / 2}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(building.icon, x + size / 2, y + size / 2);
        });
        
        // Draw units
        this.units.forEach((unit, index) => {
            const x = unit.x * this.gridSize + 15;
            const y = unit.y * this.gridSize + 15;
            
            // Unit circle
            this.ctx.fillStyle = '#f39c12';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 8, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Unit icon
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillStyle = '#fff';
            this.ctx.fillText(unit.icon, x, y);
        });
        
        // Draw town hall location indicator
        const townhall = this.buildings.find(b => b.type === 'townhall');
        if (townhall) {
            const x = townhall.x * this.gridSize + townhall.size * this.gridSize / 2;
            const y = townhall.y * this.gridSize + townhall.size * this.gridSize / 2;
            
            this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 80, 0, Math.PI * 2);
            this.ctx.stroke();
            
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 80, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        requestAnimationFrame(() => this.render());
    }
}

// Initialize game
window.addEventListener('DOMContentLoaded', () => {
    new BattleSimulator();
});
