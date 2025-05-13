/**
 * Game restart helper - include this script if you have restart issues
 * This provides alternative ways to restart the game if the space key isn't working
 */

document.addEventListener('DOMContentLoaded', function () {
    // Create a backup reset function that will be called if normal reset fails
    window.emergencyReset = function () {
        console.log("Emergency reset triggered");

        // Get references to game objects
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) return;

        // Reset global game state
        window.gameOver = false;
        window.score = 0;

        // Try to find and call the game's resetGame function
        try {
            // If resetGame exists in global scope
            if (typeof resetGame === 'function') {
                resetGame();
                return;
            }

            // Hard refresh as last resort
            location.reload();
        } catch (e) {
            console.error("Error during emergency reset:", e);
            // Last resort - reload page
            location.reload();
        }
    };

    // Add double-click on canvas to restart
    const gameCanvas = document.getElementById('gameCanvas');
    if (gameCanvas) {
        gameCanvas.addEventListener('dblclick', function () {
            if (window.gameOver) {
                console.log("Double-click restart");
                // Try normal restart first
                document.dispatchEvent(new KeyboardEvent('keydown', {
                    code: 'Space',
                    bubbles: true
                }));

                // If that doesn't work after a short delay, try emergency reset
                setTimeout(() => {
                    if (window.gameOver) {
                        window.emergencyReset();
                    }
                }, 300);
            }
        });
    }

    // Add context menu prevention and right-click restart
    if (gameCanvas) {
        gameCanvas.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            if (window.gameOver) {
                console.log("Right-click restart");
                window.emergencyReset();
            }
            return false;
        });
    }

    // Add keyboard listeners for restart
    document.addEventListener('keydown', function (e) {
        // R key as alternative restart
        if (e.code === 'KeyR' && window.gameOver) {
            console.log("R key restart");
            window.emergencyReset();
        }

        // Enter key as alternative restart
        if (e.code === 'Enter' && window.gameOver) {
            console.log("Enter key restart");
            window.emergencyReset();
        }
    });

    // Add a visible restart button that shows when game is over
    const restartBtn = document.createElement('button');
    restartBtn.textContent = "RESTART GAME";
    restartBtn.style.position = "fixed";
    restartBtn.style.top = "50%";
    restartBtn.style.left = "50%";
    restartBtn.style.transform = "translate(-50%, 50px)";
    restartBtn.style.padding = "10px 20px";
    restartBtn.style.backgroundColor = "#f1c40f";
    restartBtn.style.color = "#111";
    restartBtn.style.border = "none";
    restartBtn.style.borderRadius = "5px";
    restartBtn.style.fontWeight = "bold";
    restartBtn.style.cursor = "pointer";
    restartBtn.style.display = "none";
    restartBtn.style.zIndex = "1000";

    restartBtn.addEventListener('click', function () {
        console.log("Button restart");
        window.emergencyReset();
    });

    document.body.appendChild(restartBtn);

    // Show/hide restart button based on game state
    setInterval(() => {
        if (window.gameOver) {
            restartBtn.style.display = "block";
        } else {
            restartBtn.style.display = "none";
        }
    }, 500);

    console.log("Restart fix loaded");
});
