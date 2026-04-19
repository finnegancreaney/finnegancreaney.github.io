// ==================================================================
// Minesweeper — reveal safe cells, flag mines, clear the board.
// ==================================================================

const MINES_DIFFICULTY = {
    easy:   { w: 9,  h: 9,  mines: 10 },
    medium: { w: 12, h: 12, mines: 20 },
    hard:   { w: 16, h: 16, mines: 40 }
};

class Minesweeper {
    constructor() {
        this.boardEl = document.getElementById('mines-board');
        if (!this.boardEl) return;
        this.countEl = document.getElementById('mines-count');
        this.flagsEl = document.getElementById('mines-flags');
        this.timeEl = document.getElementById('mines-time');
        this.levelEl = document.getElementById('mines-difficulty');

        document.getElementById('mines-restart').addEventListener('click', () => this.newGame());
        this.levelEl.addEventListener('change', () => this.newGame());

        this.newGame();
    }

    newGame() {
        const cfg = MINES_DIFFICULTY[this.levelEl.value];
        this.w = cfg.w;
        this.h = cfg.h;
        this.mineCount = cfg.mines;
        this.grid = Array.from({ length: this.h }, () =>
            Array.from({ length: this.w }, () => ({ mine: false, revealed: false, flagged: false, adj: 0 }))
        );
        this.over = false;
        this.firstClick = true;
        this.flagsUsed = 0;
        this.startTime = null;
        this.elapsed = 0;
        if (this._timer) clearInterval(this._timer);
        this.countEl.textContent = this.mineCount;
        this.flagsEl.textContent = 0;
        this.timeEl.textContent = 0;
        this.render();
    }

    plantMines(avoidR, avoidC) {
        const avoid = new Set();
        for (let dr = -1; dr <= 1; dr++)
            for (let dc = -1; dc <= 1; dc++)
                avoid.add(`${avoidR + dr},${avoidC + dc}`);
        let placed = 0;
        while (placed < this.mineCount) {
            const r = Math.floor(Math.random() * this.h);
            const c = Math.floor(Math.random() * this.w);
            if (avoid.has(`${r},${c}`) || this.grid[r][c].mine) continue;
            this.grid[r][c].mine = true;
            placed++;
        }
        for (let r = 0; r < this.h; r++)
            for (let c = 0; c < this.w; c++) {
                if (this.grid[r][c].mine) continue;
                let n = 0;
                for (let dr = -1; dr <= 1; dr++)
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = r + dr, nc = c + dc;
                        if (nr < 0 || nr >= this.h || nc < 0 || nc >= this.w) continue;
                        if (this.grid[nr][nc].mine) n++;
                    }
                this.grid[r][c].adj = n;
            }
    }

    startTimer() {
        this.startTime = Date.now();
        this._timer = setInterval(() => {
            this.elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            this.timeEl.textContent = this.elapsed;
        }, 500);
    }

    reveal(r, c) {
        if (this.over) return;
        if (this.firstClick) {
            this.plantMines(r, c);
            this.firstClick = false;
            this.startTimer();
        }
        const cell = this.grid[r][c];
        if (cell.revealed || cell.flagged) return;
        cell.revealed = true;
        if (cell.mine) {
            this.over = true;
            clearInterval(this._timer);
            this.revealAllMines();
            this.render();
            return;
        }
        if (cell.adj === 0) {
            // cascade
            const stack = [[r, c]];
            while (stack.length) {
                const [cr, cc] = stack.pop();
                for (let dr = -1; dr <= 1; dr++)
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = cr + dr, nc = cc + dc;
                        if (nr < 0 || nr >= this.h || nc < 0 || nc >= this.w) continue;
                        const nb = this.grid[nr][nc];
                        if (nb.revealed || nb.flagged || nb.mine) continue;
                        nb.revealed = true;
                        if (nb.adj === 0) stack.push([nr, nc]);
                    }
            }
        }
        this.checkWin();
        this.render();
    }

    toggleFlag(r, c) {
        if (this.over) return;
        const cell = this.grid[r][c];
        if (cell.revealed) return;
        cell.flagged = !cell.flagged;
        this.flagsUsed += cell.flagged ? 1 : -1;
        this.flagsEl.textContent = this.flagsUsed;
        this.render();
    }

    revealAllMines() {
        for (let r = 0; r < this.h; r++)
            for (let c = 0; c < this.w; c++)
                if (this.grid[r][c].mine) this.grid[r][c].revealed = true;
    }

    checkWin() {
        for (let r = 0; r < this.h; r++)
            for (let c = 0; c < this.w; c++) {
                const cell = this.grid[r][c];
                if (!cell.mine && !cell.revealed) return;
            }
        this.over = true;
        this.won = true;
        clearInterval(this._timer);
    }

    render() {
        this.boardEl.style.gridTemplateColumns = `repeat(${this.w}, 1fr)`;
        this.boardEl.innerHTML = '';
        for (let r = 0; r < this.h; r++) {
            for (let c = 0; c < this.w; c++) {
                const cell = this.grid[r][c];
                const el = document.createElement('button');
                el.className = 'mines-cell';
                el.dataset.r = r;
                el.dataset.c = c;
                if (cell.revealed) {
                    el.classList.add('revealed');
                    if (cell.mine) {
                        el.classList.add('mine');
                        el.textContent = '💣';
                    } else if (cell.adj > 0) {
                        el.textContent = cell.adj;
                        el.classList.add('n' + cell.adj);
                    }
                } else if (cell.flagged) {
                    el.textContent = '🚩';
                }
                el.addEventListener('click', () => this.reveal(r, c));
                el.addEventListener('contextmenu', (e) => { e.preventDefault(); this.toggleFlag(r, c); });
                // long-press for mobile
                let longPress = null;
                el.addEventListener('touchstart', () => {
                    longPress = setTimeout(() => { this.toggleFlag(r, c); longPress = 'done'; }, 400);
                }, { passive: true });
                el.addEventListener('touchend', () => {
                    if (longPress === 'done') { longPress = null; return; }
                    if (longPress) { clearTimeout(longPress); }
                });
                this.boardEl.appendChild(el);
            }
        }
        if (this.over) {
            const banner = document.createElement('div');
            banner.className = 'mines-banner ' + (this.won ? 'won' : 'lost');
            banner.textContent = this.won ? `🎉 You cleared it in ${this.elapsed}s!` : '💥 Boom! Game over.';
            this.boardEl.appendChild(banner);
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(() => new Minesweeper(), 100));
} else {
    setTimeout(() => new Minesweeper(), 100);
}
