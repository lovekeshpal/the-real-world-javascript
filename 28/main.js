document.addEventListener('DOMContentLoaded', function() {
  // Product data
  const products = [
    {
      id: 1,
      name: "Wireless Earbuds",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?q=80&w=1978&auto=format&fit=crop&ixlib=rb-4.0.3",
      description: "High-quality wireless earbuds with noise cancellation technology."
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3",
      description: "Track your fitness and stay connected with this feature-packed smart watch."
    },
    {
      id: 3,
      name: "Bluetooth Speaker",
      price: 34.99,
      image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
      description: "Portable Bluetooth speaker with impressive sound quality and long battery life."
    },
    {
      id: 4,
      name: "Laptop Backpack",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1987&auto=format&fit=crop&ixlib=rb-4.0.3",
      description: "Durable laptop backpack with multiple compartments and water-resistant material."
    },
    {
      id: 5,
      name: "Mechanical Keyboard",
      price: 59.99,
      image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3",
      description: "Tactile mechanical keyboard with RGB lighting for gaming and typing."
    },
    {
      id: 6,
      name: "Wireless Mouse",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
      description: "Ergonomic wireless mouse with adjustable DPI settings."
    },
    {
      id: 7,
      name: "Monitor Stand",
      price: 19.99,
      image: "https://www.vari.com/on/demandware.static/-/Sites-vari-master-catalog/default/dw8e397c7b/images/large/MA-DUAL/48003-silver/vari-2-monitor_48003_silver_office.jpg",
      description: "Adjustable monitor stand to improve your desk ergonomics and save space."
    },
    {
      id: 8,
      name: "4K Monitor",
      price: 249.99,
      image: "https://i.pcmag.com/imagery/roundups/01Y9bqNdRmGOzHcetHQG2FW-36.fit_lim.size_1050x.webp",
      description: "Ultra-sharp 4K monitor perfect for content creation and gaming."
    }
  ];

  // DOM Elements
  const productContainer = document.getElementById('productContainer');
  const noItemsMessage = document.getElementById('noItemsMessage');
  const minPriceInput = document.getElementById('minPrice');
  const maxPriceInput = document.getElementById('maxPrice');
  const priceRange = document.getElementById('priceRange');
  const applyFilterBtn = document.getElementById('applyFilter');

  // Set up price range boundaries
  const prices = products.map(product => product.price);
  const minPrice = Math.floor(Math.min(...prices));
  const maxPrice = Math.ceil(Math.max(...prices));
  
  // Initialize price filter inputs with dynamic range
  minPriceInput.setAttribute('min', minPrice);
  minPriceInput.setAttribute('max', maxPrice);
  minPriceInput.value = minPrice;
  
  maxPriceInput.setAttribute('min', minPrice);
  maxPriceInput.setAttribute('max', maxPrice);
  maxPriceInput.value = maxPrice;
  
  priceRange.setAttribute('min', minPrice);
  priceRange.setAttribute('max', maxPrice);
  priceRange.value = maxPrice;
  
  // Update price label ranges
  const priceLabels = document.querySelectorAll('.price-labels span');
  if (priceLabels.length >= 2) {
    priceLabels[0].textContent = `$${minPrice}`;
    priceLabels[1].textContent = `$${maxPrice}`;
  }

  // Event listeners for price filter controls
  priceRange.addEventListener('input', function() {
    maxPriceInput.value = this.value;
  });

  maxPriceInput.addEventListener('input', function() {
    if (parseInt(this.value) < parseInt(minPriceInput.value)) {
      minPriceInput.value = this.value;
    }
    priceRange.value = this.value;
  });

  minPriceInput.addEventListener('input', function() {
    if (parseInt(this.value) > parseInt(maxPriceInput.value)) {
      maxPriceInput.value = this.value;
      priceRange.value = this.value;
    }
  });

  // Apply filter button click event
  applyFilterBtn.addEventListener('click', filterProducts);

  // Filter products by price range
  function filterProducts() {
    const min = parseFloat(minPriceInput.value);
    const max = parseFloat(maxPriceInput.value);
    
    const filteredProducts = products.filter(product => 
      product.price >= min && product.price <= max
    );
    
    displayProducts(filteredProducts);
  }

  // Display products on the page
  function displayProducts(productsToDisplay) {
    // Clear container
    productContainer.innerHTML = '';
    
    // Show or hide "no items" message
    if (productsToDisplay.length === 0) {
      noItemsMessage.style.display = 'block';
    } else {
      noItemsMessage.style.display = 'none';
    }
    
    // Create and append product cards
    productsToDisplay.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'col-md-4 col-sm-6 mb-4';
      
      productCard.innerHTML = `
        <div class="product-card">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
          </div>
          <div class="product-info">
            <h5 class="product-name">${product.name}</h5>
            <p class="product-description">${product.description}</p>
            <div class="d-flex justify-content-between align-items-center mt-2">
              <span class="product-price">$${product.price.toFixed(2)}</span>
              <button class="btn btn-sm btn-primary">
                <i class="fas fa-shopping-cart"></i> Add to Cart
              </button>
            </div>
          </div>
        </div>
      `;
      
      productContainer.appendChild(productCard);
    });
  }

  // Initialize with all products
  displayProducts(products);
});