// Customer-specific logic

// Global variables
let providers = [];
let filteredProviders = [];
let activeFilters = {
    cuisine: [],
    diet: [],
    priceRange: 400,
    verified: false,
    search: ''
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('Customer-specific script loaded.');
    
    // Initialize the app
    initializeApp();
});

async function initializeApp() {
    try {
        // Load provider data
        await loadProviders();
        
        // Initialize UI components
        initializeFilters();
        initializeSearch();
        
        // Display providers
        displayProviders(providers);
        
        // Update provider count
        updateProviderCount(providers.length);
        
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

async function loadProviders() {
    try {
        const response = await fetch('../assets/data/providers.json');
        providers = await response.json();
        filteredProviders = [...providers];
    } catch (error) {
        console.error('Error loading providers:', error);
        providers = [];
        filteredProviders = [];
    }
}

function initializeFilters() {
    // Cuisine filters
    const cuisineCheckboxes = document.querySelectorAll('input[name="cuisine"]');
    cuisineCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleCuisineFilter);
    });
    
    // Diet filters
    const dietCheckboxes = document.querySelectorAll('input[name="diet"]');
    dietCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleDietFilter);
    });
    
    // Price range filter
    const priceSlider = document.getElementById('price-slider');
    if (priceSlider) {
        priceSlider.addEventListener('input', handlePriceFilter);
    }
    
    // Verified filter
    const verifiedCheckbox = document.getElementById('verified-only');
    if (verifiedCheckbox) {
        verifiedCheckbox.addEventListener('change', handleVerifiedFilter);
    }
    
    // Apply filters button
    const applyBtn = document.getElementById('apply-filters');
    if (applyBtn) {
        applyBtn.addEventListener('click', applyFilters);
    }
    
    // Reset filters button
    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
}

function initializeSearch() {
    const searchInput = document.getElementById('sidebar-search');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    const mainSearchInput = document.getElementById('search-input');
    if (mainSearchInput) {
        mainSearchInput.addEventListener('input', handleSearch);
    }
}

function handleCuisineFilter(event) {
    const cuisine = event.target.value;
    if (event.target.checked) {
        if (!activeFilters.cuisine.includes(cuisine)) {
            activeFilters.cuisine.push(cuisine);
        }
    } else {
        activeFilters.cuisine = activeFilters.cuisine.filter(c => c !== cuisine);
    }
}

function handleDietFilter(event) {
    const diet = event.target.value;
    if (event.target.checked) {
        if (!activeFilters.diet.includes(diet)) {
            activeFilters.diet.push(diet);
        }
    } else {
        activeFilters.diet = activeFilters.diet.filter(d => d !== diet);
    }
}

function handlePriceFilter(event) {
    activeFilters.priceRange = parseInt(event.target.value);
    updatePriceDisplay(activeFilters.priceRange);
}

function handleVerifiedFilter(event) {
    activeFilters.verified = event.target.checked;
}

function handleSearch(event) {
    activeFilters.search = event.target.value.toLowerCase();
    applyFilters();
}

function updatePriceDisplay(value) {
    const priceLabels = document.querySelector('.price-labels');
    if (priceLabels) {
        priceLabels.innerHTML = `<span>₹0</span><span>₹${value}</span>`;
    }
}

function applyFilters() {
    filteredProviders = providers.filter(provider => {
        // Cuisine filter
        if (activeFilters.cuisine.length > 0) {
            const providerCuisine = provider.cuisine.toLowerCase().replace(' ', '-');
            if (!activeFilters.cuisine.includes(providerCuisine)) {
                return false;
            }
        }
        
        // Price filter
        const minPrice = Math.min(
            provider.plans.daily.lunch,
            provider.plans.daily.dinner
        );
        if (minPrice > activeFilters.priceRange) {
            return false;
        }
        
        // Verified filter
        if (activeFilters.verified && !provider.hygieneBadge) {
            return false;
        }
        
        // Search filter
        if (activeFilters.search) {
            const searchTerm = activeFilters.search;
            const searchableText = `${provider.name} ${provider.cuisine} ${provider.description}`.toLowerCase();
            if (!searchableText.includes(searchTerm)) {
                return false;
            }
        }
        
        return true;
    });
    
    displayProviders(filteredProviders);
    updateProviderCount(filteredProviders.length);
    updateActiveFilterTags();
}

function resetFilters() {
    // Reset all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Reset price slider
    const priceSlider = document.getElementById('price-slider');
    if (priceSlider) {
        priceSlider.value = 400;
        updatePriceDisplay(400);
    }
    
    // Reset search
    document.querySelectorAll('input[type="text"]').forEach(input => {
        input.value = '';
    });
    
    // Reset active filters
    activeFilters = {
        cuisine: [],
        diet: [],
        priceRange: 400,
        verified: false,
        search: ''
    };
    
    // Show all providers
    filteredProviders = [...providers];
    displayProviders(filteredProviders);
    updateProviderCount(filteredProviders.length);
    updateActiveFilterTags();
}

