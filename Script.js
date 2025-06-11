// Service Worker Registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
        .then(function(registration) {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(function(error) {
            console.log('Service Worker registration failed:', error);
        });
}

// Matrix Background Effect
const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');

// Set canvas size to window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Matrix characters
const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
const font_size = 10;
const columns = canvas.width / font_size;
const drops = [];

// Initialize the drops array
for (let x = 0; x < columns; x++) {
    drops[x] = 1;
}

// Draw the matrix effect
function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00ff41";
    ctx.font = font_size + "px courier";

    for (let i = 0; i < drops.length; i++) {
        const text = matrix[Math.floor(Math.random() * matrix.length)];
        ctx.fillText(text, i * font_size, drops[i] * font_size);

        if (drops[i] * font_size > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

// Start the matrix animation
setInterval(drawMatrix, 35);

// PWA Installation
let deferredPrompt;
const installButton = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installButton.style.display = 'block';
});

installButton.addEventListener('click', (e) => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            deferredPrompt = null;
        });
    } else {
        // Fallback for browsers that don't support PWA install
        showInstallInstructions();
    }
});

function showInstallInstructions() {
    const userAgent = navigator.userAgent.toLowerCase();
    let instructions = '';

    if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
        instructions = 'Chrome: Click the menu (⋮) → "Install GameHub" or look for the install icon in the address bar.';
    } else if (userAgent.includes('firefox')) {
        instructions = 'Firefox: Click the menu (☰) → "Install this site as an app" or add to bookmarks.';
    } else if (userAgent.includes('safari')) {
        instructions = 'Safari: Click Share (□↗) → "Add to Home Screen" → "Add".';
    } else if (userAgent.includes('edg')) {
        instructions = 'Edge: Click the menu (⋯) → "Apps" → "Install this site as an app".';
    } else {
        instructions = 'To install: Look for "Install" or "Add to Home Screen" option in your browser menu.';
    }

    alert('Install GameHub as an App:\n\n' + instructions);
}

// Smooth Scrolling Navigation
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-item a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Back to top button
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Show/hide back to top button based on scroll
    window.addEventListener('scroll', function() {
        if (backToTopButton) {
            if (window.pageYOffset > 300) {
                backToTopButton.style.opacity = '1';
                backToTopButton.style.pointerEvents = 'auto';
            } else {
                backToTopButton.style.opacity = '0';
                backToTopButton.style.pointerEvents = 'none';
            }
        }
    });
});

// Game Play Buttons Functionality
document.addEventListener('DOMContentLoaded', function() {
    const playButtons = document.querySelectorAll('.play-btn');

    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const gameCard = this.closest('.game-card');
            const gameTitle = gameCard.querySelector('.game-title').textContent;

            // Add loading state
            const originalText = this.textContent;
            this.innerHTML = '<span class="loading"></span> Loading...';
            this.disabled = true;

            // Simulate loading and redirect to Steam
            setTimeout(() => {
                let steamUrl = '';

                if (gameTitle.includes('Finals')) {
                    steamUrl = 'https://store.steampowered.com/app/2073850/THE_FINALS/';
                } else if (gameTitle.includes('EA FC 25')) {
                    steamUrl = 'https://store.steampowered.com/app/2669320/EA_SPORTS_FC_25/';
                } else if (gameTitle.includes('Witcher 3')) {
                    steamUrl = 'https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/';
                }

                if (steamUrl) {
                    window.open(steamUrl, '_blank');
                }

                // Reset button
                this.innerHTML = originalText;
                this.disabled = false;
            }, 1500);
        });
    });
});

// Performance Monitoring
window.addEventListener('load', function() {
    // Log performance metrics
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Page Load Performance:', {
            'DNS Lookup': perfData.domainLookupEnd - perfData.domainLookupStart,
            'TCP Connection': perfData.connectEnd - perfData.connectStart,
            'Server Response': perfData.responseEnd - perfData.requestStart,
            'DOM Processing': perfData.domContentLoadedEventEnd - perfData.responseEnd,
            'Total Load Time': perfData.loadEventEnd - perfData.navigationStart
        });
    }
});

// Offline Detection
window.addEventListener('online', function() {
    console.log('Connection restored');
    // You could show a notification here
});

window.addEventListener('offline', function() {
    console.log('Connection lost - running in offline mode');
    // You could show a notification here
});

// Cache API Usage for Dynamic Content
async function cacheGameData() {
    if ('caches' in window) {
        try {
            const cache = await caches.open('gamehub-dynamic-v1');
            // Cache dynamic content when needed
            console.log('Dynamic cache ready');
        } catch (error) {
            console.log('Cache API not available:', error);
        }
    }
}

cacheGameData();
