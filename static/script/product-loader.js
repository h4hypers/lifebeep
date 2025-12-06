// Product data for all items
const products = {
    'watch': {
        id: 'watch',
        name: 'LifeBeep Smartwatch',
        shortDesc: 'Intelligent Sound Alert Notifier for Hearing-Impaired',
        fullDesc: 'LifeBeep is a revolutionary wearable device designed specifically for the hearing-impaired community. It detects environmental sounds like car horns, doorbells, fire alarms, and baby crying, then alerts the user through vibration, LED indicators, and OLED display.',
        price: 899,
        originalPrice: 1499,
        discount: '40%',
        rating: 4.8,
        reviews: 127,
        images: ['static/images/product image1.jpg', 'static/images/product image2.jpg'],
        badge: 'In Stock',
        features: [
            'Real-time sound detection with IC741 amplification',
            'ESP32-powered with WiFi connectivity',
            'Vibration motor for tactile alerts',
            'OLED display with visual feedback',
            'RGB LED color-coded alerts',
            'Long-lasting rechargeable battery'
        ],
        specs: {
            'Microcontroller': 'ESP32 Dual-core',
            'Sound Detection': 'IC741 Op-Amp Circuit',
            'Display': '0.96" OLED Screen',
            'Alert System': 'Vibration + LED + Display',
            'Battery': '400mAh Li-ion',
            'Connectivity': 'WiFi 802.11 b/g/n'
        },
        hasVariants: false
    },
    'chip': {
        id: 'chip',
        name: 'IC741 + ESP32 Chip Module',
        shortDesc: 'Development board for custom projects',
        fullDesc: 'Complete development module featuring IC741 operational amplifier and ESP32 microcontroller. Perfect for DIY projects, prototyping, and custom sound detection applications. Includes all essential components for building your own sound alert system.',
        price: 599,
        originalPrice: 899,
        discount: '33%',
        rating: 4.6,
        reviews: 89,
        images: ['static/images/product image2.jpg', 'static/images/product image1.jpg'],
        badge: 'DIY Kit',
        features: [
            'IC741 operational amplifier for audio processing',
            'ESP32 dual-core processor with WiFi/Bluetooth',
            'Pre-configured for sound detection',
            'GPIO pins for custom peripherals',
            'Open-source firmware included',
            'Compatible with Arduino IDE'
        ],
        specs: {
            'Processor': 'ESP32-WROOM-32',
            'Amplifier': 'IC741 Op-Amp',
            'Clock Speed': '240 MHz',
            'Memory': '520 KB SRAM',
            'GPIO Pins': '30 available',
            'Power': '3.3V / 5V compatible'
        },
        hasVariants: false
    },
    'strap': {
        id: 'strap',
        name: 'Silicone Watch Strap',
        shortDesc: 'Available in multiple vibrant colors',
        fullDesc: 'Premium quality silicone watch strap designed for comfort and durability. Available in three eye-catching colors: Orange, Yellow, and Blue. Adjustable sizing fits most wrist sizes. Sweat-resistant and easy to clean.',
        price: 99,
        originalPrice: null,
        discount: null,
        rating: 4.7,
        reviews: 156,
        images: ['static/images/product image1.jpg'],
        badge: 'Accessory',
        features: [
            'Soft medical-grade silicone material',
            'Available in 3 colors: Orange, Yellow, Blue',
            'Adjustable to fit 6-8 inch wrists',
            'Sweat and water resistant',
            'Easy snap-on installation',
            'Durable and long-lasting'
        ],
        specs: {
            'Material': 'Medical-grade Silicone',
            'Colors': 'Orange / Yellow / Blue',
            'Width': '22mm',
            'Length': 'Adjustable 6-8 inches',
            'Clasp': 'Pin buckle',
            'Weight': '15g'
        },
        hasVariants: true,
        variants: ['orange', 'yellow', 'blue']
    },
    'battery': {
        id: 'battery',
        name: 'Rechargeable Li-ion Battery',
        shortDesc: '3.7V 400mAh long-lasting power',
        fullDesc: 'High-quality rechargeable lithium-ion battery designed specifically for LifeBeep smartwatch. Provides up to 48 hours of continuous operation. Safe charging with built-in protection circuits.',
        price: 149,
        originalPrice: null,
        discount: null,
        rating: 4.5,
        reviews: 78,
        images: ['static/images/product image1.jpg'],
        badge: 'Accessory',
        features: [
            '400mAh capacity for extended usage',
            'Up to 48 hours battery life',
            'Built-in overcharge protection',
            'Fast charging support',
            'Long cycle life (500+ charges)',
            'Compact and lightweight'
        ],
        specs: {
            'Type': 'Lithium-ion Polymer',
            'Voltage': '3.7V',
            'Capacity': '400mAh',
            'Charging Time': '1-2 hours',
            'Life Cycles': '500+ charges',
            'Safety': 'Overcharge/Discharge Protection'
        },
        hasVariants: false
    },
    'charger': {
        id: 'charger',
        name: 'USB Type-C Charging Cable',
        shortDesc: 'Fast charging cable with Type-C connector',
        fullDesc: 'Premium quality USB Type-C charging cable designed for LifeBeep devices. Supports fast charging and data transfer. Durable braided design prevents tangling and ensures long-lasting use.',
        price: 79,
        originalPrice: null,
        discount: null,
        rating: 4.6,
        reviews: 203,
        images: ['static/images/product image1.jpg'],
        badge: 'Accessory',
        features: [
            'USB Type-C connector',
            'Fast charging support',
            'Data transfer capable',
            'Braided nylon cable',
            'Tangle-free design',
            '1-meter length'
        ],
        specs: {
            'Connector': 'USB Type-C',
            'Length': '1 meter (3.3 feet)',
            'Material': 'Braided nylon',
            'Current': 'Up to 2A',
            'Compatibility': 'LifeBeep devices',
            'Color': 'Black'
        },
        hasVariants: false
    },
    'case': {
        id: 'case',
        name: 'Protective Hard Case',
        shortDesc: 'Durable case for safe storage and transport',
        fullDesc: 'Premium protective case designed to keep your LifeBeep smartwatch safe during storage and travel. Hard shell exterior with soft interior padding. Includes compartments for accessories.',
        price: 199,
        originalPrice: null,
        discount: null,
        rating: 4.8,
        reviews: 92,
        images: ['static/images/product image1.jpg'],
        badge: 'Accessory',
        features: [
            'Hard shell protection',
            'Soft velvet interior',
            'Compartments for accessories',
            'Compact and portable',
            'Zipper closure',
            'Scratch-resistant exterior'
        ],
        specs: {
            'Material': 'EVA hard shell',
            'Interior': 'Soft velvet',
            'Dimensions': '12 x 8 x 5 cm',
            'Weight': '120g',
            'Color': 'Black',
            'Closure': 'Zipper'
        },
        hasVariants: false
    },
    'stand': {
        id: 'stand',
        name: 'Acrylic Display Stand',
        shortDesc: 'Premium stand for elegant display',
        fullDesc: 'High-quality acrylic display stand designed to showcase your LifeBeep smartwatch. Perfect for bedside tables, desks, or retail displays. Crystal-clear transparency with stable base.',
        price: 249,
        originalPrice: null,
        discount: null,
        rating: 4.7,
        reviews: 64,
        images: ['static/images/product image1.jpg'],
        badge: 'Accessory',
        features: [
            'Crystal-clear acrylic material',
            'Stable and sturdy base',
            'Elegant minimalist design',
            'Scratch-resistant surface',
            'Easy to clean',
            'Universal fit for all straps'
        ],
        specs: {
            'Material': 'Premium Acrylic',
            'Dimensions': '10 x 8 x 12 cm',
            'Weight': '150g',
            'Transparency': 'Crystal clear',
            'Base': 'Anti-slip rubber',
            'Color': 'Clear'
        },
        hasVariants: false
    }
};

