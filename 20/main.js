document.addEventListener("DOMContentLoaded", function () {
  const products = [
    { id: 1, name: "Laptop", price: 50000 },
    { id: 2, name: "Shoes", price: 2500 },
    { id: 3, name: "Watch", price: 3000 },
  ];

  const productsContainer = document.getElementById("products");
  const cartContainer = document.getElementById("cart");
  const totalContainer = document.getElementById("total");
  let cart = [];

  // Function to add product to cart
  function addToCart(productId) {
    const product = products.find((p) => p.id === productId);
    cart.push(product);
    renderCart();
  }

  // Attach event listeners in renderProducts
  function renderProducts() {
    products.forEach((product) => {
      const productElement = document.createElement("div");
      productElement.className = "col-md-4";
      productElement.innerHTML = `
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">₹${product.price}</p>
          <button class="btn btn-primary">Add to Cart</button>
        </div>
      </div>
    `;
      productElement
        .querySelector("button")
        .addEventListener("click", () => addToCart(product.id));
      productsContainer.appendChild(productElement);
    });
  }

  // Function to render cart
  function renderCart() {
    cartContainer.innerHTML = "";
    let total = 0;
    cart.forEach((item) => {
      const cartItem = document.createElement("li");
      cartItem.className = "list-group-item";
      cartItem.textContent = `${item.name} - ₹${item.price}`;
      cartContainer.appendChild(cartItem);
      total += item.price;
    });
    totalContainer.textContent = total;
  }

  // Initial render
  renderProducts();
});
