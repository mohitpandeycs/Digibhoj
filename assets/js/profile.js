// Profile Page JavaScript
let userProfile = JSON.parse(localStorage.getItem('userProfile')) || {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    dateOfBirth: '1990-01-01',
    joinDate: '2024-03-15'
};

let orders = JSON.parse(localStorage.getItem('orders')) || [];
let subscriptions = JSON.parse(localStorage.getItem('subscriptions')) || [];
let addresses = JSON.parse(localStorage.getItem('addresses')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    initializeProfilePage();
});

function initializeProfilePage() {
    loadUserProfile();
    initializeNavigation();
    loadActiveTab();
    updateCartCount();
    
    // Check for hash navigation
    const hash = window.location.hash.substring(1);
    if (hash && ['orders', 'subscriptions', 'addresses', 'settings'].includes(hash)) {
        switchTab(hash);
    }
}

function loadUserProfile() {
    // Update profile card
    document.getElementById('profile-name').textContent = `${userProfile.firstName} ${userProfile.lastName}`;
    document.getElementById('profile-email').textContent = userProfile.email;
    
    // Update stats
    document.getElementById('total-orders').textContent = orders.length;
    
    const joinDate = new Date(userProfile.joinDate);
    const monthsSince = Math.floor((new Date() - joinDate) / (1000 * 60 * 60 * 24 * 30));
    document.getElementById('member-since').textContent = monthsSince;
    
    // Update profile form
    document.getElementById('first-name').value = userProfile.firstName;
    document.getElementById('last-name').value = userProfile.lastName;
    document.getElementById('email').value = userProfile.email;
    document.getElementById('phone').value = userProfile.phone;
    document.getElementById('date-of-birth').value = userProfile.dateOfBirth;
}

function initializeNavigation() {
    // Profile navigation
    const navButtons = document.querySelectorAll('.profile-nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            switchTab(tab);
        });
    });
    
    // Profile editing
    document.getElementById('edit-profile')?.addEventListener('click', enableProfileEditing);
    document.getElementById('cancel-profile')?.addEventListener('click', cancelProfileEditing);
    document.getElementById('save-profile')?.addEventListener('click', saveProfile);
    
    // Order filters
    document.getElementById('order-status-filter')?.addEventListener('change', filterOrders);
    
    // Settings
    document.getElementById('change-password')?.addEventListener('click', openPasswordModal);
    document.getElementById('close-password-modal')?.addEventListener('click', closePasswordModal);
    document.getElementById('cancel-password')?.addEventListener('click', closePasswordModal);
    document.getElementById('save-password')?.addEventListener('click', changePassword);
    
    // Navigation buttons
    document.getElementById('new-subscription')?.addEventListener('click', () => {
        window.location.href = 'home.html';
    });
    
    document.getElementById('add-address')?.addEventListener('click', addNewAddress);
    document.getElementById('delete-account')?.addEventListener('click', confirmDeleteAccount);
    
    // Cart navigation
    document.getElementById('cart-btn')?.addEventListener('click', () => {
        window.location.href = 'cart.html';
    });
}

