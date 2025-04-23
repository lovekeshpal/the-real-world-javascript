document.addEventListener('DOMContentLoaded', function() {
  // Get all product cards
  const productCards = document.querySelectorAll('.product-card');
  
  // Add 3D tilt effect for desktop devices
  if (window.matchMedia('(pointer: fine)').matches) {
    productCards.forEach(card => {
      const image = card.querySelector('.product-image');
      
      // Mouse move event for parallax effect
      card.addEventListener('mousemove', e => {
        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;
        
        // Calculate mouse position relative to card center
        const mouseX = e.clientX - cardCenterX;
        const mouseY = e.clientY - cardCenterY;
        
        // Calculate rotation and parallax values
        const rotateY = mouseX / cardRect.width * 15;
        const rotateX = -mouseY / cardRect.height * 15;
        
        // Apply subtle 3D rotation
        card.style.transform = `translateY(-5px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        
        // Add parallax effect to image
        image.style.transform = `scale(1.2) translateX(${-mouseX/20}px) translateY(${-mouseY/20}px)`;
      });
      
      // Reset transform on mouse leave
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
        image.style.transform = 'scale(1)';
        
        // Smooth transition back
        card.style.transition = 'transform 0.5s ease';
        image.style.transition = 'transform 0.5s ease';
        
        // Reset transition after returning to original state
        setTimeout(() => {
          card.style.transition = '';
          image.style.transition = '';
        }, 500);
      });
    });
  }
  
  // Product descriptions for the modal
  const productDescriptions = {
    "Premium Headphones": "Experience studio-quality sound with these wireless noise-cancelling headphones. Features include 40 hours of battery life, comfortable ear cups, and voice assistant compatibility.",
    "Smart Watch": "Track your fitness goals and stay connected with this sleek smart watch. Includes GPS, heart rate monitoring, sleep tracking, and water resistance up to 50 meters.",
    "Smart Speaker": "Fill your home with rich, room-filling sound and smart assistant capabilities. Control your smart home, play music, get answers to questions, and more with just your voice."
  };
  
  // Quick view button functionality
  const quickViewButtons = document.querySelectorAll('.overlay-content button');
  quickViewButtons.forEach(button => {
    button.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation(); // Prevent event from bubbling up
      
      // Find the closest product card
      const card = button.closest('.product-card');
      
      // Get product details
      const productImage = card.querySelector('.product-image').src;
      const productTitle = card.querySelector('.product-info h5').textContent;
      const productPrice = card.querySelector('.product-price').textContent;
      const productRating = card.querySelector('.product-rating').innerHTML;
      const productDescription = productDescriptions[productTitle] || "No description available.";
      
      // Populate modal with product details
      document.getElementById('modalProductImage').src = productImage;
      document.getElementById('modalProductTitle').textContent = productTitle;
      document.getElementById('modalProductPrice').textContent = productPrice;
      document.getElementById('modalProductRating').innerHTML = productRating;
      document.getElementById('modalProductDescription').textContent = productDescription;
      
      // Show the modal
      $('#quickViewModal').modal('show');
    });
  });
  
  // Quantity buttons functionality
  document.getElementById('quantityPlus').addEventListener('click', () => {
    const input = document.getElementById('productQuantity');
    input.value = parseInt(input.value) + 1;
  });
  
  document.getElementById('quantityMinus').addEventListener('click', () => {
    const input = document.getElementById('productQuantity');
    if (parseInt(input.value) > 1) {
      input.value = parseInt(input.value) - 1;
    }
  });
});