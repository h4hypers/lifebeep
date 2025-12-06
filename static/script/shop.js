/**
 * LifeBeep Shop - E-Commerce Functionality
 * Shopping Cart, Checkout, OTP Verification, Payment Processing
 */

// ===================================
// CONFIGURATION - EMAILJS CREDENTIALS
// ===================================
const EMAIL_CONFIG = {
    serviceId: 'service_3p881xb',
    otpTemplateId: 'template_027ew9u',  // OTP Verification Template
    orderTemplateId: 'template_ead5g0o',  // Order Notification Template
    publicKey: 'sqcnhMWcyC64bYW06'
};

// Initialize EmailJS
(function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAIL_CONFIG.publicKey);
    }
})();

// ===================================
// CART MANAGEMENT
// ===================================
let cart = JSON.parse(localStorage.getItem('lifebeep_cart')) || [];
let selectedVariant = {
    type: 'watch',
    name: 'Complete Watch',
    price: 899
};

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// Add to cart
function addToCart(product) {
    cart.push(product);
    localStorage.setItem('lifebeep_cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Product added to cart!', 'success');
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('lifebeep_cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

// Render cart items
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn') || document.getElementById('checkout-btn-catalog');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotalPrice.textContent = '₹0';
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }
    
    let total = 0;
    let html = '';
    
    cart.forEach((item, index) => {
        total += item.price;
        html += `
            <div class="cart-item">
                <img src="static/images/product image1.jpg" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>${item.variant}</p>
                </div>
                <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = html;
    cartTotalPrice.textContent = `₹${total.toLocaleString()}`;
    if (checkoutBtn) checkoutBtn.disabled = false;
    
    // Update summary
    const summaryPrice = document.getElementById('summary-price');
    const summaryTotal = document.getElementById('summary-total');
    if (summaryPrice) summaryPrice.textContent = `₹${total.toLocaleString()}`;
    if (summaryTotal) summaryTotal.textContent = `₹${total.toLocaleString()}`;
}

// ===================================
// OTP VERIFICATION
// ===================================
let generatedOTP = '';
let isEmailVerified = false;

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTP(email, firstName) {
    generatedOTP = generateOTP();
    
    const templateParams = {
        customer_name: firstName,
        otp_code: generatedOTP
    };
    
    try {
        if (typeof emailjs === 'undefined') {
            throw new Error('EmailJS not loaded. Please check your internet connection.');
        }
        
        // Send OTP email using OTP template
        await emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.otpTemplateId, templateParams);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        showNotification('Failed to send OTP. Please try again.', 'error');
        return false;
    }
}

function verifyOTP(enteredOTP) {
    return enteredOTP === generatedOTP;
}

// ===================================
// CHECKOUT FLOW
// ===================================
let checkoutData = {
    contact: {},
    address: {},
    payment: {}
};

let currentStep = 1;

function showCheckoutStep(step) {
    // Hide all steps
    document.querySelectorAll('.checkout-step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.progress-step').forEach(s => s.classList.remove('active', 'completed'));
    
    // Show current step
    document.getElementById(`step-${getStepName(step)}`).classList.add('active');
    
    // Update progress
    for (let i = 1; i <= step; i++) {
        const progressStep = document.querySelector(`.progress-step[data-step="${i}"]`);
        if (i < step) {
            progressStep.classList.add('completed');
        } else if (i === step) {
            progressStep.classList.add('active');
        }
    }
    
    currentStep = step;
}

function getStepName(step) {
    const steps = ['contact', 'address', 'payment'];
    return steps[step - 1];
}

// ===================================
// FORM VALIDATION & SUBMISSION
// ===================================

// Contact form
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    const sendOTPBtn = document.getElementById('send-otp-btn');
    const otpGroup = document.getElementById('otp-group');
    const otpInputs = document.querySelectorAll('.otp-input');
    const verifyContactBtn = document.getElementById('verify-contact-btn');
    const customerEmail = document.getElementById('customer-email');
    const firstName = document.getElementById('first-name');
    const phoneNumber = document.getElementById('phone-number');
    
    // Send OTP
    sendOTPBtn?.addEventListener('click', async function() {
        if (!customerEmail.value || !firstName.value) {
            showNotification('Please enter your name and email first', 'error');
            return;
        }
        
        if (!validateEmail(customerEmail.value)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        sendOTPBtn.disabled = true;
        sendOTPBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        const success = await sendOTP(customerEmail.value, firstName.value);
        
        if (success) {
            showNotification('OTP sent to your email!', 'success');
            otpGroup.style.display = 'block';
            otpInputs[0].focus();
        }
        
        sendOTPBtn.disabled = false;
        sendOTPBtn.innerHTML = 'Send OTP';
    });
    
    // OTP Input handling
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', function(e) {
            if (this.value.length === 1) {
                if (index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            }
            
            // Check if all OTP digits are entered
            const enteredOTP = Array.from(otpInputs).map(inp => inp.value).join('');
            if (enteredOTP.length === 6) {
                if (verifyOTP(enteredOTP)) {
                    isEmailVerified = true;
                    verifyContactBtn.disabled = false;
                    showNotification('Email verified successfully!', 'success');
                    otpInputs.forEach(inp => inp.style.borderColor = '#10b981');
                } else {
                    showNotification('Invalid OTP. Please try again.', 'error');
                    otpInputs.forEach(inp => {
                        inp.value = '';
                        inp.style.borderColor = '#ef4444';
                    });
                    otpInputs[0].focus();
                }
            }
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value === '' && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });
    
    // Phone number validation
    phoneNumber?.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
    });
    
    // Contact form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!isEmailVerified) {
            showNotification('Please verify your email first', 'error');
            return;
        }
        
        if (phoneNumber.value.length !== 10) {
            showNotification('Please enter a valid 10-digit phone number', 'error');
            return;
        }
        
        checkoutData.contact = {
            firstName: firstName.value,
            lastName: document.getElementById('last-name').value,
            email: customerEmail.value,
            countryCode: document.getElementById('country-code').value,
            phone: phoneNumber.value
        };
        
        showCheckoutStep(2);
    });
});

// PIN code input restriction
document.getElementById('pincode')?.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);
});

// Address form
document.getElementById('address-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const pincode = document.getElementById('pincode').value;
    
    // Validate PIN code (6 digits)
    if (!/^\d{6}$/.test(pincode)) {
        showNotification('Please enter a valid 6-digit PIN code', 'error');
        return;
    }
    
    checkoutData.address = {
        line1: document.getElementById('address-line1').value,
        line2: document.getElementById('address-line2').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        pincode: pincode,
        country: document.getElementById('country').value
    };
    
    showCheckoutStep(3);
});

// Back buttons
document.getElementById('back-to-contact')?.addEventListener('click', () => showCheckoutStep(1));
document.getElementById('back-to-address')?.addEventListener('click', () => showCheckoutStep(2));

// Payment method selection
document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const upiDetails = document.getElementById('upi-details');
        const placeOrderBtn = document.getElementById('place-order-btn');
        const paymentScreenshot = document.getElementById('payment-screenshot');
        
        if (this.value === 'upi') {
            upiDetails.style.display = 'block';
            placeOrderBtn.disabled = false;
            
            // Require screenshot for UPI
            paymentScreenshot.addEventListener('change', function() {
                placeOrderBtn.disabled = !this.files.length;
            });
        } else if (this.value === 'cod') {
            upiDetails.style.display = 'none';
            placeOrderBtn.disabled = false;
        }
    });
});

// Copy UPI function
function copyUPI() {
    const upiNumber = '+91 78456-93765';
    navigator.clipboard.writeText(upiNumber).then(() => {
        showNotification('UPI number copied!', 'success');
    });
}

// Place order
document.getElementById('place-order-btn')?.addEventListener('click', async function() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
    
    if (!paymentMethod) {
        showNotification('Please select a payment method', 'error');
        return;
    }
    
    checkoutData.payment.method = paymentMethod;
    
    if (paymentMethod === 'upi') {
        const screenshot = document.getElementById('payment-screenshot').files[0];
        if (!screenshot) {
            showNotification('Please upload payment screenshot', 'error');
            return;
        }
        checkoutData.payment.screenshot = screenshot.name;
    }
    
    this.disabled = true;
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    // Send order email
    await sendOrderEmail();
    
    this.disabled = false;
    this.innerHTML = '<i class="fas fa-check-circle"></i> Place Order';
});

// Send order confirmation email
async function sendOrderEmail() {
    const orderData = {
        customer_name: `${checkoutData.contact.firstName} ${checkoutData.contact.lastName}`,
        customer_email: checkoutData.contact.email,
        country_code: checkoutData.contact.countryCode,
        phone_number: checkoutData.contact.phone,
        address_line1: checkoutData.address.line1,
        address_line2: checkoutData.address.line2 || 'N/A',
        city: checkoutData.address.city,
        state: checkoutData.address.state,
        pincode: checkoutData.address.pincode,
        country: checkoutData.address.country,
        payment_method: checkoutData.payment.method === 'cod' ? 'Cash on Delivery' : 'UPI Payment',
        payment_proof: checkoutData.payment.screenshot || 'N/A',
        order_details: cart.map(item => `${item.name} - ₹${item.price}`).join(', ')
    };
    
    try {
        await emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.orderTemplateId, orderData);
        
        // Show success modal
        showSuccessModal();
        
        // Clear cart
        cart = [];
        localStorage.setItem('lifebeep_cart', JSON.stringify(cart));
        updateCartCount();
        
    } catch (error) {
        console.error('Order email failed:', error);
        showNotification('Order placed but email notification failed', 'warning');
        showSuccessModal();
    }
}

function showSuccessModal() {
    const orderId = 'LB' + Date.now().toString().slice(-8);
    document.getElementById('order-id').textContent = orderId;
    document.getElementById('order-email').textContent = checkoutData.contact.email;
    
    closeModal('checkout-modal');
    openModal('success-modal');
}

// ===================================
// MODAL MANAGEMENT
// ===================================
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Close modals
document.getElementById('close-cart')?.addEventListener('click', () => closeModal('cart-modal'));
document.getElementById('close-checkout')?.addEventListener('click', () => closeModal('checkout-modal'));

// Cart icon click
document.getElementById('cart-icon')?.addEventListener('click', function() {
    renderCartItems();
    openModal('cart-modal');
});

// Checkout button (product page)
document.getElementById('checkout-btn')?.addEventListener('click', function() {
    closeModal('cart-modal');
    showCheckoutStep(1);
    openModal('checkout-modal');
});

// Checkout button (shop page)
document.getElementById('checkout-btn-catalog')?.addEventListener('click', function() {
    // Redirect to product page with checkout
    if (cart.length > 0) {
        window.location.href = 'product.html?id=' + cart[0].id + '&checkout=true';
    }
});

// ===================================
// PRODUCT PAGE FUNCTIONALITY
// ===================================

// Change main product image
function changeImage(thumbnail) {
    const mainImage = document.getElementById('main-product-image');
    mainImage.src = thumbnail.src;
    
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    thumbnail.classList.add('active');
}

// Variant selection
document.querySelectorAll('.variant-option').forEach(option => {
    option.addEventListener('click', function() {
        document.querySelectorAll('.variant-option').forEach(o => o.classList.remove('active'));
        this.classList.add('active');
        
        selectedVariant = {
            type: this.dataset.variant,
            name: this.querySelector('strong').textContent,
            price: parseInt(this.dataset.price)
        };
        
        // Update price display
        document.querySelector('.current-price').textContent = `₹${selectedVariant.price.toLocaleString()}`;
    });
});

// Add to cart button
document.getElementById('add-to-cart-btn')?.addEventListener('click', function() {
    const product = {
        name: 'LifeBeep Smartwatch',
        variant: selectedVariant.name,
        price: selectedVariant.price
    };
    addToCart(product);
});

// Buy now button
document.getElementById('buy-now-btn')?.addEventListener('click', function() {
    const product = {
        name: 'LifeBeep Smartwatch',
        variant: selectedVariant.name,
        price: selectedVariant.price
    };
    cart = [product];  // Replace cart with single item
    localStorage.setItem('lifebeep_cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
    
    showCheckoutStep(1);
    openModal('checkout-modal');
});

// ===================================
// UTILITY FUNCTIONS
// ===================================
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification styles to page
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 100px;
        right: -400px;
        background: rgba(6, 11, 24, 0.95);
        backdrop-filter: blur(10px);
        padding: 1rem 1.5rem;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 0.8rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        z-index: 10001;
        transition: right 0.3s ease;
        min-width: 300px;
        border-left: 4px solid;
    }
    
    .notification.show {
        right: 20px;
    }
    
    .notification-success {
        border-left-color: #10b981;
    }
    
    .notification-error {
        border-left-color: #ef4444;
    }
    
    .notification-info {
        border-left-color: #06b6d4;
    }
    
    .notification i {
        font-size: 1.5rem;
    }
    
    .notification-success i {
        color: #10b981;
    }
    
    .notification-error i {
        color: #ef4444;
    }
    
    .notification-info i {
        color: #06b6d4;
    }
`;
document.head.appendChild(notificationStyles);

// Initialize on page load
updateCartCount();

// Export functions for global access
window.changeImage = changeImage;
window.copyUPI = copyUPI;
window.removeFromCart = removeFromCart;