function switchTab(tabName) {
    // Update navigation
    document.querySelectorAll('.profile-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
    
    // Update content
    document.querySelectorAll('.profile-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`)?.classList.add('active');
    
    // Load tab-specific content
    switch(tabName) {
        case 'orders':
            loadOrders();
            break;
        case 'subscriptions':
            loadSubscriptions();
            break;
        case 'addresses':
            loadAddresses();
            break;
        case 'settings':
            loadSettings();
            break;
    }
    
    // Update URL hash
    window.history.replaceState(null, null, `#${tabName}`);
}

function loadActiveTab() {
    const activeTab = document.querySelector('.profile-nav-btn.active')?.getAttribute('data-tab') || 'profile';
    if (activeTab !== 'profile') {
        switchTab(activeTab);
    }
}

function enableProfileEditing() {
    const inputs = document.querySelectorAll('#profile-form input');
    inputs.forEach(input => {
        if (input.id !== 'email') { // Email should remain readonly
            input.removeAttribute('readonly');
        }
    });
    
    document.getElementById('edit-profile').style.display = 'none';
    document.getElementById('profile-actions').style.display = 'flex';
}

function cancelProfileEditing() {
    loadUserProfile();
    
    const inputs = document.querySelectorAll('#profile-form input');
    inputs.forEach(input => {
        input.setAttribute('readonly', true);
    });
    
    document.getElementById('edit-profile').style.display = 'inline-flex';
    document.getElementById('profile-actions').style.display = 'none';
}

function saveProfile() {
    userProfile.firstName = document.getElementById('first-name').value;
    userProfile.lastName = document.getElementById('last-name').value;
    userProfile.phone = document.getElementById('phone').value;
    userProfile.dateOfBirth = document.getElementById('date-of-birth').value;
    
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    
    loadUserProfile();
    cancelProfileEditing();
    showFeedback('Profile updated successfully', 'success');
}

function loadOrders() {
    const ordersList = document.getElementById('orders-list');
    const statusFilter = document.getElementById('order-status-filter').value;
    
    let filteredOrders = orders;
    if (statusFilter) {
        filteredOrders = orders.filter(order => order.status === statusFilter);
    }
    
    if (!filteredOrders.length) {
        ordersList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-bag"></i>
                <h3>No orders found</h3>
                <p>You haven't placed any orders yet.</p>
                <a href="home.html" class="btn btn-primary">Browse Providers</a>
            </div>
        `;
        return;
    }
    
    ordersList.innerHTML = filteredOrders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div class="order-info">
                    <h4>Order #${order.id}</h4>
                    <p class="order-date">${formatDate(order.timestamp)}</p>
                </div>
                <div class="order-status">
                    <span class="status-badge status-${order.status}">${formatStatus(order.status)}</span>
                    <div class="order-total">₹${order.total}</div>
                </div>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span class="item-name">${item.name} x${item.quantity}</span>
                        <span class="item-provider">${item.providerName}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-actions">
                <button class="btn btn-secondary" onclick="viewOrderDetails('${order.id}')">
                    View Details
                </button>
                ${order.status === 'delivered' ? `
                    <button class="btn btn-primary" onclick="reorderItems('${order.id}')">
                        Reorder
                    </button>
                ` : ''}
                ${order.status === 'delivered' ? `
                    <button class="btn btn-outline" onclick="writeReview('${order.id}')">
                        Write Review
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function loadSubscriptions() {
    const subscriptionsList = document.getElementById('subscriptions-list');
    
    if (!subscriptions.length) {
        subscriptionsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-alt"></i>
                <h3>No active subscriptions</h3>
                <p>Subscribe to meal plans for regular deliveries.</p>
                <a href="home.html" class="btn btn-primary">Browse Plans</a>
            </div>
        `;
        return;
    }
    
    subscriptionsList.innerHTML = subscriptions.map(sub => `
        <div class="subscription-card">
            <div class="subscription-header">
                <h4>${sub.providerName}</h4>
                <span class="subscription-status ${sub.status}">${sub.status}</span>
            </div>
            <div class="subscription-details">
                <p><strong>Plan:</strong> ${sub.planName}</p>
                <p><strong>Next Delivery:</strong> ${formatDate(sub.nextDelivery)}</p>
                <p><strong>Amount:</strong> ₹${sub.amount}</p>
            </div>
            <div class="subscription-actions">
                <button class="btn btn-secondary" onclick="pauseSubscription('${sub.id}')">
                    ${sub.status === 'active' ? 'Pause' : 'Resume'}
                </button>
                <button class="btn btn-outline" onclick="modifySubscription('${sub.id}')">
                    Modify
                </button>
                <button class="btn btn-danger" onclick="cancelSubscription('${sub.id}')">
                    Cancel
                </button>
            </div>
        </div>
    `).join('');
}

function loadAddresses() {
    const addressesList = document.getElementById('addresses-list');
    
    if (!addresses.length) {
        addressesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-map-marker-alt"></i>
                <h3>No saved addresses</h3>
                <p>Add addresses for faster checkout.</p>
                <button class="btn btn-primary" onclick="addNewAddress()">Add Address</button>
            </div>
        `;
        return;
    }
    
    addressesList.innerHTML = addresses.map((address, index) => `
        <div class="address-card">
            <div class="address-header">
                <h4>${address.label || 'Address ' + (index + 1)}</h4>
                ${address.isDefault ? '<span class="default-badge">Default</span>' : ''}
            </div>
            <div class="address-details">
                <p>${address.line1}</p>
                ${address.line2 ? `<p>${address.line2}</p>` : ''}
                <p>${address.city} - ${address.pincode}</p>
                ${address.landmark ? `<p><em>Landmark: ${address.landmark}</em></p>` : ''}
            </div>
            <div class="address-actions">
                <button class="btn btn-secondary" onclick="editAddress(${index})">
                    Edit
                </button>
                ${!address.isDefault ? `
                    <button class="btn btn-outline" onclick="setDefaultAddress(${index})">
                        Set Default
                    </button>
                ` : ''}
                <button class="btn btn-danger" onclick="deleteAddress(${index})">
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

function loadSettings() {
    // Settings are loaded from the HTML, just ensure event listeners are attached
    const checkboxes = document.querySelectorAll('#settings-tab input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', saveSettings);
    });
}

function filterOrders() {
    loadOrders();
}

function viewOrderDetails(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        // Create a detailed view modal or navigate to order details page
        showFeedback(`Order #${orderId} details would be shown here`, 'info');
    }
}

function reorderItems(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        // Add order items to cart
        order.items.forEach(item => {
            const existingItem = cart.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                cart.push({...item});
            }
        });
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showFeedback('Items added to cart', 'success');
    }
}

function writeReview(orderId) {
    window.location.href = `review.html?orderId=${orderId}`;
}

function addNewAddress() {
    // This would typically open a modal or navigate to an address form
    showFeedback('Add address functionality would be implemented here', 'info');
}

function editAddress(index) {
    showFeedback(`Edit address ${index + 1} functionality would be implemented here`, 'info');
}

function setDefaultAddress(index) {
    addresses.forEach((addr, i) => {
        addr.isDefault = i === index;
    });
    localStorage.setItem('addresses', JSON.stringify(addresses));
    loadAddresses();
    showFeedback('Default address updated', 'success');
}

function deleteAddress(index) {
    if (confirm('Are you sure you want to delete this address?')) {
        addresses.splice(index, 1);
        localStorage.setItem('addresses', JSON.stringify(addresses));
        loadAddresses();
        showFeedback('Address deleted', 'info');
    }
}

function pauseSubscription(subId) {
    const subscription = subscriptions.find(s => s.id === subId);
    if (subscription) {
        subscription.status = subscription.status === 'active' ? 'paused' : 'active';
        localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
        loadSubscriptions();
        showFeedback(`Subscription ${subscription.status}`, 'success');
    }
}

function modifySubscription(subId) {
    showFeedback('Modify subscription functionality would be implemented here', 'info');
}

function cancelSubscription(subId) {
    if (confirm('Are you sure you want to cancel this subscription?')) {
        const index = subscriptions.findIndex(s => s.id === subId);
        if (index !== -1) {
            subscriptions.splice(index, 1);
            localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
            loadSubscriptions();
            showFeedback('Subscription cancelled', 'info');
        }
    }
}

function openPasswordModal() {
    document.getElementById('change-password-modal').style.display = 'flex';
}

function closePasswordModal() {
    document.getElementById('change-password-modal').style.display = 'none';
    document.getElementById('password-form').reset();
}

function changePassword() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
        showFeedback('Please fill in all fields', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showFeedback('New passwords do not match', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showFeedback('Password must be at least 6 characters long', 'error');
        return;
    }
    
    // In a real app, this would make an API call
    closePasswordModal();
    showFeedback('Password changed successfully', 'success');
}

function saveSettings() {
    const settings = {
        emailNotifications: document.getElementById('email-notifications').checked,
        smsNotifications: document.getElementById('sms-notifications').checked,
        pushNotifications: document.getElementById('push-notifications').checked,
        profileVisibility: document.getElementById('profile-visibility').checked,
        orderHistory: document.getElementById('order-history').checked
    };
    
    localStorage.setItem('userSettings', JSON.stringify(settings));
    showFeedback('Settings saved', 'success');
}

function confirmDeleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        if (confirm('This will permanently delete all your data. Are you absolutely sure?')) {
            // In a real app, this would make an API call
            localStorage.clear();
            window.location.href = '../auth.html';
        }
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatStatus(status) {
    const statusMap = {
        'pending': 'Pending',
        'confirmed': 'Confirmed',
        'preparing': 'Preparing',
        'out-for-delivery': 'Out for Delivery',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
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

// Initialize sample data if none exists
function initializeSampleData() {
    if (!orders.length) {
        orders = [
            {
                id: 'DB001234',
                items: [
                    { id: 1, name: 'Dal Rice', quantity: 2, price: 80, providerName: 'Sharma Tiffin Service' },
                    { id: 2, name: 'Roti Sabzi', quantity: 1, price: 70, providerName: 'Sharma Tiffin Service' }
                ],
                status: 'delivered',
                total: 230,
                timestamp: '2024-09-10T13:30:00Z',
                deliverySlot: 'lunch'
            },
            {
                id: 'DB001235',
                items: [
                    { id: 3, name: 'Biryani', quantity: 1, price: 120, providerName: 'Royal Kitchen' }
                ],
                status: 'preparing',
                total: 150,
                timestamp: '2024-09-14T19:00:00Z',
                deliverySlot: 'dinner'
            }
        ];
        localStorage.setItem('orders', JSON.stringify(orders));
    }
    
    if (!addresses.length) {
        addresses = [
            {
                label: 'Home',
                line1: '123 Main Street',
                line2: 'Apartment 4B',
                city: 'Mumbai',
                pincode: '400001',
                landmark: 'Near Central Park',
                isDefault: true
            }
        ];
        localStorage.setItem('addresses', JSON.stringify(addresses));
    }
}

// Initialize sample data on first load
document.addEventListener('DOMContentLoaded', () => {
    initializeSampleData();
});
