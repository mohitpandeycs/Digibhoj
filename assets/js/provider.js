// DigiBhoj Provider Dashboard JavaScript
let providerData = {};
let ordersData = [];
let menuData = [];
let deliveryData = [];
let analyticsData = {};

// Initialize provider dashboard
document.addEventListener('DOMContentLoaded', () => {
    initializeProviderDashboard();
});

async function initializeProviderDashboard() {
    try {
        // Load all data
        await loadProviderData();
        await loadOrdersData();
        await loadMenuData();
        await loadDeliveryData();
        
        // Initialize page-specific functionality
        const currentPage = getCurrentPage();
        
        switch(currentPage) {
            case 'dashboard':
                initializeDashboard();
                break;
            case 'menu':
                initializeMenuPage();
                break;
            case 'orders':
                initializeOrdersPage();
                break;
            case 'delivery':
                initializeDeliveryPage();
                break;
            case 'analytics':
                initializeAnalyticsPage();
                break;
            case 'profile':
                initializeProfilePage();
                break;
        }
        
    } catch (error) {
        console.error('Error initializing provider dashboard:', error);
    }
}

function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('dashboard')) return 'dashboard';
    if (path.includes('menu')) return 'menu';
    if (path.includes('orders')) return 'orders';
    if (path.includes('delivery')) return 'delivery';
    if (path.includes('analytics')) return 'analytics';
    if (path.includes('profile')) return 'profile';
    return 'dashboard';
}

// Data Loading Functions
async function loadProviderData() {
    try {
        const response = await fetch('../assets/data/providers.json');
        const providers = await response.json();
        providerData = providers[0]; // Assuming current provider is first one
    } catch (error) {
        console.error('Error loading provider data:', error);
    }
}

async function loadOrdersData() {
    try {
        const response = await fetch('../assets/data/orders.json');
        ordersData = await response.json();
    } catch (error) {
        console.error('Error loading orders data:', error);
    }
}

async function loadMenuData() {
    try {
        const response = await fetch('../assets/data/menu.json');
        menuData = await response.json();
    } catch (error) {
        console.error('Error loading menu data:', error);
    }
}

async function loadDeliveryData() {
    try {
        const response = await fetch('../assets/data/delivery.json');
        deliveryData = await response.json();
    } catch (error) {
        console.error('Error loading delivery data:', error);
    }
}

// Dashboard Functions
function initializeDashboard() {
    updateDashboardStats();
    displayRecentOrders();
    displayNotifications();
    initializeDashboardActions();
}

function updateDashboardStats() {
    const today = new Date().toDateString();
    const todayOrders = ordersData.filter(order => 
        new Date(order.orderTime).toDateString() === today
    );
    
    // Update stats cards
    updateStatCard('total-orders-today', todayOrders.length);
    updateStatCard('earnings-today', calculateTodayEarnings(todayOrders));
    updateStatCard('pending-deliveries', getPendingDeliveries());
    updateStatCard('new-reviews', getNewReviews());
}

function updateStatCard(id, value) {
    const element = document.getElementById(id);
    if (element) {
        if (id.includes('earnings')) {
            element.textContent = `₹${value}`;
        } else {
            element.textContent = value;
        }
    }
}

function calculateTodayEarnings(orders) {
    return orders.reduce((total, order) => total + order.amount, 0);
}

function getPendingDeliveries() {
    return ordersData.filter(order => 
        order.status === 'ready' || order.status === 'out-for-delivery'
    ).length;
}

function getNewReviews() {
    return Math.floor(Math.random() * 5) + 1; // Mock data
}

