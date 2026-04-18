// ==================================================================
// Match 3 — swap adjacent gems, clear 3+ in a row/column
// ==================================================================

const M3_SIZE = 8;
const M3_COLORS = ['🔴', '🟢', '🔵', '🟡', '🟣', '🟠'];
const M3_MOVES_PER_GAME = 30;
const M3_ANIM_MS = 220;
const M3_BEST_KEY = 'match3_best_score';

class Match3 {
    constructor() {
        this.board = document.getElementById('match3-board');
        if (!this.board) return;

        this.grid = [];
        this.selected = null;
        this.score = 0;
        this.moves = M3_MOVES_PER_GAME;
        this.isProcessing = false;
        this.best = parseInt(localStorage.getItem(M3_BEST_KEY), 10) || 0;

        document.getElementById('match3-restart').addEventListener('click', () => this.restart());
        document.getElementById('match3-overlay-btn').addEventListener('click', () => this.restart());

        this.initGrid();
        this.renderBoard();
        this.updateHud();
        this.hideOverlay();
    }

    // ----- Grid setup -----
    initGrid() {
        do {
            this.grid = Array.from({ length: M3_SIZE }, () =>
                Array.from({ length: M3_SIZE }, () => this.randomGem())
            );
        } while (this.findMatches().size > 0 || !this.hasValidMove());
    }

    randomGem() {
        return Math.floor(Math.random() * M3_COLORS.length);
    }

    // ----- Rendering -----
    renderBoard() {
        this.board.innerHTML = '';
        for (let r = 0; r < M3_SIZE; r++) {
            for (let c = 0; c < M3_SIZE; c++) {
                const cell = document.createElement('div');
                cell.className = `gem gem-${this.grid[r][c]}`;
                cell.dataset.row = r;
                cell.dataset.col = c;
                cell.textContent = M3_COLORS[this.grid[r][c]];
                cell.addEventListener('click', () => this.handleClick(r, c));
                this.board.appendChild(cell);
            }
        }
    }

    cellAt(r, c) {
        return this.board.children[r * M3_SIZE + c];
    }

    updateCell(r, c) {
        const cell = this.cellAt(r, c);
        if (!cell) return;
        const val = this.grid[r][c];
        cell.className = val === -1 ? 'gem empty' : `gem gem-${val}`;
        cell.textContent = val === -1 ? '' : M3_COLORS[val];
    }

    updateHud() {
        document.getElementById('match3-score').textContent = this.score;
        document.getElementById('match3-moves').textContent = this.moves;
        document.getElementById('match3-best').textContent = this.best;
    }

    // ----- Match detection -----
    findMatches() {
        const matches = new Set();

        const scan = (getVal, addKey, outer, inner) => {
            for (let i = 0; i < outer; i++) {
                let runStart = 0;
                for (let j = 1; j <= inner; j++) {
                    if (j < inner && getVal(i, j) !== -1 && getVal(i, j) === getVal(i, runStart)) continue;
                    if (j - runStart >= 3 && getVal(i, runStart) !== -1) {
                        for (let k = runStart; k < j; k++) addKey(i, k);
                    }
                    runStart = j;
                }
            }
        };

        // horizontal: outer = row, inner = col
        scan(
            (r, c) => this.grid[r][c],
            (r, c) => matches.add(`${r},${c}`),
            M3_SIZE, M3_SIZE
        );
        // vertical: outer = col, inner = row
        scan(
            (c, r) => this.grid[r][c],
            (c, r) => matches.add(`${r},${c}`),
            M3_SIZE, M3_SIZE
        );

        return matches;
    }

    hasValidMove() {
        for (let r = 0; r < M3_SIZE; r++) {
            for (let c = 0; c < M3_SIZE; c++) {
                if (c < M3_SIZE - 1) {
                    this.swap(r, c, r, c + 1);
                    const ok = this.findMatches().size > 0;
                    this.swap(r, c, r, c + 1);
                    if (ok) return true;
                }
                if (r < M3_SIZE - 1) {
                    this.swap(r, c, r + 1, c);
                    const ok = this.findMatches().size > 0;
                    this.swap(r, c, r + 1, c);
                    if (ok) return true;
                }
            }
        }
        return false;
    }

