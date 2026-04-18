class GameHub {
    constructor() {
        this.currentGame = 'home';
        this.gameStats = this.loadGameStats();
        this.setupEventListeners();
        this.updateStats();
    }

    setupEventListeners() {
        // Navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const game = btn.dataset.game;
                this.switchGame(game);
            });
        });

        // Game cards - click anywhere on card
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const game = card.dataset.game;
                this.switchGame(game);
            });
        });

        // Play buttons - click button
        document.querySelectorAll('.play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const game = btn.closest('.game-card').dataset.game;
                this.switchGame(game);
            });
        });

        // Back buttons
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchGame('home');
            });
        });
    }

    switchGame(gameName) {
        console.log('Switching to game:', gameName);
        
        // Hide all pages
        document.querySelectorAll('.game-page').forEach(page => {
            page.classList.remove('active');
        });

        // Show selected game
        const gameElement = document.getElementById(gameName);
        if (gameElement) {
            gameElement.classList.add('active');
        } else {
            console.error('Game page not found:', gameName);
            return;
        }

        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeNav = document.querySelector(`[data-game="${gameName}"]`);
        if (activeNav) {
            activeNav.classList.add('active');
        }

        this.currentGame = gameName;
        window.scrollTo(0, 0);
    }

    loadGameStats() {
        return JSON.parse(localStorage.getItem('gameStats')) || {
            flappyBestScore: 0,
            totalGamesPlayed: 0,
            playTime: 0
        };
    }

    saveGameStats() {
        localStorage.setItem('gameStats', JSON.stringify(this.gameStats));
    }

    updateStats() {
        const flappyBestEl = document.getElementById('flappy-best');
        const totalGamesEl = document.getElementById('total-games');
        const playTimeEl = document.getElementById('play-time');

        if (flappyBestEl) flappyBestEl.textContent = this.gameStats.flappyBestScore;
        if (totalGamesEl) totalGamesEl.textContent = this.gameStats.totalGamesPlayed;
        if (playTimeEl) playTimeEl.textContent = (this.gameStats.playTime / 60).toFixed(1) + 'h';
    }

    recordGameStats(game, score, timeInMinutes) {
        this.gameStats.totalGamesPlayed++;
        this.gameStats.playTime += timeInMinutes;

        if (game === 'flappyBird' && score > this.gameStats.flappyBestScore) {
            this.gameStats.flappyBestScore = score;
        }

        this.saveGameStats();
        this.updateStats();
    }
}

// Initialize Game Hub when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.gameHub = new GameHub();
    });
} else {
    window.gameHub = new GameHub();
}
