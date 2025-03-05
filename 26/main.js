document.addEventListener('DOMContentLoaded', function() {
  // Product data
  const products = [
    {
      id: 1,
      name: "Classic T-Shirt",
      price: 19.99,
      image: "https://nobero.com/cdn/shop/files/white_855177b5-5621-4a4b-a0d1-9060b89a6a69.jpg?v=1711979035"
    },
    {
      id: 2,
      name: "Denim Jeans",
      price: 49.99,
      image: "https://frenchcrown.in/cdn/shop/files/J342_2.jpg?v=1710414836&width=1750"
    },
    {
      id: 3,
      name: "Sneakers",
      price: 79.99,
      image: "https://img.tatacliq.com/images/i21//437Wx649H/MP000000024522787_437Wx649H_202411270050461.jpeg"
    },
    {
      id: 4,
      name: "Baseball Cap",
      price: 24.99,
      image: "https://imagescdn.simons.ca/images/8106-712020-23-A1_2/ny-9twenty-baseball-cap.jpg?__=55"
    },
    {
      id: 5,
      name: "Backpack",
      price: 39.99,
      image: "https://nestasia.in/cdn/shop/files/DSC0330.jpg?v=1683546932&width=600"
    },
    {
      id: 6,
      name: "Watch",
      price: 129.99,
      image: "https://justintime.in/cdn/shop/products/A1850_1.jpg?v=1682013772&width=1946"
    }
  ];

  // DOM Elements
  const productContainer = document.getElementById('productContainer');
  const cartBadge = document.getElementById('cartBadge');
  
  // Cart state
  let cartItems = [];

  // Render products
  function renderProducts() {
    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'col-md-4 col-sm-6';
      
      productCard.innerHTML = `
        <div class="product-card">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
          </div>
          <div class="product-name">${product.name}</div>
          <div class="product-price">$${product.price.toFixed(2)}</div>
          <button class="btn btn-primary btn-add-to-cart" data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>
      `;
      
      productContainer.appendChild(productCard);
    });
    
    // Add click events to all add-to-cart buttons
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
      button.addEventListener('click', addToCart);
    });
  }
  
  // Add to cart function
  function addToCart(e) {
    const button = e.target;
    const productId = parseInt(button.getAttribute('data-product-id'));
    
    // Find the product
    const product = products.find(p => p.id === productId);
    
    if (product) {
      // Add to cart array
      cartItems.push(product);
      
      // Update cart badge with animation
      updateCartBadge();
      
      // Button feedback animation
      button.innerText = "Added ✓";
      button.classList.add('added');
      
      // Reset button after 1 second
      setTimeout(() => {
        button.innerText = "Add to Cart";
        button.classList.remove('added');
      }, 1000);
    }
  }
  
  // Update cart badge
  function updateCartBadge() {
    cartBadge.textContent = cartItems.length;
    
    // Add animation class
    cartBadge.classList.add('cart-badge-update');
    
    // Remove animation class after animation completes
    setTimeout(() => {
      cartBadge.classList.remove('cart-badge-update');
    }, 500);
  }
  
  // Initialize the page
  renderProducts();
});