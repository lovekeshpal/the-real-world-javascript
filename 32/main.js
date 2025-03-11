document.addEventListener('DOMContentLoaded', function() {
  const sections = document.querySelectorAll('.content-section');
  const navLinks = document.querySelectorAll('#section-nav .nav-link');
  const sidebar = document.getElementById('sidebar');
  const toggleNavBtn = document.getElementById('toggle-nav');
  
  // Add backdrop for mobile navigation
  const backdrop = document.createElement('div');
  backdrop.className = 'sidebar-backdrop';
  document.body.appendChild(backdrop);
  
  // Options for the Intersection Observer
  const options = {
    root: null, // Use the viewport
    rootMargin: '-20% 0px -70% 0px', // Adjust these values to control when sections are considered "visible"
    threshold: 0
  };
  
  // Create an observer instance
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Get the id of the section in view
        const id = entry.target.id;
        
        // Update active class on navigation links
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, options);
  
  // Start observing sections
  sections.forEach(section => {
    observer.observe(section);
  });
  
  // Smooth scroll to section when clicking on nav links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get the target section from href attribute
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        // Smooth scroll to the section
        targetSection.scrollIntoView({
          behavior: 'smooth'
        });
        
        // Close sidebar on mobile after clicking
        if (window.innerWidth < 768) {
          toggleSidebar();
        }
      }
    });
  });
  
  // Toggle sidebar on mobile
  function toggleSidebar() {
    sidebar.classList.toggle('show');
    backdrop.classList.toggle('show');
  }
  
  // Add event listeners for toggling
  toggleNavBtn.addEventListener('click', toggleSidebar);
  backdrop.addEventListener('click', toggleSidebar);
  
  // Close sidebar when window resizes to desktop size
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && sidebar.classList.contains('show')) {
      sidebar.classList.remove('show');
      backdrop.classList.remove('show');
    }
  });
});