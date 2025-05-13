// Fallback asset generator for when image files aren't available
const FallbackAssets = {
    // Generate a colored rectangle as placeholder
    generatePlaceholder: function (width, height, color, text) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);

        // Border
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.strokeRect(2, 2, width - 4, height - 4);

        // Text label
        if (text) {
            ctx.fillStyle = 'white';
            ctx.font = `${Math.floor(width / 10)}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, width / 2, height / 2);
        }

        return canvas.toDataURL();
    },

    // Generate all needed game assets as placeholders
    generateGameAssets: function () {
        return {
            player: this.generatePlaceholder(100, 100, 'blue', 'PLAYER'),
            background: this.generatePlaceholder(800, 600, '#333', 'BG'),
            enemy: this.generatePlaceholder(100, 100, 'red', 'ENEMY')
        };
    }
};
