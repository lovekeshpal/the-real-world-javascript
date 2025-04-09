// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Get all flip cards
  const flipCards = document.querySelectorAll('.flip-card');
  
  // Add click event to each card
  flipCards.forEach(card => {
    card.addEventListener('click', function() {
      this.classList.toggle('flipped');
    });
  });
  
  // Prevent buttons on back from triggering flip
  const buttons = document.querySelectorAll('.flip-card-back button, .flip-card-back a');
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  });
});