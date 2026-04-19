// ==================================================================
// Klondike Solitaire — click to select, click destination to move.
// ==================================================================

const SOL_SUITS = {
    hearts:   { symbol: '♥', color: 'red' },
    diamonds: { symbol: '♦', color: 'red' },
    clubs:    { symbol: '♣', color: 'black' },
    spades:   { symbol: '♠', color: 'black' }
};
const SOL_RANK_NAMES = ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

class Solitaire {
    constructor() {
        this.tableEl = document.getElementById('sol-table');
        if (!this.tableEl) return;
        this.scoreEl = document.getElementById('sol-score');
        this.movesEl = document.getElementById('sol-moves');
        document.getElementById('sol-restart').addEventListener('click', () => this.newDeal());
        this.newDeal();
    }

    newDeal() {
        const deck = [];
        for (const s of Object.keys(SOL_SUITS))
            for (let r = 1; r <= 13; r++) deck.push({ suit: s, rank: r, faceUp: false });
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }

        this.tableau = [[], [], [], [], [], [], []];
        for (let col = 0; col < 7; col++) {
            for (let row = 0; row <= col; row++) {
                const card = deck.pop();
                card.faceUp = (row === col);
                this.tableau[col].push(card);
            }
        }
        this.stock = deck.map(c => ({ ...c, faceUp: false }));
        this.waste = [];
        this.foundations = [[], [], [], []];
        this.selected = null;
        this.moves = 0;
        this.score = 0;
        this.won = false;
        this.render();
    }

    drawFromStock() {
        if (this.selected) { this.selected = null; this.render(); return; }
        if (this.stock.length === 0) {
            this.stock = this.waste.slice().reverse().map(c => ({ ...c, faceUp: false }));
            this.waste = [];
        } else {
            const card = this.stock.pop();
            card.faceUp = true;
            this.waste.push(card);
        }
        this.incMoves();
        this.render();
    }

    canPlaceFoundation(card, pile) {
        if (pile.length === 0) return card.rank === 1;
        const top = pile[pile.length - 1];
        return card.suit === top.suit && card.rank === top.rank + 1;
    }

    canPlaceTableau(firstCard, col) {
        if (col.length === 0) return firstCard.rank === 13;
        const top = col[col.length - 1];
        if (!top.faceUp) return false;
        return SOL_SUITS[firstCard.suit].color !== SOL_SUITS[top.suit].color
            && firstCard.rank === top.rank - 1;
    }

    isValidSequence(cards) {
        for (let i = 1; i < cards.length; i++) {
            if (SOL_SUITS[cards[i].suit].color === SOL_SUITS[cards[i - 1].suit].color) return false;
            if (cards[i].rank !== cards[i - 1].rank - 1) return false;
        }
        return true;
    }

    selectedMatches(source) {
        if (!this.selected) return false;
        if (this.selected.type !== source.type || this.selected.idx !== source.idx) return false;
        if (source.type === 'tableau') return source.cardIdx >= this.selected.cardIdx;
        return true;
    }

    onCardClick(source) {
        // Don't let face-down cards be clicked (handled in cardEl)
        if (this.selected) {
            // Clicking the currently-selected card or lower deselects
            if (this.selected.type === source.type && this.selected.idx === source.idx
                && (source.type !== 'tableau' || this.selected.cardIdx === source.cardIdx)) {
                this.selected = null;
                this.render();
                return;
            }
            this.tryMove(source);
        } else {
            this.selected = source;
            this.render();
        }
    }

    onEmptyDest(type, idx) {
        if (!this.selected) return;
        this.tryMove({ type, idx });
    }

    tryMove(dest) {
        const src = this.selected;
        let cards;
        if (src.type === 'waste') cards = [this.waste[this.waste.length - 1]];
        else if (src.type === 'foundation') cards = [this.foundations[src.idx][this.foundations[src.idx].length - 1]];
        else if (src.type === 'tableau') cards = this.tableau[src.idx].slice(src.cardIdx);
        if (!cards || !cards.length) { this.selected = null; this.render(); return; }

        let placed = false;
        if (dest.type === 'foundation') {
            if (cards.length === 1 && this.canPlaceFoundation(cards[0], this.foundations[dest.idx])) {
                this.foundations[dest.idx].push(cards[0]);
                placed = true;
                this.score += 10;
            }
        } else if (dest.type === 'tableau') {
            if (this.isValidSequence(cards) && this.canPlaceTableau(cards[0], this.tableau[dest.idx])) {
                this.tableau[dest.idx].push(...cards);
                placed = true;
            }
        }

        if (placed) {
            if (src.type === 'waste') {
                this.waste.pop();
            } else if (src.type === 'foundation') {
                this.foundations[src.idx].pop();
            } else if (src.type === 'tableau') {
                this.tableau[src.idx].splice(src.cardIdx, cards.length);
                const col = this.tableau[src.idx];
                if (col.length > 0 && !col[col.length - 1].faceUp) {
                    col[col.length - 1].faceUp = true;
                    this.score += 5;
                }
            }
            this.incMoves();
        }
        this.selected = null;
        this.render();
        this.checkWin();
    }

    incMoves() {
        this.moves++;
        this.movesEl.textContent = this.moves;
        this.scoreEl.textContent = this.score;
    }

    checkWin() {
        const total = this.foundations.reduce((a, f) => a + f.length, 0);
        if (total === 52 && !this.won) {
            this.won = true;
            setTimeout(() => alert(`🎉 You won in ${this.moves} moves! Score: ${this.score}`), 100);
        }
    }

    cardEl(card, source) {
        const el = document.createElement('div');
        if (!card.faceUp) {
            el.className = 'sol-card back';
            return el;
        }
        const info = SOL_SUITS[card.suit];
        el.className = `sol-card face ${info.color}`;
        el.innerHTML = `<span class="sol-rank">${SOL_RANK_NAMES[card.rank]}</span><span class="sol-suit">${info.symbol}</span>`;
        if (this.selectedMatches(source)) el.classList.add('selected');
        el.addEventListener('click', (e) => { e.stopPropagation(); this.onCardClick(source); });
        return el;
    }

    render() {
        this.scoreEl.textContent = this.score;
        this.movesEl.textContent = this.moves;
        this.tableEl.innerHTML = '';

        const top = document.createElement('div');
        top.className = 'sol-row sol-top';

        // Stock
        const stockEl = document.createElement('div');
        stockEl.className = 'sol-pile sol-stock';
        if (this.stock.length > 0) {
            const back = document.createElement('div');
            back.className = 'sol-card back';
            stockEl.appendChild(back);
        } else {
            const empty = document.createElement('div');
            empty.className = 'sol-empty';
            empty.textContent = this.waste.length > 0 ? '↻' : '';
            stockEl.appendChild(empty);
        }
        stockEl.addEventListener('click', () => this.drawFromStock());
        top.appendChild(stockEl);

        // Waste
        const wasteEl = document.createElement('div');
        wasteEl.className = 'sol-pile sol-waste';
        if (this.waste.length > 0) {
            wasteEl.appendChild(this.cardEl(this.waste[this.waste.length - 1], { type: 'waste', idx: 0 }));
        } else {
            const empty = document.createElement('div');
            empty.className = 'sol-empty';
            wasteEl.appendChild(empty);
        }
        top.appendChild(wasteEl);

        const spacer = document.createElement('div');
        spacer.className = 'sol-spacer';
        top.appendChild(spacer);

        // Foundations
        this.foundations.forEach((f, i) => {
            const fEl = document.createElement('div');
            fEl.className = 'sol-pile sol-foundation';
            if (f.length > 0) {
                fEl.appendChild(this.cardEl(f[f.length - 1], { type: 'foundation', idx: i }));
            } else {
                const empty = document.createElement('div');
                empty.className = 'sol-empty foundation-slot';
                empty.textContent = '♢';
                empty.addEventListener('click', () => this.onEmptyDest('foundation', i));
                fEl.appendChild(empty);
            }
            top.appendChild(fEl);
        });
        this.tableEl.appendChild(top);

        // Tableau
        const bottom = document.createElement('div');
        bottom.className = 'sol-row sol-tableau-row';
        this.tableau.forEach((col, i) => {
            const colEl = document.createElement('div');
            colEl.className = 'sol-pile sol-column';
            if (col.length === 0) {
                const empty = document.createElement('div');
                empty.className = 'sol-empty tableau-slot';
                empty.addEventListener('click', () => this.onEmptyDest('tableau', i));
                colEl.appendChild(empty);
            } else {
                col.forEach((c, j) => {
                    const cEl = this.cardEl(c, { type: 'tableau', idx: i, cardIdx: j });
                    cEl.style.marginTop = j === 0 ? '0' : (c.faceUp ? '-70px' : '-85px');
                    colEl.appendChild(cEl);
                });
            }
            bottom.appendChild(colEl);
        });
        this.tableEl.appendChild(bottom);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(() => new Solitaire(), 100));
} else {
    setTimeout(() => new Solitaire(), 100);
}
