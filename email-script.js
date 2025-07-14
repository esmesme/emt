// Enhanced oscillating dots background
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
    
    // Oscillating dots parameters
    const dotCount = 20;
    const rowCount = 5;
    const spacing = 60;
    let time = 0;
    let lastTime = 0;
    
    // Animation loop
    function animate(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        time += deltaTime * 0.001;
        
        // Clear canvas with background color
        ctx.fillStyle = '#b6bac5';
        ctx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
        
        // Draw oscillating dots in rows
        for (let row = 0; row < rowCount; row++) {
            const y = bgCanvas.height / 2 - ((rowCount - 1) / 2) * spacing + row * spacing;
            
            for (let i = 0; i < dotCount; i++) {
                // Calculate x-position with spacing
                const baseX = bgCanvas.width / 2 - ((dotCount - 1) / 2) * spacing + i * spacing;
                
                // Wave parameters vary by row
                const amplitude = 8 + row * 3;
                const frequency = 0.8 + row * 0.15;
                const phaseOffset = row * 0.8;
                
                // Calculate vertical oscillation
                const offset = Math.sin(time * frequency + i * 0.3 + phaseOffset) * amplitude;
                const finalY = y + offset;
                
                // Dot size and opacity vary with oscillation
                const dotSize = 2 + Math.abs(Math.sin(time * frequency + i * 0.3 + phaseOffset)) * 1.5;
                const opacity = 0.4 + Math.abs(Math.sin(time * frequency + i * 0.3 + phaseOffset)) * 0.4;
                
                // Draw dot
                ctx.globalAlpha = opacity;
                ctx.fillStyle = '#383e4e';
                ctx.beginPath();
                ctx.arc(baseX, finalY, dotSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    requestAnimationFrame(animate);
    
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