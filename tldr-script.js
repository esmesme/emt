// Rainbow squiggles background
let canvas, ctx;
let squiggles = [];

function setup() {
    canvas = document.getElementById('background-canvas');
    ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        createSquiggles(); // Recreate squiggles on resize
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create squiggles
    createSquiggles();
    
    // Start color animation
    animate();
}

function createSquiggles() {
    squiggles = [];
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
        '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
        '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
    ];
    
    for (let i = 0; i < 20; i++) {
        squiggles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 4 + 2,
            points: generateSquigglePoints(),
            colorIndex: Math.floor(Math.random() * colors.length),
            colorChangeSpeed: Math.random() * 0.02 + 0.01
        });
    }
}

function generateSquigglePoints() {
    const points = [];
    const startX = Math.random() * canvas.width;
    const startY = Math.random() * canvas.height;
    const length = Math.random() * 100 + 50;
    const segments = Math.floor(length / 10);
    
    let x = startX;
    let y = startY;
    
    for (let i = 0; i < segments; i++) {
        points.push({x: x, y: y});
        x += (Math.random() - 0.5) * 20;
        y += (Math.random() - 0.5) * 20;
    }
    
    return points;
}

function animate() {
    // Clear canvas
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
        '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
        '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
    ];
    
    // Draw squiggles
    squiggles.forEach(squiggle => {
        // Update color
        squiggle.colorIndex += squiggle.colorChangeSpeed;
        if (squiggle.colorIndex >= colors.length) {
            squiggle.colorIndex = 0;
        }
        
        const currentColor = colors[Math.floor(squiggle.colorIndex)];
        
        // Draw squiggle
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = squiggle.size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        squiggle.points.forEach((point, index) => {
            if (index === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        });
        ctx.stroke();
    });
    
    requestAnimationFrame(animate);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', setup); 