// Delivery Charts and Interactive Features
class DeliveryCharts {
    constructor() {
        this.charts = {};
        this.initializeCharts();
        this.setupInteractivity();
    }

    initializeCharts() {
        // Main earnings chart
        this.createEarningsChart();
        
        // Breakdown pie chart
        this.createBreakdownChart();
        
        // Performance trend chart
        this.createPerformanceChart();
    }

    createEarningsChart() {
        const ctx = document.getElementById('earnings-chart');
        if (!ctx) return;

        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(230, 39, 39, 0.8)');
        gradient.addColorStop(1, 'rgba(230, 39, 39, 0.1)');

        this.charts.earnings = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Daily Earnings (₹)',
                    data: [380, 290, 520, 350, 460, 600, 450],
                    borderColor: '#E62727',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#E62727',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#E62727',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `Earnings: ₹${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#9CA3AF',
                            font: {
                                family: 'Poppins',
                                size: 12
                            }
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            borderDash: [5, 5]
                        },
                        ticks: {
                            color: '#9CA3AF',
                            font: {
                                family: 'Poppins',
                                size: 12
                            },
                            callback: function(value) {
                                return '₹' + value;
                            }
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    createBreakdownChart() {
        const ctx = document.getElementById('breakdown-chart');
        if (!ctx) return;

        this.charts.breakdown = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Base Fee', 'Distance Bonus', 'Peak Hours', 'Tips'],
                datasets: [{
                    data: [45, 25, 20, 10],
                    backgroundColor: [
                        '#E62727',
                        '#1E93AB',
                        '#67C090',
                        '#F59E0B'
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#9CA3AF',
                            font: {
                                family: 'Poppins',
                                size: 12
                            },
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#E62727',
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed}%`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 2000
                }
            }
        });
    }

    createPerformanceChart() {
        const ctx = document.getElementById('performance-chart');
        if (!ctx) return;

        this.charts.performance = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Speed', 'Accuracy', 'Customer Rating', 'Efficiency', 'Reliability'],
                datasets: [{
                    label: 'Performance',
                    data: [85, 92, 96, 88, 94],
                    borderColor: '#1E93AB',
                    backgroundColor: 'rgba(30, 147, 171, 0.2)',
                    borderWidth: 2,
                    pointBackgroundColor: '#1E93AB',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#1E93AB',
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed.r}%`;
                            }
                        }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        angleLines: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        pointLabels: {
                            color: '#9CA3AF',
                            font: {
                                family: 'Poppins',
                                size: 11
                            }
                        },
                        ticks: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    setupInteractivity() {
        // Theme toggle functionality
        this.setupThemeToggle();
        
        // Notification dropdown
        this.setupNotifications();
        
        // Custom select dropdowns
        this.setupCustomSelects();
        
        // Search functionality
        this.setupSearchFilters();
        
        // Progress bar animations
        this.animateProgressBars();
        
        // Level progress animation
        this.animateLevelProgress();
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const icon = themeToggle.querySelector('i');
            
            if (document.body.classList.contains('dark-mode')) {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
            
            // Update charts for theme change
            this.updateChartsForTheme();
        });
    }

    setupNotifications() {
        const notificationBtn = document.getElementById('notification-btn');
        const notificationsSidebar = document.querySelector('.notifications-sidebar');
        
        if (!notificationBtn || !notificationsSidebar) return;

        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationsSidebar.classList.toggle('active');
        });

