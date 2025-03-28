document.addEventListener('DOMContentLoaded', function() {
  // Sample product data
const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80',
    stock: 15
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80',
    stock: 8
  },
  {
    id: 3,
    name: 'Bluetooth Speaker',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80',
    stock: 0
  },
  {
    id: 4,
    name: 'Laptop Stand',
    price: 29.99,
    image: 'https://m.media-amazon.com/images/I/51mN-RUnn5L._SX679_.jpg',
    stock: 4
  },
  {
    id: 5,
    name: 'Mechanical Keyboard',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80',
    stock: 12
  },
  {
    id: 6,
    name: 'Wireless Mouse',
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1605773527852-c546a8584ea3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80',
    stock: 2
  }
];

  // Get product container
  const productContainer = document.getElementById('productContainer');
  
  // Get cart badge
  const cartBadge = document.getElementById('cartBadge');
  
  // Initialize cart
  let cartItems = 0;
  
  // Create stock level indicator
  function createStockIndicator(stockLevel) {
    const indicator = document.createElement('div');
    indicator.className = 'stock-indicator';
    
    if (stockLevel > 10) {
      indicator.classList.add('in-stock');
      indicator.textContent = 'In Stock';
    } else if (stockLevel > 0) {
      indicator.classList.add('low-stock');
      indicator.textContent = 'Low Stock: Only ' + stockLevel + ' left';
    } else {
      indicator.classList.add('out-of-stock');
      indicator.textContent = 'Out of Stock';
    }
    
    return indicator;
  }
  
  // Function to render products
  function renderProducts() {
    productContainer.innerHTML = '';
    
    products.forEach(product => {
      // Create product card
      const productCol = document.createElement('div');
      productCol.className = 'col-md-4 mb-4';
      
      const productCard = document.createElement('div');
      productCard.className = 'card product-card';
      
      // Product image
      const productImage = document.createElement('img');
      productImage.src = product.image;
      productImage.className = 'card-img-top';
      productImage.alt = product.name;
      
      // Product details
      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';
      
      const productName = document.createElement('h5');
      productName.className = 'card-title';
      productName.textContent = product.name;
      
      const productPrice = document.createElement('p');
      productPrice.className = 'card-text price';
      productPrice.textContent = `$${product.price}`;
      
      // Add to cart button
      const addToCartBtn = document.createElement('button');
      addToCartBtn.className = 'btn btn-primary add-to-cart';
      addToCartBtn.textContent = 'Add to Cart';
      
      if (product.stock === 0) {
        addToCartBtn.disabled = true;
        addToCartBtn.className = 'btn btn-secondary';
      }
      
      addToCartBtn.addEventListener('click', function() {
        if (product.stock > 0) {
          // Decrease stock
          product.stock--;
          
          // Update cart
          cartItems++;
          cartBadge.textContent = cartItems;
          
          // Re-render product to update stock indicator
          renderProducts();
        }
      });
      
      // Stock indicator
      const stockIndicator = createStockIndicator(product.stock);
      
      // Assemble card
      cardBody.appendChild(productName);
      cardBody.appendChild(productPrice);
      cardBody.appendChild(addToCartBtn);
      cardBody.appendChild(stockIndicator);
      
      productCard.appendChild(productImage);
      productCard.appendChild(cardBody);
      
      productCol.appendChild(productCard);
      productContainer.appendChild(productCol);
    });
  }
  
  // Initialize products
  renderProducts();
});