function displayRecentOrders() {
    const container = document.getElementById('recent-orders-table');
    if (!container) return;
    
    const recentOrders = ordersData.slice(0, 5);
    
    container.innerHTML = recentOrders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.customerName}</td>
            <td>${order.items.join(', ')}</td>
            <td>₹${order.amount}</td>
            <td><span class="status-badge ${order.status}">${order.status}</span></td>
            <td>${formatTime(order.orderTime)}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewOrderDetails(${order.id})">
                    View
                </button>
            </td>
        </tr>
    `).join('');
}

function displayNotifications() {
    const container = document.getElementById('notifications-list');
    if (!container) return;
    
    const notifications = [
        { message: 'New order received from John Doe', time: '2 min ago', type: 'order' },
        { message: 'Payment of ₹450 received', time: '5 min ago', type: 'payment' },
        { message: 'Delivery completed for Order #1234', time: '10 min ago', type: 'delivery' }
    ];
    
    container.innerHTML = notifications.map(notif => `
        <div class="notification-item">
            <div class="notification-content">
                <p>${notif.message}</p>
                <span class="notification-time">${notif.time}</span>
            </div>
        </div>
    `).join('');
}

function initializeDashboardActions() {
    // Quick action buttons
    const addMenuBtn = document.getElementById('add-menu-item-btn');
    if (addMenuBtn) {
        addMenuBtn.addEventListener('click', () => window.location.href = 'menu.html');
    }
    
    const checkOrdersBtn = document.getElementById('check-orders-btn');
    if (checkOrdersBtn) {
        checkOrdersBtn.addEventListener('click', () => window.location.href = 'orders.html');
    }
    
    const viewAnalyticsBtn = document.getElementById('view-analytics-btn');
    if (viewAnalyticsBtn) {
        viewAnalyticsBtn.addEventListener('click', () => window.location.href = 'analytics.html');
    }
    
    const assignDeliveryBtn = document.getElementById('assign-delivery-btn');
    if (assignDeliveryBtn) {
        assignDeliveryBtn.addEventListener('click', () => window.location.href = 'delivery.html');
    }
}

// Menu Management Functions
function initializeMenuPage() {
    displayMenuItems();
    initializeMenuForm();
    initializeMenuFilters();
}

function displayMenuItems() {
    const container = document.getElementById('menu-items-table');
    if (!container) return;
    
    container.innerHTML = menuData.map(item => `
        <tr>
            <td>
                <img src="${item.image || '../assets/images/hero-bg.jpg'}" alt="${item.name}" class="menu-item-thumb">
                ${item.name}
            </td>
            <td>${item.category}</td>
            <td>${item.cuisine}</td>
            <td>₹${item.price}</td>
            <td><span class="diet-tag ${item.dietType}">${item.dietType}</span></td>
            <td>${item.capacity}</td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="editMenuItem(${item.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteMenuItem(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function initializeMenuForm() {
    const form = document.getElementById('add-menu-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        addMenuItem();
    });
}

function addMenuItem() {
    const form = document.getElementById('add-menu-form');
    const formData = new FormData(form);
    
    const newItem = {
        id: Date.now(),
        name: formData.get('dishName'),
        category: formData.get('category'),
        cuisine: formData.get('cuisine'),
        price: parseInt(formData.get('price')),
        dietType: formData.get('dietType'),
        capacity: parseInt(formData.get('capacity')),
        description: formData.get('description'),
        image: '../assets/images/hero-bg.jpg'
    };
    
    menuData.push(newItem);
    displayMenuItems();
    form.reset();
    showNotification('Menu item added successfully!', 'success');
}

function editMenuItem(id) {
    const item = menuData.find(item => item.id === id);
    if (!item) return;
    
    // Populate edit modal
    document.getElementById('edit-dish-name').value = item.name;
    document.getElementById('edit-category').value = item.category;
    document.getElementById('edit-cuisine').value = item.cuisine;
    document.getElementById('edit-price').value = item.price;
    document.getElementById('edit-diet-type').value = item.dietType;
    document.getElementById('edit-capacity').value = item.capacity;
    document.getElementById('edit-description').value = item.description;
    
    // Show modal
    document.getElementById('edit-menu-modal').style.display = 'block';
    
    // Store item ID for update
    document.getElementById('edit-menu-modal').dataset.itemId = id;
}

