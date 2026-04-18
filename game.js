vaconst canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const soundToggle = document.getElementById('soundToggle');
const restartBtn = document.getElementById('restartBtn');
const highScoreDisplay = document.getElementById('highScore');

// Game states
const GAME_STATE = {
    START: 'start',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'gameOver'
};

// Game variables
let gameState = GAME_STATE.START;
let score = 0;
let highScore = localStorage.getItem('flappyBirdHighScore') || 0;
let gravity = 0.5;
let frameCount = 0;
let difficulty = 1;
let soundEnabled = true;

highScoreDisplay.textContent = highScore;

// Bird object
const bird = {
    x: 60,
    y: 150,
    width: 30,
    height: 30,
    velocity: 0,
    rotation: 0,
    wingFlap: 0,
    hasShield: false,
    shieldDuration: 0,
    
    update() {
        if (gameState !== GAME_STATE.PLAYING) return;
        
        this.velocity += gravity;
        this.y += this.velocity;
        
        // Rotation based on velocity
        this.rotation = Math.min(this.velocity * 0.05, 1.5);
        
        // Wing flap animation
        this.wingFlap += 0.15;
        
        // Shield duration
        if (this.hasShield) {
            this.shieldDuration--;
            if (this.shieldDuration <= 0) {
                this.hasShield = false;
            }
        }
        
        // Ground collision
        if (this.y + this.height >= canvas.height - 30) {
            gameState = GAME_STATE.GAME_OVER;
            playSound('collision');
        }
        
        // Ceiling collision
        if (this.y <= 0) {
            this.y = 0;
            this.velocity = 0;
        }
    },
    
    flap() {
        this.velocity = -10;
        playSound('flap');
    },
    
    draw() {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);
        
        // Draw bird body
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw eye
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(8, -5, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw eye shine
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(9, -4, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw beak
        ctx.fillStyle = '#FF6347';
        ctx.beginPath();
        ctx.moveTo(10, -2);
        ctx.lineTo(18, 0);
        ctx.lineTo(10, 2);
        ctx.closePath();
        ctx.fill();
        
        // Draw wings with flap animation
        const wingY = Math.sin(this.wingFlap) * 3;
        ctx.strokeStyle = '#FFB347';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(-8, wingY, 8, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw shield if active
        if (this.hasShield) {
            ctx.strokeStyle = `rgba(100, 150, 255, ${this.shieldDuration / 300})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, this.width / 2 + 8, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.restore();
    }
};

// Pipes array
let pipes = [];
let powerUps = [];

function createPipe() {
    const minHeight = 50;
    const maxHeight = 150;
    const gap = 90 + difficulty * 5; // Gap decreases with difficulty
    
    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
    
    pipes.push({
        x: canvas.width,
        topHeight: topHeight,
        bottomHeight: canvas.height - topHeight - gap,
        width: 50,
        scored: false,
        
        draw() {
            // Draw pipes with gradient
            const gradient = ctx.createLinearGradient(this.x, 0, this.x + this.width, 0);
            gradient.addColorStop(0, '#2a7f2a');
            gradient.addColorStop(1, '#1a4d1a');
            
            ctx.fillStyle = gradient;
            // Top pipe
            ctx.fillRect(this.x, 0, this.width, this.topHeight);
            // Bottom pipe
            ctx.fillRect(this.x, canvas.height - this.bottomHeight, this.width, this.bottomHeight);
            
            // Draw pipe caps
            ctx.fillStyle = '#1a4d1a';
            ctx.fillRect(this.x - 2, this.topHeight - 8, this.width + 4, 8);
            ctx.fillRect(this.x - 2, canvas.height - this.bottomHeight, this.width + 4, 8);
        },
        
        update() {
            this.x -= (4 + difficulty * 0.5); // Speed increases with difficulty
        }
    });
}

function createPowerUp(x, y) {
    if (Math.random() > 0.7) { // 30% chance
        powerUps.push({
            x: x,
            y: y,
            width: 20,
            height: 20,
            type: Math.random() > 0.5 ? 'shield' : 'points',
            rotation: 0,
            
            draw() {
                ctx.save();
                ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
                ctx.rotate(this.rotation);
                
                if (this.type === 'shield') {
                    ctx.fillStyle = '#6495ED';
                    ctx.beginPath();
                    ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#FFF';
                    ctx.font = 'bold 12px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('S', 0, 0);
                } else {
                    ctx.fillStyle = '#FFD700';
                    ctx.beginPath();
                    ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#000';
                    ctx.font = 'bold 12px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('+', 0, 0);
                }
                
                ctx.restore();
            },
            
            update() {
                this.x -= (4 + difficulty * 0.5);
                this.rotation += 0.05;
            }
        });
    }
}

function checkCollision(bird, pipe) {
    if (bird.x < pipe.x + pipe.width && bird.x + bird.width > pipe.x) {
        if (bird.y < pipe.topHeight || bird.y + bird.height > canvas.height - pipe.bottomHeight) {
            return true;
        }
    }
    return false;
}

function checkPowerUpCollision(bird, powerUp) {
    return bird.x < powerUp.x + powerUp.width &&
           bird.x + bird.width > powerUp.x &&
           bird.y < powerUp.y + powerUp.height &&
           bird.y + bird.height > powerUp.y;
}

function drawClouds() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    
    // Simple cloud shapes
    const cloudPositions = [
        { x: 50, y: 50 },
        { x: 200, y: 100 },
        { x: 280, y: 30 }
    ];
    
    cloudPositions.forEach(pos => {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
        ctx.arc(pos.x + 20, pos.y, 25, 0, Math.PI * 2);
        ctx.arc(pos.x + 40, pos.y, 20, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawStartScreen() {
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    
    // Title
    ctx.font = 'bold 40px Arial';
    ctx.fillText('Flappy Bird', canvas.width / 2, 80);
    
    // Instructions
    ctx.font = '18px Arial';
    ctx.fillText('Click or Press SPACE to Start', canvas.width / 2, 200);
    ctx.fillText('Avoid the pipes!', canvas.width / 2, 240);
    
    ctx.font = '16px Arial';
    ctx.fillText('Shield: Protects once', canvas.width / 2, 310);
    ctx.fillText('Plus: +10 points', canvas.width / 2, 340);
    ctx.fillText('Difficulty increases over time', canvas.width / 2, 370);
    
    ctx.textAlign = 'left';
}

function drawGameOverScreen() {
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#FFF';
    ctx.textAlign = 'center';
    
    ctx.font = 'bold 50px Arial';
    ctx.fillText('Game Over!', canvas.width / 2, 120);
    
    ctx.font = '28px Arial';
    ctx.fillText('Score: ' + score, canvas.width / 2, 190);
    ctx.fillText('Best: ' + highScore, canvas.width / 2, 240);
    
    ctx.font = '18px Arial';
    ctx.fillText('Click or Press SPACE to Restart', canvas.width / 2, 320);
    
    ctx.textAlign = 'left';
}

function playSound(type) {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
        case 'flap':
            oscillator.frequency.value = 400;
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
            break;
        case 'score':
            oscillator.frequency.value = 800;
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
            break;
        case 'collision':
            oscillator.frequency.value = 200;
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
            break;
        case 'powerup':
            oscillator.frequency.value = 600;
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.15);
            break;
    }
}

function update() {
    if (gameState !== GAME_STATE.PLAYING) return;
    
    bird.update();
    
    // Generate pipes with difficulty scaling
    if (frameCount % Math.max(60 - difficulty * 3, 40) === 0) {
        createPipe();
    }
    
    // Update pipes
    pipes.forEach((pipe, index) => {
        pipe.update();
        
        // Check collision
        if (!bird.hasShield && checkCollision(bird, pipe)) {
            gameState = GAME_STATE.GAME_OVER;
            playSound('collision');
        } else if (bird.hasShield && checkCollision(bird, pipe)) {
            bird.hasShield = false;
            playSound('powerup');
        }
        
        // Check if bird passed the pipe
        if (!pipe.scored && bird.x > pipe.x + pipe.width) {
            pipe.scored = true;
            score += 10;
            difficulty = 1 + Math.floor(score / 50);
            playSound('score');
            
            // Create power-up at pipe location
            createPowerUp(pipe.x + pipe.width / 2, canvas.height / 2);
        }
        
        // Remove pipes that are off screen
        if (pipe.x + pipe.width < 0) {
            pipes.splice(index, 1);
        }
    });
    
    // Update power-ups
    powerUps.forEach((powerUp, index) => {
        powerUp.update();
        
        // Check collision with bird
        if (checkPowerUpCollision(bird, powerUp)) {
            if (powerUp.type === 'shield') {
                bird.hasShield = true;
                bird.shieldDuration = 300;
            } else {
                score += 10;
            }
            playSound('powerup');
            powerUps.splice(index, 1);
        }
        
        // Remove power-ups that are off screen
        if (powerUp.x < -30) {
            powerUps.splice(index, 1);
        }
    });
}

function draw() {
    // Draw background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGradient.addColorStop(0, '#87CEEB');
    bgGradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw clouds
    drawClouds();
    
    // Draw pipes
    pipes.forEach(pipe => {
        pipe.draw();
    });
    
    // Draw power-ups
    powerUps.forEach(powerUp => {
        powerUp.draw();
    });
    
    // Draw bird
    bird.draw();
    
    // Draw ground
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
    
    ctx.fillStyle = '#1a6b1a';
    ctx.fillRect(0, canvas.height - 30, canvas.width, 5);
    
    // Draw UI
    ctx.fillStyle = '#000';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
    
    ctx.font = '14px Arial';
    ctx.fillText('Difficulty: ' + difficulty, 10, 50);
    
    // Draw game state screens
    if (gameState === GAME_STATE.START) {
        drawStartScreen();
    } else if (gameState === GAME_STATE.GAME_OVER) {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('flappyBirdHighScore', highScore);
            highScoreDisplay.textContent = highScore;
        }
        drawGameOverScreen();
    }
}

function gameLoop() {
    update();
    draw();
    frameCount++;
    requestAnimationFrame(gameLoop);
}

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === GAME_STATE.START) {
            gameState = GAME_STATE.PLAYING;
        } else if (gameState === GAME_STATE.GAME_OVER) {
            resetGame();
        } else if (gameState === GAME_STATE.PLAYING) {
            bird.flap();
        }
    }
});

canvas.addEventListener('click', () => {
    if (gameState === GAME_STATE.START) {
        gameState = GAME_STATE.PLAYING;
    } else if (gameState === GAME_STATE.GAME_OVER) {
        resetGame();
    } else if (gameState === GAME_STATE.PLAYING) {
        bird.flap();
    }
});

soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundToggle.textContent = soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF';
    soundToggle.classList.toggle('off');
});

restartBtn.addEventListener('click', () => {
    if (gameState === GAME_STATE.GAME_OVER) {
        resetGame();
    }
});

function resetGame() {
    gameState = GAME_STATE.PLAYING;
    score = 0;
    difficulty = 1;
    frameCount = 0;
    bird.y = 150;
    bird.velocity = 0;
    bird.hasShield = false;
    bird.shieldDuration = 0;
    pipes = [];
    powerUps = [];
}

// Start the game loop
gameLoop();
