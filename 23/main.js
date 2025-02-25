document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const couponCodeInput = document.getElementById("couponCodeInput");
  const applyCouponBtn = document.getElementById("applyCoupon");
  const couponMessage = document.getElementById("couponMessage");
  const discountRow = document.getElementById("discountRow");
  const discountElement = document.getElementById("discount");
  const subtotalElement = document.getElementById("subtotal");
  const shippingElement = document.getElementById("shipping");
  const totalElement = document.getElementById("total");

  // Cart data
  let cart = {
    subtotal: 100.0,
    shipping: 5.0,
    discount: 0,
    total: 105.0,
    appliedCoupon: null,
  };

  // Available coupon codes with their discounts
  const coupons = {
    WELCOME10: {
      type: "percentage",
      value: 10,
      description: "10% off your order",
    },
    SAVE20: {
      type: "percentage",
      value: 20,
      description: "20% off your order",
    },
    FREESHIP: {
      type: "shipping",
      value: 100,
      description: "Free shipping on your order",
    },
    FLAT25: {
      type: "fixed",
      value: 25,
      description: "$25 off your order",
    },
  };

  // Initialize display
  updateCartDisplay();

  // Event listeners
  applyCouponBtn.addEventListener("click", applyCoupon);
  couponCodeInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      applyCoupon();
    }
  });

  function applyCoupon() {
    const couponCode = couponCodeInput.value.trim().toUpperCase();

    // Reset previous coupon
    resetCoupon();

    // Empty coupon code check
    if (!couponCode) {
      showCouponMessage("Please enter a coupon code", "error");
      return;
    }

    // Check if coupon exists
    if (!coupons[couponCode]) {
      showCouponMessage("Invalid coupon code", "error");
      return;
    }

    // Apply the coupon
    const coupon = coupons[couponCode];
    cart.appliedCoupon = couponCode;

    // Calculate discount based on coupon type
    switch (coupon.type) {
      case "percentage":
        cart.discount = ((cart.subtotal * coupon.value) / 100).toFixed(2);
        break;
      case "fixed":
        cart.discount = Math.min(coupon.value, cart.subtotal).toFixed(2);
        break;
      case "shipping":
        cart.discount = Math.min(cart.shipping, coupon.value).toFixed(2);
        break;
    }

    // Update cart total
    updateCartTotal();

    // Update UI
    updateCartDisplay();
    showCouponMessage(`Coupon applied: ${coupon.description}`, "success");
  }

  function resetCoupon() {
    cart.discount = 0;
    cart.appliedCoupon = null;
    couponMessage.textContent = "";
    couponMessage.className = "coupon-message";
    updateCartTotal();
  }

  function updateCartTotal() {
    cart.total = (
      parseFloat(cart.subtotal) +
      parseFloat(cart.shipping) -
      parseFloat(cart.discount)
    ).toFixed(2);
  }

  function updateCartDisplay() {
    subtotalElement.textContent = `$${cart.subtotal.toFixed(2)}`;
    shippingElement.textContent = `$${cart.shipping.toFixed(2)}`;
    totalElement.textContent = `$${cart.total}`;

    if (cart.discount > 0) {
      discountElement.textContent = `-$${cart.discount}`;
      discountRow.style.display = "flex";
    } else {
      discountRow.style.display = "none";
    }
  }

  function showCouponMessage(message, type) {
    couponMessage.textContent = message;
    couponMessage.className = `coupon-message ${type}`;
  }
});