    // ----- Input -----
    async handleClick(r, c) {
        if (this.isProcessing || this.moves <= 0) return;

        if (!this.selected) {
            this.selected = { r, c };
            this.cellAt(r, c).classList.add('selected');
            return;
        }

        const { r: sr, c: sc } = this.selected;
        this.cellAt(sr, sc).classList.remove('selected');
        this.selected = null;

        if (sr === r && sc === c) return;

        const isAdjacent = Math.abs(sr - r) + Math.abs(sc - c) === 1;
        if (!isAdjacent) {
            this.selected = { r, c };
            this.cellAt(r, c).classList.add('selected');
            return;
        }

        this.isProcessing = true;

        this.swap(sr, sc, r, c);
        this.updateCell(sr, sc);
        this.updateCell(r, c);
        await this.sleep(M3_ANIM_MS / 2);

        if (this.findMatches().size === 0) {
            // invalid — bounce back
            this.swap(sr, sc, r, c);
            this.cellAt(sr, sc).classList.add('bounce');
            this.cellAt(r, c).classList.add('bounce');
            await this.sleep(M3_ANIM_MS);
            this.updateCell(sr, sc);
            this.updateCell(r, c);
            this.cellAt(sr, sc).classList.remove('bounce');
            this.cellAt(r, c).classList.remove('bounce');
        } else {
            this.moves--;
            await this.resolveCascades();
            if (!this.hasValidMove()) {
                await this.reshuffle();
            }
        }

        this.isProcessing = false;
        this.updateHud();
        this.checkGameOver();
    }

    swap(r1, c1, r2, c2) {
        const tmp = this.grid[r1][c1];
        this.grid[r1][c1] = this.grid[r2][c2];
        this.grid[r2][c2] = tmp;
    }

    // ----- Cascades -----
    async resolveCascades() {
        let multiplier = 1;
        while (true) {
            const matches = this.findMatches();
            if (matches.size === 0) break;

            const gained = matches.size * 10 * multiplier;
            this.score += gained;
            this.updateHud();

            for (const key of matches) {
                const [r, c] = key.split(',').map(Number);
                this.cellAt(r, c).classList.add('clearing');
            }
            await this.sleep(M3_ANIM_MS);

            for (const key of matches) {
                const [r, c] = key.split(',').map(Number);
                this.grid[r][c] = -1;
            }

            this.applyGravity();
            this.fillTop();

            for (let r = 0; r < M3_SIZE; r++) {
                for (let c = 0; c < M3_SIZE; c++) this.updateCell(r, c);
            }

            this.board.classList.add('dropping');
            await this.sleep(M3_ANIM_MS);
            this.board.classList.remove('dropping');

            multiplier++;
        }
    }

    applyGravity() {
        for (let c = 0; c < M3_SIZE; c++) {
            let writeRow = M3_SIZE - 1;
            for (let r = M3_SIZE - 1; r >= 0; r--) {
                if (this.grid[r][c] !== -1) {
                    if (writeRow !== r) {
                        this.grid[writeRow][c] = this.grid[r][c];
                        this.grid[r][c] = -1;
                    }
                    writeRow--;
                }
            }
        }
    }

    fillTop() {
        for (let c = 0; c < M3_SIZE; c++) {
            for (let r = 0; r < M3_SIZE; r++) {
                if (this.grid[r][c] === -1) this.grid[r][c] = this.randomGem();
            }
        }
    }

    async reshuffle() {
        do {
            const flat = this.grid.flat();
            for (let i = flat.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [flat[i], flat[j]] = [flat[j], flat[i]];
            }
            for (let r = 0; r < M3_SIZE; r++) {
                for (let c = 0; c < M3_SIZE; c++) this.grid[r][c] = flat[r * M3_SIZE + c];
            }
        } while (this.findMatches().size > 0 || !this.hasValidMove());

        for (let r = 0; r < M3_SIZE; r++) {
            for (let c = 0; c < M3_SIZE; c++) this.updateCell(r, c);
        }
        this.board.classList.add('dropping');
        await this.sleep(M3_ANIM_MS);
        this.board.classList.remove('dropping');
    }

    // ----- Game state -----
    checkGameOver() {
        if (this.moves > 0) return;
        if (this.score > this.best) {
            this.best = this.score;
            try { localStorage.setItem(M3_BEST_KEY, this.best); } catch {}
        }
        this.updateHud();
        this.showOverlay();
    }

    showOverlay() {
        const newBest = this.score === this.best && this.score > 0;
        document.getElementById('match3-overlay-title').textContent = newBest ? '🎉 New Best Score!' : '🏁 Game Over';
        document.getElementById('match3-overlay-body').textContent = `Final score: ${this.score}`;
        document.getElementById('match3-overlay').classList.add('show');
    }

    hideOverlay() {
        document.getElementById('match3-overlay').classList.remove('show');
    }

    restart() {
        this.score = 0;
        this.moves = M3_MOVES_PER_GAME;
        this.selected = null;
        this.isProcessing = false;
        this.initGrid();
        this.renderBoard();
        this.updateHud();
        this.hideOverlay();
    }

    sleep(ms) {
        return new Promise(res => setTimeout(res, ms));
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(() => new Match3(), 100));
} else {
    setTimeout(() => new Match3(), 100);
}
