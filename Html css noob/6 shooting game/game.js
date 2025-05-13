// Main Game Logic
document.addEventListener('DOMContentLoaded', function () {
    // Canvas setup
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Hide loading message when game starts
    const loadingElement = document.getElementById('loading');

    // Game state initialization
    let gameStarted = false;
    let score = 0;
    let highScore = localStorage.getItem('highScore') || 0;
    let scoreMultiplier = 1;
    let comboTimer = 0;
    let comboCount = 0;
    let lives = 3;
    let gameOver = false;
    let scorePopups = [];
    let assetsLoaded = false;
    let loadingProgress = 0;

    // Loading state tracking
    const loadingStates = {
        background: false,
        player: false,
        enemy: false,
        star: false,
        laser: false
    };

    // Fix variable initialization order to avoid reference errors
    const player = {
        x: canvas.width / 2,
        y: canvas.height - 100,
        width: 40,
        height: 40,
        speed: 5,
        color: '#3498db',
        cooldown: 0,
        maxCooldown: 300
    };

    // Make variables accessible globally
    window.score = score;
    window.highScore = highScore;
    window.gameOver = gameOver;
    window.player = player;
    window.resetGame = resetGame;

    // Game entities
    const enemies = [];
    const stars = [];
    const particles = [];
    const lasers = [];

    // Controls state
    const keys = {
        ArrowLeft: false,
        ArrowRight: false,
        ArrowUp: false,
        ArrowDown: false,
        Space: false
    };

    // Timing variables
    let lastTime = 0;
    let enemyTimer = 0;
    let starTimer = 0;

    // ---------------
    // ASSET GENERATION
    // ---------------

    // Assets container
    const assets = {};

    // Update loading progress
    function updateLoadingProgress(asset, status) {
        loadingStates[asset] = status;

        // Count loaded assets
        let loaded = 0;
        let total = 0;
        for (const key in loadingStates) {
            total++;
            if (loadingStates[key]) loaded++;
        }

        loadingProgress = Math.floor((loaded / total) * 100);

        // Update loading display
        if (loadingElement) {
            loadingElement.textContent = `Loading... ${loadingProgress}%`;
        }

        // Check if all assets are loaded
        if (loaded === total) {
            assetsLoaded = true;
            startGameWhenReady();
        }
    }

    // Generate player image with loading tracking
    function createPlayerImage() {
        console.log("Creating player image");
        try {
            const playerCanvas = document.createElement('canvas');
            playerCanvas.width = 40;
            playerCanvas.height = 40;
            const pCtx = playerCanvas.getContext('2d');

            // Ship body
            pCtx.fillStyle = '#3498db';
            pCtx.beginPath();
            pCtx.moveTo(20, 0);
            pCtx.lineTo(40, 40);
            pCtx.lineTo(0, 40);
            pCtx.closePath();
            pCtx.fill();

            // Ship cockpit
            pCtx.fillStyle = '#cceeff';
            pCtx.beginPath();
            pCtx.arc(20, 20, 8, 0, Math.PI * 2);
            pCtx.fill();

            updateLoadingProgress('player', true);
            return playerCanvas;
        } catch (e) {
            console.error("Failed to create player asset:", e);
            updateLoadingProgress('player', true); // Mark as loaded even if it fails
            return createFallbackAsset('blue', 'P');
        }
    }

    // Generate enemy image with loading tracking
    function createEnemyImage() {
        console.log("Creating enemy image");
        try {
            const enemyCanvas = document.createElement('canvas');
            enemyCanvas.width = 30;
            enemyCanvas.height = 30;
            const eCtx = enemyCanvas.getContext('2d');

            // Enemy body
            eCtx.fillStyle = '#e74c3c';
            eCtx.beginPath();
            eCtx.arc(15, 15, 15, 0, Math.PI * 2);
            eCtx.fill();

            // Enemy details
            eCtx.fillStyle = 'white';
            eCtx.beginPath();
            eCtx.arc(8, 10, 5, 0, Math.PI * 2);
            eCtx.arc(22, 10, 5, 0, Math.PI * 2);
            eCtx.fill();

            eCtx.fillStyle = 'black';
            eCtx.beginPath();
            eCtx.arc(8, 10, 2.5, 0, Math.PI * 2);
            eCtx.arc(22, 10, 2.5, 0, Math.PI * 2);
            eCtx.fill();

            eCtx.fillStyle = 'black';
            eCtx.beginPath();
            eCtx.arc(15, 20, 6, 0, Math.PI, false);
            eCtx.stroke();

            updateLoadingProgress('enemy', true);
            return enemyCanvas;
        } catch (e) {
            console.error("Failed to create enemy asset:", e);
            updateLoadingProgress('enemy', true);
            return createFallbackAsset('red', 'E');
        }
    }

    // Generate star image with loading tracking
    function createStarImage() {
        console.log("Creating star image");
        try {
            const starCanvas = document.createElement('canvas');
            starCanvas.width = 20;
            starCanvas.height = 20;
            const sCtx = starCanvas.getContext('2d');

            sCtx.fillStyle = '#f1c40f';

            // Draw 5-pointed star
            sCtx.beginPath();
            for (let i = 0; i < 5; i++) {
                const outerX = 10 + 10 * Math.cos((i * 72 - 18) * Math.PI / 180);
                const outerY = 10 + 10 * Math.sin((i * 72 - 18) * Math.PI / 180);
                const innerX = 10 + 4 * Math.cos((i * 72 + 18) * Math.PI / 180);
                const innerY = 10 + 4 * Math.sin((i * 72 + 18) * Math.PI / 180);

                if (i === 0) {
                    sCtx.moveTo(outerX, outerY);
                } else {
                    sCtx.lineTo(outerX, outerY);
                }

                sCtx.lineTo(innerX, innerY);
            }
            sCtx.closePath();
            sCtx.fill();

            updateLoadingProgress('star', true);
            return starCanvas;
        } catch (e) {
            console.error("Failed to create star asset:", e);
            updateLoadingProgress('star', true);
            return createFallbackAsset('yellow', 'S');
        }
    }

    // Generate background with loading tracking
    function createBackgroundImage() {
        console.log("Creating background image");
        try {
            const bgCanvas = document.createElement('canvas');
            bgCanvas.width = canvas.width;
            bgCanvas.height = canvas.height;
            const bgCtx = bgCanvas.getContext('2d');

            // Create gradient background
            const gradient = bgCtx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#0a0e2c');
            gradient.addColorStop(1, '#1a1a3a');
            bgCtx.fillStyle = gradient;
            bgCtx.fillRect(0, 0, canvas.width, canvas.height);

            // Add stars
            for (let i = 0; i < 150; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const radius = Math.random() * 1.5 + 0.5;

                bgCtx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`;
                bgCtx.beginPath();
                bgCtx.arc(x, y, radius, 0, Math.PI * 2);
                bgCtx.fill();
            }

            updateLoadingProgress('background', true);
            return bgCanvas;
        } catch (e) {
            console.error("Failed to create background asset:", e);
            updateLoadingProgress('background', true);
            return createFallbackAsset('#333', 'BG', canvas.width, canvas.height);
        }
    }

    // Generate laser image with loading tracking
    function createLaserImage() {
        console.log("Creating laser image");
        try {
            const laserCanvas = document.createElement('canvas');
            laserCanvas.width = 6;
            laserCanvas.height = 20;
            const lCtx = laserCanvas.getContext('2d');

            // Laser gradient
            const gradient = lCtx.createLinearGradient(0, 0, laserCanvas.width, 0);
            gradient.addColorStop(0, 'rgba(0, 255, 255, 0.5)');
            gradient.addColorStop(0.5, 'rgba(0, 255, 255, 1)');
            gradient.addColorStop(1, 'rgba(0, 255, 255, 0.5)');

            // Draw laser beam
            lCtx.fillStyle = gradient;
            lCtx.fillRect(0, 0, laserCanvas.width, laserCanvas.height);

            // Add glow effect
            lCtx.shadowColor = '#00ffff';
            lCtx.shadowBlur = 10;
            lCtx.beginPath();
            lCtx.fillRect(1, 1, laserCanvas.width - 2, laserCanvas.height - 2);

            updateLoadingProgress('laser', true);
            return laserCanvas;
        } catch (e) {
            console.error("Failed to create laser asset:", e);
            updateLoadingProgress('laser', true);
            return createFallbackAsset('cyan', 'L', 6, 20);
        }
    }

    // Create a simple fallback asset when image creation fails
    function createFallbackAsset(color, letter, width = 40, height = 40) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);

        if (letter) {
            ctx.fillStyle = 'white';
            ctx.font = `${Math.min(width, height) / 2}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(letter, width / 2, height / 2);
        }

        return canvas;
    }

    // Load assets with tracking and fallbacks
    function loadAssets() {
        console.log("Starting asset loading");

        // Reset loading states
        for (const key in loadingStates) {
            loadingStates[key] = false;
        }

        // Create all game assets with loading tracking
        assets.player = createPlayerImage();
        assets.enemy = createEnemyImage();
        assets.star = createStarImage();
        assets.background = createBackgroundImage();
        assets.laser = createLaserImage();
    }

    // ---------------
    // GAME MECHANICS
    // ---------------

    // Create a new enemy
    function spawnEnemy() {
        enemies.push({
            x: Math.random() * (canvas.width - 30),
            y: -30,
            width: 30,
            height: 30,
            speed: 1 + Math.random() * 3,
            rotation: 0
        });
    }

    // Create a new star (collectible)
    function spawnStar() {
        stars.push({
            x: Math.random() * (canvas.width - 20),
            y: -20,
            width: 20,
            height: 20,
            speed: 1 + Math.random() * 2,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 4 - 2
        });
    }

    // Create particle effect
    function createParticles(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            particles.push({
                x: x,
                y: y,
                size: Math.random() * 5 + 1,
                speed: Math.random() * 3 + 1,
                angle: Math.random() * Math.PI * 2,
                color: color,
                alpha: 1,
                decay: Math.random() * 0.02 + 0.01
            });
        }
    }

    // Create a score popup animation
    function createScorePopup(x, y, value) {
        scorePopups.push({
            x: x,
            y: y,
            value: value,
            opacity: 1,
            size: 24,
            velocity: -2 // Move upward
        });
    }

    // Check collision between two objects
    function checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
            obj1.x + obj2.width > obj2.x &&
            obj1.y < obj2.y + obj2.height &&
            obj1.y + obj2.height > obj2.y;
    }

    // Handle user input
    function handleInput() {
        // Move player based on key states
        if (keys.ArrowLeft && player.x > 0) {
            player.x -= player.speed;
        }
        if (keys.ArrowRight && player.x < canvas.width - player.width) {
            player.x += player.speed;
        }
        if (keys.ArrowUp && player.y > 0) {
            player.y -= player.speed;
        }
        if (keys.ArrowDown && player.y < canvas.height - player.height) {
            player.y += player.speed;
        }

        // Restart game when pressing space after game over
        if (gameOver && keys.Space) {
            console.log("Space key detected, restarting game");
            resetGame();
            return; // Important: return to prevent other actions
        }

        // Fire laser with Space key
        if (keys.Space && !gameOver) {
            shootLaser();
        }
    }

    // Create a new laser shot
    function shootLaser() {
        if (player.cooldown > 0) return; // Can't shoot during cooldown

        // Create laser at player position
        lasers.push({
            x: player.x + player.width / 2 - 3, // Center the laser on the player
            y: player.y,
            width: 6,
            height: 20,
            speed: 10,
            power: 1
        });

        // Add muzzle flash effect
        createParticles(
            player.x + player.width / 2,
            player.y,
            '#00ffff',
            5
        );

        // Play laser sound effect
        playSound('laser');

        // Reset cooldown
        player.cooldown = player.maxCooldown;
    }

    // Play sound effect
    function playSound(type) {
        // Create simple sound effects using the Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            switch (type) {
                case 'laser':
                    oscillator.type = 'sawtooth';
                    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(110, audioContext.currentTime + 0.1);
                    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + 0.1);
                    break;
                case 'explosion':
                    oscillator.type = 'triangle';
                    oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + 0.5);
                    break;
                case 'collect':
                    oscillator.type = 'sine';
                    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.1);
                    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + 0.1);
                    break;
            }
        } catch (e) {
            // Sound failed to play - ignore error
            console.log("Sound not supported or enabled");
        }
    }

    // Update game state
    function update(deltaTime) {
        // Process keys first for immediate restart response
        if (gameOver && keys.Space) {
            resetGame();
            return;
        }

        if (gameOver) return;

        handleInput();

        // Update player cooldown
        if (player.cooldown > 0) {
            player.cooldown -= deltaTime;
        }

        // Spawn enemies
        enemyTimer += deltaTime;
        if (enemyTimer > 1500) {
            spawnEnemy();
            enemyTimer = 0;
        }

        // Spawn stars
        starTimer += deltaTime;
        if (starTimer > 2000) {
            spawnStar();
            starTimer = 0;
        }

        // Update combo timer
        if (comboTimer > 0) {
            comboTimer -= deltaTime;
            if (comboTimer <= 0) {
                comboCount = 0;
                scoreMultiplier = 1;
            }
        }

        // Update enemies
        for (let i = enemies.length - 1; i >= 0; i--) {
            enemies[i].y += enemies[i].speed;
            enemies[i].rotation += 1;

            // Remove off-screen enemies
            if (enemies[i].y > canvas.height) {
                enemies.splice(i, 1);
                continue;
            }

            // Check collision with player
            if (checkCollision(player, enemies[i])) {
                createParticles(player.x + player.width / 2, player.y + player.height / 2, '#e74c3c', 20);
                enemies.splice(i, 1);
                lives--;

                if (lives <= 0) {
                    gameOver = true;
                }

                continue;
            }
        }

        // Update stars
        for (let i = stars.length - 1; i >= 0; i--) {
            stars[i].y += stars[i].speed;
            stars[i].rotation += stars[i].rotationSpeed;

            // Remove off-screen stars
            if (stars[i].y > canvas.height) {
                stars.splice(i, 1);
                continue;
            }

            // Check collision with player
            if (checkCollision(player, stars[i])) {
                createParticles(stars[i].x + 10, stars[i].y + 10, '#f1c40f', 15);

                // Update combo
                comboCount++;
                comboTimer = 3000; // Reset combo timer (3 seconds)
                scoreMultiplier = Math.min(5, 1 + Math.floor(comboCount / 3)); // Increase multiplier every 3 stars

                // Calculate points with multiplier
                const points = 10 * scoreMultiplier;
                score += points;

                // Create score popup
                createScorePopup(stars[i].x, stars[i].y, points);

                // Check for new high score
                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem('highScore', highScore);
                }

                stars.splice(i, 1);
                continue;
            }
        }

        // Update lasers
        for (let i = lasers.length - 1; i >= 0; i--) {
            lasers[i].y -= lasers[i].speed;

            // Remove off-screen lasers
            if (lasers[i].y < -lasers[i].height) {
                lasers.splice(i, 1);
                continue;
            }

            // Check collision with enemies
            for (let j = enemies.length - 1; j >= 0; j--) {
                if (checkCollision(lasers[i], enemies[j])) {
                    // Create explosion effect
                    createParticles(
                        enemies[j].x + enemies[j].width / 2,
                        enemies[j].y + enemies[j].height / 2,
                        '#e74c3c',
                        20
                    );

                    // Play explosion sound
                    playSound('explosion');

                    // Add score for destroying enemies
                    const points = 5 * scoreMultiplier;
                    score += points;

                    // Create score popup
                    createScorePopup(enemies[j].x, enemies[j].y, points);

                    // Check for new high score
                    if (score > highScore) {
                        highScore = score;
                        localStorage.setItem('highScore', highScore);
                    }

                    // Remove both the laser and enemy
                    enemies.splice(j, 1);
                    lasers.splice(i, 1);

                    // Exit inner loop since laser was removed
                    break;
                }
            }
        }

        // Update particles
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].x += Math.cos(particles[i].angle) * particles[i].speed;
            particles[i].y += Math.sin(particles[i].angle) * particles[i].speed;
            particles[i].alpha -= particles[i].decay;

            if (particles[i].alpha <= 0) {
                particles.splice(i, 1);
            }
        }

        // Update score popups
        for (let i = scorePopups.length - 1; i >= 0; i--) {
            scorePopups[i].y += scorePopups[i].velocity;
            scorePopups[i].opacity -= 0.02;

            if (scorePopups[i].opacity <= 0) {
                scorePopups.splice(i, 1);
            }
        }

        // Update global score variable for HTML display
        window.score = score;
        window.highScore = highScore;

        // Also share game over state
        window.gameOver = gameOver;
    }

    // Draw everything
    function render() {
        // Clear canvas first
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Show loading screen if assets aren't loaded
        if (!assetsLoaded) {
            // Draw loading screen
            ctx.fillStyle = '#0a0e2c';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#3498db';
            ctx.fillRect(canvas.width / 2 - 150, canvas.height / 2 - 20, 300 * (loadingProgress / 100), 40);

            ctx.strokeStyle = 'white';
            ctx.strokeRect(canvas.width / 2 - 150, canvas.height / 2 - 20, 300, 40);

            ctx.fillStyle = 'white';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`Loading... ${loadingProgress}%`, canvas.width / 2, canvas.height / 2 + 60);

            return;
        }

        // Draw background
        ctx.drawImage(assets.background, 0, 0);

        // Draw stars
        stars.forEach(star => {
            ctx.save();
            ctx.translate(star.x + star.width / 2, star.y + star.height / 2);
            ctx.rotate(star.rotation * Math.PI / 180);
            ctx.drawImage(assets.star, -star.width / 2, -star.height / 2);
            ctx.restore();
        });

        // Draw enemies
        enemies.forEach(enemy => {
            ctx.save();
            ctx.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
            ctx.rotate(enemy.rotation * Math.PI / 180);
            ctx.drawImage(assets.enemy, -enemy.width / 2, -enemy.height / 2);
            ctx.restore();
        });

        // Draw lasers
        lasers.forEach(laser => {
            ctx.drawImage(assets.laser, laser.x, laser.y);
        });

        // Draw player
        ctx.drawImage(assets.player, player.x, player.y);

        // Draw particles
        particles.forEach(particle => {
            ctx.fillStyle = particle.color + Math.floor(particle.alpha * 255).toString(16).padStart(2, '0');
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw score popups
        scorePopups.forEach(popup => {
            ctx.fillStyle = `rgba(255, 255, 0, ${popup.opacity})`;
            ctx.font = `bold ${popup.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText(`+${popup.value}`, popup.x + 10, popup.y);
            ctx.textAlign = 'left';
        });

        // Draw UI
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, 20, 30);
        ctx.fillText(`High Score: ${highScore}`, 20, 60);

        // Draw multiplier if active
        if (scoreMultiplier > 1) {
            ctx.fillStyle = '#f1c40f'; // Yellow
            ctx.font = 'bold 22px Arial';
            ctx.fillText(`${scoreMultiplier}x`, 150, 30);

            // Draw combo meter
            const comboWidth = 100 * (comboTimer / 3000);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(150, 35, 100, 5);
            ctx.fillStyle = '#f1c40f';
            ctx.fillRect(150, 35, comboWidth, 5);
        }

        // Draw lives
        ctx.fillText(`Lives: `, canvas.width - 120, 30);
        for (let i = 0; i < lives; i++) {
            ctx.drawImage(assets.player, canvas.width - 100 + i * 25, 10, 20, 20);
        }

        // Draw cooldown indicator if player recently shot
        if (player.cooldown > 0 && !gameOver) {
            const cooldownWidth = 50 * (player.cooldown / player.maxCooldown);
            ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
            ctx.fillRect(player.x - 5, player.y + player.height + 5, 50, 3);
        }
    }

    // Main game loop
    function gameLoop(timestamp) {
        // Calculate delta time
        const deltaTime = timestamp - lastTime || 16;
        lastTime = timestamp;

        // Update and render
        update(deltaTime);
        render();

        // Continue the loop
        requestAnimationFrame(gameLoop);
    }

    // Start the game when ready
    function startGameWhenReady() {
        if (assetsLoaded && !gameStarted) {
            gameStarted = true;

            // Hide loading element
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }

            // Setup and start game
            setupEventListeners();
            resetGame();
            requestAnimationFrame(gameLoop);
            console.log("Game initialized and started successfully");
        }
    }

    // Reset the game
    function resetGame() {
        console.log("Game reset function called");

        // Reset all game objects
        player.x = canvas.width / 2;
        player.y = canvas.height - 100;
        enemies.length = 0;
        stars.length = 0;
        particles.length = 0;
        scorePopups.length = 0;
        lasers.length = 0; // Also clear lasers

        // Reset game state
        score = 0;
        scoreMultiplier = 1;
        comboCount = 0;
        comboTimer = 0;
        lives = 3;
        gameOver = false;
        enemyTimer = 0;
        starTimer = 0;

        // Update global variables
        window.score = score;
        window.gameOver = gameOver;

        // Force redraw
        render();
    }

    // Event listeners with cleanup to prevent duplicates
    function setupEventListeners() {
        // Remove existing listeners first to prevent duplicates
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);

        // Add new listeners
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
    }

    // Key handlers
    function handleKeyDown(e) {
        // Handle restart first with direct call
        if (e.code === 'Space' && gameOver) {
            console.log("Space key pressed, attempting restart");
            resetGame();
            e.preventDefault();
            return;
        }

        // Handle other keys
        if (e.code === 'ArrowLeft' ||
            e.code === 'ArrowRight' ||
            e.code === 'ArrowUp' ||
            e.code === 'ArrowDown') {
            keys[e.code] = true;
            e.preventDefault();
        }

        if (e.code === 'Space') {
            keys.Space = true;
            e.preventDefault();
        }
    }

    function handleKeyUp(e) {
        if (e.code === 'ArrowLeft' ||
            e.code === 'ArrowRight' ||
            e.code === 'ArrowUp' ||
            e.code === 'ArrowDown' ||
            e.code === 'Space') {
            keys[e.code] = false;
        }
    }

    // Initialize and start loading
    function init() {
        console.log("Game initialization started");
        loadAssets();

        // Set a timeout to force start if assets take too long
        setTimeout(function () {
            if (!assetsLoaded) {
                console.warn("Asset loading timed out - forcing game start");
                assetsLoaded = true;
                startGameWhenReady();
            }
        }, 5000); // Wait 5 seconds max
    }

    // Start initialization
    init();
});