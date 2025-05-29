document.addEventListener('DOMContentLoaded', function() {
  // Form element and success message
  const form = document.getElementById('celebrationForm');
  const successMessage = document.getElementById('successMessage');
  const confettiContainer = document.getElementById('confetti-container');
  
  // Confetti colors
  const colors = [
    '#f94144', '#f3722c', '#f8961e', '#f9c74f', 
    '#90be6d', '#43aa8b', '#4d908e', '#577590', 
    '#277da1', '#ff66c4', '#9b5de5'
  ];
  
  // Confetti shapes
  const shapes = ['square', 'triangle', 'circle'];
  
  // Form submission event
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Show success message
    successMessage.style.display = 'block';
    
    // Create confetti celebration
    createConfetti();
    
    // Reset form after delay
    setTimeout(() => {
      form.reset();
    }, 3000);
  });
  
  // Function to create confetti
  function createConfetti() {
    // Number of confetti pieces
    const confettiCount = 150;
    
    // Clear any existing confetti
    confettiContainer.innerHTML = '';
    
    // Create confetti pieces
    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        
        // Random position, color, shape and size
        const size = Math.random() * 10 + 6; // Between 6-16px
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100; // Random horizontal position
        
        // Apply styles
        confetti.className = `confetti ${shape}`;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.backgroundColor = color;
        confetti.style.left = `${left}%`;
        confetti.style.top = '-20px';
        confetti.style.opacity = '1';
        
        // Set random rotation
        const rotation = Math.random() * 360;
        confetti.style.transform = `rotate(${rotation}deg)`;
        
        // Add to container
        confettiContainer.appendChild(confetti);
        
        // Animate falling
        animateConfetti(confetti);
      }, i * 20); // Stagger creation for better effect
    }
  }
  
  // Function to animate a single confetti piece
  function animateConfetti(element) {
    // Random horizontal movement
    const horizontalMovement = (Math.random() - 0.5) * 15;
    
    // Set random fall speed
    const fallSpeed = Math.random() * 3 + 2;
    
    // Set random spin speed
    const spinSpeed = Math.random() * 15 - 7.5;
    
    // Starting position
    let top = -20;
    let rotation = Math.random() * 360;
    let opacity = 1;
    let horizontalPos = parseFloat(element.style.left);
    
    // Animation function
    function fall() {
      // Update position
      top += fallSpeed;
      rotation += spinSpeed;
      horizontalPos += horizontalMovement / 10;
      
      // Update element style
      element.style.top = `${top}px`;
      element.style.transform = `rotate(${rotation}deg)`;
      element.style.left = `${horizontalPos}%`;
      
      // Fade out as it falls past 70% of screen height
      if (top > window.innerHeight * 0.7) {
        opacity -= 0.03;
        element.style.opacity = opacity;
      }
      
      // Continue animation until off-screen or fully transparent
      if (top < window.innerHeight + 100 && opacity > 0) {
        requestAnimationFrame(fall);
      } else {
        // Remove confetti from DOM when animation completes
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      }
    }
    
    // Start animation
    requestAnimationFrame(fall);
  }
});