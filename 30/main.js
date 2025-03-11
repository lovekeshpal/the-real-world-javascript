document.addEventListener('DOMContentLoaded', function() {
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');
  const rootElement = document.documentElement;
  
  // Function to check scroll position
  function handleScroll() {
    // Show button when user has scrolled down 300px from the top
    const scrollTotal = rootElement.scrollHeight - rootElement.clientHeight;
    
    if (rootElement.scrollTop / scrollTotal > 0.1) {
      // Show button
      scrollToTopBtn.classList.add('visible');
    } else {
      // Hide button
      scrollToTopBtn.classList.remove('visible');
    }
  }
  
  // Scroll to top when button is clicked
  function scrollToTop() {
    // Smooth scroll to the top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  
  // Add event listeners
  window.addEventListener('scroll', handleScroll, { passive: true });
  scrollToTopBtn.addEventListener('click', scrollToTop);
  
  // Initial check in case the page is refreshed while scrolled down
  handleScroll();
});