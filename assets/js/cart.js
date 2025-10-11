// Cart & Checkout JavaScript
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let userAddress = JSON.parse(localStorage.getItem('userAddress')) || null;
let appliedPromo = null;

document.addEventListener('DOMContentLoaded', () => {
    initializeCartPage();
});

function initializeCartPage() {
    loadCartItems();
    loadUserAddress();
    updateCartSummary();
    initializeEventListeners();
    updateCartCount();
}

function initializeEventListeners() {
    // Cart actions
    document.getElementById('clear-cart')?.addEventListener('click', clearCart);
    document.getElementById('place-order')?.addEventListener('click', placeOrder);
    
    // Address modal
    document.getElementById('change-address')?.addEventListener('click', openAddressModal);
    document.getElementById('close-address-modal')?.addEventListener('click', closeAddressModal);
    document.getElementById('cancel-address')?.addEventListener('click', closeAddressModal);
    document.getElementById('save-address')?.addEventListener('click', saveAddress);
    
    // Promo code
    document.getElementById('apply-promo')?.addEventListener('click', applyPromoCode);
    
    // Order confirmation
    document.getElementById('view-orders')?.addEventListener('click', () => {
        window.location.href = 'profile.html#orders';
    });
    
    // Delivery slot validation
    document.getElementById('delivery-slot')?.addEventListener('change', validateCheckout);
    
    // Payment method validation
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', validateCheckout);
    });
}

