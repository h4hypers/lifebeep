/**
 * LifeBeep Boot Animation Controller - REDESIGNED
 * Sound Wave → Microphone → IC741 → ESP32 → Watch → Website
 * Proper Signal Flow Representation
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        totalDuration: 5500,      // 5.5 seconds total
        removeDelay: 6000,         // Remove overlay after 6s
        enableScroll: true         // Re-enable scroll after animation
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
            <div class="signal-flow">
                <!-- 1. Sound Wave Source -->
                <div class="sound-source">
                    <div class="sound-ripple"></div>
                    <div class="sound-ripple"></div>
                    <div class="sound-ripple"></div>
                    <div class="sound-icon">🔊</div>
                </div>
                
                <!-- Wave Path from Sound to Mic -->
                <div class="wave-path-1">
                    <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 0 40 Q 25 20, 50 40 T 100 40 T 150 40 T 200 40" 
                              stroke="#06b6d4" 
                              stroke-width="3" 
                              fill="none" 
                              stroke-linecap="round"/>
                    </svg>
                    <div class="wave-particle"></div>
                </div>
                
                <!-- 2. Microphone Module -->
                <div class="microphone">
                    <div class="mic-body"></div>
                    <div class="mic-stand"></div>
                </div>
                
                <!-- Connection Line 1 -->
                <div class="connection-line line-1"></div>
                <div class="data-particle data-particle-1"></div>
                
                <!-- 3. IC741 Operational Amplifier -->
                <div class="ic741">
                    <div class="ic-body"></div>
                    <div class="ic-label">IC741</div>
                    <div class="ic-pins-left">
                        <div class="ic-pin"></div>
                        <div class="ic-pin"></div>
                        <div class="ic-pin"></div>
                        <div class="ic-pin"></div>
                    </div>
                    <div class="ic-pins-right">
                        <div class="ic-pin"></div>
                        <div class="ic-pin"></div>
                        <div class="ic-pin"></div>
                        <div class="ic-pin"></div>
                    </div>
                </div>
                
                <!-- Connection Line 2 -->
                <div class="connection-line line-2"></div>
                <div class="data-particle data-particle-2"></div>
                
                <!-- 4. ESP32 Microcontroller -->
                <div class="esp32">
                    <div class="esp32-board"></div>
                    <div class="esp32-chip">
                        <div class="esp32-label">ESP32</div>
                    </div>
                    <div class="wifi-indicator"></div>
                </div>
                
                <!-- Connection Line 3 -->
                <div class="connection-line line-3"></div>
                <div class="data-particle data-particle-3"></div>
                
                <!-- 5. Smartwatch with Notification -->
                <div class="smartwatch">
                    <div class="watch-strap-top"></div>
                    <div class="watch-face">
                        <div class="notification-bell">🔔</div>
                    </div>
                    <div class="watch-strap-bottom"></div>
                </div>
                
                <!-- Final Flash Effect -->
                <div class="website-flash"></div>
            </div>
        `;
        
        return overlay;
    }

    /**
     * Remove boot overlay and restore scroll
     */
    function removeBootOverlay(overlay) {
        // Re-enable scrolling
        document.body.classList.remove('boot-active');
        
        // Remove overlay from DOM
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
        
        // Trigger custom event for completion
        triggerBootComplete();
    }

    /**
     * Trigger custom boot complete event
     */
    function triggerBootComplete() {
        const event = new CustomEvent('lifebeep-boot-complete', {
            detail: {
                duration: CONFIG.totalDuration,
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * Public API for manual restart (debugging)
     */
    window.LifeBeepBoot = {
        restart: function() {
            const existingOverlay = document.getElementById('boot-overlay');
            if (existingOverlay) {
                existingOverlay.remove();
            }
            document.body.classList.remove('boot-active');
            setTimeout(initBootAnimation, 100);
        }
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBootAnimation);
    } else {
        initBootAnimation();
    }

})();
