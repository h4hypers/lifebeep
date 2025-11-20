// ===================================
// LIFEBEEP - ESP32 INTEGRATION
// ===================================

// Configuration
const ESP32_CONFIG = {
    pollingInterval: 3000, // 3 seconds
    timeout: 5000, // 5 seconds
    storageKey: 'lifebeep_esp32_ip'
};

// State
let esp32IP = null;
let pollingTimer = null;
let isPolling = false;
let consecutiveFailures = 0;
const MAX_FAILURES = 3;

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    initESP32();
});

// ===================================
// INITIALIZATION
// ===================================
function initESP32() {
    // Load saved IP from localStorage
    loadSavedIP();
    
    // Setup modal handlers
    setupConfigModal();
    
    // Start polling if IP exists
    if (esp32IP) {
        startPolling();
    } else {
        updateDeviceStatus('offline', 'No device configured');
    }
}

// ===================================
// CONFIGURATION MODAL
// ===================================
function setupConfigModal() {
    const modal = document.getElementById('esp32Modal');
    const openBtn = document.getElementById('configESP32');
    const closeBtn = document.querySelector('.modal-close');
    const saveBtn = document.getElementById('saveESP32Config');
    const ipInput = document.getElementById('esp32IP');
    
    if (!modal || !openBtn || !saveBtn || !ipInput) return;
    
    // Load current IP into input
    if (esp32IP) {
        ipInput.value = esp32IP;
    }
    
    // Open modal
    openBtn.addEventListener('click', () => {
        modal.classList.add('active');
        ipInput.focus();
    });
    
    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Save configuration
    saveBtn.addEventListener('click', () => {
        const newIP = ipInput.value.trim();
        
        if (!newIP) {
            showNotification('Please enter a valid IP address', 'error');
            return;
        }
        
        // Validate IP format
        if (!isValidIP(newIP)) {
            showNotification('Invalid IP address format', 'error');
            return;
        }
        
        // Save and restart polling
        esp32IP = newIP;
        localStorage.setItem(ESP32_CONFIG.storageKey, newIP);
        consecutiveFailures = 0;
        
        modal.classList.remove('active');
        showNotification('ESP32 configuration saved', 'success');
        
        // Restart polling
        stopPolling();
        startPolling();
    });
    
    // Allow Enter key to save
    ipInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveBtn.click();
        }
    });
}

// ===================================
// IP VALIDATION
// ===================================
function isValidIP(ip) {
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipPattern.test(ip)) return false;
    
    const parts = ip.split('.');
    return parts.every(part => {
        const num = parseInt(part, 10);
        return num >= 0 && num <= 255;
    });
}

// ===================================
// LOCAL STORAGE
// ===================================
function loadSavedIP() {
    const savedIP = localStorage.getItem(ESP32_CONFIG.storageKey);
    if (savedIP) {
        esp32IP = savedIP;
    }
}

// ===================================
// POLLING CONTROL
// ===================================
function startPolling() {
    if (isPolling) return;
    
    isPolling = true;
    console.log(`Starting ESP32 polling at ${esp32IP}`);
    
    // Initial fetch
    fetchDeviceData();
    
    // Set up interval
    pollingTimer = setInterval(() => {
        fetchDeviceData();
    }, ESP32_CONFIG.pollingInterval);
}

function stopPolling() {
    if (pollingTimer) {
        clearInterval(pollingTimer);
        pollingTimer = null;
    }
    isPolling = false;
    console.log('Stopped ESP32 polling');
}

// ===================================
// DATA FETCHING
// ===================================
async function fetchDeviceData() {
    if (!esp32IP) {
        updateDeviceStatus('offline', 'No device configured');
        return;
    }
    
    const url = `http://${esp32IP}/readings`;
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), ESP32_CONFIG.timeout);
        
        const response = await fetch(url, {
            method: 'GET',
            signal: controller.signal,
            mode: 'cors',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Reset failure counter on success
        consecutiveFailures = 0;
        
        // Update UI with data
        updateDeviceData(data);
        
    } catch (error) {
        consecutiveFailures++;
        
        console.warn(`ESP32 fetch failed (${consecutiveFailures}/${MAX_FAILURES}):`, error.message);
        
        if (consecutiveFailures >= MAX_FAILURES) {
            updateDeviceStatus('offline', `Device unreachable (${error.message})`);
            
            // Stop polling after too many failures to save resources
            if (consecutiveFailures > MAX_FAILURES * 3) {
                stopPolling();
                showNotification('Device offline. Polling stopped. Reconfigure to retry.', 'error');
            }
        } else {
            // Still trying
            updateDeviceStatus('connecting', 'Connecting...');
        }
    }
}

