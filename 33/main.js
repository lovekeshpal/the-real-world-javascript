document.addEventListener('DOMContentLoaded', function() {
  // Smooth scrolling for navigation links and scroll buttons
  const scrollLinks = document.querySelectorAll('.nav-link, .scroll-btn');
  
  scrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get the target section
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        // Calculate position to scroll to (with navbar offset)
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        
        // Smooth scroll to target
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        if (navbarCollapse.classList.contains('show')) {
          navbarToggler.click();
        }
      }
    });
  });
  
  // Highlight active nav item on scroll
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.navbar-nav .nav-link');
  
  function highlightNavItem() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    // Check each section's position
    sections.forEach(section => {
      const sectionTop = section.offsetTop - document.querySelector('.navbar').offsetHeight - 10;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        // Remove active class from all nav items
        navItems.forEach(item => {
          item.classList.remove('active');
        });
        
        // Add active class to current section's nav item
        const activeNavItem = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (activeNavItem) {
          activeNavItem.classList.add('active');
        }
      }
    });
  }
  
  // Change navbar background on scroll
  function toggleNavbarBackground() {
    const navbar = document.querySelector('.navbar');
    if (window.pageYOffset > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  
  // Add scroll event listeners
  window.addEventListener('scroll', highlightNavItem);
  window.addEventListener('scroll', toggleNavbarBackground);
  
  // Initialize on page load
  highlightNavItem();
  toggleNavbarBackground();
});