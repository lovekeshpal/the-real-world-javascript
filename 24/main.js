document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const fetchButton = document.getElementById("fetchProducts");
  const productContainer = document.getElementById("productContainer");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const errorContainer = document.getElementById("errorContainer");

  // Event listener for fetch button
  fetchButton.addEventListener("click", fetchProducts);

  // Function to fetch products from API
  async function fetchProducts() {
    // Show loading spinner and hide any previous errors
    loadingSpinner.style.display = "block";
    errorContainer.style.display = "none";
    productContainer.innerHTML = "";

    try {
      // Fetch data from API
      const response = await fetch("https://fakestoreapi.com/products?limit=5");

      // Check if the response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse JSON response
      const products = await response.json();

      // Display products
      displayProducts(products);
    } catch (error) {
      // Handle errors
      console.error("Error fetching products:", error);
      errorContainer.textContent = `Failed to fetch products: ${error.message}`;
      errorContainer.style.display = "block";
    } finally {
      // Hide loading spinner
      loadingSpinner.style.display = "none";
    }
  }

  // Function to display products
  function displayProducts(products) {
    // Clear previous products
    productContainer.innerHTML = "";

    // Check if products array is empty
    if (!products || products.length === 0) {
      errorContainer.textContent = "No products found.";
      errorContainer.style.display = "block";
      return;
    }

    // Create HTML for each product
    products.forEach((product) => {
      // Create stars based on rating
      const rating = product.rating.rate;
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 >= 0.5;

      let starsHTML = "";
      for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
      }
      if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
      }
      const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
      for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
      }

      // Create product card
      const productCard = document.createElement("div");
      productCard.className = "col-md-4 mb-4";
      productCard.innerHTML = `
        <div class="card product-card">
          <div class="product-image-container p-3">
            <img src="${product.image}" class="product-image" alt="${
        product.title
      }">
          </div>
          <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="product-description card-text">${product.description}</p>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <span class="product-price">$${product.price.toFixed(2)}</span>
              <div class="product-rating">
                <span class="stars">${starsHTML}</span>
                <small class="text-muted">(${product.rating.count})</small>
              </div>
            </div>
            <button class="btn btn-sm btn-outline-primary mt-2">Add to Cart</button>
          </div>
        </div>
      `;

      productContainer.appendChild(productCard);
    });
  }
});
