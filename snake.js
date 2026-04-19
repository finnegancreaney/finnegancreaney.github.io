// ==================================================================
// Snake — classic. Arrow keys / WASD. Eat apples, don't crash.
// ==================================================================

const SNAKE_GRID = 20;
const SNAKE_TILE = 20;
const SNAKE_SPEED_MS = 110;
const SNAKE_BEST_KEY = 'snake_best_score';

class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('snakeCanvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.scoreEl = document.getElementById('snake-score');
        this.bestEl = document.getElementById('snake-best');
        this.best = parseInt(localStorage.getItem(SNAKE_BEST_KEY), 10) || 0;

        document.getElementById('snake-restart').addEventListener('click', () => this.reset());
        window.addEventListener('keydown', (e) => this.onKey(e));

        this.reset();
        setInterval(() => this.step(), SNAKE_SPEED_MS);
    }

    reset() {
        this.snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
        this.dir = { x: 1, y: 0 };
        this.pendingDir = this.dir;
        this.score = 0;
        this.over = false;
        this.placeFood();
        this.updateHud();
        this.render();
    }

    placeFood() {
        while (true) {
            const x = Math.floor(Math.random() * SNAKE_GRID);
            const y = Math.floor(Math.random() * SNAKE_GRID);
            if (!this.snake.some(s => s.x === x && s.y === y)) {
                this.food = { x, y };
                return;
            }
        }
    }

    onKey(e) {
        if (document.getElementById('snake')?.classList.contains('active') === false) return;
        const map = {
            ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
            ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
            w: { x: 0, y: -1 }, s: { x: 0, y: 1 }, a: { x: -1, y: 0 }, d: { x: 1, y: 0 }
        };
        const d = map[e.key];
        if (!d) return;
        if (d.x === -this.dir.x && d.y === -this.dir.y) return; // no 180
        this.pendingDir = d;
        e.preventDefault();
    }

    step() {
        if (this.over) return;
        if (!document.getElementById('snake')?.classList.contains('active')) return;
        this.dir = this.pendingDir;
        const head = { x: this.snake[0].x + this.dir.x, y: this.snake[0].y + this.dir.y };
        if (head.x < 0 || head.x >= SNAKE_GRID || head.y < 0 || head.y >= SNAKE_GRID) return this.die();
        if (this.snake.some(s => s.x === head.x && s.y === head.y)) return this.die();
        this.snake.unshift(head);
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            if (this.score > this.best) {
                this.best = this.score;
                try { localStorage.setItem(SNAKE_BEST_KEY, this.best); } catch {}
            }
            this.placeFood();
            this.updateHud();
        } else {
            this.snake.pop();
        }
        this.render();
    }

    die() {
        this.over = true;
        this.render();
    }

    updateHud() {
        this.scoreEl.textContent = this.score;
        this.bestEl.textContent = this.best;
    }

    render() {
        const { ctx } = this;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        for (let i = 0; i <= SNAKE_GRID; i++) {
            ctx.beginPath();
            ctx.moveTo(i * SNAKE_TILE, 0); ctx.lineTo(i * SNAKE_TILE, this.canvas.height); ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * SNAKE_TILE); ctx.lineTo(this.canvas.width, i * SNAKE_TILE); ctx.stroke();
        }

        // Food
        ctx.fillStyle = '#ef4444';
        this.drawCell(this.food.x, this.food.y);

        // Snake
        for (let i = 0; i < this.snake.length; i++) {
            ctx.fillStyle = i === 0 ? '#22c55e' : '#15803d';
            this.drawCell(this.snake[i].x, this.snake[i].y);
        }

        if (this.over) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 32px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Game Over', this.canvas.width / 2, this.canvas.height / 2 - 20);
            ctx.font = '18px Arial';
            ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 16);
            ctx.fillText('Click New Game', this.canvas.width / 2, this.canvas.height / 2 + 46);
        }
    }

    drawCell(x, y) {
        this.ctx.fillRect(x * SNAKE_TILE + 1, y * SNAKE_TILE + 1, SNAKE_TILE - 2, SNAKE_TILE - 2);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(() => new SnakeGame(), 100));
} else {
    setTimeout(() => new SnakeGame(), 100);
}
