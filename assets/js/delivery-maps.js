// Google Maps Integration for Delivery Tracking
class DeliveryMaps {
    constructor() {
        this.map = null;
        this.directionsService = null;
        this.directionsRenderer = null;
        this.currentLocationMarker = null;
        this.pickupMarker = null;
        this.deliveryMarker = null;
        this.watchId = null;
        this.currentOrder = null;
        
        // Sample delivery data with Nashik locations
        this.deliveryData = {
            'DB001': {
                pickup: { lat: 19.9975, lng: 73.7898, name: 'Spice Garden', address: 'Shop No. 12, College Road, Nashik Road, Nashik' },
                delivery: { lat: 20.0057, lng: 73.7823, name: 'Rahul Deshmukh', address: 'Flat 302, Sai Heritage, College Road, Nashik' }
            },
            'DB002': {
                pickup: { lat: 19.9929, lng: 73.7333, name: 'Taste of Nashik', address: 'Shop 5, Gangapur Road, Panchavati, Nashik' },
                delivery: { lat: 20.0061, lng: 73.7455, name: 'Neha Patil', address: 'B-12, Shreeji Residency, Govind Nagar, Nashik' }
            },
            'DB003': {
                pickup: { lat: 20.0100, lng: 73.7898, name: 'Purohit Bhojanalaya', address: 'Near Dwarka Circle, Nashik Road, Nashik' },
                delivery: { lat: 20.0150, lng: 73.7950, name: 'Vikram Joshi', address: 'A-5, Sai Darshan, Indira Nagar, Nashik' }
            }
        };
        
        this.initializeMap();
        this.setupEventListeners();
    }

