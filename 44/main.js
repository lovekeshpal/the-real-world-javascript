document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    const wishlistCount = document.getElementById('wishlistCount');
    const wishlistDrawer = document.getElementById('wishlistDrawer');
    const wishlistItems = document.getElementById('wishlistItems');
    const viewWishlistBtn = document.getElementById('viewWishlist');
    const closeWishlistBtn = document.getElementById('closeWishlist');
    const notificationPopup = document.getElementById('notificationPopup');
    const notificationContent = document.getElementById('notificationContent');
    
    // Store wishlist data
    let wishlist = [];
    
    // Load wishlist from localStorage
    function loadWishlist() {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
            wishlist = JSON.parse(savedWishlist);
            updateWishlistUI();
        }
    }
    
    // Save wishlist to localStorage
    function saveWishlist() {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
    
    // Update UI to reflect wishlist state
    function updateWishlistUI() {
        // Update heart icons on product cards
        wishlistButtons.forEach(button => {
            const productId = button.getAttribute('data-product-id');
            if (wishlist.includes(productId)) {
                button.classList.add('active');
                button.innerHTML = '<i class="fas fa-heart"></i>';
            } else {
                button.classList.remove('active');
                button.innerHTML = '<i class="far fa-heart"></i>';
            }
        });
        
        // Update wishlist count
        wishlistCount.textContent = wishlist.length;
        
        // Update wishlist drawer content
        updateWishlistDrawer();
    }
    
    // Toggle product in wishlist
    function toggleWishlist(productId) {
        const index = wishlist.indexOf(productId);
        let message = '';
        let icon = '';
        
        if (index === -1) {
            // Add to wishlist
            wishlist.push(productId);
            message = 'Product added to wishlist';
            icon = '<i class="fas fa-heart text-danger mr-2"></i>';
            showNotification(message, icon, 'success');
        } else {
            // Remove from wishlist
            wishlist.splice(index, 1);
            message = 'Product removed from wishlist';
            icon = '<i class="far fa-heart mr-2"></i>';
            showNotification(message, icon, 'info');
        }
        
        saveWishlist();
        updateWishlistUI();
    }
    
    // Update wishlist drawer content
    function updateWishlistDrawer() {
        if (wishlist.length === 0) {
            // Show empty state
            wishlistItems.innerHTML = `
                <div class="empty-wishlist text-center">
                    <div class="empty-wishlist-icon">
                        <i class="far fa-heart"></i>
                    </div>
                    <p>Your wishlist is empty</p>
                    <p class="text-muted small">Click the heart icon on products to add them to your wishlist</p>
                </div>
            `;
            return;
        }
        
        // Clear current items
        wishlistItems.innerHTML = '';
        
        // Add each product
        wishlist.forEach(productId => {
            // Get product data from the DOM (in a real app, you might fetch from an API)
            const productCard = document.querySelector(`.product-card[data-product-id="${productId}"]`);
            const productImage = productCard.querySelector('img').src;
            const productTitle = productCard.querySelector('h5').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            
            // Create wishlist item
            const wishlistItem = document.createElement('div');
            wishlistItem.className = 'wishlist-item';
            wishlistItem.innerHTML = `
                <div class="wishlist-item-image">
                    <img src="${productImage}" alt="${productTitle}">
                </div>
                <div class="wishlist-item-details">
                    <h5 class="wishlist-item-title">${productTitle}</h5>
                    <div class="wishlist-item-price">${productPrice}</div>
                    <button class="btn btn-sm btn-primary mt-2">
                        <i class="fas fa-shopping-cart mr-1"></i> Add to Cart
                    </button>
                </div>
                <button class="wishlist-item-remove" data-product-id="${productId}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            // Add remove functionality
            const removeButton = wishlistItem.querySelector('.wishlist-item-remove');
            removeButton.addEventListener('click', function() {
                toggleWishlist(this.getAttribute('data-product-id'));
            });
            
            // Add to drawer
            wishlistItems.appendChild(wishlistItem);
        });
    }
    
    // Show notification popup
    function showNotification(message, icon, type) {
        notificationContent.innerHTML = `${icon}${message}`;
        notificationContent.className = `notification-content notification-${type}`;
        notificationPopup.classList.add('show');
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            notificationPopup.classList.remove('show');
        }, 3000);
    }
    
    // Toggle wishlist drawer
    function toggleWishlistDrawer() {
        wishlistDrawer.classList.toggle('active');
        
        // Toggle overlay
        let overlay = document.querySelector('.overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'overlay';
            document.body.appendChild(overlay);
            
            // Close drawer when clicking overlay
            overlay.addEventListener('click', toggleWishlistDrawer);
        }
        
        overlay.classList.toggle('active');
    }
    
    // Attach event listeners
    
    // Wishlist toggle buttons
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productId = this.getAttribute('data-product-id');
            
            // Add animation class
            this.classList.add('animate');
            setTimeout(() => {
                this.classList.remove('animate');
            }, 400);
            
            toggleWishlist(productId);
        });
    });
    
    // View wishlist button
    viewWishlistBtn.addEventListener('click', toggleWishlistDrawer);
    
    // Close wishlist button
    closeWishlistBtn.addEventListener('click', toggleWishlistDrawer);
    
    // Initialize
    loadWishlist();
});