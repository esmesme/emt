function initNavigation() {
    const nav = document.querySelector('.main-nav');
    const title = document.querySelector('.container');
    let isVisible = false;

    // Check if elements exist
    if (!nav || !title) {
        console.error('Navigation or title elements not found!');
        return;
    }

    console.log('Nav and title elements found successfully');

    // Function to handle scroll events
    function handleScroll() {
        // Get the position and dimensions of the title
        const titleRect = title.getBoundingClientRect();
        const titleHeight = titleRect.height;
        const titleBottom = titleRect.bottom;
        const windowHeight = window.innerHeight;
        
        // Show nav only when the title is completely scrolled out of view with a buffer
        if (titleBottom < -50) {
            if (!isVisible) {
                console.log('Showing nav - title is fully out of view');
                nav.classList.add('visible');
                isVisible = true;
            }
        } 
        // Hide nav when the title is visible or close to being visible
        else if (titleBottom > -50) {
            console.log('Hiding nav - title is visible or nearly visible');
            nav.classList.remove('visible');
            isVisible = false;
        }
    }

    // Add scroll event listener with throttling to improve performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial check
    handleScroll();
}

// Wait for the DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
} else {
    initNavigation();
}