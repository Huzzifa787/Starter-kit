// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Sanitize input to prevent XSS attacks
 */
function sanitizeInput(input) {
    const temp = document.createElement('div');
    temp.textContent = input;
    return temp.innerHTML;
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show alert dialog
 */
function showAlert(message) {
    alert(message);
}

// ========================================
// MOBILE NAVIGATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navLinks.contains(event.target)) {
                navLinks.classList.remove('active');
            }
        });
    }
});

// ========================================
// NEWSLETTER SUBSCRIPTION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletterForm');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailInput = document.getElementById('newsletterEmail');
            const email = emailInput.value.trim();

            // Validate email
            if (!email) {
                showAlert('Please enter an email address.');
                return;
            }

            if (!isValidEmail(email)) {
                showAlert('Please enter a valid email address.');
                return;
            }

            // Success
            showAlert('Thank you for subscribing to our newsletter!');
            emailInput.value = '';
        });
    }
});

// ========================================
// SHOPPING CART FUNCTIONALITY
// ========================================

/**
 * Get cart from localStorage
 */
function getCart() {
    const cart = localStorage.getItem('bloomValleyCart');
    return cart ? JSON.parse(cart) : [];
}

/**
 * Save cart to localStorage
 */
function saveCart(cart) {
    localStorage.setItem('bloomValleyCart', JSON.stringify(cart));
}

/**
 * Update cart count display
 */
function updateCartCount() {
    const cart = getCart();
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
}

/**
 * Add item to cart
 */
function addToCart(id, name, price) {
    const cart = getCart();

    // Create cart item
    const item = {
        id: sanitizeInput(id),
        name: sanitizeInput(name),
        price: parseFloat(price)
    };

    // Add to cart
    cart.push(item);
    saveCart(cart);
    updateCartCount();

    // Show confirmation
    showAlert('Item added.');
}

/**
 * Render cart items in modal
 */
function renderCartItems() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');

    if (!cartItemsContainer) return;

    // Clear container
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="body" style="text-align: center; padding: 20px;">Your cart is empty.</p>';
        cartTotalElement.textContent = '0.00';
        return;
    }

    // Calculate total
    let total = 0;

    // Render each item
    cart.forEach(item => {
        total += item.price;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <p class="body-strong">${item.name}</p>
                <p class="body">$${item.price.toFixed(2)}</p>
            </div>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    // Update total
    cartTotalElement.textContent = total.toFixed(2);
}

/**
 * Clear cart
 */
function clearCart() {
    localStorage.removeItem('bloomValleyCart');
    updateCartCount();
    renderCartItems();
}

/**
 * Process order
 */
function processOrder() {
    const cart = getCart();

    if (cart.length === 0) {
        showAlert('Your cart is empty.');
        return;
    }

    showAlert('Thank you for your order.');
    clearCart();
    closeCartModal();
}

/**
 * Open cart modal
 */
function openCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        renderCartItems();
        modal.classList.add('active');

        // Focus trap
        modal.focus();
    }
}

/**
 * Close cart modal
 */
function closeCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Initialize cart functionality on gallery page
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count on page load
    updateCartCount();

    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.btn-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = this.getAttribute('data-price');
            addToCart(id, name, price);
        });
    });

    // View cart button
    const viewCartBtn = document.getElementById('viewCartBtn');
    if (viewCartBtn) {
        viewCartBtn.addEventListener('click', openCartModal);
    }

    // Close modal button
    const closeModalBtn = document.getElementById('closeModal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeCartModal);
    }

    // Clear cart button
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear your cart?')) {
                clearCart();
            }
        });
    }

    // Process order button
    const processOrderBtn = document.getElementById('processOrderBtn');
    if (processOrderBtn) {
        processOrderBtn.addEventListener('click', processOrder);
    }

    // Close modal when clicking outside
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.addEventListener('click', function(e) {
            if (e.target === cartModal) {
                closeCartModal();
            }
        });
    }

    // Close modal with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCartModal();
        }
    });
});

// ========================================
// CONTACT FORM (ABOUT PAGE)
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();

            // Validate required fields
            if (!name) {
                showAlert('Please enter your name.');
                return;
            }

            if (!email) {
                showAlert('Please enter your email address.');
                return;
            }

            if (!isValidEmail(email)) {
                showAlert('Please enter a valid email address.');
                return;
            }

            if (!message) {
                showAlert('Please enter a message.');
                return;
            }

            // Sanitize inputs
            const sanitizedData = {
                name: sanitizeInput(name),
                email: sanitizeInput(email),
                phone: sanitizeInput(phone),
                message: sanitizeInput(message),
                timestamp: new Date().toISOString()
            };

            // Store in localStorage
            try {
                // Get existing submissions
                let submissions = localStorage.getItem('bloomValleySubmissions');
                submissions = submissions ? JSON.parse(submissions) : [];

                // Add new submission
                submissions.push(sanitizedData);

                // Save back to localStorage
                localStorage.setItem('bloomValleySubmissions', JSON.stringify(submissions));

                // Show success message
                showAlert('Form submitted successfully.');

                // Reset form
                contactForm.reset();

            } catch (error) {
                showAlert('An error occurred. Please try again.');
                console.error('Form submission error:', error);
            }
        });
    }
});

// ========================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            // Skip if it's just "#"
            if (targetId === '#') {
                e.preventDefault();
                return;
            }

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Add keyboard navigation support for cards
    const cards = document.querySelectorAll('.category-card, .highlight-card, .event-card');

    cards.forEach(card => {
        card.setAttribute('tabindex', '0');

        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                this.click();
            }
        });
    });
});
