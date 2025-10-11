// Authentication-related scripts

document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    const roleTabs = document.querySelectorAll('.role-tab');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const roleFields = document.querySelectorAll('.role-fields');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginRoleSelect = document.getElementById('loginRole');
    
    // Get role from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get('role');
    
    let currentRole = 'customer';
    let currentForm = 'login';

    // Initialize page based on URL parameters
    if (roleParam && ['customer', 'provider', 'delivery'].includes(roleParam)) {
        currentRole = roleParam;
        switchToRole(roleParam);
    }

    // Role switching functionality
    roleTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const role = tab.getAttribute('data-role');
            switchToRole(role);
        });
    });

    function switchToRole(role) {
        currentRole = role;
        
        // Update role tab active state
        roleTabs.forEach(tab => {
            const isActive = tab.getAttribute('data-role') === role;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive);
        });

        // Update role fields visibility
        roleFields.forEach(field => {
            const isActive = field.getAttribute('data-role') === role;
            field.classList.toggle('active', isActive);
            if (isActive) {
                field.setAttribute('aria-hidden', 'false');
            } else {
                field.setAttribute('aria-hidden', 'true');
            }
        });

        // Update login role select
        if (loginRoleSelect) {
            loginRoleSelect.value = role;
        }
    }

    // Auth form switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const form = tab.getAttribute('data-form');
            switchToForm(form);
        });
    });

    function switchToForm(form) {
        currentForm = form;
        
        // Update auth tab active state
        authTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-form') === form) {
                tab.classList.add('active');
            }
        });

        // Update form visibility
        authForms.forEach(formEl => {
            formEl.classList.remove('active');
            if (formEl.id === form + 'Form') {
                formEl.classList.add('active');
            }
        });
    }

    // Form validation functions
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password) {
        return password.length >= 6;
    }

    function validatePhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        let errorElement = formGroup.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.color = 'var(--color-primary-red)';
            errorElement.style.fontSize = '0.85em';
            errorElement.style.marginTop = '5px';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        input.style.borderColor = 'var(--color-primary-red)';
    }

    function clearError(input) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        input.style.borderColor = 'var(--color-border-light)';
    }

    // Login form handling
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            const role = document.getElementById('loginRole').value;

            // Clear previous errors
            clearError(document.getElementById('loginEmail'));
            clearError(document.getElementById('loginPassword'));

            let isValid = true;

            // Validate email
            if (!email) {
                showError(document.getElementById('loginEmail'), 'Email/Phone is required');
                isValid = false;
            } else if (!validateEmail(email) && !validatePhone(email)) {
                showError(document.getElementById('loginEmail'), 'Please enter a valid email or phone number');
                isValid = false;
            }

            // Validate password
            if (!password) {
                showError(document.getElementById('loginPassword'), 'Password is required');
                isValid = false;
            } else if (!validatePassword(password)) {
                showError(document.getElementById('loginPassword'), 'Password must be at least 6 characters');
                isValid = false;
            }

            if (isValid) {
                // Store user data in localStorage for demo
                const userData = {
                    email: email,
                    role: role,
                    loginTime: new Date().toISOString()
                };
                localStorage.setItem('user', JSON.stringify(userData));
                
                // Redirect based on role
                redirectToDashboard(role);
            }
        });
    }

    // Register form handling
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(registerForm);
            const role = currentRole;
            
            let isValid = true;

            // Clear previous errors
            const allInputs = registerForm.querySelectorAll('input, select, textarea');
            allInputs.forEach(input => clearError(input));

            // Role-specific validation
            if (role === 'customer') {
                const name = document.getElementById('customerName').value.trim();
                const email = document.getElementById('customerEmail').value.trim();
                const password = document.getElementById('customerPassword').value;
                const confirmPassword = document.getElementById('customerConfirmPassword').value;
                const address = document.getElementById('customerAddress').value.trim();

                if (!name) {
                    showError(document.getElementById('customerName'), 'Name is required');
                    isValid = false;
                }

                if (!email) {
                    showError(document.getElementById('customerEmail'), 'Email is required');
                    isValid = false;
                } else if (!validateEmail(email)) {
                    showError(document.getElementById('customerEmail'), 'Please enter a valid email');
                    isValid = false;
                }

                if (!password) {
                    showError(document.getElementById('customerPassword'), 'Password is required');
                    isValid = false;
                } else if (!validatePassword(password)) {
                    showError(document.getElementById('customerPassword'), 'Password must be at least 6 characters');
                    isValid = false;
                }

                if (password !== confirmPassword) {
                    showError(document.getElementById('customerConfirmPassword'), 'Passwords do not match');
                    isValid = false;
                }

                if (!address) {
                    showError(document.getElementById('customerAddress'), 'Address is required');
                    isValid = false;
                }

            } else if (role === 'provider') {
                const messName = document.getElementById('providerMessName').value.trim();
                const ownerName = document.getElementById('providerOwnerName').value.trim();
                const email = document.getElementById('providerEmail').value.trim();
                const password = document.getElementById('providerPassword').value;
                const address = document.getElementById('providerAddress').value.trim();
                const certificate = document.getElementById('hygieneCertificate').files[0];

                if (!messName) {
                    showError(document.getElementById('providerMessName'), 'Mess/Shop name is required');
                    isValid = false;
                }

                if (!ownerName) {
                    showError(document.getElementById('providerOwnerName'), 'Owner name is required');
                    isValid = false;
                }

                if (!email) {
                    showError(document.getElementById('providerEmail'), 'Email is required');
                    isValid = false;
                } else if (!validateEmail(email)) {
                    showError(document.getElementById('providerEmail'), 'Please enter a valid email');
                    isValid = false;
                }

                if (!password) {
                    showError(document.getElementById('providerPassword'), 'Password is required');
                    isValid = false;
                } else if (!validatePassword(password)) {
                    showError(document.getElementById('providerPassword'), 'Password must be at least 6 characters');
                    isValid = false;
                }

                if (!address) {
                    showError(document.getElementById('providerAddress'), 'Address is required');
                    isValid = false;
                }

                if (!certificate) {
                    showError(document.getElementById('hygieneCertificate'), 'Hygiene certificate is required');
                    isValid = false;
                }

            } else if (role === 'delivery') {
                const name = document.getElementById('deliveryName').value.trim();
                const email = document.getElementById('deliveryEmail').value.trim();
                const password = document.getElementById('deliveryPassword').value;
                const phone = document.getElementById('deliveryPhone').value.trim();
                const vehicleNumber = document.getElementById('vehicleNumber').value.trim();
                const license = document.getElementById('licenseUpload').files[0];

                if (!name) {
                    showError(document.getElementById('deliveryName'), 'Name is required');
                    isValid = false;
                }

                if (!email) {
                    showError(document.getElementById('deliveryEmail'), 'Email is required');
                    isValid = false;
                } else if (!validateEmail(email)) {
                    showError(document.getElementById('deliveryEmail'), 'Please enter a valid email');
                    isValid = false;
                }

                if (!password) {
                    showError(document.getElementById('deliveryPassword'), 'Password is required');
                    isValid = false;
                } else if (!validatePassword(password)) {
                    showError(document.getElementById('deliveryPassword'), 'Password must be at least 6 characters');
                    isValid = false;
                }

                if (!phone) {
                    showError(document.getElementById('deliveryPhone'), 'Phone number is required');
                    isValid = false;
                } else if (!validatePhone(phone)) {
                    showError(document.getElementById('deliveryPhone'), 'Please enter a valid phone number');
                    isValid = false;
                }

                if (!vehicleNumber) {
                    showError(document.getElementById('vehicleNumber'), 'Vehicle number is required');
                    isValid = false;
                }

                if (!license) {
                    showError(document.getElementById('licenseUpload'), 'License upload is required');
                    isValid = false;
                }
            }

            // Check terms agreement
            const termsCheckbox = registerForm.querySelector('input[name="terms"]');
            if (!termsCheckbox.checked) {
                showError(termsCheckbox, 'You must agree to the terms and conditions');
                isValid = false;
            }

            if (isValid) {
                // Store user data in localStorage for demo
                const userData = {
                    role: role,
                    registrationTime: new Date().toISOString(),
                    formData: Object.fromEntries(formData)
                };
                localStorage.setItem('user', JSON.stringify(userData));
                
                // Redirect based on role
                redirectToDashboard(role);
            }
        });
    }

    // Redirect to appropriate dashboard
    function redirectToDashboard(role) {
        console.log(`Redirecting to ${role} dashboard`);
        
        // Add a small delay to show success state
        setTimeout(() => {
            if (role === 'customer') {
                window.location.href = 'customer/home.html';
            } else if (role === 'provider') {
                window.location.href = 'provider/dashboard.html';
            } else if (role === 'delivery') {
                window.location.href = 'delivery/dashboard.html';
            }
        }, 500);
    }

    // Social login buttons (demo functionality)
    const socialButtons = document.querySelectorAll('.btn-social');
    socialButtons.forEach(button => {
        button.addEventListener('click', () => {
            const provider = button.classList.contains('btn-google') ? 'Google' : 'Facebook';
            alert(`${provider} login would be implemented here. For demo, please use the regular login form.`);
        });
    });

    // Forgot password link
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Password reset functionality would be implemented here. Please contact support for assistance.');
        });
    }

    // Real-time validation
    const allInputs = document.querySelectorAll('input, select, textarea');
    allInputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.type === 'email' && input.value) {
                if (!validateEmail(input.value)) {
                    showError(input, 'Please enter a valid email address');
                } else {
                    clearError(input);
                }
            }
            
            if (input.type === 'password' && input.value) {
                if (!validatePassword(input.value)) {
                    showError(input, 'Password must be at least 6 characters');
                } else {
                    clearError(input);
                }
            }
        });

        input.addEventListener('input', () => {
            clearError(input);
        });
    });
});