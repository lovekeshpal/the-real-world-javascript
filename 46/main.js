document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const productsContainer = document.getElementById('productsContainer');
  const loadingSpinner = document.getElementById('loadingSpinner');
  const cartItems = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  const emptyCartMessage = document.getElementById('emptyCartMessage');
  const cartSummary = document.getElementById('cartSummary');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const statusMessage = document.getElementById('statusMessage');
  
  // Modal elements
  const productModal = document.getElementById('productModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalLoading = document.getElementById('modalLoading');
  const modalContent = document.getElementById('modalContent');
  const modalImage = document.getElementById('modalImage');
  const modalProductName = document.getElementById('modalProductName');
  const modalPrice = document.getElementById('modalPrice');
  const modalStock = document.getElementById('modalStock');
  const modalDescription = document.getElementById('modalDescription');
  const modalQuantity = document.getElementById('modalQuantity');
  const decreaseQuantity = document.getElementById('decreaseQuantity');
  const increaseQuantity = document.getElementById('increaseQuantity');
  const modalAddToCart = document.getElementById('modalAddToCart');
  
  // Sort elements
  const sortDropdown = document.getElementById('sortDropdown');
  const sortOptions = document.querySelectorAll('[data-sort]');
  
  // Product data
  let products = [];
  let cart = [];
  let currentProduct = null;
  
  // Initialize
  init();
  
  // Initialize the app
  async function init() {
    try {
      // Load products
      await loadProducts();
      
      // Set up event listeners
      setupEventListeners();
      
      // Load cart from localStorage
      loadCart();
    } catch (error) {
      showStatusMessage('Error initializing app: ' + error.message, 'danger');
    }
  }
  
  // Load products from API (simulated)
  async function loadProducts() {
    try {
      // Show loading spinner
      loadingSpinner.style.display = 'block';
      productsContainer.innerHTML = '';
      
      // Simulate API call with delay
      const response = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            status: 200,
            json: () => Promise.resolve([
              {
                id: 1,
                name: 'Wireless Headphones',
                price: 99.99,
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
                description: 'Premium wireless headphones with noise cancellation technology and 30-hour battery life.',
                stock: 15
              },
              {
                id: 2,
                name: 'Smart Watch',
                price: 149.99,
                image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500',
                description: 'Track your fitness goals, receive notifications, and control your music with this stylish smart watch.',
                stock: 8
              },
              {
                id: 3,
                name: 'Wireless Earbuds',
                price: 79.99,
                image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500',
                description: 'Lightweight wireless earbuds with touch controls and compact charging case.',
                stock: 0
              },
              {
                id: 4,
                name: 'Bluetooth Speaker',
                price: 49.99,
                image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500',
                description: 'Portable Bluetooth speaker with 360° sound and waterproof design for outdoor adventures.',
                stock: 3
              },
              {
                id: 5,
                name: 'Laptop Backpack',
                price: 39.99,
                image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
                description: 'Durable laptop backpack with multiple compartments and water-resistant material.',
                stock: 22
              },
              {
                id: 6,
                name: 'Smartphone',
                price: 699.99,
                image: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500',
                description: 'The latest smartphone with cutting-edge camera technology and all-day battery life.',
                stock: 5
              }
            ])
          });
        }, 1500);
      });
      
      if (response.status === 200) {
        products = await response.json();
        renderProducts(products);
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (error) {
      showStatusMessage('Error loading products: ' + error.message, 'danger');
    } finally {
      // Hide loading spinner
      loadingSpinner.style.display = 'none';
    }
  }
  
  // Render products to DOM
  function renderProducts(productsToRender) {
    productsContainer.innerHTML = '';
    
    if (productsToRender.length === 0) {
      productsContainer.innerHTML = `
        <div class="col-12 text-center py-5">
          <p class="text-muted">No products found</p>
        </div>
      `;
      return;
    }
    
    productsToRender.forEach(product => {
      const stockClass = getStockClass(product.stock);
      const stockText = getStockText(product.stock);
      const disabledClass = product.stock === 0 ? 'disabled' : '';
      
      const productCard = document.createElement('div');
      productCard.className = 'col-md-4 mb-4';
      productCard.innerHTML = `
        <div class="card product-card">
          <div class="product-image-container">
            <img src="${product.image}" class="product-image" alt="${product.name}">
          </div>
          <div class="card-body">
            <h5 class="card-title product-name">${product.name}</h5>
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="product-price">$${product.price.toFixed(2)}</span>
              <span class="stock-status ${stockClass}">${stockText}</span>
            </div>
            <div class="btn-group w-100">
              <button class="btn btn-sm btn-outline-primary view-details" data-id="${product.id}">
                <i class="fas fa-search mr-1"></i>Details
              </button>
              <button class="btn btn-sm btn-primary add-to-cart ${disabledClass}" data-id="${product.id}" ${disabledClass}>
                <i class="fas fa-cart-plus mr-1"></i>Add to Cart
              </button>
            </div>
          </div>
        </div>
      `;
      
      productsContainer.appendChild(productCard);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.view-details').forEach(button => {
      button.addEventListener('click', () => openProductModal(parseInt(button.dataset.id)));
    });
    
    document.querySelectorAll('.add-to-cart').forEach(button => {
      if (!button.classList.contains('disabled')) {
        button.addEventListener('click', () => quickAddToCart(parseInt(button.dataset.id)));
      }
    });
  }
  
  // Open product modal
  async function openProductModal(productId) {
    // Reset modal
    modalContent.classList.add('d-none');
    modalLoading.classList.remove('d-none');
    modalQuantity.value = 1;
    
    // Show modal
    $('#productModal').modal('show');
    
    try {
      // Simulate API call to get product details
      const product = await new Promise((resolve, reject) => {
        setTimeout(() => {
          const foundProduct = products.find(p => p.id === productId);
          if (foundProduct) {
            resolve(foundProduct);
          } else {
            reject(new Error('Product not found'));
          }
        }, 800);
      });
      
      // Update current product
      currentProduct = product;
      
      // Populate modal with product details
      modalImage.src = product.image;
      modalProductName.textContent = product.name;
      modalPrice.textContent = `$${product.price.toFixed(2)}`;
      
      const stockClass = getStockClass(product.stock);
      const stockText = getStockText(product.stock);
      modalStock.innerHTML = `<span class="${stockClass}"><i class="fas fa-circle mr-1"></i>${stockText}</span>`;
      
      modalDescription.textContent = product.description;
      
      // Disable add to cart button if out of stock
      modalAddToCart.disabled = product.stock === 0;
      
      // Update max quantity
      modalQuantity.max = product.stock || 1;
      
      // Show content
      modalLoading.classList.add('d-none');
      modalContent.classList.remove('d-none');
      
    } catch (error) {
      $('#productModal').modal('hide');
      showStatusMessage('Error loading product details: ' + error.message, 'danger');
    }
  }
  
  // Quick add to cart from product listing
  async function quickAddToCart(productId) {
    try {
      // Find product
      const product = products.find(p => p.id === productId);
      
      if (!product) {
        throw new Error('Product not found');
      }
      
      // Check stock
      if (product.stock <= 0) {
        throw new Error('Product is out of stock');
      }
      
      // Simulate server check for stock availability
      const stockCheckResult = await checkStockAvailability(product.id, 1);
      
      if (stockCheckResult.available) {
        // Add to cart
        addToCart(product, 1);
        showStatusMessage(`Added ${product.name} to cart`, 'success');
      } else {
        throw new Error(stockCheckResult.message);
      }
      
    } catch (error) {
      showStatusMessage(error.message, 'danger');
    }
  }
  
  // Add product to cart
  function addToCart(product, quantity) {
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      });
    }
    
    // Update product stock
    const productInList = products.find(p => p.id === product.id);
    if (productInList) {
      productInList.stock -= quantity;
    }
    
    // Save cart to localStorage
    saveCart();
    
    // Update UI
    updateCartUI();
    renderProducts(products); // Re-render to update stock display
    
    // Animate cart badge
    cartCount.classList.add('updating');
    setTimeout(() => {
      cartCount.classList.remove('updating');
    }, 500);
  }
  
  // Remove item from cart
  function removeFromCart(productId) {
    // Find item in cart
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
      const removedItem = cart[itemIndex];
      
      // Restore stock
      const product = products.find(p => p.id === productId);
      if (product) {
        product.stock += removedItem.quantity;
      }
      
      // Remove from cart
      cart.splice(itemIndex, 1);
      
      // Save cart
      saveCart();
      
      // Update UI
      updateCartUI();
      renderProducts(products);
      
      showStatusMessage(`Removed ${removedItem.name} from cart`, 'info');
    }
  }
  
  // Update cart UI
  function updateCartUI() {
    // Update cart count
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Show/hide empty cart message
    if (cart.length === 0) {
      emptyCartMessage.style.display = 'block';
      cartSummary.classList.add('d-none');
      cartItems.innerHTML = '';
      cartItems.appendChild(emptyCartMessage);
    } else {
      emptyCartMessage.style.display = 'none';
      cartSummary.classList.remove('d-none');
      
      // Clear current items
      cartItems.innerHTML = '';
      
      // Add each cart item
      cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
          <div class="d-flex justify-content-between">
            <div>
              <div class="cart-item-title">${item.name}</div>
              <div class="cart-item-price">$${item.price.toFixed(2)} × <span class="cart-item-quantity">${item.quantity}</span></div>
            </div>
            <div class="cart-item-remove" data-id="${item.id}">
              <i class="fas fa-times"></i>
            </div>
          </div>
        `;
        
        cartItems.appendChild(cartItem);
      });
      
      // Add remove event listeners
      document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', () => removeFromCart(parseInt(button.dataset.id)));
      });
      
      // Update subtotal
      const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    }
  }
  
  // Save cart to localStorage
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  
  // Load cart from localStorage
  function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      cart = JSON.parse(savedCart);
      
      // Update stock counts for products
      cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
          // Make sure we don't go negative
          product.stock = Math.max(0, product.stock - item.quantity);
        }
      });
      
      updateCartUI();
    }
  }
  
  // Simulate checking stock availability (async)
  async function checkStockAvailability(productId, quantity) {
    return new Promise(resolve => {
      setTimeout(() => {
        const product = products.find(p => p.id === productId);
        
        if (!product) {
          resolve({
            available: false,
            message: 'Product not found'
          });
        } else if (product.stock < quantity) {
          resolve({
            available: false,
            message: `Only ${product.stock} items available`
          });
        } else {
          resolve({
            available: true,
            message: 'In stock'
          });
        }
      }, 500); // Simulate network delay
    });
  }
  
  // Simulate checkout process
  async function processCheckout() {
    if (cart.length === 0) {
      showStatusMessage('Your cart is empty', 'warning');
      return;
    }
    
    try {
      // Disable checkout button
      checkoutBtn.disabled = true;
      checkoutBtn.innerHTML = '<span class="spinner-border spinner-border-sm mr-2"></span>Processing...';
      
      // Simulate API call
      const result = await new Promise((resolve, reject) => {
        setTimeout(() => {
          // 90% chance of success
          if (Math.random() > 0.1) {
            resolve({
              success: true,
              orderId: 'ORD-' + Math.floor(Math.random() * 1000000)
            });
          } else {
            reject(new Error('Payment processing failed'));
          }
        }, 2000);
      });
      
      // Success
      showStatusMessage(`Order placed successfully! Order ID: ${result.orderId}`, 'success');
      
      // Clear cart
      cart = [];
      saveCart();
      updateCartUI();
      
    } catch (error) {
      showStatusMessage('Checkout failed: ' + error.message, 'danger');
    } finally {
      // Reset checkout button
      checkoutBtn.disabled = false;
      checkoutBtn.innerHTML = '<i class="fas fa-credit-card mr-2"></i>Checkout';
    }
  }
  
  // Show status message
  function showStatusMessage(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `alert alert-${type} status-message`;
    statusMessage.classList.remove('d-none');
    
    // Auto hide after animation completes
    setTimeout(() => {
      statusMessage.classList.add('d-none');
    }, 3000);
  }
  
  // Get stock display class
  function getStockClass(stock) {
    if (stock === 0) return 'out-of-stock';
    if (stock <= 5) return 'low-stock';
    return 'in-stock';
  }
  
  // Get stock display text
  function getStockText(stock) {
    if (stock === 0) return 'Out of Stock';
    if (stock <= 5) return `Low Stock (${stock})`;
    return 'In Stock';
  }
  
  // Sort products
  function sortProducts(sortType) {
    let sortedProducts = [...products];
    
    switch (sortType) {
      case 'name-asc':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
    }
    
    renderProducts(sortedProducts);
  }
  
  // Setup event listeners
  function setupEventListeners() {
    // Sort dropdown
    sortOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        sortProducts(option.dataset.sort);
      });
    });
    
    // Checkout button
    checkoutBtn.addEventListener('click', processCheckout);
    
    // Quantity controls in modal
    decreaseQuantity.addEventListener('click', () => {
      const currentVal = parseInt(modalQuantity.value) || 1;
      if (currentVal > 1) {
        modalQuantity.value = currentVal - 1;
      }
    });
    
    increaseQuantity.addEventListener('click', () => {
      const currentVal = parseInt(modalQuantity.value) || 1;
      const max = parseInt(modalQuantity.max) || 999;
      if (currentVal < max) {
        modalQuantity.value = currentVal + 1;
      }
    });
    
    // Add to cart from modal
    modalAddToCart.addEventListener('click', async () => {
      if (!currentProduct) return;
      
      const quantity = parseInt(modalQuantity.value) || 1;
      
      try {
        // Check stock
        const stockCheckResult = await checkStockAvailability(currentProduct.id, quantity);
        
        if (stockCheckResult.available) {
          // Add to cart
          addToCart(currentProduct, quantity);
          $('#productModal').modal('hide');
          showStatusMessage(`Added ${quantity} ${currentProduct.name} to cart`, 'success');
        } else {
          throw new Error(stockCheckResult.message);
        }
      } catch (error) {
        showStatusMessage(error.message, 'danger');
      }
    });
  }
});