// Oscillating dots background
document.addEventListener('DOMContentLoaded', function() {
    const letters = document.querySelectorAll('.letter');
    
    // Create background canvas for oscillating dots
    const bgCanvas = document.createElement('canvas');
    bgCanvas.style.position = 'fixed';
    bgCanvas.style.top = '0';
    bgCanvas.style.left = '0';
    bgCanvas.style.width = '100%';
    bgCanvas.style.height = '100%';
    bgCanvas.style.zIndex = '-1';
    bgCanvas.style.pointerEvents = 'none';
    document.body.appendChild(bgCanvas);
    
    const ctx = bgCanvas.getContext('2d');
    
    function resizeCanvas() {
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create oscillating dots
    const dots = [];
    const numDots = 50;
    
    for (let i = 0; i < numDots; i++) {
        dots.push({
            x: Math.random() * bgCanvas.width,
            y: Math.random() * bgCanvas.height,
            radius: Math.random() * 3 + 1,
            speed: Math.random() * 0.02 + 0.01,
            offset: Math.random() * Math.PI * 2
        });
    }
    
    // Animation loop
    function animate() {
        ctx.fillStyle = '#b6bac5';
        ctx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
        
        dots.forEach(dot => {
            const oscillation = Math.sin(Date.now() * dot.speed + dot.offset) * 20;
            const alpha = 0.3 + Math.sin(Date.now() * dot.speed + dot.offset) * 0.2;
            
            ctx.globalAlpha = alpha;
            ctx.fillStyle = '#383e4e';
            ctx.beginPath();
            ctx.arc(dot.x + oscillation, dot.y, dot.radius, 0, Math.PI * 2);
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Letter hover animations
    letters.forEach(letter => {
        letter.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-20px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        letter.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}); 