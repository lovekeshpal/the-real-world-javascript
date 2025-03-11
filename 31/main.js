document.addEventListener('DOMContentLoaded', function() {
  const progressBar = document.getElementById('scrollProgressBar');
  
  // Function to update the scroll progress
  function updateScrollProgress() {
    // Calculate how much has been scrolled
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Calculate the height of the page content 
    // (full document height minus the viewport height)
    const scrollHeight = document.documentElement.scrollHeight - 
                         document.documentElement.clientHeight;
    
    // Calculate the scroll percentage (0 to 1)
    const scrollPercent = scrollTop / scrollHeight;
    
    // Set the width of the progress bar as a percentage
    progressBar.style.width = scrollPercent * 100 + '%';
  }
  
  // Listen for scroll events
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  
  // Initialize on page load
  updateScrollProgress();
  
  // Update on window resize as heights may change
  window.addEventListener('resize', updateScrollProgress, { passive: true });
});