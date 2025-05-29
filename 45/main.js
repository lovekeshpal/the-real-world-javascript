document.addEventListener('DOMContentLoaded', function() {
  // Select all accordion items
  const accordionItems = document.querySelectorAll('.accordion-item');
  
  // Add click event to each header
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    
    header.addEventListener('click', function() {
      // Check if this item is already active
      const isActive = item.classList.contains('active');
      
      // Close all accordion items
      accordionItems.forEach(accordionItem => {
        accordionItem.classList.remove('active');
      });
      
      // If the clicked item wasn't active, open it
      if (!isActive) {
        item.classList.add('active');
      }
      
      // Add accessibility attributes
      updateAriaAttributes();
    });
    
    // Initialize with ARIA attributes
    setInitialAriaAttributes(item, header);
  });
  
  // Set initial ARIA attributes for accessibility
  function setInitialAriaAttributes(item, header) {
    const content = item.querySelector('.accordion-content');
    
    // Set ID for the content panel
    const contentId = 'accordion-content-' + (Array.from(accordionItems).indexOf(item) + 1);
    content.id = contentId;
    
    // Set ARIA attributes for the header
    header.setAttribute('role', 'button');
    header.setAttribute('aria-expanded', 'false');
    header.setAttribute('aria-controls', contentId);
    header.setAttribute('tabindex', '0');
    
    // Set ARIA attributes for the content
    content.setAttribute('role', 'region');
    content.setAttribute('aria-labelledby', header.id || 'accordion-header-' + (Array.from(accordionItems).indexOf(item) + 1));
    content.setAttribute('aria-hidden', 'true');
  }
  
  // Update ARIA attributes when state changes
  function updateAriaAttributes() {
    accordionItems.forEach(item => {
      const header = item.querySelector('.accordion-header');
      const content = item.querySelector('.accordion-content');
      const isActive = item.classList.contains('active');
      
      header.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      content.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });
  }
  
  // Add keyboard support
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    
    header.addEventListener('keydown', function(e) {
      // Toggle on Enter or Space
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });
  
  // Open the first panel by default
  if (accordionItems.length > 0) {
    accordionItems[0].classList.add('active');
    updateAriaAttributes();
  }
});