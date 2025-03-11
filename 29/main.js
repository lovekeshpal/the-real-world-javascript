document.addEventListener('DOMContentLoaded', function() {
  const contentContainer = document.getElementById('contentContainer');
  const scrollToBottomBtn = document.getElementById('scrollToBottomBtn');
  
  // Variables to track scroll direction
  let lastScrollTop = 0;
  let isScrollingDown = true;
  let isAtBottom = false;
  
  // Check if user is at the bottom of the container
  function checkIfAtBottom() {
    const scrollTop = contentContainer.scrollTop;
    const scrollHeight = contentContainer.scrollHeight;
    const clientHeight = contentContainer.clientHeight;
    
    // Consider "at bottom" if within 20px of the bottom
    return scrollTop + clientHeight >= scrollHeight - 20;
  }
  
  // Handle scroll events
  contentContainer.addEventListener('scroll', function() {
    const st = contentContainer.scrollTop;
    
    // Determine scroll direction
    isScrollingDown = st > lastScrollTop;
    isAtBottom = checkIfAtBottom();
    
    // Show button if scrolling up and not at bottom
    if (!isScrollingDown && !isAtBottom) {
      scrollToBottomBtn.classList.add('visible');
    } else {
      scrollToBottomBtn.classList.remove('visible');
    }
    
    lastScrollTop = st;
  });
  
  // Scroll to bottom when button is clicked
  scrollToBottomBtn.addEventListener('click', function() {
    contentContainer.scrollTo({
      top: contentContainer.scrollHeight,
      behavior: 'smooth'
    });
  });
});