function displayProviders(providersToShow) {
    const grid = document.getElementById('providers-grid');
    const loading = document.getElementById('loading-spinner');
    const noResults = document.getElementById('no-results');
    
    if (!grid) return;
    
    // Show loading
    if (loading) loading.style.display = 'block';
    if (noResults) noResults.style.display = 'none';
    
    // Clear existing content
    grid.innerHTML = '';
    
    setTimeout(() => {
        if (loading) loading.style.display = 'none';
        
        if (providersToShow.length === 0) {
            if (noResults) noResults.style.display = 'block';
            return;
        }
        
        providersToShow.forEach(provider => {
            const card = createProviderCard(provider);
            grid.appendChild(card);
        });
    }, 500);
}

function createProviderCard(provider) {
    const card = document.createElement('div');
    card.className = 'provider-card-modern';
    card.onclick = () => goToProvider(provider.id);
    
    const stars = generateStars(provider.rating);
    const cuisineTag = provider.cuisine.charAt(0).toUpperCase() + provider.cuisine.slice(1);
    
    card.innerHTML = `
        <div class="provider-image-modern" style="background-image: url('${provider.image || '../assets/images/hero-bg.jpg'}')">
            ${provider.hygieneBadge ? '<div class="verified-badge"><i class="fas fa-check-circle"></i> Verified</div>' : ''}
        </div>
        <div class="provider-info-modern">
            <h3 class="provider-name-modern">${provider.name}</h3>
            <div class="provider-rating-modern">
                <div class="rating-stars">${stars}</div>
                <span class="rating-count">${provider.rating} • ${provider.totalReviews || 0}+ reviews</span>
            </div>
            <p class="provider-description-modern">${provider.description}</p>
            <div class="provider-tags">
                <span class="cuisine-tag-modern">${cuisineTag}</span>
                <span class="cuisine-tag-modern">Vegetarian</span>
            </div>
            <div class="provider-meta-modern">
                <span><i class="fas fa-clock"></i> ${provider.deliveryTime}</span>
                <span><i class="fas fa-map-marker-alt"></i> ${provider.location}</span>
            </div>
            <button class="view-menu-btn">View Menu</button>
        </div>
    `;
    
    return card;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function updateProviderCount(count) {
    const countElement = document.getElementById('provider-count');
    if (countElement) {
        countElement.textContent = count;
    }
}

function updateActiveFilterTags() {
    const activeFiltersContainer = document.getElementById('active-filters');
    if (!activeFiltersContainer) return;
    
    activeFiltersContainer.innerHTML = '';
    
    // Add cuisine filters
    activeFilters.cuisine.forEach(cuisine => {
        const tag = createFilterTag(cuisine.replace('-', ' '), () => {
            removeFilter('cuisine', cuisine);
        });
        activeFiltersContainer.appendChild(tag);
    });
    
    // Add diet filters
    activeFilters.diet.forEach(diet => {
        const tag = createFilterTag(diet.replace('-', ' '), () => {
            removeFilter('diet', diet);
        });
        activeFiltersContainer.appendChild(tag);
    });
    
    // Add verified filter
    if (activeFilters.verified) {
        const tag = createFilterTag('Verified Only', () => {
            removeFilter('verified');
        });
        activeFiltersContainer.appendChild(tag);
    }
}

function createFilterTag(text, onRemove) {
    const tag = document.createElement('span');
    tag.className = 'filter-tag';
    tag.innerHTML = `${text.charAt(0).toUpperCase() + text.slice(1)} <i class="fas fa-times"></i>`;
    
    const removeBtn = tag.querySelector('i');
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        onRemove();
    });
    
    return tag;
}

function removeFilter(type, value) {
    switch (type) {
        case 'cuisine':
            activeFilters.cuisine = activeFilters.cuisine.filter(c => c !== value);
            document.querySelector(`input[value="${value}"][name="cuisine"]`).checked = false;
            break;
        case 'diet':
            activeFilters.diet = activeFilters.diet.filter(d => d !== value);
            document.querySelector(`input[value="${value}"][name="diet"]`).checked = false;
            break;
        case 'verified':
            activeFilters.verified = false;
            document.getElementById('verified-only').checked = false;
            break;
    }
    
    applyFilters();
}

function goToProvider(providerId) {
    window.location.href = `provider.html?id=${providerId}`;
}

// Navigation functions
function goToCart() {
    window.location.href = 'cart.html';
}

function goToProfile() {
    window.location.href = 'profile.html';
}

// Export functions for global access
window.goToCart = goToCart;
window.goToProfile = goToProfile;

