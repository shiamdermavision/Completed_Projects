/**
 * Loading Fix Script
 * Helps ensure the game loads properly even if there are asset loading issues
 */
document.addEventListener('DOMContentLoaded', function () {
    console.log("Loading fix script initialized");

    // Create an enhanced loading display
    function createLoadingDisplay() {
        // Remove any existing loading elements for clean start
        const oldLoading = document.getElementById('loading');
        if (oldLoading) oldLoading.remove();

        // Create new loading container
        const loadingContainer = document.createElement('div');
        loadingContainer.id = 'enhanced-loading';
        loadingContainer.style.position = 'fixed';
        loadingContainer.style.top = '0';
        loadingContainer.style.left = '0';
        loadingContainer.style.width = '100%';
        loadingContainer.style.height = '100%';
        loadingContainer.style.backgroundColor = 'rgba(10, 14, 44, 0.9)';
        loadingContainer.style.display = 'flex';
        loadingContainer.style.flexDirection = 'column';
        loadingContainer.style.justifyContent = 'center';
        loadingContainer.style.alignItems = 'center';
        loadingContainer.style.zIndex = '1000';

        // Create loading text
        const loadingText = document.createElement('h2');
        loadingText.id = 'loading';
        loadingText.innerText = 'Loading Game...';
        loadingText.style.color = 'white';
        loadingText.style.marginBottom = '20px';
        loadingContainer.appendChild(loadingText);

        // Create progress bar container
        const progressContainer = document.createElement('div');
        progressContainer.style.width = '300px';
        progressContainer.style.height = '20px';
        progressContainer.style.backgroundColor = '#111';
        progressContainer.style.border = '2px solid white';
        progressContainer.style.borderRadius = '10px';
        progressContainer.style.overflow = 'hidden';
        loadingContainer.appendChild(progressContainer);

        // Create progress bar
        const progressBar = document.createElement('div');
        progressBar.id = 'loading-progress';
        progressBar.style.width = '0%';
        progressBar.style.height = '100%';
        progressBar.style.backgroundColor = '#3498db';
        progressBar.style.transition = 'width 0.3s';
        progressContainer.appendChild(progressBar);

        // Create status text
        const statusText = document.createElement('div');
        statusText.id = 'loading-status';
        statusText.innerText = 'Preparing game assets...';
        statusText.style.color = '#aaa';
        statusText.style.marginTop = '10px';
        statusText.style.fontSize = '14px';
        loadingContainer.appendChild(statusText);

        // Create force start button (hidden initially)
        const startButton = document.createElement('button');
        startButton.id = 'force-start';
        startButton.innerText = 'Start Game Now';
        startButton.style.marginTop = '30px';
        startButton.style.padding = '10px 20px';
        startButton.style.backgroundColor = '#f1c40f';
        startButton.style.border = 'none';
        startButton.style.borderRadius = '5px';
        startButton.style.color = 'black';
        startButton.style.fontWeight = 'bold';
        startButton.style.cursor = 'pointer';
        startButton.style.display = 'none';
        startButton.onclick = forceStartGame;
        loadingContainer.appendChild(startButton);

        // Add to document
        document.body.appendChild(loadingContainer);

        // Show force start button after 3 seconds
        setTimeout(function () {
            startButton.style.display = 'block';
        }, 3000);
    }

    // Update the loading progress display
    function updateLoadingProgress(percent, status) {
        const progressBar = document.getElementById('loading-progress');
        const statusText = document.getElementById('loading-status');
        const loadingText = document.getElementById('loading');

        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }

        if (statusText && status) {
            statusText.innerText = status;
        }

        if (loadingText) {
            loadingText.innerText = `Loading Game... ${percent}%`;
        }
    }

    // Force game to start regardless of loading state
    function forceStartGame() {
        console.log("Forcing game to start");

        // Hide loading display
        const loadingDisplay = document.getElementById('enhanced-loading');
        if (loadingDisplay) {
            loadingDisplay.style.display = 'none';
        }

        // Set global variables to indicate loading complete
        window.assetsLoaded = true;

        // Try various methods to start the game
        if (typeof window.startGameWhenReady === 'function') {
            window.startGameWhenReady();
        }

        // If game still shows loading, try a page reload
        setTimeout(function () {
            const loading = document.getElementById('loading');
            if (loading && loading.style.display !== 'none') {
                alert("Having trouble loading the game. The page will reload to try again.");
                location.reload();
            }
        }, 1000);
    }

    // Initialize enhanced loading
    createLoadingDisplay();

    // Monitor loading progress
    let loadingProgress = 0;
    const loadingInterval = setInterval(function () {
        // Increment progress automatically for smoother experience
        loadingProgress += 5;
        if (loadingProgress >= 95) {
            clearInterval(loadingInterval);
            loadingProgress = 95; // Stay at 95% until actual completion
        }

        updateLoadingProgress(loadingProgress, "Loading game assets...");

        // Check if game has started
        if (window.gameStarted || window.assetsLoaded) {
            updateLoadingProgress(100, "Game ready!");

            // Hide loading after a short delay
            setTimeout(function () {
                const loadingDisplay = document.getElementById('enhanced-loading');
                if (loadingDisplay) {
                    loadingDisplay.style.display = 'none';
                }
            }, 500);

            clearInterval(loadingInterval);
        }
    }, 200);

    // Safety timeout in case the game never loads
    setTimeout(function () {
        const loadingDisplay = document.getElementById('enhanced-loading');
        const forceStartButton = document.getElementById('force-start');

        if (loadingDisplay && loadingDisplay.style.display !== 'none') {
            console.warn("Game loading timeout - showing force start button");
            if (forceStartButton) {
                forceStartButton.style.display = 'block';
                forceStartButton.style.backgroundColor = '#e74c3c';
            }
            updateLoadingProgress(95, "Loading seems slow. Click the button below to start anyway.");
        }
    }, 8000);
});
