// Checkout Page JavaScript
let currentOrder = null;
let trackingInterval = null;

// Initialize checkout page
document.addEventListener('DOMContentLoaded', function() {
    initializeCheckoutPage();
    setupEventListeners();
    updateCartCount();
    setupProfileDropdown();
});

// Initialize checkout page with order data
function initializeCheckoutPage() {
    // Get the latest order from localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const latestOrder = orders[orders.length - 1];
    
    if (latestOrder) {
        currentOrder = latestOrder;
        displayOrderDetails(latestOrder);
        startOrderTracking(latestOrder);
    } else {
        // Redirect to home if no order found
        window.location.href = 'home.html';
    }
}

// Display order details
function displayOrderDetails(order) {
    // Update order ID
    document.getElementById('order-id-display').textContent = `#${order.id}`;
    
    // Display order items
    const orderItemsContainer = document.getElementById('order-items-display');
    orderItemsContainer.innerHTML = '';
    
    order.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        itemElement.innerHTML = `
            <div class="item-info">
                <img src="${item.image || '../assets/images/hero-bg.jpg'}" alt="${item.name}" class="item-image">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p class="item-provider">${item.providerName}</p>
                    <p class="item-category">${item.category}</p>
                </div>
            </div>
            <div class="item-quantity">
                <span>Qty: ${item.quantity}</span>
            </div>
            <div class="item-price">
                <span>₹${item.price * item.quantity}</span>
            </div>
        `;
        orderItemsContainer.appendChild(itemElement);
    });
    
    // Update totals
    document.getElementById('order-subtotal').textContent = `₹${order.subtotal}`;
    document.getElementById('order-delivery-fee').textContent = `₹${order.deliveryFee}`;
    document.getElementById('order-service-fee').textContent = `₹${order.serviceFee}`;
    document.getElementById('order-total').textContent = `₹${order.total}`;
    
    // Show discount if applicable
    if (order.discount > 0) {
        document.getElementById('discount-row').style.display = 'flex';
        document.getElementById('order-discount').textContent = `-₹${order.discount}`;
    }
    
    // Update delivery info
    document.getElementById('delivery-address-display').textContent = order.deliveryAddress;
    document.getElementById('estimated-delivery').textContent = order.estimatedDelivery;
    document.getElementById('payment-method-display').textContent = order.paymentMethod;
    
    // Update confirmed time
    document.getElementById('confirmed-time').textContent = formatOrderTime(order.timestamp);
}

// Start order tracking simulation
function startOrderTracking(order) {
    // Simulate order progress
    const steps = ['confirmed', 'preparing', 'out-for-delivery', 'delivered'];
    let currentStepIndex = 0;
    
    // Update initial status based on order age
    const orderAge = Date.now() - new Date(order.timestamp).getTime();
    const minutesElapsed = Math.floor(orderAge / (1000 * 60));
    
    if (minutesElapsed > 30) {
        currentStepIndex = 3; // Delivered
    } else if (minutesElapsed > 20) {
        currentStepIndex = 2; // Out for delivery
    } else if (minutesElapsed > 10) {
        currentStepIndex = 1; // Preparing
    }
    
    updateTrackingStatus(currentStepIndex);
    
    // Simulate real-time updates every 30 seconds
    trackingInterval = setInterval(() => {
        if (currentStepIndex < steps.length - 1) {
            currentStepIndex++;
            updateTrackingStatus(currentStepIndex);
            
            // Update order status in localStorage
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const orderIndex = orders.findIndex(o => o.id === order.id);
            if (orderIndex !== -1) {
                orders[orderIndex].status = getStatusFromStep(currentStepIndex);
                localStorage.setItem('orders', JSON.stringify(orders));
            }
        } else {
            clearInterval(trackingInterval);
        }
    }, 30000); // Update every 30 seconds for demo
}

// Update tracking timeline UI
function updateTrackingStatus(currentStep) {
    const timelineSteps = document.querySelectorAll('.timeline-step');
    
    timelineSteps.forEach((step, index) => {
        step.classList.remove('completed', 'active');
        
        if (index < currentStep) {
            step.classList.add('completed');
        } else if (index === currentStep) {
            step.classList.add('active');
        }
        
        // Update step times
        const stepTime = step.querySelector('.step-time');
        if (index < currentStep) {
            stepTime.textContent = getStepTime(index);
        } else if (index === currentStep) {
            stepTime.textContent = 'In progress';
        } else {
            stepTime.textContent = 'Pending';
        }
    });
}