function updateMenuItem() {
    const modal = document.getElementById('edit-menu-modal');
    const itemId = parseInt(modal.dataset.itemId);
    const itemIndex = menuData.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) return;
    
    menuData[itemIndex] = {
        ...menuData[itemIndex],
        name: document.getElementById('edit-dish-name').value,
        category: document.getElementById('edit-category').value,
        cuisine: document.getElementById('edit-cuisine').value,
        price: parseInt(document.getElementById('edit-price').value),
        dietType: document.getElementById('edit-diet-type').value,
        capacity: parseInt(document.getElementById('edit-capacity').value),
        description: document.getElementById('edit-description').value
    };
    
    displayMenuItems();
    modal.style.display = 'none';
    showNotification('Menu item updated successfully!', 'success');
}

function deleteMenuItem(id) {
    if (confirm('Are you sure you want to delete this menu item?')) {
        menuData = menuData.filter(item => item.id !== id);
        displayMenuItems();
        showNotification('Menu item deleted successfully!', 'success');
    }
}

// Orders Management Functions
function initializeOrdersPage() {
    displayOrders();
    initializeOrderFilters();
    initializeOrderActions();
}

function displayOrders() {
    const container = document.getElementById('orders-table');
    if (!container) return;
    
    container.innerHTML = ordersData.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.customerName}</td>
            <td>${order.items.join(', ')}</td>
            <td>${order.planType}</td>
            <td>₹${order.amount}</td>
            <td>${order.paymentMethod}</td>
            <td><span class="status-badge ${order.status}">${order.status}</span></td>
            <td>${formatTime(order.orderTime)}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewOrderDetails(${order.id})">
                    View
                </button>
                ${order.status === 'pending' ? `
                    <button class="btn btn-sm btn-success" onclick="acceptOrder(${order.id})">
                        Accept
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="rejectOrder(${order.id})">
                        Reject
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

function viewOrderDetails(orderId) {
    const order = ordersData.find(o => o.id === orderId);
    if (!order) return;
    
    // Populate order details modal
    document.getElementById('order-detail-id').textContent = `#${order.id}`;
    document.getElementById('order-detail-customer').textContent = order.customerName;
    document.getElementById('order-detail-phone').textContent = order.customerPhone;
    document.getElementById('order-detail-address').textContent = order.deliveryAddress;
    document.getElementById('order-detail-items').innerHTML = order.items.map(item => `<li>${item}</li>`).join('');
    document.getElementById('order-detail-amount').textContent = `₹${order.amount}`;
    document.getElementById('order-detail-payment').textContent = order.paymentMethod;
    document.getElementById('order-detail-status').textContent = order.status;
    document.getElementById('order-detail-time').textContent = formatTime(order.orderTime);
    
    // Show modal
    document.getElementById('order-details-modal').style.display = 'block';
    
    // Store order ID for actions
    document.getElementById('order-details-modal').dataset.orderId = orderId;
}

function acceptOrder(orderId) {
    updateOrderStatus(orderId, 'accepted');
    showNotification('Order accepted successfully!', 'success');
}

function rejectOrder(orderId) {
    // Show reject modal
    document.getElementById('reject-order-modal').style.display = 'block';
    document.getElementById('reject-order-modal').dataset.orderId = orderId;
}

function confirmRejectOrder() {
    const modal = document.getElementById('reject-order-modal');
    const orderId = parseInt(modal.dataset.orderId);
    const reason = document.getElementById('reject-reason').value;
    
    updateOrderStatus(orderId, 'rejected', reason);
    modal.style.display = 'none';
    document.getElementById('reject-reason').value = '';
    showNotification('Order rejected', 'warning');
}

function updateOrderStatus(orderId, status, reason = '') {
    const orderIndex = ordersData.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        ordersData[orderIndex].status = status;
        if (reason) ordersData[orderIndex].rejectionReason = reason;
        displayOrders();
    }
}

// Delivery Management Functions
function initializeDeliveryPage() {
    displayUnassignedOrders();
    displayAssignedDeliveries();
    displayDeliveryBoys();
    initializeDeliveryForm();
}