        // Close notifications when clicking outside
        document.addEventListener('click', (e) => {
            if (!notificationsSidebar.contains(e.target)) {
                notificationsSidebar.classList.remove('active');
            }
        });
    }

    setupCustomSelects() {
        const customSelects = document.querySelectorAll('.custom-select');
        
        customSelects.forEach(select => {
            const display = select.querySelector('.select-display');
            const dropdown = select.querySelector('.select-dropdown');
            const options = select.querySelectorAll('.select-option');
            
            if (!display || !dropdown) return;

            display.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Close other selects
                customSelects.forEach(otherSelect => {
                    if (otherSelect !== select) {
                        otherSelect.classList.remove('active');
                    }
                });
                
                select.classList.toggle('active');
            });

            options.forEach(option => {
                option.addEventListener('click', () => {
                    const text = option.textContent;
                    const value = option.dataset.value;
                    
                    display.querySelector('.select-text').textContent = text;
                    
                    // Update selected state
                    options.forEach(opt => opt.removeAttribute('selected'));
                    option.setAttribute('selected', '');
                    
                    select.classList.remove('active');
                    
                    // Trigger change event
                    this.handleSelectChange(select, value);
                });
            });
        });

        // Close selects when clicking outside
        document.addEventListener('click', () => {
            customSelects.forEach(select => {
                select.classList.remove('active');
            });
        });
    }

    handleSelectChange(select, value) {
        const selectId = select.id;
        
        if (selectId === 'date-range-select') {
            this.updateEarningsChart(value);
        } else if (selectId === 'status-filter-select') {
            this.filterEarningsTable(value);
        }
    }

    updateEarningsChart(period) {
        if (!this.charts.earnings) return;

        let newData, newLabels;
        
        switch(period) {
            case 'today':
                newLabels = ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'];
                newData = [50, 80, 120, 90, 150, 100];
                break;
            case 'week':
                newLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                newData = [380, 290, 520, 350, 460, 600, 450];
                break;
            case 'month':
                newLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                newData = [2100, 2450, 2200, 2800];
                break;
            case 'all':
                newLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
                newData = [8500, 9200, 8800, 9500, 10200, 9800];
                break;
            default:
                return;
        }

        this.charts.earnings.data.labels = newLabels;
        this.charts.earnings.data.datasets[0].data = newData;
        this.charts.earnings.update('active');
    }

    setupSearchFilters() {
        const searchInputs = document.querySelectorAll('.search-input');
        
        searchInputs.forEach(input => {
            const clearBtn = input.parentElement.querySelector('.clear-search');
            
            input.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                this.filterContent(input, query);
                
                if (clearBtn) {
                    clearBtn.style.display = query ? 'flex' : 'none';
                }
            });
            
            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    input.value = '';
                    input.dispatchEvent(new Event('input'));
                    clearBtn.style.display = 'none';
                });
            }
        });
    }

    filterContent(input, query) {
        const inputId = input.id;
        
        if (inputId === 'delivery-search') {
            this.filterDeliveries(query);
        } else if (inputId === 'earnings-search') {
            this.filterEarningsTable(query);
        }
    }

    filterDeliveries(query) {
        const deliveryCards = document.querySelectorAll('.delivery-card');
        
        deliveryCards.forEach(card => {
            const orderId = card.querySelector('.order-id')?.textContent.toLowerCase() || '';
            const customerName = card.querySelector('.customer-name')?.textContent.toLowerCase() || '';
            
            const matches = orderId.includes(query) || customerName.includes(query);
            card.style.display = matches ? 'block' : 'none';
        });
    }

    filterEarningsTable(query) {
        const rows = document.querySelectorAll('.earning-row');
        
        rows.forEach(row => {
            const orderId = row.querySelector('.order-id')?.textContent.toLowerCase() || '';
            const matches = orderId.includes(query);
            row.style.display = matches ? 'table-row' : 'none';
        });
    }

    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.style.width;
                    bar.style.width = '0%';
                    
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                }
            });
        });

        progressBars.forEach(bar => observer.observe(bar));
    }

    animateLevelProgress() {
        const levelFill = document.querySelector('.level-fill');
        if (!levelFill) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const fill = entry.target;
                    const width = fill.style.width;
                    fill.style.width = '0%';
                    
                    setTimeout(() => {
                        fill.style.width = width;
                    }, 500);
                }
            });
        });

        observer.observe(levelFill);
    }

    updateChartsForTheme() {
        const isDark = document.body.classList.contains('dark-mode');
        const textColor = isDark ? '#E5E7EB' : '#374151';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

        Object.values(this.charts).forEach(chart => {
            if (chart.options.scales) {
                // Update axis colors
                Object.keys(chart.options.scales).forEach(scaleKey => {
                    const scale = chart.options.scales[scaleKey];
                    if (scale.ticks) scale.ticks.color = textColor;
                    if (scale.grid) scale.grid.color = gridColor;
                    if (scale.pointLabels) scale.pointLabels.color = textColor;
                });
            }
            
            // Update legend colors
            if (chart.options.plugins?.legend?.labels) {
                chart.options.plugins.legend.labels.color = textColor;
            }
            
            chart.update('none');
        });
    }
}

