/**
 * Laser Upgrade System
 * This script adds power-ups and weapon upgrades to the game
 */
document.addEventListener('DOMContentLoaded', function () {
    // Wait for main game to initialize
    setTimeout(() => {
        if (!window.game) {
            console.log("Creating laser upgrade system");
            setupLaserUpgrades();
        }
    }, 1000);

    function setupLaserUpgrades() {
        // Store original shooter function if it exists
        const originalShootFunction = window.shootLaser;

        // Power-up levels
        const powerUpLevels = [
            { name: "Standard", cooldown: 300, color: "#00ffff", width: 6, damage: 1 },
            { name: "Rapid", cooldown: 200, color: "#00ff00", width: 4, damage: 1 },
            { name: "Power", cooldown: 400, color: "#ff0000", width: 8, damage: 2 },
            { name: "Dual", cooldown: 350, color: "#ffff00", width: 5, damage: 1, count: 2 }
        ];

        let currentLevel = 0;

        // Create power-up item that occasionally spawns
        const createPowerUp = function () {
            // Check if this function exists in the main game
            if (typeof window.createPowerUp === 'function') return;

            // Only spawn if we have a player object
            if (!window.player) return;

            const powerUp = {
                x: Math.random() * 700 + 50,
                y: -30,
                width: 30,
                height: 30,
                type: Math.floor(Math.random() * powerUpLevels.length),
                speed: 2,
                active: true
            };

            // Add to a global array if it exists
            if (Array.isArray(window.powerUps)) {
                window.powerUps.push(powerUp);
            }
        };

        // Start spawning power-ups
        setInterval(createPowerUp, 15000); // Every 15 seconds

        // Override player shooting function to support upgrades
        window.shootLaser = function () {
            // Get player if available
            const player = window.player;
            if (!player) return;

            // Get laser array
            const lasers = window.lasers || [];

            // Get current power level
            const powerLevel = powerUpLevels[currentLevel];

            // Can't shoot during cooldown
            if (player.cooldown > 0) return;

            // Number of lasers to shoot
            const laserCount = powerLevel.count || 1;

            // Create lasers based on current power level
            for (let i = 0; i < laserCount; i++) {
                let xOffset = 0;

                // Calculate offset for multiple lasers
                if (laserCount > 1) {
                    xOffset = (i - (laserCount - 1) / 2) * 12;
                }

                lasers.push({
                    x: player.x + player.width / 2 - powerLevel.width / 2 + xOffset,
                    y: player.y,
                    width: powerLevel.width,
                    height: 20,
                    speed: 10,
                    power: powerLevel.damage,
                    color: powerLevel.color
                });
            }

            // Add muzzle flash effect if particle function exists
            if (typeof window.createParticles === 'function') {
                window.createParticles(
                    player.x + player.width / 2,
                    player.y,
                    powerLevel.color,
                    5
                );
            }

            // Play sound if function exists
            if (typeof window.playSound === 'function') {
                window.playSound('laser');
            }

            // Reset cooldown based on current power level
            player.cooldown = powerLevel.cooldown;
            player.maxCooldown = powerLevel.cooldown; // Update max cooldown too
        };

        // Function to upgrade weapon
        window.upgradeLaser = function () {
            currentLevel = (currentLevel + 1) % powerUpLevels.length;

            // Show notification
            if (typeof window.createScorePopup === 'function') {
                const player = window.player;
                if (player) {
                    window.createScorePopup(
                        player.x,
                        player.y,
                        powerUpLevels[currentLevel].name + " Laser!"
                    );
                }
            }

            return powerUpLevels[currentLevel].name;
        };

        console.log("Laser upgrade system initialized");
    }
});
