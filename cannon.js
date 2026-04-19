// ============================================================
// Cannon Siege — aim, fire, destroy targets, chain explosions
// ============================================================

(function () {

const CANNON_BEST_KEY = 'cannonSiegeBest';
const GRAVITY   = 0.28;
const BALL_SPEED = 15;
const CW = 640, CH = 380, GY = 330;  // canvas dims + ground Y

class CannonSiege {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx    = canvas.getContext('2d');
        this.best   = parseInt(localStorage.getItem(CANNON_BEST_KEY) || '0');
        this.score  = 0;
        this.lvlIdx = 0;
        this.state  = 'aim'; // aim | flying | levelEnd | gameOver | win
        this.ball       = null;
        this.targets    = [];
        this.platforms  = [];
        this.particles  = [];
        this.explosions = [];
        this.aimDots    = [];
        this.shotsLeft  = 0;
        this.angleDeg   = -40;

        this.levels = this.buildLevels();
        this.loadLevel(0);
        this.bindEvents();
        this.loop();
    }

    // ---- LEVEL DATA ----
    buildLevels() {
        const G = GY;
        return [
            {
                name: 'Level 1 — Warming Up',
                shots: 5,
                platforms: [],
                targets: [
                    { x:400, y:G-45, w:45, h:45, type:'crate',  hp:2 },
                    { x:460, y:G-45, w:45, h:45, type:'crate',  hp:2 },
                    { x:520, y:G-45, w:45, h:45, type:'crate',  hp:2 },
                ],
            },
            {
                name: 'Level 2 — Incoming!',
                shots: 5,
                platforms: [],
                targets: [
                    { x:370, y:G-45, w:45, h:45, type:'crate',   hp:2 },
                    { x:430, y:G-55, w:38, h:55, type:'barrel',  hp:1 },
                    { x:480, y:G-45, w:45, h:45, type:'crate',   hp:2 },
                    { x:540, y:G-55, w:30, h:55, type:'soldier', hp:1 },
                ],
            },
            {
                name: 'Level 3 — High Ground',
                shots: 5,
                platforms: [
                    { x:370, y:G-95, w:210, h:16 },
                ],
                targets: [
                    { x:378, y:G-95-50, w:45, h:50, type:'crate',   hp:2 },
                    { x:438, y:G-95-55, w:30, h:55, type:'soldier', hp:1 },
                    { x:482, y:G-95-52, w:38, h:52, type:'barrel',  hp:1 },
                    { x:535, y:G-95-50, w:30, h:50, type:'soldier', hp:1 },
                    { x:410, y:G-50,   w:30, h:50, type:'soldier', hp:1 },
                    { x:530, y:G-45,   w:45, h:45, type:'crate',   hp:2 },
                ],
            },
            {
                name: 'Level 4 — Stone Wall',
                shots: 6,
                platforms: [],
                targets: [
                    { x:360, y:G-50, w:45, h:50, type:'crate',   hp:2 },
                    { x:412, y:G-55, w:30, h:55, type:'soldier', hp:1 },
                    { x:450, y:G-50, w:50, h:50, type:'stone',   hp:4 },
                    { x:508, y:G-55, w:38, h:55, type:'barrel',  hp:1 },
                    { x:555, y:G-50, w:45, h:50, type:'crate',   hp:2 },
                    { x:385, y:G-100, w:45, h:50, type:'crate',  hp:2 },
                    { x:495, y:G-105, w:30, h:55, type:'soldier',hp:1 },
                ],
            },
            {
                name: 'Level 5 — The Fortress',
                shots: 7,
                platforms: [
                    { x:355, y:G-75,  w:52, h:16 },
                    { x:515, y:G-75,  w:52, h:16 },
                    { x:385, y:G-148, w:168, h:16 },
                ],
                targets: [
                    { x:358, y:G-75-55,  w:46, h:55, type:'soldier', hp:1 },
                    { x:518, y:G-75-55,  w:46, h:55, type:'soldier', hp:1 },
                    { x:395, y:G-148-52, w:38, h:52, type:'barrel',  hp:1 },
                    { x:450, y:G-148-50, w:50, h:50, type:'stone',   hp:4 },
                    { x:510, y:G-148-52, w:30, h:52, type:'soldier', hp:1 },
                    { x:415, y:G-50,     w:30, h:50, type:'soldier', hp:1 },
                    { x:455, y:G-50,     w:45, h:50, type:'crate',   hp:2 },
                    { x:510, y:G-50,     w:30, h:50, type:'soldier', hp:1 },
                ],
            },
        ];
    }

    loadLevel(idx) {
        if (idx >= this.levels.length) { this.saveBest(); this.state = 'win'; return; }
        const lvl = this.levels[idx];
        this.lvlIdx    = idx;
        this.shotsLeft = lvl.shots;
        this.targets   = lvl.targets.map(t => ({ ...t, destroyed: false, flash: 0 }));
        this.platforms = lvl.platforms.slice();
        this.ball = null; this.particles = []; this.explosions = []; this.aimDots = [];
        this.state = 'aim';
        this.computeAimDots();
    }

    saveBest() {
        if (this.score > this.best) {
            this.best = this.score;
            try { localStorage.setItem(CANNON_BEST_KEY, this.best); } catch {}
        }
    }

    // ---- INPUT ----
    bindEvents() {
        this.canvas.addEventListener('mousemove', e => {
            if (this.state !== 'aim') return;
            const p = this.relPos(e.clientX, e.clientY);
            this.updateAngle(p.x, p.y);
        });
        this.canvas.addEventListener('click', e => {
            const p = this.relPos(e.clientX, e.clientY);
            this.handleInput(p.x, p.y);
        });
        this.canvas.addEventListener('touchend', e => {
            e.preventDefault();
            const t = e.changedTouches[0];
            const p = this.relPos(t.clientX, t.clientY);
            if (this.state === 'aim') { this.updateAngle(p.x, p.y); }
            this.handleInput(p.x, p.y);
        }, { passive: false });
    }

    relPos(cx, cy) {
        const r = this.canvas.getBoundingClientRect();
        return {
            x: (cx - r.left) * (CW / r.width),
            y: (cy - r.top)  * (CH / r.height),
        };
    }

    handleInput(x, y) {
        if (this.state === 'aim' && this.shotsLeft > 0) {
            this.updateAngle(x, y);
            this.fire();
        } else if (this.state === 'levelEnd') {
            this.loadLevel(this.lvlIdx + 1);
        } else if (this.state === 'gameOver' || this.state === 'win') {
            this.score = 0;
            this.loadLevel(0);
        }
    }

    // ---- AIM ----
    cannonBase() { return { x: 70, y: GY }; }
    cannonTip() {
        const b = this.cannonBase(), a = this.angleDeg * Math.PI / 180;
        return { x: b.x + Math.cos(a) * 44, y: b.y + Math.sin(a) * 44 };
    }

    updateAngle(mx, my) {
        const b = this.cannonBase();
        let deg = Math.atan2(my - b.y, mx - b.x) * 180 / Math.PI;
        this.angleDeg = Math.max(-82, Math.min(-6, deg));
        this.computeAimDots();
    }

    computeAimDots() {
        // trajectory preview removed — aim by eye!
        this.aimDots = [];
    }

    // ---- FIRE ----
    fire() {
        const tip = this.cannonTip(), a = this.angleDeg * Math.PI / 180;
        this.ball = {
            x: tip.x, y: tip.y,
            vx: Math.cos(a) * BALL_SPEED,
            vy: Math.sin(a) * BALL_SPEED,
            r: 10,
        };
        this.shotsLeft--;
        this.state = 'flying';
        this.aimDots = [];
    }

    // ---- PHYSICS ----
    updateBall() {
        if (!this.ball) return;
        const b = this.ball;
        b.vy += GRAVITY;
        b.x  += b.vx;
        b.y  += b.vy;

        if (b.y + b.r >= GY) {
            this.boom(b.x, GY - b.r, 32, false);
            this.ball = null; this.afterShot(); return;
        }
        if (b.x > CW + 30 || b.y > CH + 30) {
            this.ball = null; this.afterShot(); return;
        }
        for (const p of this.platforms) {
            if (b.x + b.r > p.x && b.x - b.r < p.x + p.w &&
                b.y + b.r > p.y && b.y - b.r < p.y + p.h) {
                this.boom(b.x, b.y, 32, false);
                this.ball = null; this.afterShot(); return;
            }
        }
        for (const t of this.targets) {
            if (t.destroyed) continue;
            if (b.x + b.r > t.x && b.x - b.r < t.x + t.w &&
                b.y + b.r > t.y && b.y - b.r < t.y + t.h) {
                this.hitTarget(t, 2);
                const chain = (t.type === 'barrel' && t.destroyed);
                this.boom(b.x, b.y, chain ? 85 : 48, chain);
                this.ball = null; this.afterShot(); return;
            }
        }
    }

    hitTarget(t, dmg) {
        if (t.destroyed) return;
        t.hp   -= dmg;
        t.flash = 10;
        if (t.hp <= 0) {
            t.destroyed = true;
            this.score += { crate:100, barrel:150, soldier:200, stone:300 }[t.type] || 100;
        }
    }

    boom(x, y, radius, isChain) {
        this.explosions.push({ x, y, r: 0, maxR: radius, life: 1, chain: isChain });
        this.spawnParticles(x, y, isChain);
        if (isChain) setTimeout(() => this.chainBlast(x, y, radius + 35), 60);
    }

    chainBlast(x, y, radius) {
        for (const t of this.targets) {
            if (t.destroyed) continue;
            const cx = t.x + t.w / 2, cy = t.y + t.h / 2;
            if (Math.hypot(cx - x, cy - y) < radius) {
                this.hitTarget(t, 3);
                if (t.destroyed && t.type === 'barrel') {
                    setTimeout(() => this.boom(t.x + t.w / 2, t.y + t.h / 2, 85, true), 180);
                }
            }
        }
    }

    spawnParticles(x, y, big) {
        const n = big ? 24 : 14;
        const cols = ['#ff6b35','#ff4500','#ffd700','#ff8c00','#ffffff'];
        for (let i = 0; i < n; i++) {
            const ang = (i / n) * Math.PI * 2 + (Math.random() - 0.5);
            const spd = (big ? 3 : 1.5) + Math.random() * (big ? 5.5 : 3);
            this.particles.push({
                x, y,
                vx: Math.cos(ang) * spd,
                vy: Math.sin(ang) * spd - 1.5,
                r: 2 + Math.random() * 4,
                life: 1,
                col: cols[Math.floor(Math.random() * cols.length)],
            });
        }
    }

    afterShot() {
        const alive = this.targets.some(t => !t.destroyed);
        if (!alive) {
            const bonus = this.shotsLeft * 150;
            this.score += bonus;
            this.saveBest();
            setTimeout(() => { this.state = 'levelEnd'; }, 650);
        } else if (this.shotsLeft <= 0) {
            this.saveBest();
            setTimeout(() => { this.state = 'gameOver'; }, 850);
        } else {
            this.state = 'aim';
            this.computeAimDots();
        }
    }

    // ---- UPDATE ----
    update() {
        if (this.state === 'flying') this.updateBall();

        for (let i = this.explosions.length - 1; i >= 0; i--) {
            const e = this.explosions[i];
            e.r = Math.min(e.r + e.maxR * 0.13, e.maxR);
            e.life -= 0.055;
            if (e.life <= 0) this.explosions.splice(i, 1);
        }
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx; p.y += p.vy; p.vy += 0.18;
            p.life -= 0.033;
            if (p.life <= 0) this.particles.splice(i, 1);
        }
        for (const t of this.targets) if (t.flash > 0) t.flash--;
    }

    // ---- DRAW ----
    draw() {
        const ctx = this.ctx;

        // Sky
        const sky = ctx.createLinearGradient(0, 0, 0, CH);
        sky.addColorStop(0, '#5ba3d0'); sky.addColorStop(1, '#c8e8f8');
        ctx.fillStyle = sky; ctx.fillRect(0, 0, CW, CH);

        this.drawCloud(ctx, 120, 42, 52);
        this.drawCloud(ctx, 340, 26, 40);
        this.drawCloud(ctx, 540, 55, 48);

        // Ground
        ctx.fillStyle = '#5d8a3c'; ctx.fillRect(0, GY, CW, CH - GY);
        ctx.fillStyle = '#4a7030'; ctx.fillRect(0, GY, CW, 7);

        // Distant hills
        ctx.fillStyle = '#6aaa45';
        ctx.beginPath(); ctx.arc(490, GY, 88, Math.PI, 0); ctx.fill();
        ctx.beginPath(); ctx.arc(590, GY, 55, Math.PI, 0); ctx.fill();

        // Platforms
        for (const p of this.platforms) this.drawPlatform(ctx, p);

        // Targets
        for (const t of this.targets) if (!t.destroyed) this.drawTarget(ctx, t);

        // Explosions
        for (const e of this.explosions) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, e.life * 0.72);
            const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r);
            g.addColorStop(0,   e.chain ? '#ffffff' : '#ffe566');
            g.addColorStop(0.4, '#ff8800');
            g.addColorStop(1,   'rgba(180,0,0,0)');
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(e.x, e.y, Math.max(1, e.r), 0, Math.PI * 2); ctx.fill();
            ctx.restore();
        }

        // Particles
        for (const p of this.particles) {
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.fillStyle = p.col;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Aim dots
        if (this.state === 'aim') {
            for (let i = 0; i < this.aimDots.length; i++) {
                const d = this.aimDots[i];
                ctx.globalAlpha = d.a * 0.85;
                ctx.fillStyle = '#fff';
                ctx.beginPath(); ctx.arc(d.x, d.y, 3, 0, Math.PI * 2); ctx.fill();
            }
            ctx.globalAlpha = 1;
        }

        // Ball
        if (this.ball) {
            const b = this.ball;
            ctx.fillStyle = '#252525';
            ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#111'; ctx.lineWidth = 1.5; ctx.stroke();
            ctx.fillStyle = 'rgba(255,255,255,0.22)';
            ctx.beginPath(); ctx.arc(b.x - 3, b.y - 3, 4, 0, Math.PI * 2); ctx.fill();
        }

        this.drawCannon(ctx);
        this.drawHUD(ctx);

        if      (this.state === 'levelEnd') this.drawOverlay(ctx, '🎉 Level Clear!', '#ffd700', `Score: ${this.score}`, 'Click to continue →');
        else if (this.state === 'gameOver') this.drawOverlay(ctx, '💥 Game Over',    '#ff4444', `Score: ${this.score}  ·  Best: ${this.best}`, 'Click to try again');
        else if (this.state === 'win')      this.drawOverlay(ctx, '🏆 You Won!',     '#ffd700', `Final Score: ${this.score}  ·  Best: ${this.best}`, 'Click to play again');
    }

    drawCloud(ctx, x, y, s) {
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.beginPath();
        ctx.arc(x, y, s * 0.5, 0, Math.PI * 2);
        ctx.arc(x + s * 0.42, y - s * 0.08, s * 0.38, 0, Math.PI * 2);
        ctx.arc(x - s * 0.35, y + 0.05 * s, s * 0.3,  0, Math.PI * 2);
        ctx.arc(x + s * 0.72, y + 0.1  * s, s * 0.28, 0, Math.PI * 2);
        ctx.fill();
    }

    drawPlatform(ctx, p) {
        ctx.fillStyle = '#8B6914';
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.fillStyle = '#a37a1a';
        ctx.fillRect(p.x, p.y, p.w, 5);
        ctx.strokeStyle = '#6b5010'; ctx.lineWidth = 1.5;
        ctx.strokeRect(p.x, p.y, p.w, p.h);
    }

    drawCannon(ctx) {
        const bx = 70, by = GY;
        const a = this.angleDeg * Math.PI / 180;

        // Wheel
        ctx.fillStyle = '#5a3a1a';
        ctx.beginPath(); ctx.arc(bx - 8, by + 10, 22, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#3a2010'; ctx.lineWidth = 3; ctx.stroke();
        ctx.fillStyle = '#7a5a3a';
        ctx.beginPath(); ctx.arc(bx - 8, by + 10, 12, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#5a3a1a'; ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
            const sa = (i / 4) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(bx - 8, by + 10);
            ctx.lineTo(bx - 8 + Math.cos(sa) * 12, by + 10 + Math.sin(sa) * 12);
            ctx.stroke();
        }

        // Carriage
        ctx.fillStyle = '#7B4520';
        ctx.fillRect(bx - 28, by - 8, 56, 18);
        ctx.strokeStyle = '#5a3010'; ctx.lineWidth = 2; ctx.strokeRect(bx - 28, by - 8, 56, 18);

        // Barrel
        ctx.save();
        ctx.translate(bx, by - 5);
        ctx.rotate(a);

        const bg = ctx.createLinearGradient(0, -12, 0, 12);
        bg.addColorStop(0, '#777'); bg.addColorStop(0.5, '#444'); bg.addColorStop(1, '#333');
        ctx.fillStyle = bg;
        ctx.beginPath(); ctx.roundRect(-6, -12, 54, 24, 5); ctx.fill();
        ctx.strokeStyle = '#222'; ctx.lineWidth = 1.5; ctx.stroke();

        // Rings
        ctx.fillStyle = '#333';
        [10, 28, 44].forEach(xp => ctx.fillRect(xp, -13, 5, 26));

        // Muzzle
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath(); ctx.arc(48, 0, 9, 0, Math.PI * 2); ctx.fill();

        ctx.restore();
    }

    drawTarget(ctx, t) {
        const fl = t.flash > 0 && t.flash % 2 === 0;
        ctx.save();

        if (t.type === 'crate') {
            ctx.fillStyle = fl ? '#ffe066' : '#c8830a';
            ctx.fillRect(t.x, t.y, t.w, t.h);
            ctx.strokeStyle = '#8B5E1A'; ctx.lineWidth = 2; ctx.strokeRect(t.x, t.y, t.w, t.h);
            ctx.strokeStyle = fl ? '#aa8800' : '#a06820'; ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(t.x, t.y + t.h/2); ctx.lineTo(t.x + t.w, t.y + t.h/2);
            ctx.moveTo(t.x + t.w/2, t.y); ctx.lineTo(t.x + t.w/2, t.y + t.h);
            ctx.moveTo(t.x+5, t.y+5); ctx.lineTo(t.x+t.w-5, t.y+t.h-5);
            ctx.moveTo(t.x+t.w-5, t.y+5); ctx.lineTo(t.x+5, t.y+t.h-5);
            ctx.stroke();

        } else if (t.type === 'barrel') {
            ctx.fillStyle = fl ? '#ff4400' : '#8B0000';
            ctx.beginPath(); ctx.roundRect(t.x, t.y, t.w, t.h, 8); ctx.fill();
            ctx.strokeStyle = '#5a0000'; ctx.lineWidth = 2; ctx.stroke();
            ctx.fillStyle = '#777';
            [0.25, 0.65].forEach(f => ctx.fillRect(t.x+3, t.y + t.h*f, t.w-6, 5));
            ctx.fillStyle = '#ff0';
            ctx.font = `bold ${Math.max(9, Math.min(12, t.w*0.28))}px Arial`;
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('TNT', t.x + t.w/2, t.y + t.h/2);

        } else if (t.type === 'soldier') {
            // Body
            ctx.fillStyle = fl ? '#ffe066' : '#3a7a3a';
            ctx.fillRect(t.x+5, t.y + t.h*0.38, t.w-10, t.h*0.52);
            // Head
            ctx.fillStyle = fl ? '#ffe066' : '#f5c5a0';
            ctx.beginPath(); ctx.arc(t.x + t.w/2, t.y + t.h*0.22, t.w*0.27, 0, Math.PI*2); ctx.fill();
            // Helmet
            ctx.fillStyle = '#2a5a2a';
            ctx.fillRect(t.x+4, t.y+2, t.w-8, t.h*0.18);
            ctx.beginPath(); ctx.arc(t.x + t.w/2, t.y + t.h*0.13, t.w*0.31, Math.PI, 0); ctx.fill();
            // Arms
            ctx.strokeStyle = fl ? '#ffe066' : '#3a7a3a';
            ctx.lineWidth = 4; ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(t.x+6, t.y+t.h*0.47); ctx.lineTo(t.x+1,     t.y+t.h*0.7);
            ctx.moveTo(t.x+t.w-6, t.y+t.h*0.47); ctx.lineTo(t.x+t.w-1, t.y+t.h*0.7);
            ctx.stroke();
            // Eyes
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.arc(t.x + t.w*0.37, t.y + t.h*0.2, 2, 0, Math.PI*2);
            ctx.arc(t.x + t.w*0.63, t.y + t.h*0.2, 2, 0, Math.PI*2);
            ctx.fill();

        } else if (t.type === 'stone') {
            ctx.fillStyle = fl ? '#bbb' : '#707070';
            ctx.beginPath(); ctx.roundRect(t.x, t.y, t.w, t.h, 5); ctx.fill();
            ctx.strokeStyle = '#444'; ctx.lineWidth = 2; ctx.stroke();
            ctx.strokeStyle = '#999'; ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(t.x+8,  t.y+6);  ctx.lineTo(t.x+22, t.y+24);
            ctx.moveTo(t.x+28, t.y+8);  ctx.lineTo(t.x+16, t.y+28);
            ctx.stroke();
            // HP bar
            const frac = Math.max(0, t.hp / 4);
            ctx.fillStyle = '#222'; ctx.fillRect(t.x+4, t.y+t.h-10, t.w-8, 7);
            ctx.fillStyle = frac > 0.5 ? '#4f4' : frac > 0.25 ? '#ff4' : '#f44';
            ctx.fillRect(t.x+4, t.y+t.h-10, (t.w-8) * frac, 7);
        }

        ctx.restore();
    }

    drawHUD(ctx) {
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.fillRect(0, 0, CW, 38);

        const lvlName = this.levels[Math.min(this.lvlIdx, this.levels.length - 1)].name;
        ctx.fillStyle = '#fff'; ctx.font = 'bold 14px Arial'; ctx.textAlign = 'left';
        ctx.fillText(lvlName, 10, 24);

        ctx.textAlign = 'center'; ctx.font = 'bold 15px Arial';
        ctx.fillText(`Score: ${this.score}`, CW / 2, 24);

        // Shots as little cannonballs
        const totalW = this.shotsLeft * 22;
        const bx0 = CW - 16 - totalW;
        for (let i = 0; i < Math.min(this.shotsLeft, 10); i++) {
            ctx.fillStyle = '#252525';
            ctx.beginPath(); ctx.arc(bx0 + i * 22 + 9, 19, 8, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#111'; ctx.lineWidth = 1; ctx.stroke();
        }

        ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '11px Arial'; ctx.textAlign = 'left';
        ctx.fillText(`Best: ${this.best}`, 8, CH - 6);
        ctx.textAlign = 'left';
    }

    drawOverlay(ctx, title, titleCol, body, hint) {
        ctx.fillStyle = 'rgba(0,0,0,0.65)';
        ctx.fillRect(0, 0, CW, CH);

        ctx.textAlign = 'center';
        ctx.fillStyle = titleCol; ctx.font = 'bold 40px Arial';
        ctx.fillText(title, CW / 2, CH / 2 - 42);

        ctx.fillStyle = '#fff'; ctx.font = '21px Arial';
        ctx.fillText(body, CW / 2, CH / 2 + 8);

        ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '16px Arial';
        ctx.fillText(hint, CW / 2, CH / 2 + 50);
        ctx.textAlign = 'left';
    }

    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }
}

// Lazy-init: only create when the cannon tab is first opened
(function boot() {
    const orig = window.switchTab;
    let inst = null;
    window.switchTab = function (tabName) {
        orig(tabName);
        if (tabName === 'cannon' && !inst) {
            const canvas = document.getElementById('cannonCanvas');
            if (canvas) inst = new CannonSiege(canvas);
        }
    };
})();

})();