    initializeMap() {
        // Default center (Nashik)
        const defaultCenter = { lat: 20.0059, lng: 73.7694 };
        
        // Initialize map
        this.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: defaultCenter,
            styles: this.getMapStyles(),
            disableDefaultUI: true,
            zoomControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false
        });

        // Initialize directions service
        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer({
            suppressMarkers: true,
            polylineOptions: {
                strokeColor: '#1E93AB',
                strokeWeight: 4,
                strokeOpacity: 0.8
            }
        });
        this.directionsRenderer.setMap(this.map);

        // Get current location
        this.getCurrentLocation();
        
        // Load default order
        this.loadOrder('DB001');
        
        // Update order dropdown with Nashik locations
        this.updateOrderDropdown();
        
        // Hide loading overlay
        setTimeout(() => {
            document.getElementById('map-loading').style.display = 'none';
        }, 1500);
    }

    getMapStyles() {
        return [
            {
                "featureType": "all",
                "elementType": "geometry.fill",
                "stylers": [{"weight": "2.00"}]
            },
            {
                "featureType": "all",
                "elementType": "geometry.stroke",
                "stylers": [{"color": "#9c9c9c"}]
            },
            {
                "featureType": "all",
                "elementType": "labels.text",
                "stylers": [{"visibility": "on"}]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [{"color": "#f2f2f2"}]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry.fill",
                "stylers": [{"color": "#ffffff"}]
            },
            {
                "featureType": "landscape.man_made",
                "elementType": "geometry.fill",
                "stylers": [{"color": "#ffffff"}]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [{"saturation": -100}, {"lightness": 45}]
            },
            {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [{"color": "#eeeeee"}]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#7b7b7b"}]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.stroke",
                "stylers": [{"color": "#ffffff"}]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [{"visibility": "simplified"}]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [{"color": "#46bcec"}, {"visibility": "on"}]
            },
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [{"color": "#c8d7d4"}]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#070707"}]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.stroke",
                "stylers": [{"color": "#ffffff"}]
            }
        ];
    }

    getCurrentLocation() {
        if (navigator.geolocation) {
            // Get initial position
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const currentPos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    
                    this.updateCurrentLocationMarker(currentPos);
                    this.map.setCenter(currentPos);
                },
                (error) => {
                    console.warn('Geolocation error:', error);
                    // Use default location if geolocation fails
                    this.updateCurrentLocationMarker({ lat: 19.1136, lng: 72.8697 });
                }
            );

            // Watch position for real-time updates
            this.watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const currentPos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    
                    this.updateCurrentLocationMarker(currentPos);
                    this.updateSpeed(position.coords.speed);
                },
                (error) => {
                    console.warn('Geolocation watch error:', error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                }
            );
        }
    }

    updateCurrentLocationMarker(position) {
        if (this.currentLocationMarker) {
            this.currentLocationMarker.setPosition(position);
        } else {
            this.currentLocationMarker = new google.maps.Marker({
                position: position,
                map: this.map,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: '#4285F4',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2
                },
                title: 'Your Location'
            });
        }
    }

    loadOrder(orderId) {
        this.currentOrder = orderId;
        const orderData = this.deliveryData[orderId];
        
        if (!orderData) return;

        // Clear existing markers
        this.clearMarkers();

        // Create pickup marker
        this.pickupMarker = new google.maps.Marker({
            position: orderData.pickup,
            map: this.map,
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="14" fill="#E62727" stroke="#ffffff" stroke-width="2"/>
                        <text x="16" y="20" text-anchor="middle" fill="white" font-family="FontAwesome" font-size="12">&#xf54e;</text>
                    </svg>
                `),
                scaledSize: new google.maps.Size(32, 32),
                anchor: new google.maps.Point(16, 16)
            },
            title: `Pickup: ${orderData.pickup.name}`
        });

        // Create delivery marker
        this.deliveryMarker = new google.maps.Marker({
            position: orderData.delivery,
            map: this.map,
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="14" fill="#67C090" stroke="#ffffff" stroke-width="2"/>
                        <text x="16" y="20" text-anchor="middle" fill="white" font-family="FontAwesome" font-size="12">&#xf015;</text>
                    </svg>
                `),
                scaledSize: new google.maps.Size(32, 32),
                anchor: new google.maps.Point(16, 16)
            },
            title: `Delivery: ${orderData.delivery.name}`
        });

        // Calculate and display route
        this.calculateRoute(orderData.pickup, orderData.delivery);
        
        // Update order info panel
        this.updateOrderInfo(orderId, orderData);
    }

    calculateRoute(pickup, delivery) {
        const request = {
            origin: pickup,
            destination: delivery,
            travelMode: google.maps.TravelMode.DRIVING,
            avoidHighways: false,
            avoidTolls: false
        };

        this.directionsService.route(request, (result, status) => {
            if (status === 'OK') {
                this.directionsRenderer.setDirections(result);
                
                const route = result.routes[0];
                const leg = route.legs[0];
                
                // Update route information
                this.updateRouteInfo(leg.distance.text, leg.duration.text);
                
                // Update navigation instructions
                this.updateNavigationInstructions(route.legs[0].steps);
                
                // Fit map to show entire route
                const bounds = new google.maps.LatLngBounds();
                bounds.extend(pickup);
                bounds.extend(delivery);
                this.map.fitBounds(bounds);
            } else {
                console.error('Directions request failed:', status);
            }
        });
    }

    updateRouteInfo(distance, duration) {
        const distanceEl = document.getElementById('route-distance');
        const etaEl = document.getElementById('route-eta');
        
        if (distanceEl) distanceEl.textContent = distance;
        if (etaEl) etaEl.textContent = duration;
    }

    updateNavigationInstructions(steps) {
        const instructionsList = document.querySelector('.instructions-list');
        if (!instructionsList) return;

        instructionsList.innerHTML = '';
        
        steps.slice(0, 3).forEach((step, index) => {
            const instruction = document.createElement('div');
            instruction.className = `instruction-item ${index === 0 ? 'current' : ''}`;
            
            const iconClass = this.getInstructionIcon(step.maneuver);
            
            instruction.innerHTML = `
                <div class="instruction-icon">
                    <i class="fas ${iconClass}"></i>
                </div>
                <div class="instruction-text">
                    <span class="instruction-action">${step.instructions.replace(/<[^>]*>/g, '')}</span>
                    <span class="instruction-distance">${step.distance.text}</span>
                </div>
            `;
            
            instructionsList.appendChild(instruction);
        });
    }

    getInstructionIcon(maneuver) {
        const iconMap = {
            'turn-left': 'fa-arrow-left',
            'turn-right': 'fa-arrow-right',
            'turn-slight-left': 'fa-arrow-left',
            'turn-slight-right': 'fa-arrow-right',
            'turn-sharp-left': 'fa-arrow-left',
            'turn-sharp-right': 'fa-arrow-right',
            'uturn-left': 'fa-undo',
            'uturn-right': 'fa-redo',
            'straight': 'fa-arrow-up',
            'ramp-left': 'fa-arrow-left',
            'ramp-right': 'fa-arrow-right',
            'merge': 'fa-code-branch',
            'fork-left': 'fa-arrow-left',
            'fork-right': 'fa-arrow-right',
            'roundabout-left': 'fa-circle',
            'roundabout-right': 'fa-circle'
        };
        
        return iconMap[maneuver] || 'fa-arrow-right';
    }

    updateOrderInfo(orderId, orderData) {
        // Update order ID
        const orderIdEl = document.querySelector('.order-id');
        if (orderIdEl) orderIdEl.textContent = `#${orderId}`;
        
        // Update pickup info
        const pickupName = document.querySelector('.pickup-details .location-name');
        const pickupAddress = document.querySelector('.pickup-details .location-address');
        if (pickupName) pickupName.textContent = orderData.pickup.name;
        if (pickupAddress) pickupAddress.textContent = orderData.pickup.address;
        
        // Update delivery info
        const deliveryName = document.querySelector('.delivery-details .location-name');
        const deliveryAddress = document.querySelector('.delivery-details .location-address');
        if (deliveryName) deliveryName.textContent = orderData.delivery.name;
        if (deliveryAddress) deliveryAddress.textContent = orderData.delivery.address;
    }

    updateOrderDropdown() {
        const dropdown = document.querySelector('.select-dropdown');
        if (!dropdown) return;
        
        // Clear existing options
        dropdown.innerHTML = '';
        
        // Add options from deliveryData
        Object.entries(this.deliveryData).forEach(([id, data]) => {
            const option = document.createElement('div');
            option.className = 'select-option';
            option.setAttribute('data-value', id);
            option.innerHTML = `<span>#${id} - ${data.pickup.name} → ${data.delivery.name}</span>`;
            dropdown.appendChild(option);
            
            // Add click handler
            option.addEventListener('click', () => this.loadOrder(id));
        });
    }

    updateSpeed(speed) {
        const speedEl = document.getElementById('current-speed');
        if (speedEl && speed !== null) {
            const kmh = Math.round(speed * 3.6); // Convert m/s to km/h
            speedEl.textContent = `${kmh} km/h`;
        }
    }

    clearMarkers() {
        if (this.pickupMarker) {
            this.pickupMarker.setMap(null);
            this.pickupMarker = null;
        }
        if (this.deliveryMarker) {
            this.deliveryMarker.setMap(null);
            this.deliveryMarker = null;
        }
    }

    setupEventListeners() {
        // Map control buttons
        const centerBtn = document.getElementById('center-location');
        const trafficBtn = document.getElementById('toggle-traffic');
        const fullscreenBtn = document.getElementById('fullscreen-map');
        
        if (centerBtn) {
            centerBtn.addEventListener('click', () => {
                if (this.currentLocationMarker) {
                    this.map.setCenter(this.currentLocationMarker.getPosition());
                    this.map.setZoom(16);
                }
            });
        }
        
        if (trafficBtn) {
            let trafficLayer = null;
            trafficBtn.addEventListener('click', () => {
                if (trafficLayer) {
                    trafficLayer.setMap(null);
                    trafficLayer = null;
                    trafficBtn.classList.remove('active');
                } else {
                    trafficLayer = new google.maps.TrafficLayer();
                    trafficLayer.setMap(this.map);
                    trafficBtn.classList.add('active');
                }
            });
        }
        
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                const mapContainer = document.getElementById('map-container');
                if (mapContainer.requestFullscreen) {
                    mapContainer.requestFullscreen();
                } else if (mapContainer.webkitRequestFullscreen) {
                    mapContainer.webkitRequestFullscreen();
                } else if (mapContainer.msRequestFullscreen) {
                    mapContainer.msRequestFullscreen();
                }
            });
        }

        // Order selection
        const orderSelect = document.getElementById('current-delivery-select');
        if (orderSelect) {
            const options = orderSelect.querySelectorAll('.select-option');
            options.forEach(option => {
                option.addEventListener('click', () => {
                    const orderId = option.dataset.value;
                    this.loadOrder(orderId);
                });
            });
        }

        // Refresh location button
        const refreshBtn = document.getElementById('refresh-location');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.getCurrentLocation();
                refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
                setTimeout(() => {
                    refreshBtn.innerHTML = '<i class="fas fa-crosshairs"></i> My Location';
                }, 2000);
            });
        }

        // Delivery timer
        this.startDeliveryTimer();
        
        // Battery status
        this.updateBatteryStatus();
    }

    startDeliveryTimer() {
        const timerEl = document.getElementById('delivery-timer');
        if (!timerEl) return;
        
        let seconds = 15 * 60 + 30; // 15:30
        
        setInterval(() => {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            timerEl.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
            seconds++;
        }, 1000);
    }

    updateBatteryStatus() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then((battery) => {
                const updateBattery = () => {
                    const batteryEl = document.getElementById('device-battery');
                    if (batteryEl) {
                        const level = Math.round(battery.level * 100);
                        batteryEl.textContent = `${level}%`;
                    }
                };
                
                updateBattery();
                battery.addEventListener('levelchange', updateBattery);
            });
        }
    }
}

