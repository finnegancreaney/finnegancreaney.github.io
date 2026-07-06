// ==================================================================
// Blackjack (21) — casino rules: dealer stands on 17, blackjack pays 3:2,
// Hit / Stand / Double Down, chip bankroll persisted to localStorage.
// ==================================================================

const BJ_SUITS = {
    hearts:   { symbol: '♥', color: 'red' },
    diamonds: { symbol: '♦', color: 'red' },
    clubs:    { symbol: '♣', color: 'black' },
    spades:   { symbol: '♠', color: 'black' }
};
const BJ_RANK_NAMES = ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const BJ_START_BANK = 500;
const BJ_BANK_KEY = 'bj_bankroll_v1';
const BJ_CHIPS = [5, 25, 50, 100];

class Blackjack {
    constructor() {
        this.tableEl = document.getElementById('bj-table');
        if (!this.tableEl) return;
        this.dealerEl   = document.getElementById('bj-dealer-cards');
        this.playerEl   = document.getElementById('bj-player-cards');
        this.dealerScoreEl = document.getElementById('bj-dealer-score');
        this.playerScoreEl = document.getElementById('bj-player-score');
        this.bankEl     = document.getElementById('bj-bank');
        this.betEl      = document.getElementById('bj-bet');
        this.msgEl      = document.getElementById('bj-message');
        this.chipRow    = document.getElementById('bj-chips');
        this.actionRow  = document.getElementById('bj-actions');
        this.dealBtn    = document.getElementById('bj-deal');
        this.hitBtn     = document.getElementById('bj-hit');
        this.standBtn   = document.getElementById('bj-stand');
        this.doubleBtn  = document.getElementById('bj-double');
        this.clearBtn   = document.getElementById('bj-clear');

        this.bank = this.loadBank();
        this.bet = 0;
        this.inRound = false;

        this.buildChips();
        this.dealBtn.addEventListener('click', () => this.deal());
        this.clearBtn.addEventListener('click', () => this.clearBet());
        this.hitBtn.addEventListener('click', () => this.hit());
        this.standBtn.addEventListener('click', () => this.stand());
        this.doubleBtn.addEventListener('click', () => this.doubleDown());

        this.resetTable();
        this.render();
    }

    loadBank() {
        const v = parseInt(localStorage.getItem(BJ_BANK_KEY), 10);
        return (Number.isFinite(v) && v > 0) ? v : BJ_START_BANK;
    }
    saveBank() { localStorage.setItem(BJ_BANK_KEY, String(this.bank)); }