// Get product ID from URL parameter
function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || 'watch';
}

// Load product data on page load
window.addEventListener('DOMContentLoaded', function() {
    const productId = getProductIdFromURL();
    const product = products[productId];
    
    if (!product) {
        window.location.href = 'shop.html';
        return;
    }
    
    loadProductData(product);
});

function loadProductData(product) {
    // Update page title
    document.title = `${product.name} - LifeBeep Shop`;
    
    // Update breadcrumb
    const breadcrumbProduct = document.querySelector('.breadcrumb span');
    if (breadcrumbProduct) {
        breadcrumbProduct.textContent = product.name;
    }
    
    // Update main product image
    const mainImage = document.getElementById('main-product-image');
    if (mainImage) {
        mainImage.src = product.images[0];
        mainImage.alt = product.name;
    }
    
    // Update thumbnails
    const thumbnailsContainer = document.querySelector('.product-thumbnails');
    if (thumbnailsContainer && product.images.length > 1) {
        thumbnailsContainer.innerHTML = product.images.map((img, index) => 
            `<img src="${img}" alt="View ${index + 1}" class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeImage(this)">`
        ).join('');
    }
    
    // Update product title and description
    const title = document.querySelector('.product-title');
    if (title) title.innerHTML = product.name.replace('LifeBeep ', 'LifeBeep <span class="highlight">') + '</span>';
    
    const subtitle = document.querySelector('.product-subtitle');
    if (subtitle) subtitle.textContent = product.shortDesc;
    
    const description = document.querySelector('.product-description p');
    if (description) description.textContent = product.fullDesc;
    
    // Update rating
    const ratingSpan = document.querySelector('.product-rating span');
    if (ratingSpan) ratingSpan.textContent = `${product.rating}/5.0 (${product.reviews} reviews)`;
    
    // Update price
    const currentPrice = document.querySelector('.current-price');
    if (currentPrice) currentPrice.textContent = `₹${product.price}`;
    
    if (product.originalPrice) {
        const originalPrice = document.querySelector('.original-price');
        if (originalPrice) {
            originalPrice.textContent = `₹${product.originalPrice}`;
            originalPrice.style.display = 'inline';
        }
        
        const discountBadge = document.querySelector('.discount-badge');
        if (discountBadge) {
            discountBadge.textContent = `${product.discount} OFF`;
            discountBadge.style.display = 'inline';
        }
    } else {
        const originalPrice = document.querySelector('.original-price');
        const discountBadge = document.querySelector('.discount-badge');
        if (originalPrice) originalPrice.style.display = 'none';
        if (discountBadge) discountBadge.style.display = 'none';
    }
    
    // Update badge
    const badge = document.querySelector('.product-badge');
    if (badge) badge.innerHTML = `<i class="fas fa-bolt"></i> ${product.badge}`;
    
    // Update features
    const featuresList = document.querySelector('.product-features ul');
    if (featuresList) {
        featuresList.innerHTML = product.features.map(feature => 
            `<li><i class="fas fa-check-circle"></i> ${feature}</li>`
        ).join('');
    }
    
    // Hide variants section for products without variants
    const variantsSection = document.querySelector('.product-variants');
    if (variantsSection && !product.hasVariants) {
        variantsSection.style.display = 'none';
    }
    
    // Update specifications
    const specsGrid = document.querySelector('.specs-grid');
    if (specsGrid) {
        specsGrid.innerHTML = Object.entries(product.specs).map(([key, value]) => `
            <div class="spec-card glass-card">
                <div class="spec-icon">
                    <i class="fas fa-microchip"></i>
                </div>
                <h3>${key}</h3>
                <p>${value}</p>
            </div>
        `).join('');
    }
    
    // Update Add to Cart button with product data
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const buyNowBtn = document.getElementById('buy-now-btn');
    
    if (addToCartBtn) {
        addToCartBtn.onclick = function() {
            addToCart({
                id: product.id,
                name: product.name,
                variant: product.name,
                price: product.price,
                image: product.images[0]
            });
        };
    }
    
    if (buyNowBtn) {
        buyNowBtn.onclick = function() {
            const item = {
                id: product.id,
                name: product.name,
                variant: product.name,
                price: product.price,
                image: product.images[0]
            };
            cart = [item];
            localStorage.setItem('lifebeep_cart', JSON.stringify(cart));
            updateCartCount();
            renderCartItems();
            showCheckoutStep(1);
            openModal('checkout-modal');
        };
    }
}
