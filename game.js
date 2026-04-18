// Flappy Bird Game Logic in JavaScript

// Initialize canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let bird;
const pipes = [];
let score = 0;
let gravity = 0.6;
let isGameOver = false;

// Bird object
function createBird() {
    bird = {
        x: 50,
        y: canvas.height / 2,
        width: 20,
        height: 20,
        gravity: gravity,
        lift: -15,
        velocity: 0,
        jump() {
            this.velocity += this.lift;
        },
        update() {
            this.velocity += this.gravity;
            this.y += this.velocity;
            if (this.y + this.height >= canvas.height) {
                isGameOver = true;
            }
            if (this.y < 0) {
                this.y = 0;
                this.velocity = 0;
            }
        },
        draw() {
            ctx.fillStyle = 'yellow';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };
}

// Pipe object
function createPipe() {
    const pipe = {
        x: canvas.width,
        width: 50,
        top: Math.random() * (canvas.height / 2),
        bottom: Math.random() * (canvas.height / 2),
        draw() {
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x, 0, this.width, this.top);
            ctx.fillRect(this.x, canvas.height - this.bottom, this.width, this.bottom);
        },
        update() {
            this.x -= 2;
        }
    };
    pipes.push(pipe);
}

// Collision detection
function isCollision(bird, pipe) {
    if (bird.x + bird.width > pipe.x && bird.x < pipe.x + pipe.width) {
        if (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom) {
            return true;
        }
    }
    return false;
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bird.update();
    bird.draw();

    if (frameCount % 75 === 0) {
        createPipe();
    }
    pipes.forEach((pipe, index) => {
        pipe.update();
        pipe.draw();
        if (isCollision(bird, pipe)) {
            isGameOver = true;
        }
        if (pipe.x + pipe.width < 0) {
            pipes.splice(index, 1);
            score++;
        }
    });

    if (isGameOver) {
        ctx.fillText('Game Over! Score: ' + score, canvas.width / 2 - 50, canvas.height / 2);
        return;
    }

    ctx.fillText('Score: ' + score, 10, 20);

    requestAnimationFrame(gameLoop);
}

// Start game
let frameCount = 0;
createBird();
setInterval(() => {
    frameCount++;
}, 1000 / 60);

// Event listener for bird jump
window.addEventListener('click', () => {
    if (!isGameOver) {
        bird.jump();
    } else {
        // Reset game logic
        pipes.length = 0;
        score = 0;
        createBird();
        isGameOver = false;
        frameCount = 0;
        gameLoop();
    }
});

// Initial game loop call
gameLoop();