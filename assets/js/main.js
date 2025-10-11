// Global JavaScript functions

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    const themeToggle = document.getElementById('theme-toggle');
    const mainHeader = document.querySelector('.main-header');
    const navLinks = document.querySelectorAll('.nav-links a');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mainNav = document.querySelector('.main-nav');

    // Theme Toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            themeToggle.querySelector('i').className = isDark ? 'fas fa-moon' : 'fas fa-sun';
        });

        // Apply saved theme preference
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.querySelector('i').className = 'fas fa-moon';
        } else {
            themeToggle.querySelector('i').className = 'fas fa-sun';
        }
    }

    // Sticky Header on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    });

    // Smooth Scroll for Navigation Links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - mainHeader.offsetHeight,
                    behavior: 'smooth'
                });
                // Close mobile nav if open
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                }
            }
        });
    });

    // Hamburger Menu Toggle
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }

    // Highlight active section on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - mainHeader.offsetHeight;
            if (pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Initial scroll check to set active link and header style
    window.dispatchEvent(new Event('scroll'));

    // Load providers dynamically for showcase
    fetch('assets/data/providers.json')
        .then(response => response.json())
        .then(providers => {
            const providerShowcase = document.getElementById('provider-showcase');
            if (providerShowcase) {
                providers.forEach(provider => {
                    const providerCard = `
                        <div class="provider-card">
                            <img src="assets/images/mess-placeholder.jpg" alt="${provider.name}">
                            <h3>${provider.name}</h3>
                            <p>${provider.cuisine}</p>
                            <div class="rating">
                                ${'<i class="fas fa-star"></i>'.repeat(Math.floor(provider.rating))}
                                ${provider.rating % 1 !== 0 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                                (${provider.rating})
                            </div>
                        </div>
                    `;
                    providerShowcase.innerHTML += providerCard;
                });
            }
        })
        .catch(error => console.error('Error loading providers:', error));
});
