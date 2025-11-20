/**
 * LifeBeep Boot Animation Controller
 * IC741 → ESP32 → Watch Boot Sequence
 * Pure JavaScript - No Dependencies
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        totalDuration: 4000,      // 4 seconds total
        removeDelay: 4000,        // Remove overlay after 4s
        enableScroll: true        // Re-enable scroll after animation
    };

    /**
     * Initialize boot animation on page load
     */
    function initBootAnimation() {
        // Prevent scrolling during boot
        document.body.classList.add('boot-active');
        
        // Create boot overlay
        const overlay = createBootOverlay();
        document.body.insertBefore(overlay, document.body.firstChild);
        
        // Schedule cleanup
        setTimeout(() => {
            removeBootOverlay(overlay);
        }, CONFIG.removeDelay);
    }

    /**
     * Create the complete boot overlay structure
     */
    function createBootOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'boot-overlay';
        
        overlay.innerHTML = `
            <!-- IC 741 Operational Amplifier -->
            <div class="ic741">
                <div class="ic741-pin-left"></div>
                <div class="ic741-pin-left"></div>
                <div class="ic741-pin-left"></div>
                <div class="ic741-pin-left"></div>
                <div class="ic741-pin-right"></div>
                <div class="ic741-pin-right"></div>
                <div class="ic741-pin-right"></div>
                <div class="ic741-pin-right"></div>
            </div>
            
            <!-- Input Waveform (Raw Signal) -->
            <div class="waveform-in">
                <svg viewBox="0 0 150 60" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 0 30 Q 15 10, 30 30 T 60 30 T 90 30 T 120 30 T 150 30" 
                          stroke="#00f6ff" 
                          stroke-width="3" 
                          fill="none" 
                          stroke-linecap="round">
                        <animate attributeName="d" 
                                 dur="0.5s" 
                                 repeatCount="indefinite"
                                 values="M 0 30 Q 15 10, 30 30 T 60 30 T 90 30 T 120 30 T 150 30;
                                         M 0 30 Q 15 50, 30 30 T 60 30 T 90 30 T 120 30 T 150 30;
                                         M 0 30 Q 15 10, 30 30 T 60 30 T 90 30 T 120 30 T 150 30" />
                    </path>
                </svg>
            </div>
            
            <!-- Output Waveform (Filtered Signal) -->
            <div class="waveform-out">
                <svg viewBox="0 0 120 50" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 0 25 Q 20 15, 40 25 T 80 25 T 120 25" 
                          stroke="#a855ff" 
                          stroke-width="3" 
                          fill="none" 
                          stroke-linecap="round">
                        <animate attributeName="d" 
                                 dur="0.4s" 
                                 repeatCount="indefinite"
                                 values="M 0 25 Q 20 15, 40 25 T 80 25 T 120 25;
                                         M 0 25 Q 20 35, 40 25 T 80 25 T 120 25;
                                         M 0 25 Q 20 15, 40 25 T 80 25 T 120 25" />
                    </path>
                </svg>
            </div>
            
            <!-- ESP32 Microcontroller -->
            <div class="esp32">
                <div class="wifi-icon"></div>
            </div>
            
            <!-- Neon Beam -->
            <div class="beam"></div>
            
            <!-- Watch -->
            <div class="watch">
                <div class="watch-strap-left"></div>
                <div class="watch-strap-right"></div>
            </div>
            
            <!-- Screen Flash Effect -->
            <div class="screen-flash"></div>
        `;
        
        return overlay;
    }

    /**
     * Remove boot overlay and restore scroll
     */
    function removeBootOverlay(overlay) {
        if (!overlay) return;
        
        // Re-enable scrolling
        if (CONFIG.enableScroll) {
            document.body.classList.remove('boot-active');
        }
        
        // Remove overlay from DOM
        setTimeout(() => {
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 100);
        
        // Dispatch completion event
        triggerBootComplete();
    }

    /**
     * Trigger custom event when boot completes
     */
    function triggerBootComplete() {
        const event = new CustomEvent('bootComplete', {
            detail: {
                timestamp: Date.now(),
                duration: CONFIG.totalDuration
            }
        });
        window.dispatchEvent(event);
    }

    /**
     * Optional: Check if boot animation should run
     * (e.g., skip for returning visitors)
     */
    function shouldShowBoot() {
        // For now, always show boot animation
        // Could add localStorage check: localStorage.getItem('bootShown')
        return true;
    }

    /**
     * Optional: Enable skip on click/tap
     */
    function enableSkipOnClick(overlay) {
        overlay.addEventListener('click', () => {
            removeBootOverlay(overlay);
        }, { once: true });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBootAnimation);
    } else {
        initBootAnimation();
    }

    // Expose for debugging/manual control
    window.LifeBeepBoot = {
        restart: initBootAnimation,
        config: CONFIG
    };

})();
