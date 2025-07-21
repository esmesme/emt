// Windows 95 Style Portfolio JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeDesktopIcons();
    initializeWindows();
    initializeImageViewer();
    updateTime();
    
    // Update time every minute
    setInterval(updateTime, 60000);
});

// Desktop Icons Functionality
function initializeDesktopIcons() {
    const desktopIcons = document.querySelectorAll('.desktop-icon');
    
    desktopIcons.forEach(icon => {
        let clickTimeout;
        let clickCount = 0;
        
        icon.addEventListener('click', function(e) {
            clickCount++;
            
            if (clickCount === 1) {
                clickTimeout = setTimeout(() => {
                    // Single click - select the icon
                    selectIcon(this);
                    clickCount = 0;
                }, 200);
            } else {
                // Double click - open the window
                clearTimeout(clickTimeout);
                clickCount = 0;
                const project = this.getAttribute('data-project');
                openProjectWindow(project);
                this.classList.add('open');
                this.classList.remove('selected');
            }
        });
        
        // Prevent double click from triggering single click
        icon.addEventListener('dblclick', function(e) {
            e.preventDefault();
            clearTimeout(clickTimeout);
            clickCount = 0;
        });
    });
}

// Select icon (single click)
function selectIcon(icon) {
    // Remove selection from all other icons
    document.querySelectorAll('.desktop-icon').forEach(i => {
        i.classList.remove('selected');
    });
    
    // Select this icon
    icon.classList.add('selected');
}

// Select folder item (single click)
function selectFolderItem(item) {
    // Remove selection from all other folder items in the same window
    const window = item.closest('.window-content');
    if (window) {
        window.querySelectorAll('.folder-item').forEach(i => {
            i.classList.remove('selected');
        });
    }
    
    // Select this item
    item.classList.add('selected');
}

// Window Management
function initializeWindows() {
    // Make all windows draggable and resizable
    const windows = document.querySelectorAll('.window');
    windows.forEach(window => {
        makeWindowDraggable(window);
        makeWindowResizable(window);
    });
    
    // Window controls
    const closeButtons = document.querySelectorAll('.window-control.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const window = this.closest('.window-container, .gallery-window, .readme-window');
            closeWindow(window);
        });
    });
    
    // Minimize buttons (just hide for now)
    const minimizeButtons = document.querySelectorAll('.window-control.minimize');
    minimizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const window = this.closest('.window-container, .gallery-window, .readme-window');
            minimizeWindow(window);
        });
    });
    
    // Maximize buttons (toggle size)
    const maximizeButtons = document.querySelectorAll('.window-control.maximize');
    maximizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const window = this.closest('.window-container, .gallery-window, .readme-window');
            maximizeWindow(window);
        });
    });
    
    // Folder items in project windows
    const folderItems = document.querySelectorAll('.folder-item');
    folderItems.forEach(item => {
        let clickTimeout;
        let clickCount = 0;
        
        item.addEventListener('click', function(e) {
            clickCount++;
            
            if (clickCount === 1) {
                clickTimeout = setTimeout(() => {
                    // Single click - select the item
                    selectFolderItem(this);
                    clickCount = 0;
                }, 200);
            } else {
                // Double click - open the item
                clearTimeout(clickTimeout);
                clickCount = 0;
                const gallery = this.getAttribute('data-gallery');
                const readme = this.getAttribute('data-readme');
                
                if (gallery) {
                    openGallery(gallery);
                } else if (readme) {
                    openReadme(readme);
                }
                this.classList.add('open');
                this.classList.remove('selected');
            }
        });
        
        // Prevent double click from triggering single click
        item.addEventListener('dblclick', function(e) {
            e.preventDefault();
            clearTimeout(clickTimeout);
            clickCount = 0;
        });
    });
}

