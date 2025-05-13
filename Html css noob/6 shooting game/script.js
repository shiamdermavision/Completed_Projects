let points = 0;

document.getElementById('click-button').addEventListener('click', () => {
    points++;
    document.getElementById('points').textContent = points;
});

document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const spaceship = document.getElementById('spaceship');
    const gameArea = document.querySelector('.game-area');
    const scoreValue = document.getElementById('score-value');
    const levelValue = document.getElementById('level-value');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const gameMessage = document.getElementById('game-message');

    // Game state
    let gameActive = false;
    let score = 0;
    let level = 1;
    let speed = 2;
    let spaceshipPosition = {
        x: gameArea.offsetWidth / 2 - 30,
        y: gameArea.offsetHeight - 80
    };
    let asteroids = [];
    let gameLoop;
    let asteroidInterval;

    // Initialize spaceship position
    spaceship.style.left = `${spaceshipPosition.x}px`;
    spaceship.style.bottom = `${spaceshipPosition.y}px`;

    // Start game
    startBtn.addEventListener('click', () => {
        if (!gameActive) {
            startGame();
        }
    });

    // Reset game
    resetBtn.addEventListener('click', () => {
        resetGame();
    });

    // Key controls
    document.addEventListener('keydown', (e) => {
        if (!gameActive) return;

        switch (e.key) {
            case 'ArrowLeft':
                moveSpaceship('left');
                break;
            case 'ArrowRight':
                moveSpaceship('right');
                break;
            case 'ArrowUp':
                moveSpaceship('up');
                break;
            case 'ArrowDown':
                moveSpaceship('down');
                break;
        }
    });

    // Move spaceship
    function moveSpaceship(direction) {
        const step = 20;
        const boundaries = {
            left: 0,
            right: gameArea.offsetWidth - 60,
            top: 0,
            bottom: gameArea.offsetHeight - 60
        };

        switch (direction) {
            case 'left':
                if (spaceshipPosition.x > boundaries.left) {
                    spaceshipPosition.x -= step;
                }
                break;
            case 'right':
                if (spaceshipPosition.x < boundaries.right) {
                    spaceshipPosition.x += step;
                }
                break;
            case 'up':
                if (spaceshipPosition.y < boundaries.bottom) {
                    spaceshipPosition.y += step;
                }
                break;
            case 'down':
                if (spaceshipPosition.y > boundaries.top) {
                    spaceshipPosition.y -= step;
                }
                break;
        }

        spaceship.style.left = `${spaceshipPosition.x}px`;
        spaceship.style.bottom = `${spaceshipPosition.y}px`;

        // Rotation effect when moving left/right
        if (direction === 'left') {
            spaceship.style.transform = 'translateX(-50%) rotate(-15deg)';
        } else if (direction === 'right') {
            spaceship.style.transform = 'translateX(-50%) rotate(15deg)';
        } else {
            spaceship.style.transform = 'translateX(-50%) rotate(0)';
        }

        setTimeout(() => {
            spaceship.style.transform = 'translateX(-50%) rotate(0)';
        }, 100);
    }

    // Create asteroid
    function createAsteroid() {
        if (!gameActive) return;

        const asteroid = document.createElement('div');
        asteroid.classList.add('asteroid');

        // Random size
        const size = Math.random() * 30 + 20;
        asteroid.style.width = `${size}px`;
        asteroid.style.height = `${size}px`;

        // Random horizontal position
        const x = Math.random() * (gameArea.offsetWidth - size);
        asteroid.style.left = `${x}px`;
        asteroid.style.top = '-50px';

        // Add to game area
        gameArea.appendChild(asteroid);

        // Add to asteroids array with position data
        asteroids.push({
            element: asteroid,
            x: x,
            y: -50,
            size: size,
            speed: Math.random() * 2 + speed
        });
    }

    // Move asteroids
    function moveAsteroids() {
        for (let i = asteroids.length - 1; i >= 0; i--) {
            const asteroid = asteroids[i];

            asteroid.y += asteroid.speed;
            asteroid.element.style.top = `${asteroid.y}px`;

            // Check if asteroid is out of bounds
            if (asteroid.y > gameArea.offsetHeight) {
                gameArea.removeChild(asteroid.element);
                asteroids.splice(i, 1);

                // Increment score when dodging asteroid
                updateScore(10);
            }

            // Check collision with spaceship
            if (checkCollision(asteroid)) {
                gameOver();
                return;
            }
        }
    }

    // Check collision
    function checkCollision(asteroid) {
        const shipRect = spaceship.getBoundingClientRect();
        const asteroidRect = asteroid.element.getBoundingClientRect();

        return !(
            shipRect.right < asteroidRect.left + 10 ||
            shipRect.left > asteroidRect.right - 10 ||
            shipRect.bottom < asteroidRect.top + 10 ||
            shipRect.top > asteroidRect.bottom - 10
        );
    }

    // Update score
    function updateScore(points) {
        score += points;
        scoreValue.textContent = score;

        // Level up every 200 points
        if (score % 200 === 0) {
            levelUp();
        }
    }

    // Level up
    function levelUp() {
        level++;
        levelValue.textContent = level;
        speed += 0.5;

        // Clear current asteroid interval and create a new one
        clearInterval(asteroidInterval);
        asteroidInterval = setInterval(createAsteroid, 1000 / level);

        // Show level up message
        gameMessage.textContent = `Level ${level}!`;
        gameMessage.style.opacity = '1';

        setTimeout(() => {
            gameMessage.style.opacity = '0';
        }, 2000);
    }

    // Start game
    function startGame() {
        gameActive = true;
        gameMessage.style.opacity = '0';
        startBtn.disabled = true;
        startBtn.textContent = 'Playing...';

        // Reset spaceship position
        spaceshipPosition = {
            x: gameArea.offsetWidth / 2 - 30,
            y: gameArea.offsetHeight - 80
        };
        spaceship.style.left = `${spaceshipPosition.x}px`;
        spaceship.style.bottom = `${spaceshipPosition.y}px`;

        // Start creating asteroids
        asteroidInterval = setInterval(createAsteroid, 1000);

        // Start game loop
        gameLoop = setInterval(() => {
            moveAsteroids();
        }, 1000 / 60);  // 60fps
    }

    // Game over
    function gameOver() {
        gameActive = false;
        clearInterval(gameLoop);
        clearInterval(asteroidInterval);

        gameMessage.textContent = `Game Over! Score: ${score}`;
        gameMessage.style.opacity = '1';

        startBtn.disabled = false;
        startBtn.textContent = 'Play Again';
    }

    // Reset game
    function resetGame() {
        gameActive = false;
        clearInterval(gameLoop);
        clearInterval(asteroidInterval);

        // Remove all asteroids
        asteroids.forEach(asteroid => {
            gameArea.removeChild(asteroid.element);
        });
        asteroids = [];

        // Reset score and level
        score = 0;
        level = 1;
        speed = 2;
        scoreValue.textContent = score;
        levelValue.textContent = level;

        // Reset UI
        gameMessage.textContent = 'Use arrow keys to move!';
        gameMessage.style.opacity = '0.8';
        startBtn.disabled = false;
        startBtn.textContent = 'Start Game';

        // Reset spaceship position
        spaceshipPosition = {
            x: gameArea.offsetWidth / 2 - 30,
            y: gameArea.offsetHeight - 80
        };
        spaceship.style.left = `${spaceshipPosition.x}px`;
        spaceship.style.bottom = `${spaceshipPosition.y}px`;
    }
});
