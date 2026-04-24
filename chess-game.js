// ==================================================================
// Chess — chessboard.js (UI) + chess.js (rules) + tiny minimax AI.
// You play white, computer plays black.
// ==================================================================

const CHESS_PIECE_VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

class ChessGame {
    constructor() {
        this.boardDiv = document.getElementById('chess-board');
        this.chessPage = document.getElementById('chess');
        if (!this.boardDiv || !this.chessPage) return;

        this.initialized = false;

        // Defer init until the chess tab becomes visible — chessboard.js
        // reads container width at construction time. If we call it synchronously
        // from the MutationObserver, layout hasn't flushed after display:none→block,
        // so width is 0 and squares render as invisible.
        const deferredInit = () => {
            // Double rAF: one to get past the current frame, one to ensure
            // the browser has painted the newly-visible container.
            requestAnimationFrame(() => requestAnimationFrame(() => {
                if (this.chessPage.classList.contains('active')) this.init();
            }));
        };
        if (this.chessPage.classList.contains('active')) {
            deferredInit();
        } else {
            const observer = new MutationObserver(() => {
                if (!this.chessPage.classList.contains('active')) return;
                if (!this.initialized) {
                    deferredInit();
                } else if (this.board) {
                    requestAnimationFrame(() => this.board.resize());
                }
            });
            observer.observe(this.chessPage, { attributes: true, attributeFilter: ['class'] });
        }
    }

    init() {
        if (this.initialized) return;
        if (typeof Chess === 'undefined' || typeof Chessboard === 'undefined' || typeof jQuery === 'undefined') {
            this.boardDiv.innerHTML = '<p style="padding:12px;color:#991b1b;">Chess libraries failed to load. Check your internet connection and refresh.</p>';
            return;
        }

        this.statusEl = document.getElementById('chess-status');
        this.levelEl = document.getElementById('chess-level');
        this.game = new Chess();

        const config = {
            draggable: true,
            position: 'start',
            onDragStart: (src, piece) => this.onDragStart(src, piece),
            onDrop: (src, dst) => this.onDrop(src, dst),
            onSnapEnd: () => this.board.position(this.game.fen()),
            pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
        };
        this.board = Chessboard('chess-board', config);

        document.getElementById('chess-restart').addEventListener('click', () => this.reset());
        document.getElementById('chess-undo').addEventListener('click', () => this.undo());
        window.addEventListener('resize', () => this.board && this.board.resize());

        this.aiThinking = false;
        this.initialized = true;
        this.updateStatus();
        setTimeout(() => this.board.resize(), 50);
    }

    reset() {
        this.game.reset();
        this.board.start();
        this.aiThinking = false;
        this.updateStatus();
    }

    undo() {
        this.game.undo(); // undo AI
        this.game.undo(); // undo player
        this.board.position(this.game.fen());
        this.aiThinking = false;
        this.updateStatus();
    }

    onDragStart(src, piece) {
        if (this.game.game_over()) return false;
        if (this.aiThinking) return false;
        if (piece.search(/^b/) !== -1) return false; // can't drag black pieces
    }

    onDrop(src, dst) {
        const move = this.game.move({ from: src, to: dst, promotion: 'q' });
        if (move === null) return 'snapback';
        this.updateStatus();
        if (this.game.game_over()) return; // no AI reply if user just ended the game
        setTimeout(() => this.computerMove(), 250);
    }

    computerMove() {
        if (this.game.game_over()) { this.updateStatus(); return; }
        this.aiThinking = true;
        if (this.statusEl) this.statusEl.textContent = '🤔 Computer thinking…';

        // Yield once so the "thinking" status paints before we block.
        setTimeout(() => {
            try {
                const level = parseInt(this.levelEl.value, 10) || 2;
                const moves = this.game.moves({ verbose: true });
                if (moves.length === 0) return;

                let chosen = level <= 1
                    ? moves[Math.floor(Math.random() * moves.length)]
                    : this.bestMove(level);
                if (!chosen) chosen = moves[0];

                const result = this.game.move(chosen);
                if (result === null) {
                    console.warn('Chess AI: picked move rejected, falling back', chosen);
                    this.game.move(moves[0]);
                }
            } catch (e) {
                console.error('Chess AI error, playing random legal move:', e);
                try {
                    const legal = this.game.moves({ verbose: true });
                    if (legal.length > 0) this.game.move(legal[0]);
                } catch (ee) { console.error('Fallback also failed', ee); }
            } finally {
                // CRITICAL: always reset aiThinking and redraw, even if anything above threw.
                try { this.board.position(this.game.fen()); } catch (e) { console.error('Board redraw failed', e); }
                this.aiThinking = false;
                try { this.updateStatus(); } catch (e) { console.error('Status update failed', e); }
            }
        }, 30);
    }

    evaluate() {
        const board = this.game.board();
        let score = 0;
        for (const row of board) {
            for (const sq of row) {
                if (!sq) continue;
                const v = CHESS_PIECE_VALUE[sq.type] || 0;
                score += sq.color === 'b' ? v : -v;
            }
        }
        return score; // positive is good for black (computer)
    }

    bestMove(depth) {
        const moves = this.game.moves({ verbose: true });
        let best = null;
        let bestScore = -Infinity;
        for (const m of moves) {
            this.game.move(m);
            const score = this.minimax(depth - 1, -Infinity, Infinity, false);
            this.game.undo();
            if (score > bestScore || (score === bestScore && Math.random() < 0.3)) {
                bestScore = score;
                best = m;
            }
        }
        return best || moves[0];
    }

    minimax(depth, alpha, beta, maximising) {
        if (depth === 0 || this.game.game_over()) return this.evaluate();
        const moves = this.game.moves({ verbose: true });
        if (maximising) {
            let value = -Infinity;
            for (const m of moves) {
                this.game.move(m);
                value = Math.max(value, this.minimax(depth - 1, alpha, beta, false));
                this.game.undo();
                alpha = Math.max(alpha, value);
                if (alpha >= beta) break;
            }
            return value;
        } else {
            let value = Infinity;
            for (const m of moves) {
                this.game.move(m);
                value = Math.min(value, this.minimax(depth - 1, alpha, beta, true));
                this.game.undo();
                beta = Math.min(beta, value);
                if (alpha >= beta) break;
            }
            return value;
        }
    }

    updateStatus() {
        if (!this.statusEl) return;
        let status;
        const turn = this.game.turn() === 'w' ? 'White' : 'Black';
        this.statusEl.style.color = '';
        if (this.game.in_checkmate()) {
            status = `🏁 Checkmate — ${turn === 'White' ? 'Computer wins 🤖' : 'You win! 🎉'}  · Hit New Game`;
            this.statusEl.style.color = '#991b1b';
        } else if (this.game.in_stalemate()) {
            status = '🤝 Stalemate — draw. Hit New Game';
            this.statusEl.style.color = '#6b4e00';
        } else if (this.game.insufficient_material()) {
            status = '🤝 Draw (insufficient material). Hit New Game';
            this.statusEl.style.color = '#6b4e00';
        } else if (this.game.in_threefold_repetition()) {
            status = '🤝 Draw (threefold repetition). Hit New Game';
            this.statusEl.style.color = '#6b4e00';
        } else if (this.game.in_draw()) {
            status = '🤝 Draw. Hit New Game';
            this.statusEl.style.color = '#6b4e00';
        } else {
            status = `${turn} to move`;
            if (this.game.in_check()) status += ' — check!';
        }
        this.statusEl.textContent = status;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(() => new ChessGame(), 300));
} else {
    setTimeout(() => new ChessGame(), 300);
}
