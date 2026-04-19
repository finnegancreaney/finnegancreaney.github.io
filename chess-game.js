// ==================================================================
// Chess — chessboard.js (UI) + chess.js (rules) + tiny minimax AI.
// You play white, computer plays black.
// ==================================================================

const CHESS_PIECE_VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

class ChessGame {
    constructor() {
        this.boardDiv = document.getElementById('chess-board');
        if (!this.boardDiv) return;
        if (typeof Chess === 'undefined' || typeof Chessboard === 'undefined') {
            this.boardDiv.textContent = 'Chess libraries failed to load. Check your internet connection.';
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
            pieceTheme: 'https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/website/img/chesspieces/wikipedia/{piece}.png'
        };
        this.board = Chessboard('chess-board', config);

        document.getElementById('chess-restart').addEventListener('click', () => this.reset());
        document.getElementById('chess-undo').addEventListener('click', () => this.undo());
        window.addEventListener('resize', () => this.board.resize());

        this.updateStatus();
    }

    reset() {
        this.game.reset();
        this.board.start();
        this.updateStatus();
    }

    undo() {
        this.game.undo(); // undo AI
        this.game.undo(); // undo player
        this.board.position(this.game.fen());
        this.updateStatus();
    }

    onDragStart(src, piece) {
        if (this.game.game_over()) return false;
        if (piece.search(/^b/) !== -1) return false; // can't drag black pieces
    }

    onDrop(src, dst) {
        const move = this.game.move({ from: src, to: dst, promotion: 'q' });
        if (move === null) return 'snapback';
        this.updateStatus();
        setTimeout(() => this.computerMove(), 250);
    }

    computerMove() {
        if (this.game.game_over()) return;
        const level = parseInt(this.levelEl.value, 10) || 2;
        const moves = this.game.moves();
        if (moves.length === 0) return;

        let chosen;
        if (level <= 1) {
            chosen = moves[Math.floor(Math.random() * moves.length)];
        } else {
            chosen = this.bestMove(level);
        }
        this.game.move(chosen);
        this.board.position(this.game.fen());
        this.updateStatus();
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
        const moves = this.game.moves();
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
        const moves = this.game.moves();
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
        let status;
        const turn = this.game.turn() === 'w' ? 'White' : 'Black';
        if (this.game.in_checkmate()) {
            status = `Checkmate! ${turn === 'White' ? 'Computer' : 'You'} won.`;
        } else if (this.game.in_draw()) {
            status = 'Draw.';
        } else {
            status = `${turn} to move`;
            if (this.game.in_check()) status += ' (in check!)';
        }
        if (this.statusEl) this.statusEl.textContent = status;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(() => new ChessGame(), 300));
} else {
    setTimeout(() => new ChessGame(), 300);
}