// Utility functions for delivery actions
function acceptDelivery(orderId) {
    const card = document.querySelector(`[data-order-id="${orderId}"]`);
    if (card) {
        card.classList.remove('pending');
        card.classList.add('ongoing');
        
        const status = card.querySelector('.delivery-status');
        if (status) {
            status.innerHTML = '<i class="fas fa-truck"></i> Ongoing';
            status.className = 'delivery-status ongoing';
        }
        
        // Update action buttons
        const actions = card.querySelector('.delivery-actions');
        if (actions) {
            actions.innerHTML = `
                <button class="action-btn navigate-btn" onclick="navigateToDelivery('${orderId}')">
                    <i class="fas fa-route"></i>
                    Navigate
                </button>
                <button class="action-btn complete-btn" onclick="completeDelivery('${orderId}')">
                    <i class="fas fa-check"></i>
                    Complete
                </button>
            `;
        }
        
        // Show success notification
        showNotification('Delivery accepted successfully!', 'success');
    }
}

function rejectDelivery(orderId) {
    const card = document.querySelector(`[data-order-id="${orderId}"]`);
    if (card) {
        card.style.animation = 'slideOut 0.3s ease-in-out forwards';
        setTimeout(() => {
            card.remove();
        }, 300);
        
        showNotification('Delivery rejected', 'info');
    }
}

function completeDelivery(orderId) {
    const card = document.querySelector(`[data-order-id="${orderId}"]`);
    if (card) {
        card.classList.remove('ongoing');
        card.classList.add('completed');
        
        const status = card.querySelector('.delivery-status');
        if (status) {
            status.innerHTML = '<i class="fas fa-check-circle"></i> Completed';
            status.className = 'delivery-status completed';
        }
        
        // Update action buttons
        const actions = card.querySelector('.delivery-actions');
        if (actions) {
            actions.innerHTML = `
                <button class="action-btn view-btn" onclick="viewDeliveryDetails('${orderId}')">
                    <i class="fas fa-eye"></i>
                    View Details
                </button>
            `;
        }
        
        showNotification('Delivery completed successfully! 🎉', 'success');
        
        // Update stats
        updateDeliveryStats();
    }
}

function navigateToDelivery(orderId) {
    // Redirect to map page with order details
    window.location.href = `map.html?order=${orderId}`;
}

function viewDeliveryDetails(orderId) {
    // Show delivery details modal or redirect to details page
    showNotification(`Viewing details for order ${orderId}`, 'info');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function updateDeliveryStats() {
    // Update completed count
    const completedElement = document.getElementById('completed-today');
    if (completedElement) {
        const current = parseInt(completedElement.textContent) || 0;
        completedElement.textContent = current + 1;
    }
    
    // Update earnings (assuming ₹50 per delivery)
    const earningsElement = document.getElementById('today-earnings');
    if (earningsElement) {
        const current = parseFloat(earningsElement.textContent.replace('₹', '').replace(',', '')) || 0;
        const newEarnings = current + 50;
        earningsElement.textContent = `₹${newEarnings.toLocaleString('en-IN', {minimumFractionDigits: 2})}`;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DeliveryCharts();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(-100%); opacity: 0; }
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--glass-bg);
        backdrop-filter: blur(20px);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-xl);
        padding: var(--space-md) var(--space-lg);
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        color: var(--text-primary);
        box-shadow: var(--glass-shadow);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        z-index: 10000;
        min-width: 250px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.success {
        border-left: 4px solid var(--color-success);
    }
    
    .notification.error {
        border-left: 4px solid var(--color-danger);
    }
    
    .notification.info {
        border-left: 4px solid var(--color-info);
    }
    
    .notification i {
        font-size: 1.25rem;
    }
    
    .notification.success i {
        color: var(--color-success);
    }
    
    .notification.error i {
        color: var(--color-danger);
    }
    
    .notification.info i {
        color: var(--color-info);
    }
`;
document.head.appendChild(style);
