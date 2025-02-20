document.addEventListener("DOMContentLoaded", function () {
  let cart = [];

  const products = [
    { id: 1, name: "Laptop", price: 50000, quantity: 1 },
    { id: 2, name: "Shoes", price: 2500, quantity: 1 },
    { id: 3, name: "Watch", price: 3000, quantity: 1 },
  ];

  const productsContainer = document.getElementById("products");
  const cartContainer = document.getElementById("cart");
  const totalContainer = document.getElementById("total");

  // Function to add product to cart
  function addToCart(product) {
    const exitingProduct = cart.find((p) => p.id === product.id);

    if (exitingProduct) {
      exitingProduct.quantity += product.quantity;
    } else {
      cart.push(product);
    }

    renderCart();
  }

  // Function to remove product to cart

  function removeFromCart(product,index) {
    
    const exitingProduct = cart.find((p) => p.id === product.id);

    if(!exitingProduct) return alert("Please Add Product First");

    const removeProduct = cart.filter((item) => item.id != product.id);

    cart = [...removeProduct];

    renderCart();
  }

  // Attach event listeners in renderProducts
  function renderProducts() {
    products.forEach((product,index) => {
      const productElement = document.createElement("div");
      productElement.className = "col-md-4";
      productElement.innerHTML = `
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">₹${product.price}</p>
          <button class="btn  add btn-primary">Add to Cart</button>
          <button class="btn remove btn-primary">Remove</button>
        </div>
      </div>
    `;
      //Add To Cart

      productElement
        .querySelector(".add")
        .addEventListener("click", () => addToCart(product));

      //Remove From Cart

      productElement
        .querySelector(".remove")
        .addEventListener("click", () => removeFromCart(product,index));

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
      cartItem.textContent = `${item.name} - ₹${item.price} x ${item.quantity}`;
      cartContainer.appendChild(cartItem);
      total += item.price * item.quantity;
    });
    totalContainer.textContent = total;
  }

  // Initial render
  renderProducts();
});