function loadCartItems() {
    const cartItemsList = document.getElementById('cart-items-list');
    const emptyCart = document.getElementById('empty-cart');
    
    if (!cart.length) {
        cartItemsList.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }
    
    cartItemsList.style.display = 'block';
    emptyCart.style.display = 'none';
    
    cartItemsList.innerHTML = cart.map(item => `
        <div class="cart-item" data-item-id="${item.id}">
            <div class="item-image">
                <img src="${item.image || '../assets/images/hero-bg.jpg'}" alt="${item.name}">
            </div>
            <div class="item-details">
                <h4 class="item-name">${item.name}</h4>
                <p class="item-provider">${item.providerName}</p>
                <div class="item-price">₹${item.price}</div>
            </div>
            <div class="quantity-controls">
                <button class="qty-btn minus" onclick="updateQuantity(${item.id}, -1)">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="quantity">${item.quantity}</span>
                <button class="qty-btn plus" onclick="updateQuantity(${item.id}, 1)">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <div class="item-total">₹${item.price * item.quantity}</div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function updateQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(itemId);
        return;
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
    updateCartSummary();
    updateCartCount();
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
    updateCartSummary();
    updateCartCount();
    showFeedback('Item removed from cart', 'info');
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems();
        updateCartSummary();
        updateCartCount();
        showFeedback('Cart cleared', 'info');
    }
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 200 ? 0 : 20;
    const serviceFee = 10;
    let discount = 0;
    
    if (appliedPromo) {
        discount = appliedPromo.type === 'percentage' 
            ? (subtotal * appliedPromo.value / 100)
            : appliedPromo.value;
    }
    
    const total = subtotal + deliveryFee + serviceFee - discount;
    
    document.getElementById('subtotal').textContent = `₹${subtotal}`;
    document.getElementById('delivery-fee').textContent = deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`;
    document.getElementById('service-fee').textContent = `₹${serviceFee}`;
    document.getElementById('total-amount').textContent = `₹${total}`;
    
    // Update order items summary
    const orderSummary = document.getElementById('order-items-summary');
    if (orderSummary) {
        orderSummary.innerHTML = cart.map(item => `
            <div class="summary-item">
                <span class="item-name">${item.name} x${item.quantity}</span>
                <span class="item-price">₹${item.price * item.quantity}</span>
            </div>
        `).join('');
    }
    
    validateCheckout();
}

function loadUserAddress() {
    const addressDisplay = document.getElementById('current-address');
    
    if (userAddress) {
        addressDisplay.textContent = `${userAddress.line1}, ${userAddress.city} - ${userAddress.pincode}`;
    } else {
        addressDisplay.textContent = 'No address saved. Please add a delivery address.';
    }
}

function openAddressModal() {
    const modal = document.getElementById('address-modal');
    modal.style.display = 'flex';
    
    // Pre-fill form if address exists
    if (userAddress) {
        document.getElementById('address-line1').value = userAddress.line1 || '';
        document.getElementById('address-line2').value = userAddress.line2 || '';
        document.getElementById('city').value = userAddress.city || '';
        document.getElementById('pincode').value = userAddress.pincode || '';
        document.getElementById('landmark').value = userAddress.landmark || '';
    }
}

function closeAddressModal() {
    document.getElementById('address-modal').style.display = 'none';
}

function saveAddress() {
    const addressForm = document.getElementById('address-form');
    const formData = new FormData(addressForm);
    
    userAddress = {
        line1: document.getElementById('address-line1').value,
        line2: document.getElementById('address-line2').value,
        city: document.getElementById('city').value,
        pincode: document.getElementById('pincode').value,
        landmark: document.getElementById('landmark').value
    };
    
    if (!userAddress.line1 || !userAddress.city || !userAddress.pincode) {
        showFeedback('Please fill in all required fields', 'error');
        return;
    }
    
    localStorage.setItem('userAddress', JSON.stringify(userAddress));
    loadUserAddress();
    closeAddressModal();
    validateCheckout();
    showFeedback('Address saved successfully', 'success');
}

function applyPromoCode() {
    const promoCode = document.getElementById('promo-code').value.trim().toUpperCase();
    const promoMessage = document.getElementById('promo-message');
    
    // Mock promo codes
    const promoCodes = {
        'WELCOME10': { type: 'percentage', value: 10, description: '10% off' },
        'SAVE50': { type: 'fixed', value: 50, description: '₹50 off' },
        'FIRST20': { type: 'percentage', value: 20, description: '20% off for first order' }
    };
    
    if (promoCodes[promoCode]) {
        appliedPromo = promoCodes[promoCode];
        promoMessage.innerHTML = `<span class="promo-success">✓ ${appliedPromo.description} applied!</span>`;
        updateCartSummary();
        showFeedback('Promo code applied successfully', 'success');
    } else {
        promoMessage.innerHTML = `<span class="promo-error">Invalid promo code</span>`;
        showFeedback('Invalid promo code', 'error');
    }
}

function validateCheckout() {
    const placeOrderBtn = document.getElementById('place-order');
    const deliverySlot = document.getElementById('delivery-slot').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked');
    
    const isValid = cart.length > 0 && userAddress && deliverySlot && paymentMethod;
    
    placeOrderBtn.disabled = !isValid;
    placeOrderBtn.style.opacity = isValid ? '1' : '0.6';
}

function placeOrder() {
    if (!validateOrderData()) return;
    
    const orderData = {
        id: generateOrderId(),
        items: cart,
        address: userAddress,
        deliverySlot: document.getElementById('delivery-slot').value,
        paymentMethod: document.querySelector('input[name="payment"]:checked').value,
        subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        deliveryFee: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) > 200 ? 0 : 20,
        serviceFee: 10,
        discount: appliedPromo ? (appliedPromo.type === 'percentage' 
            ? (cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * appliedPromo.value / 100)
            : appliedPromo.value) : 0,
        promoCode: appliedPromo ? document.getElementById('promo-code').value : null,
        status: 'confirmed',
        timestamp: new Date().toISOString(),
        estimatedDelivery: getEstimatedDelivery()
    };
    
    orderData.total = orderData.subtotal + orderData.deliveryFee + orderData.serviceFee - orderData.discount;
    
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.unshift(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show confirmation modal
    showOrderConfirmation(orderData);
    
    // Update UI
    updateCartCount();
}

function validateOrderData() {
    if (!cart.length) {
        showFeedback('Your cart is empty', 'error');
        return false;
    }
    
    if (!userAddress) {
        showFeedback('Please add a delivery address', 'error');
        return false;
    }
    
    if (!document.getElementById('delivery-slot').value) {
        showFeedback('Please select a delivery slot', 'error');
        return false;
    }
    
    if (!document.querySelector('input[name="payment"]:checked')) {
        showFeedback('Please select a payment method', 'error');
        return false;
    }
    
    return true;
}

function generateOrderId() {
    return 'DB' + Date.now().toString().slice(-6);
}

function getEstimatedDelivery() {
    const slot = document.getElementById('delivery-slot').value;
    const today = new Date();
    
    if (slot === 'lunch') {
        return 'Today 12:00 PM - 2:00 PM';
    } else if (slot === 'dinner') {
        return 'Today 7:00 PM - 9:00 PM';
    }
    
    return '30-45 minutes';
}

function showOrderConfirmation(orderData) {
    const modal = document.getElementById('order-confirmation-modal');
    document.getElementById('order-id').textContent = `#${orderData.id}`;
    document.getElementById('delivery-time').textContent = orderData.estimatedDelivery;
    modal.style.display = 'flex';
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function showFeedback(message, type = 'info') {
    const feedback = document.createElement('div');
    feedback.className = `feedback feedback-${type}`;
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        color: white;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
    `;
    
    switch(type) {
        case 'success':
            feedback.style.background = '#67C090';
            break;
        case 'error':
            feedback.style.background = '#E62727';
            break;
        case 'info':
            feedback.style.background = '#1E93AB';
            break;
    }
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 3000);
}

// Navigation functions
function goToHome() {
    window.location.href = 'home.html';
}

function goToProfile() {
    window.location.href = 'profile.html';
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    const addressModal = document.getElementById('address-modal');
    const orderModal = document.getElementById('order-confirmation-modal');
    
    if (e.target === addressModal) {
        closeAddressModal();
    }
    
    if (e.target === orderModal) {
        orderModal.style.display = 'none';
    }
});