function displayUnassignedOrders() {
    const container = document.getElementById('unassigned-orders');
    if (!container) return;
    
    const unassignedOrders = ordersData.filter(order => 
        order.status === 'accepted' && !order.deliveryBoyId
    );
    
    container.innerHTML = unassignedOrders.map(order => `
        <div class="unassigned-order-card">
            <h4>Order #${order.id}</h4>
            <p><strong>Customer:</strong> ${order.customerName}</p>
            <p><strong>Address:</strong> ${order.deliveryAddress}</p>
            <p><strong>Amount:</strong> ₹${order.amount}</p>
            <p><strong>Time:</strong> ${formatTime(order.orderTime)}</p>
            <button class="btn btn-primary" onclick="assignDelivery(${order.id})">
                Assign Delivery
            </button>
        </div>
    `).join('');
}

function displayAssignedDeliveries() {
    const container = document.getElementById('assigned-deliveries-table');
    if (!container) return;
    
    const assignedOrders = ordersData.filter(order => order.deliveryBoyId);
    
    container.innerHTML = assignedOrders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.customerName}</td>
            <td>${order.deliveryBoyName || 'Unknown'}</td>
            <td>₹${order.amount}</td>
            <td><span class="status-badge ${order.status}">${order.status}</span></td>
            <td>${formatTime(order.orderTime)}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="trackDelivery(${order.id})">
                    Track
                </button>
            </td>
        </tr>
    `).join('');
}

function displayDeliveryBoys() {
    const container = document.getElementById('delivery-boys-grid');
    if (!container) return;
    
    const deliveryBoys = [
        { id: 1, name: 'Rahul Kumar', phone: '+91 98765 43210', status: 'available', currentOrders: 0 },
        { id: 2, name: 'Amit Singh', phone: '+91 98765 43211', status: 'busy', currentOrders: 2 },
        { id: 3, name: 'Suresh Patel', phone: '+91 98765 43212', status: 'available', currentOrders: 1 }
    ];
    
    container.innerHTML = deliveryBoys.map(boy => `
        <div class="delivery-boy-card ${boy.status}">
            <h4>${boy.name}</h4>
            <p><i class="fas fa-phone"></i> ${boy.phone}</p>
            <p><strong>Status:</strong> ${boy.status}</p>
            <p><strong>Current Orders:</strong> ${boy.currentOrders}</p>
            <button class="btn btn-sm btn-primary" onclick="viewDeliveryBoyDetails(${boy.id})">
                View Details
            </button>
        </div>
    `).join('');
}

// Analytics Functions
function initializeAnalyticsPage() {
    initializeCharts();
    displayEarningsBreakdown();
    displayPopularItems();
    displayDemandInsights();
    displayCustomerFeedback();
    displayRecentActivity();
}

function initializeCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx && typeof Chart !== 'undefined') {
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Revenue',
                    data: [1200, 1900, 3000, 5000, 2000, 3000, 4500],
                    borderColor: '#67C090',
                    backgroundColor: 'rgba(103, 192, 144, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
}

// Profile Management Functions
function initializeProfilePage() {
    initializeProfileForms();
    initializeDocumentUpload();
    initializeSettings();
}

function initializeProfileForms() {
    const basicInfoForm = document.getElementById('basic-info-form');
    if (basicInfoForm) {
        basicInfoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            updateBasicInfo();
        });
    }
    
    const bankForm = document.getElementById('bank-form');
    if (bankForm) {
        bankForm.addEventListener('submit', (e) => {
            e.preventDefault();
            updateBankDetails();
        });
    }
}

function updateBasicInfo() {
    showNotification('Profile updated successfully!', 'success');
}

function updateBankDetails() {
    showNotification('Bank details updated successfully!', 'success');
}

// Utility Functions
function formatTime(timestamp) {
    return new Date(timestamp).toLocaleString();
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        z-index: 10000;
        background: ${type === 'success' ? '#67C090' : type === 'warning' ? '#f39c12' : '#3498db'};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Modal Functions
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Initialize modal close buttons
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) modal.style.display = 'none';
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
});