// Get status string from step index
function getStatusFromStep(stepIndex) {
    const statuses = ['confirmed', 'preparing', 'out-for-delivery', 'delivered'];
    return statuses[stepIndex] || 'confirmed';
}

// Get formatted step time
function getStepTime(stepIndex) {
    const now = new Date();
    const times = [
        new Date(now.getTime() - 30 * 60000), // 30 min ago
        new Date(now.getTime() - 20 * 60000), // 20 min ago
        new Date(now.getTime() - 10 * 60000), // 10 min ago
        now
    ];
    
    return formatTime(times[stepIndex]);
}

// Format time for display
function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

// Format order time
function formatOrderTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 1) {
        return 'Just now';
    } else if (diffMinutes < 60) {
        return `${diffMinutes} min ago`;
    } else {
        return formatTime(date);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Track order button
    document.getElementById('track-order').addEventListener('click', function() {
        showTrackingModal();
    });
    
    // Contact provider button
    document.getElementById('contact-provider').addEventListener('click', function() {
        showContactModal();
    });
    
    // View all orders button
    document.getElementById('view-all-orders').addEventListener('click', function() {
        window.location.href = 'profile.html#orders';
    });
    
    // Cart button
    document.getElementById('cart-btn').addEventListener('click', function() {
        window.location.href = 'cart.html';
    });
    
    // Search functionality
    document.getElementById('search-btn').addEventListener('click', function() {
        const searchTerm = document.getElementById('search-input').value.trim();
        if (searchTerm) {
            window.location.href = `home.html?search=${encodeURIComponent(searchTerm)}`;
        }
    });
    
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('search-btn').click();
        }
    });
}

// Show tracking modal
function showTrackingModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content tracking-modal">
            <div class="modal-header">
                <h3>Live Order Tracking</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="tracking-map">
                    <div class="map-placeholder">
                        <i class="fas fa-map-marked-alt"></i>
                        <p>Live tracking map would be integrated here</p>
                        <div class="delivery-person">
                            <div class="person-info">
                                <img src="../assets/images/hero-bg.jpg" alt="Delivery Person" class="person-avatar">
                                <div class="person-details">
                                    <h4>Rahul Kumar</h4>
                                    <p>Delivery Partner</p>
                                    <div class="person-rating">
                                        <span class="rating">4.8 ⭐</span>
                                    </div>
                                </div>
                            </div>
                            <div class="person-actions">
                                <button class="btn btn-sm btn-outline">
                                    <i class="fas fa-phone"></i>
                                    Call
                                </button>
                                <button class="btn btn-sm btn-outline">
                                    <i class="fas fa-comment"></i>
                                    Chat
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tracking-details">
                    <div class="detail-item">
                        <i class="fas fa-motorcycle"></i>
                        <span>Estimated arrival: 15-20 minutes</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-route"></i>
                        <span>Distance: 2.5 km away</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Show contact modal
function showContactModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content contact-modal">
            <div class="modal-header">
                <h3>Contact Provider</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="provider-contact">
                    <div class="provider-info">
                        <img src="../assets/images/hero-bg.jpg" alt="Provider" class="provider-avatar">
                        <div class="provider-details">
                            <h4>${currentOrder?.items[0]?.providerName || 'Provider'}</h4>
                            <p>Tiffin Service Provider</p>
                            <div class="provider-rating">
                                <span class="rating">4.5 ⭐</span>
                                <span class="reviews">500+ reviews</span>
                            </div>
                        </div>
                    </div>
                    <div class="contact-options">
                        <button class="contact-btn">
                            <i class="fas fa-phone"></i>
                            <div class="contact-info">
                                <span class="contact-label">Call Provider</span>
                                <span class="contact-detail">+91 98765 43210</span>
                            </div>
                        </button>
                        <button class="contact-btn">
                            <i class="fas fa-comment"></i>
                            <div class="contact-info">
                                <span class="contact-label">Chat Support</span>
                                <span class="contact-detail">Get instant help</span>
                            </div>
                        </button>
                        <button class="contact-btn">
                            <i class="fas fa-envelope"></i>
                            <div class="contact-info">
                                <span class="contact-label">Email Support</span>
                                <span class="contact-detail">support@provider.com</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}

// Setup profile dropdown
function setupProfileDropdown() {
    const profileBtn = document.getElementById('profile-btn');
    const dropdown = document.getElementById('profile-dropdown');
    
    profileBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        dropdown.classList.remove('show');
    });
    
    // Load user profile
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    if (userProfile.name) {
        document.querySelector('.profile-name').textContent = userProfile.name;
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (trackingInterval) {
        clearInterval(trackingInterval);
    }
});