    newShoe() {
        // 4-deck shoe, reshuffled whenever it runs low.
        this.shoe = [];
        for (let d = 0; d < 4; d++)
            for (const s of Object.keys(BJ_SUITS))
                for (let r = 1; r <= 13; r++) this.shoe.push({ suit: s, rank: r });
        for (let i = this.shoe.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.shoe[i], this.shoe[j]] = [this.shoe[j], this.shoe[i]];
        }
    }

    draw() {
        if (!this.shoe || this.shoe.length < 20) this.newShoe();
        return this.shoe.pop();
    }

    resetTable() {
        this.dealer = [];
        this.player = [];
        this.hideHole = false;
    }

    buildChips() {
        this.chipRow.innerHTML = '';
        BJ_CHIPS.forEach(v => {
            const b = document.createElement('button');
            b.className = `bj-chip chip-${v}`;
            b.textContent = v;
            b.addEventListener('click', () => this.addChip(v));
            this.chipRow.appendChild(b);
        });
    }

    addChip(v) {
        if (this.inRound) return;
        if (this.bet + v > this.bank) { this.flash('Not enough chips for that bet'); return; }
        this.bet += v;
        this.msgEl.textContent = 'Place your bet, then Deal.';
        this.render();
    }

    clearBet() {
        if (this.inRound) return;
        this.bet = 0;
        this.render();
    }

    // ---- Hand value with soft-ace handling ----
    handValue(cards) {
        let total = 0, aces = 0;
        for (const c of cards) {
            if (c.rank === 1) { aces++; total += 11; }
            else total += Math.min(c.rank, 10);
        }
        while (total > 21 && aces > 0) { total -= 10; aces--; }
        return { total, soft: aces > 0 };
    }

    isBlackjack(cards) {
        return cards.length === 2 && this.handValue(cards).total === 21;
    }

    deal() {
        if (this.inRound) return;
        if (this.bet <= 0) { this.flash('Place a bet first'); return; }
        if (this.bet > this.bank) { this.flash('Bet exceeds your chips'); return; }

        this.inRound = true;
        this.bank -= this.bet;            // stake goes on the table
        this.saveBank();
        this.resetTable();
        this.hideHole = true;
        this.player.push(this.draw(), this.draw());
        this.dealer.push(this.draw(), this.draw());
        this.msgEl.textContent = '';

        const playerBJ = this.isBlackjack(this.player);
        const dealerBJ = this.isBlackjack(this.dealer);
        if (playerBJ || dealerBJ) {
            this.hideHole = false;
            if (playerBJ && dealerBJ) this.settle('push', 'Both have Blackjack — push.');
            else if (playerBJ) this.settle('blackjack', 'Blackjack! You win 3:2 🎉');
            else this.settle('lose', 'Dealer has Blackjack. You lose.');
            return;
        }
        this.render();
    }

    canDouble() {
        return this.inRound && this.player.length === 2 && this.bank >= this.bet;
    }

    hit() {
        if (!this.inRound) return;
        this.player.push(this.draw());
        if (this.handValue(this.player).total > 21) {
            this.hideHole = false;
            this.settle('lose', 'Bust! You went over 21.');
        } else {
            this.render();
        }
    }

    doubleDown() {
        if (!this.canDouble()) return;
        this.bank -= this.bet;   // stake a second bet
        this.bet *= 2;
        this.saveBank();
        this.player.push(this.draw());
        if (this.handValue(this.player).total > 21) {
            this.hideHole = false;
            this.settle('lose', 'Bust on the double! You lose.');
        } else {
            this.stand();
        }
    }

    stand() {
        if (!this.inRound) return;
        this.hideHole = false;
        // Dealer draws to 17 (stands on all 17s, incl. soft).
        while (this.handValue(this.dealer).total < 17) this.dealer.push(this.draw());

        const p = this.handValue(this.player).total;
        const d = this.handValue(this.dealer).total;
        if (d > 21) this.settle('win', `Dealer bust (${d})! You win.`);
        else if (p > d) this.settle('win', `You win ${p} to ${d}! 🎉`);
        else if (p < d) this.settle('lose', `Dealer wins ${d} to ${p}.`);
        else this.settle('push', `Push — both ${p}.`);
    }

    settle(result, message) {
        // stake already deducted; return winnings including stake.
        if (result === 'blackjack') this.bank += this.bet + Math.round(this.bet * 1.5);
        else if (result === 'win')  this.bank += this.bet * 2;
        else if (result === 'push') this.bank += this.bet;
        // 'lose' returns nothing.
        this.saveBank();
        this.inRound = false;
        const priorBet = this.bet;
        this.bet = 0;
        this.msgEl.textContent = message;
        this.msgEl.className = 'bj-message ' +
            (result === 'lose' ? 'lose' : result === 'push' ? 'push' : 'win');
        this.lastBet = priorBet;
        this.render();
        if (this.bank <= 0) {
            setTimeout(() => this.render(), 0);
        }
    }

    flash(text) {
        this.msgEl.textContent = text;
        this.msgEl.className = 'bj-message';
    }

    // ---- Rendering ----
    cardEl(card, hidden) {
        const el = document.createElement('div');
        if (hidden) { el.className = 'bj-card back'; return el; }
        const info = BJ_SUITS[card.suit];
        el.className = `bj-card face ${info.color}`;
        el.innerHTML =
            `<span class="bj-rank">${BJ_RANK_NAMES[card.rank]}</span>` +
            `<span class="bj-suit">${info.symbol}</span>` +
            `<span class="bj-rank bj-rank-b">${BJ_RANK_NAMES[card.rank]}</span>`;
        return el;
    }

    renderHand(container, cards, hideHole) {
        container.innerHTML = '';
        cards.forEach((c, i) => {
            container.appendChild(this.cardEl(c, hideHole && i === 1));
        });
    }

    render() {
        this.bankEl.textContent = this.bank;
        this.betEl.textContent = this.bet;

        this.renderHand(this.dealerEl, this.dealer, this.hideHole);
        this.renderHand(this.playerEl, this.player, false);

        // Scores
        if (this.player.length) {
            const pv = this.handValue(this.player);
            this.playerScoreEl.textContent =
                pv.total + (pv.soft && pv.total !== 21 ? ` (soft)` : '');
        } else this.playerScoreEl.textContent = '–';

        if (this.dealer.length) {
            if (this.hideHole) {
                this.dealerScoreEl.textContent = Math.min(this.dealer[0].rank === 1 ? 11 : this.dealer[0].rank, 10) + ' + ?';
            } else {
                this.dealerScoreEl.textContent = this.handValue(this.dealer).total;
            }
        } else this.dealerScoreEl.textContent = '–';

        // Which controls are visible
        const broke = this.bank <= 0 && !this.inRound;
        this.chipRow.style.display  = this.inRound ? 'none' : 'flex';
        this.dealBtn.style.display  = this.inRound ? 'none' : 'inline-flex';
        this.clearBtn.style.display = (!this.inRound && this.bet > 0) ? 'inline-flex' : 'none';
        this.actionRow.style.display = this.inRound ? 'flex' : 'none';
        this.doubleBtn.disabled = !this.canDouble();

        if (broke) {
            this.chipRow.style.display = 'none';
            this.dealBtn.style.display = 'none';
            this.msgEl.textContent = 'You\'re out of chips!';
            this.msgEl.className = 'bj-message lose';
            if (!document.getElementById('bj-rebuy')) {
                const b = document.createElement('button');
                b.id = 'bj-rebuy';
                b.className = 'bj-btn bj-deal-btn';
                b.textContent = `↻ New Stack (${BJ_START_BANK})`;
                b.addEventListener('click', () => {
                    this.bank = BJ_START_BANK;
                    this.saveBank();
                    this.bet = 0;
                    b.remove();
                    this.msgEl.textContent = 'Place your bet, then Deal.';
                    this.msgEl.className = 'bj-message';
                    this.render();
                });
                this.chipRow.parentNode.insertBefore(b, this.actionRow);
            }
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(() => new Blackjack(), 100));
} else {
    setTimeout(() => new Blackjack(), 100);
}
