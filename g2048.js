// ==================================================================
// 2048 — slide tiles, merge matching numbers, reach 2048.
// ==================================================================

const G2048_SIZE = 4;
const G2048_BEST_KEY = 'g2048_best';

class Game2048 {
    constructor() {
        this.boardEl = document.getElementById('g2048-board');
        if (!this.boardEl) return;
        this.scoreEl = document.getElementById('g2048-score');
        this.bestEl = document.getElementById('g2048-best');
        this.overlayEl = document.getElementById('g2048-overlay');
        this.overlayTitle = document.getElementById('g2048-overlay-title');
        this.overlayBody = document.getElementById('g2048-overlay-body');

        this.best = parseInt(localStorage.getItem(G2048_BEST_KEY), 10) || 0;

        document.getElementById('g2048-restart').addEventListener('click', () => this.reset());
        document.getElementById('g2048-overlay-btn').addEventListener('click', () => this.reset());
        window.addEventListener('keydown', (e) => this.onKey(e));

        // Touch swipe
        this.boardEl.addEventListener('touchstart', (e) => {
            const t = e.touches[0];
            this.touchStart = { x: t.clientX, y: t.clientY };
        }, { passive: true });
        this.boardEl.addEventListener('touchend', (e) => {
            if (!this.touchStart) return;
            const t = e.changedTouches[0];
            const dx = t.clientX - this.touchStart.x;
            const dy = t.clientY - this.touchStart.y;
            if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
            if (Math.abs(dx) > Math.abs(dy)) this.move(dx > 0 ? 'right' : 'left');
            else this.move(dy > 0 ? 'down' : 'up');
        });

        this.reset();
    }

    reset() {
        this.grid = Array.from({ length: G2048_SIZE }, () => Array(G2048_SIZE).fill(0));
        this.score = 0;
        this.won = false;
        this.over = false;
        this.overlayEl.hidden = true;
        this.addRandom();
        this.addRandom();
        this.render();
    }

    addRandom() {
        const empty = [];
        for (let r = 0; r < G2048_SIZE; r++)
            for (let c = 0; c < G2048_SIZE; c++)
                if (this.grid[r][c] === 0) empty.push([r, c]);
        if (!empty.length) return;
        const [r, c] = empty[Math.floor(Math.random() * empty.length)];
        this.grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }

    onKey(e) {
        if (document.getElementById('g2048')?.classList.contains('active') === false) return;
        const map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
                      w: 'up', s: 'down', a: 'left', d: 'right' };
        const dir = map[e.key];
        if (!dir) return;
        e.preventDefault();
        this.move(dir);
    }

    move(dir) {
        if (this.over) return;
        const before = JSON.stringify(this.grid);
        const rotateCW = (g) => g[0].map((_, c) => g.map(row => row[c]).reverse());
        const rotateCCW = (g) => g[0].map((_, c) => g.map(row => row[row.length - 1 - c]));
        let g = this.grid.map(row => row.slice());

        if (dir === 'up')    g = rotateCCW(g);
        if (dir === 'down')  g = rotateCW(g);
        if (dir === 'right') g = g.map(r => r.slice().reverse());

        for (let r = 0; r < G2048_SIZE; r++) {
            const row = g[r].filter(v => v !== 0);
            for (let i = 0; i < row.length - 1; i++) {
                if (row[i] === row[i + 1]) {
                    row[i] *= 2;
                    this.score += row[i];
                    if (row[i] >= 2048) this.won = true;
                    row.splice(i + 1, 1);
                }
            }
            while (row.length < G2048_SIZE) row.push(0);
            g[r] = row;
        }

        if (dir === 'up')    g = rotateCW(g);
        if (dir === 'down')  g = rotateCCW(g);
        if (dir === 'right') g = g.map(r => r.slice().reverse());

        const after = JSON.stringify(g);
        if (before === after) return;
        this.grid = g;
        this.addRandom();

        if (this.score > this.best) {
            this.best = this.score;
            try { localStorage.setItem(G2048_BEST_KEY, this.best); } catch {}
        }
        this.render();

        if (this.won && !this.overAck) {
            this.showOverlay('🎉 You reached 2048!', `Score: ${this.score}. Keep playing or start over.`);
            this.overAck = true;
        }
        if (!this.hasMoves()) {
            this.over = true;
            this.showOverlay('Game Over', `Score: ${this.score} · Best: ${this.best}`);
        }
    }

    hasMoves() {
        for (let r = 0; r < G2048_SIZE; r++)
            for (let c = 0; c < G2048_SIZE; c++) {
                if (this.grid[r][c] === 0) return true;
                if (c + 1 < G2048_SIZE && this.grid[r][c] === this.grid[r][c + 1]) return true;
                if (r + 1 < G2048_SIZE && this.grid[r][c] === this.grid[r + 1][c]) return true;
            }
        return false;
    }

    showOverlay(title, body) {
        this.overlayTitle.textContent = title;
        this.overlayBody.textContent = body;
        this.overlayEl.hidden = false;
    }

    render() {
        this.boardEl.innerHTML = '';
        for (let r = 0; r < G2048_SIZE; r++) {
            for (let c = 0; c < G2048_SIZE; c++) {
                const cell = document.createElement('div');
                const v = this.grid[r][c];
                cell.className = 'g2048-tile' + (v ? ' v-' + Math.min(v, 2048) : '');
                cell.textContent = v || '';
                this.boardEl.appendChild(cell);
            }
        }
        this.scoreEl.textContent = this.score;
        this.bestEl.textContent = this.best;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(() => new Game2048(), 100));
} else {
    setTimeout(() => new Game2048(), 100);
}
