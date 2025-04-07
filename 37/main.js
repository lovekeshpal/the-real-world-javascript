document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const fontSelect = document.getElementById('font-family');
  const previewText = document.getElementById('preview-text');
  const sizeButtons = document.querySelectorAll('[data-size]');
  const styleButtons = document.querySelectorAll('[data-style]');
  
  // Display elements
  const currentFont = document.getElementById('current-font');
  const currentSize = document.getElementById('current-size');
  const currentStyles = document.getElementById('current-styles');
  
  // Tracking active styles
  const activeStyles = {
    bold: false,
    italic: false,
    underline: false
  };
  
  // Initialize with default values
  updateFontFamily();
  
  // Font family change event
  fontSelect.addEventListener('change', function() {
    updateFontFamily();
    highlightChange();
  });
  
  // Font size buttons
  sizeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const size = this.getAttribute('data-size');
      
      // Remove all size classes
      previewText.classList.remove('font-small', 'font-medium', 'font-large');
      
      // Add selected size class
      previewText.classList.add('font-' + size);
      
      // Update display
      currentSize.textContent = capitalizeFirstLetter(size);
      
      highlightChange();
    });
  });
  
  // Font style buttons
  styleButtons.forEach(button => {
    button.addEventListener('click', function() {
      const style = this.getAttribute('data-style');
      
      // Toggle active state visually
      this.classList.toggle('active');
      
      // Toggle style
      activeStyles[style] = !activeStyles[style];
      
      // Update classes
      previewText.classList.toggle('font-' + style, activeStyles[style]);
      
      // Update display
      updateStylesDisplay();
      
      highlightChange();
    });
  });
  
  // Helper functions
  function updateFontFamily() {
    const fontFamily = fontSelect.value;
    previewText.style.fontFamily = fontFamily;
    
    // Get readable name from option text
    const selectedOption = fontSelect.options[fontSelect.selectedIndex];
    currentFont.textContent = selectedOption.text;
  }
  
  function updateStylesDisplay() {
    const activeStyleNames = [];
    
    if (activeStyles.bold) activeStyleNames.push('Bold');
    if (activeStyles.italic) activeStyleNames.push('Italic');
    if (activeStyles.underline) activeStyleNames.push('Underline');
    
    currentStyles.textContent = activeStyleNames.length > 0 ? 
      activeStyleNames.join(', ') : 
      'None';
  }
  
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  function highlightChange() {
    previewText.classList.add('preview-change');
    setTimeout(() => {
      previewText.classList.remove('preview-change');
    }, 500);
  }
});