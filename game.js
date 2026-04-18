const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let gameRunning = true;
let gameStarted = false;
let score = 0;
let gravity = 0.5;
let frameCount = 0;

// Bird object
const bird = {
    x: 60,
    y: 150,
    width: 30,
    height: 30,
    velocity: 0,
    
    update() {
        this.velocity += gravity;
        this.y += this.velocity;
        
        // Ground collision
        if (this.y + this.height >= canvas.height) {
            gameRunning = false;
        }
        
        // Ceiling collision
        if (this.y <= 0) {
            this.y = 0;
            this.velocity = 0;
        }
    },
    
    flap() {
        this.velocity = -10;
        gameStarted = true;
    },
    
    draw() {
        // Draw bird as a circle with a beak
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw eye
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2 + 5, this.y + this.height / 2 - 3, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw beak
        ctx.fillStyle = '#FF6347';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width, this.y + this.height / 2 - 2);
        ctx.lineTo(this.x + this.width + 8, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width, this.y + this.height / 2 + 2);
        ctx.closePath();
        ctx.fill();
    }
};

// Pipes array
let pipes = [];

function createPipe() {
    const minHeight = 40;
    const maxHeight = 150;
    const gap = 100;
    
    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
    
    pipes.push({
        x: canvas.width,
        topHeight: topHeight,
        bottomHeight: canvas.height - topHeight - gap,
        width: 50,
        scored: false,
        
        draw() {
            ctx.fillStyle = '#228B22';
            // Top pipe
            ctx.fillRect(this.x, 0, this.width, this.topHeight);
            // Bottom pipe
            ctx.fillRect(this.x, canvas.height - this.bottomHeight, this.width, this.bottomHeight);
        },
        
        update() {
            this.x -= 4;
        }
    });
}

function checkCollision(bird, pipe) {
    // Check if bird collides with top pipe
    if (bird.x < pipe.x + pipe.width && bird.x + bird.width > pipe.x) {
        if (bird.y < pipe.topHeight || bird.y + bird.height > canvas.height - pipe.bottomHeight) {
            return true;
        }
    }
    return false;
}

function update() {
    if (!gameRunning) return;
    
    bird.update();
    
    // Generate pipes
    if (frameCount % 90 === 0) {
        createPipe();
    }
    
    // Update pipes
    pipes.forEach((pipe, index) => {
        pipe.update();
        
        // Check collision
        if (checkCollision(bird, pipe)) {
            gameRunning = false;
        }
        
        // Check if bird passed the pipe
        if (!pipe.scored && bird.x > pipe.x + pipe.width) {
            pipe.scored = true;
            score++;
        }
        
        // Remove pipes that are off screen
        if (pipe.x + pipe.width < 0) {
            pipes.splice(index, 1);
        }
    });
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw ground
    ctx.fillStyle = '#90EE90';
    ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
    
    // Draw pipes
    pipes.forEach(pipe => {
        pipe.draw();
    });
    
    // Draw bird
    bird.draw();
    
    // Draw score
    ctx.fillStyle = '#000';
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
    
    // Draw game over screen
    if (!gameRunning) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 30);
        
        ctx.font = '24px Arial';
        ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2 + 20);
        ctx.fillText('Click to Restart', canvas.width / 2, canvas.height / 2 + 60);
        ctx.textAlign = 'left';
    }
    
    // Draw start instruction
    if (!gameStarted) {
        ctx.fillStyle = '#000';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Click or Press SPACE to Start', canvas.width / 2, 50);
        ctx.textAlign = 'left';
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
        if (!gameRunning) {
            restartGame();
        } else {
            bird.flap();
        }
    }
});

canvas.addEventListener('click', () => {
    if (!gameRunning) {
        restartGame();
    } else {
        bird.flap();
    }
});

function restartGame() {
    gameRunning = true;
    gameStarted = false;
    score = 0;
    frameCount = 0;
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
}

// Start the game loop
gameLoop();