// Delivery action functions
function callProvider() {
    showNotification('Calling provider...', 'info');
    // In a real app, this would initiate a phone call
}

function callCustomer() {
    showNotification('Calling customer...', 'info');
    // In a real app, this would initiate a phone call
}

function navigateToPickup() {
    showNotification('Opening navigation to pickup location', 'info');
    // In a real app, this would open the device's navigation app
}

function navigateToDelivery() {
    showNotification('Opening navigation to delivery location', 'info');
    // In a real app, this would open the device's navigation app
}

function markDispatched() {
    const dispatchedBtn = document.getElementById('mark-dispatched');
    const deliveredBtn = document.getElementById('mark-delivered');
    
    if (dispatchedBtn && deliveredBtn) {
        dispatchedBtn.style.display = 'none';
        deliveredBtn.style.display = 'block';
        
        // Update order status
        const statusEl = document.querySelector('.order-status');
        if (statusEl) {
            statusEl.innerHTML = '<i class="fas fa-shipping-fast"></i> Dispatched';
            statusEl.className = 'order-status dispatched';
        }
        
        showNotification('Order marked as dispatched! 🚚', 'success');
    }
}

function markDelivered() {
    const modal = document.getElementById('delivery-confirmation-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Initialize Google Maps callback
function initMap() {
    new DeliveryMaps();
}

// Fallback initialization if Google Maps fails to load
document.addEventListener('DOMContentLoaded', () => {
    // Check if Google Maps loaded
    setTimeout(() => {
        if (typeof google === 'undefined') {
            console.warn('Google Maps failed to load, using fallback map');
            document.getElementById('map-loading').innerHTML = `
                <div class="map-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Map service unavailable</p>
                    <small>Please check your internet connection</small>
                </div>
            `;
        }
    }, 5000);
    
    // Setup modal functionality
    setupDeliveryModal();
});

function setupDeliveryModal() {
    const modal = document.getElementById('delivery-confirmation-modal');
    const closeBtn = document.getElementById('close-delivery-modal');
    const cancelBtn = document.getElementById('cancel-delivery');
    const confirmBtn = document.getElementById('confirm-delivery');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            const otp = document.getElementById('delivery-otp').value;
            const notes = document.getElementById('delivery-notes').value;
            
            // Simulate delivery confirmation
            modal.style.display = 'none';
            
            // Update order status
            const statusEl = document.querySelector('.order-status');
            if (statusEl) {
                statusEl.innerHTML = '<i class="fas fa-check-circle"></i> Delivered';
                statusEl.className = 'order-status delivered';
            }
            
            showNotification('Delivery confirmed successfully! 🎉', 'success');
            
            // Redirect to dashboard after delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        });
    }
}

// Add map-specific CSS
const mapStyles = document.createElement('style');
mapStyles.textContent = `
    .map-controls {
        position: absolute;
        top: 20px;
        right: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 1000;
    }
    
    .map-control-btn {
        width: 44px;
        height: 44px;
        background: var(--glass-bg);
        backdrop-filter: blur(10px);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-xl);
        color: var(--text-primary);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.125rem;
        transition: all var(--transition-normal);
        box-shadow: var(--shadow-sm);
    }
    
    .map-control-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }
    
    .map-control-btn.active {
        background: var(--primary-gradient);
        color: white;
    }
    
    .map-loading {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--glass-bg);
        backdrop-filter: blur(20px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--space-lg);
        border-radius: 16px;
        z-index: 1000;
    }
    
    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-top: 3px solid var(--color-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .map-error {
        text-align: center;
        color: var(--text-secondary);
    }
    
    .map-error i {
        font-size: 2rem;
        color: var(--color-warning);
        margin-bottom: var(--space-md);
    }
`;
document.head.appendChild(mapStyles);
