// ===================================
// LIFEBEEP - PREMIUM INTRO ANIMATION
// Sound Shockwave Watch Pulse
// ===================================

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        animationDuration: 3000, // 3 seconds total
        particleCount: 10,
        vibrationStart: 1100, // Start vibration at 1.1s
        removeDelay: 3200 // Remove overlay after 3.2s
    };
    
    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        initIntroAnimation();
    });
    
    /**
     * Initialize the intro animation
     */
    function initIntroAnimation() {
        // Prevent scrolling during animation
        document.body.classList.add('intro-active');
        
        // Create the intro overlay
        const overlay = createOverlay();
        document.body.insertBefore(overlay, document.body.firstChild);
        
        // Add floating particles
        addFloatingParticles(overlay);
        
        // Trigger vibration effect
        setTimeout(() => {
            triggerVibration(overlay);
        }, CONFIG.vibrationStart);
        
        // Remove overlay and cleanup
        setTimeout(() => {
            removeOverlay(overlay);
        }, CONFIG.removeDelay);
    }
    
    /**
     * Create the intro overlay structure
     */
    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'intro-overlay';
        overlay.innerHTML = `
            <div class="watch-container">
                <div class="signal-source"></div>
                <div class="water-wave"></div>
                <div class="water-wave"></div>
                <div class="water-wave"></div>
                <div class="water-wave"></div>
                <div class="watch-outline">
                    <div class="hour-hand"></div>
                    <div class="minute-hand"></div>
                    <div class="led-center"></div>
                </div>
                <div class="final-ripple"></div>
            </div>
        `;
        return overlay;
    }
    
    /**
     * Add floating particles to the background
     */
    function addFloatingParticles(overlay) {
        for (let i = 0; i < CONFIG.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random positioning
            const top = Math.random() * 100;
            const left = Math.random() * 100;
            const delay = Math.random() * 2;
            const duration = 2 + Math.random() * 2;
            
            particle.style.top = `${top}%`;
            particle.style.left = `${left}%`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;
            
            overlay.appendChild(particle);
        }
    }
    
    /**
     * Trigger vibration effect on watch container
     */
    function triggerVibration(overlay) {
        const watchContainer = overlay.querySelector('.watch-container');
        if (watchContainer) {
            watchContainer.classList.add('vibrating');
        }
    }
    
    /**
     * Remove overlay and restore page functionality
     */
    function removeOverlay(overlay) {
        // Wait for fade-out animation to complete
        setTimeout(() => {
            // Remove overlay from DOM
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
            
            // Re-enable scrolling
            document.body.classList.remove('intro-active');
            
            // Trigger any post-load effects
            triggerPageEnter();
        }, 500);
    }
    
    /**
     * Trigger page enter animations
     */
    function triggerPageEnter() {
        // Add loaded class to body for any additional effects
        document.body.classList.add('intro-completed');
        
        // Trigger hero section animations if they exist
        const heroElements = document.querySelectorAll('.hero-content [data-aos]');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('aos-animate');
            }, index * 100);
        });
        
        // Optional: dispatch custom event for other scripts
        const event = new CustomEvent('introComplete', {
            detail: { timestamp: Date.now() }
        });
        window.dispatchEvent(event);
    }
    
    /**
     * Skip animation on user interaction (optional)
     */
    function enableSkipOnClick(overlay) {
        overlay.addEventListener('click', function() {
            overlay.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                removeOverlay(overlay);
            }, 300);
        });
    }
    
    /**
     * Preload check - skip if user has visited before (optional)
     */
    function shouldShowIntro() {
        const hasVisited = localStorage.getItem('lifebeep_visited');
        
        // Uncomment to skip on repeat visits:
        // if (hasVisited) {
        //     return false;
        // }
        
        localStorage.setItem('lifebeep_visited', 'true');
        return true;
    }
    
    // Optional: Listen for page visibility changes
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            const overlay = document.getElementById('intro-overlay');
            if (overlay) {
                removeOverlay(overlay);
            }
        }
    });
    
    // Expose to window for debugging
    window.LifeBeepIntro = {
        restart: initIntroAnimation,
        version: '1.0.0'
    };
    
    console.log('%c LifeBeep Intro Animation Loaded ', 
                'background: linear-gradient(135deg, #00f6ff, #a855ff); color: white; font-size: 14px; font-weight: bold; padding: 8px;');
})();