// ===================================
// UI UPDATES
// ===================================
function updateDeviceData(data) {
    // Update status to online
    const pulseDot = document.querySelector('.pulse-dot');
    if (pulseDot) {
        pulseDot.style.color = 'var(--success)';
    }
    
    // Update voltage
    const voltageValue = document.getElementById('voltageValue');
    if (voltageValue && data.voltage !== undefined) {
        voltageValue.textContent = `${data.voltage.toFixed(2)} V`;
        voltageValue.classList.remove('offline');
    }
    
    // Update alert status
    const alertStatus = document.getElementById('alertStatus');
    if (alertStatus && data.alert !== undefined) {
        alertStatus.textContent = data.alert ? 'ACTIVE' : 'Normal';
        
        if (data.alert) {
            alertStatus.classList.add('alert-active');
            alertStatus.style.color = 'var(--danger)';
            
            // Optional: Show notification for alert
            showNotification(`⚠️ Alert: ${data.soundType || 'Unknown sound detected'}`, 'warning');
        } else {
            alertStatus.classList.remove('alert-active');
            alertStatus.style.color = 'var(--success)';
        }
    }
    
    // Update sound type
    const soundType = document.getElementById('soundType');
    if (soundType && data.soundType) {
        soundType.textContent = data.soundType;
        soundType.classList.remove('offline');
    }
    
    // Update timestamp
    const timestamp = document.getElementById('timestamp');
    if (timestamp && data.timestamp) {
        const date = new Date(data.timestamp);
        timestamp.textContent = formatTimestamp(date);
        timestamp.classList.remove('offline');
    } else if (timestamp) {
        timestamp.textContent = formatTimestamp(new Date());
    }
}

function updateDeviceStatus(status, message) {
    const pulseDot = document.querySelector('.pulse-dot');
    const voltageValue = document.getElementById('voltageValue');
    const alertStatus = document.getElementById('alertStatus');
    const soundType = document.getElementById('soundType');
    const timestamp = document.getElementById('timestamp');
    
    switch (status) {
        case 'offline':
            if (pulseDot) pulseDot.style.color = 'var(--danger)';
            if (voltageValue) {
                voltageValue.textContent = 'Offline';
                voltageValue.classList.add('offline');
            }
            if (alertStatus) {
                alertStatus.textContent = 'Offline';
                alertStatus.classList.add('offline');
                alertStatus.classList.remove('alert-active');
            }
            if (soundType) {
                soundType.textContent = message || 'Device Offline';
                soundType.classList.add('offline');
            }
            if (timestamp) {
                timestamp.textContent = '--';
                timestamp.classList.add('offline');
            }
            break;
            
        case 'connecting':
            if (pulseDot) pulseDot.style.color = 'var(--warning)';
            if (voltageValue) voltageValue.textContent = 'Connecting...';
            if (alertStatus) alertStatus.textContent = 'Connecting...';
            if (soundType) soundType.textContent = 'Connecting...';
            break;
    }
}

// ===================================
// UTILITY FUNCTIONS
// ===================================
function formatTimestamp(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    
    if (diffSec < 60) {
        return `${diffSec}s ago`;
    } else if (diffMin < 60) {
        return `${diffMin}m ago`;
    } else if (diffHour < 24) {
        return `${diffHour}h ago`;
    } else {
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

function showNotification(message, type = 'info') {
    // Check if notification function exists in main.js
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }
    
    // Fallback notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    const bgColors = {
        success: 'rgba(16, 185, 129, 0.9)',
        error: 'rgba(239, 68, 68, 0.9)',
        warning: 'rgba(245, 158, 11, 0.9)',
        info: 'rgba(59, 130, 246, 0.9)'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${bgColors[type] || bgColors.info};
        color: white;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
        font-family: 'Rajdhani', sans-serif;
        font-weight: 600;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ===================================
// MANUAL CONTROLS (for debugging)
// ===================================
window.ESP32 = {
    getIP: () => esp32IP,
    setIP: (ip) => {
        esp32IP = ip;
        localStorage.setItem(ESP32_CONFIG.storageKey, ip);
        stopPolling();
        startPolling();
    },
    clearIP: () => {
        esp32IP = null;
        localStorage.removeItem(ESP32_CONFIG.storageKey);
        stopPolling();
        updateDeviceStatus('offline', 'No device configured');
    },
    startPolling: startPolling,
    stopPolling: stopPolling,
    fetchNow: fetchDeviceData,
    getStatus: () => ({
        ip: esp32IP,
        polling: isPolling,
        failures: consecutiveFailures
    })
};

// Log available commands
console.log('%c ESP32 Controls Available ', 'background: #06b6d4; color: white; font-weight: bold; padding: 5px;');
console.log('ESP32.getIP() - Get current IP');
console.log('ESP32.setIP("192.168.1.100") - Set IP and start polling');
console.log('ESP32.clearIP() - Clear saved IP');
console.log('ESP32.startPolling() - Start polling');
console.log('ESP32.stopPolling() - Stop polling');
console.log('ESP32.fetchNow() - Fetch immediately');
console.log('ESP32.getStatus() - Get current status');
