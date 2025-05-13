/**
 * Simple game restart helper
 * Addresses common restart issues with minimal code
 */

document.addEventListener('DOMContentLoaded', function () {
    console.log("Simple restart helper loaded");

    // Add restart button to the page
    const button = document.createElement('button');
    button.textContent = "RESTART";
    button.style.position = "fixed";
    button.style.bottom = "10px";
    button.style.right = "10px";
    button.style.padding = "10px";
    button.style.backgroundColor = "#f1c40f";
    button.style.color = "black";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.display = "none";
    button.style.zIndex = "1000";
    document.body.appendChild(button);

    // Show button when game is over
    setInterval(function () {
        if (window.gameOver) {
            button.style.display = "block";
        } else {
            button.style.display = "none";
        }
    }, 300);

    // Add click handler to restart the game
    button.addEventListener('click', function () {
        console.log("Restart button clicked");
        restartGame();
    });

    // Add key handler for R key to restart
    document.addEventListener('keydown', function (e) {
        if ((e.code === 'KeyR' || e.key === 'r') && window.gameOver) {
            console.log("R key pressed, restarting game");
            restartGame();
        }
    });

    // Function to restart the game using multiple approaches
    function restartGame() {
        // Method 1: Try using exposed resetGame function
        if (typeof window.resetGame === 'function') {
            window.resetGame();
            return;
        }

        // Method 2: Simulate Space key press
        document.dispatchEvent(new KeyboardEvent('keydown', {
            code: 'Space',
            key: ' ',
            keyCode: 32,
            bubbles: true
        }));

        // Method 3: Reset game variables directly
        if (window.gameOver) {
            window.gameOver = false;
            window.score = 0;

            // Wait a bit and reload if game doesn't restart
            setTimeout(function () {
                if (window.gameOver) {
                    location.reload();
                }
            }, 500);
        }
    }
});