// Make window draggable
function makeWindowDraggable(windowElement) {
    const titlebar = windowElement.querySelector('.window-titlebar');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    
    titlebar.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
    
    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        
        if (e.target === titlebar || e.target.closest('.window-titlebar')) {
            isDragging = true;
        }
    }
    
    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            
            xOffset = currentX;
            yOffset = currentY;
            
            setTranslate(currentX, currentY, windowElement);
        }
    }
    
    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }
    
    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate(${xPos}px, ${yPos}px)`;
    }
}

// Make window resizable
function makeWindowResizable(windowElement) {
    // Add resize handles
    const resizeHandles = [
        { class: 'n', cursor: 'n-resize' },
        { class: 's', cursor: 's-resize' },
        { class: 'e', cursor: 'e-resize' },
        { class: 'w', cursor: 'w-resize' },
        { class: 'ne', cursor: 'ne-resize' },
        { class: 'nw', cursor: 'nw-resize' },
        { class: 'se', cursor: 'se-resize' },
        { class: 'sw', cursor: 'sw-resize' }
    ];
    
    resizeHandles.forEach(handle => {
        const handleElement = document.createElement('div');
        handleElement.className = `window-resize-handle ${handle.class}`;
        handleElement.style.cursor = handle.cursor;
        windowElement.appendChild(handleElement);
        
        // Add resize functionality
        makeResizeHandle(handleElement, handle.class, windowElement);
    });
}

// Make individual resize handle functional
function makeResizeHandle(handle, direction, windowElement) {
    let isResizing = false;
    let startX, startY, startWidth, startHeight, startLeft, startTop;
    
    handle.addEventListener('mousedown', startResize);
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
    
    function startResize(e) {
        e.preventDefault();
        e.stopPropagation();
        
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        
        const rect = windowElement.getBoundingClientRect();
        startWidth = rect.width;
        startHeight = rect.height;
        startLeft = rect.left;
        startTop = rect.top;
        
        windowElement.classList.add('resizing');
    }
    
    function resize(e) {
        if (!isResizing) return;
        
        e.preventDefault();
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        let newWidth = startWidth;
        let newHeight = startHeight;
        let newLeft = startLeft;
        let newTop = startTop;
        
        // Calculate new dimensions based on direction
        if (direction.includes('e')) {
            newWidth = Math.max(400, startWidth + deltaX);
        }
        if (direction.includes('w')) {
            const widthChange = Math.min(deltaX, startWidth - 400);
            newWidth = Math.max(400, startWidth - widthChange);
            newLeft = startLeft + widthChange;
        }
        if (direction.includes('s')) {
            newHeight = Math.max(300, startHeight + deltaY);
        }
        if (direction.includes('n')) {
            const heightChange = Math.min(deltaY, startHeight - 300);
            newHeight = Math.max(300, startHeight - heightChange);
            newTop = startTop + heightChange;
        }
        
        // Apply new dimensions
        windowElement.style.width = newWidth + 'px';
        windowElement.style.height = newHeight + 'px';
        
        // Update position if needed
        if (newLeft !== startLeft || newTop !== startTop) {
            const container = windowElement.closest('.window-container, .gallery-window, .readme-window');
            if (container) {
                const currentTransform = container.style.transform;
                const translateMatch = currentTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
                if (translateMatch) {
                    const currentX = parseFloat(translateMatch[1]);
                    const currentY = parseFloat(translateMatch[2]);
                    const deltaLeft = newLeft - startLeft;
                    const deltaTop = newTop - startTop;
                    container.style.transform = `translate(${currentX + deltaLeft}px, ${currentY + deltaTop}px)`;
                }
            }
        }
    }
    
    function stopResize() {
        isResizing = false;
        windowElement.classList.remove('resizing');
    }
}

// Open project window
function openProjectWindow(project) {
    const windowId = `${project}-window`;
    const window = document.getElementById(windowId);
    
    if (window) {
        // Show the window (don't close others)
        window.style.display = 'block';
        
        // Center the window if it's not already positioned
        if (!window.style.transform || window.style.transform === 'translate(-50%, -50%)') {
            centerWindow(window);
        }
        
        // Bring to front
        bringToFront(window);
    }
}

// Open gallery window
function openGallery(galleryId) {
    const galleryWindow = document.getElementById(`${galleryId}-gallery`);
    
    if (galleryWindow) {
        galleryWindow.style.display = 'block';
        centerWindow(galleryWindow);
        bringToFront(galleryWindow);
    }
}

// Open README window
function openReadme(readmeId) {
    const readmeWindow = document.getElementById(readmeId);
    
    if (readmeWindow) {
        readmeWindow.style.display = 'block';
        centerWindow(readmeWindow);
        bringToFront(readmeWindow);
    }
}

// Close window
function closeWindow(window) {
    if (window) {
        window.style.display = 'none';
        // Reset transform
        window.style.transform = 'translate(-50%, -50%)';
        
        // Remove open state from corresponding icon
        const project = window.id.replace('-window', '');
        const icon = document.querySelector(`[data-project="${project}"]`);
        if (icon) {
            icon.classList.remove('open');
        }
    }
}

// Minimize window (just hide for now)
function minimizeWindow(window) {
    if (window) {
        window.style.display = 'none';
    }
}

// Maximize window
function maximizeWindow(window) {
    const isMaximized = window.classList.contains('maximized');
    
    if (isMaximized) {
        // Restore
        window.classList.remove('maximized');
        window.style.width = '';
        window.style.height = '';
        window.style.top = '';
        window.style.left = '';
        window.style.transform = 'translate(-50%, -50%)';
    } else {
        // Maximize
        window.classList.add('maximized');
        window.style.width = 'calc(100vw - 40px)';
        window.style.height = 'calc(100vh - 80px)';
        window.style.top = '20px';
        window.style.left = '20px';
        window.style.transform = 'none';
    }
}

// Close all windows
function closeAllWindows() {
    const windows = document.querySelectorAll('.window-container, .gallery-window, .readme-window');
    windows.forEach(window => {
        closeWindow(window);
    });
}

// Center window
function centerWindow(window) {
    window.style.transform = 'translate(-50%, -50%)';
}

// Bring window to front
function bringToFront(window) {
    // Remove high z-index from all windows
    const allWindows = document.querySelectorAll('.window-container, .gallery-window, .readme-window');
    allWindows.forEach(w => {
        w.style.zIndex = '100';
    });
    
    // Bring this window to front
    window.style.zIndex = '1000';
}

// Image Viewer Functionality
function initializeImageViewer() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const imageViewer = document.getElementById('image-viewer');
    const imageViewerImg = document.getElementById('image-viewer-img');
    const closeImageViewer = document.querySelector('.image-viewer-control.close');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imageSrc = this.getAttribute('data-image');
            if (imageSrc && imageSrc !== '[PLACEHOLDER]') {
                imageViewerImg.src = imageSrc;
                imageViewer.style.display = 'flex';
                bringToFront(imageViewer);
            }
        });
    });
    
    if (closeImageViewer) {
        closeImageViewer.addEventListener('click', function() {
            imageViewer.style.display = 'none';
        });
    }
    
    // Close on background click
    imageViewer.addEventListener('click', function(e) {
        if (e.target === imageViewer) {
            imageViewer.style.display = 'none';
        }
    });
}

// Update time in taskbar
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    
    const timeElement = document.querySelector('.time');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

// Play click sound (placeholder)
function playClickSound() {
    // Could add actual sound effect here
    console.log('Click!');
}

    // Back button functionality
    const backButtons = document.querySelectorAll('.back-button');
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetWindow = this.getAttribute('data-back-to');
            if (targetWindow) {
                // Close current window
                const currentWindow = this.closest('.gallery-window, .readme-window');
                if (currentWindow) {
                    currentWindow.style.display = 'none';
                }
                
                // Open target window
                const targetWindowElement = document.getElementById(targetWindow);
                if (targetWindowElement) {
                    targetWindowElement.style.display = 'block';
                    centerWindow(targetWindowElement);
                    bringToFront(targetWindowElement);
                }
            }
        });
    });
    
    // Add click sound to interactive elements
    document.addEventListener('DOMContentLoaded', function() {
        const clickableElements = document.querySelectorAll('.desktop-icon, .window-control, .folder-item, .gallery-item, .back-button');
        clickableElements.forEach(element => {
            element.addEventListener('click', playClickSound);
        });
    }); 