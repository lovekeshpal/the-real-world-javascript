document.addEventListener('DOMContentLoaded', function() {
  // Toast configuration
  const toastDuration = 5000; // Duration in milliseconds before auto-dismiss
  
  // Toast container
  const toastContainer = document.getElementById('toast-container');
  
  // Example toast messages
  const toastMessages = {
    success: {
      title: 'Success!',
      message: 'Your action was completed successfully.',
      icon: 'fas fa-check-circle'
    },
    error: {
      title: 'Error!',
      message: 'Something went wrong. Please try again.',
      icon: 'fas fa-times-circle'
    },
    warning: {
      title: 'Warning!',
      message: 'Please be careful with this action.',
      icon: 'fas fa-exclamation-triangle'
    },
    info: {
      title: 'Information',
      message: 'Here is some information you might find useful.',
      icon: 'fas fa-info-circle'
    }
  };
  
  // Function to create and show a toast notification
  function showToast(type) {
    // Get toast data
    const toast = toastMessages[type];
    
    // Create toast element
    const toastElement = document.createElement('div');
    toastElement.className = `toast toast-${type}`;
    toastElement.innerHTML = `
      <div class="toast-content">
        <div class="toast-icon">
          <i class="${toast.icon}"></i>
        </div>
        <div class="toast-message">
          <strong>${toast.title}</strong>
          <div>${toast.message}</div>
        </div>
      </div>
      <button class="toast-close">&times;</button>
    `;
    
    // Add to container
    toastContainer.appendChild(toastElement);
    
    // Give time for the DOM to update before animating in
    setTimeout(() => {
      toastElement.style.opacity = 1;
    }, 10);
    
    // Set up auto-dismiss
    const dismissTimeout = setTimeout(() => {
      removeToast(toastElement);
    }, toastDuration);
    
    // Set up click-to-dismiss
    const closeButton = toastElement.querySelector('.toast-close');
    closeButton.addEventListener('click', () => {
      clearTimeout(dismissTimeout);
      removeToast(toastElement);
    });
    
    // Return the toast element for potential later use
    return toastElement;
  }
  
  // Function to remove a toast with animation
  function removeToast(toastElement) {
    toastElement.classList.add('toast-removing');
    
    // Remove from DOM after animation completes
    setTimeout(() => {
      if (toastElement.parentNode === toastContainer) {
        toastContainer.removeChild(toastElement);
      }
    }, 500); // Match this to the CSS animation duration
  }
  
  // Set up event listeners for the buttons
  document.getElementById('success-toast').addEventListener('click', () => {
    showToast('success');
  });
  
  document.getElementById('error-toast').addEventListener('click', () => {
    showToast('error');
  });
  
  document.getElementById('warning-toast').addEventListener('click', () => {
    showToast('warning');
  });
  
  document.getElementById('info-toast').addEventListener('click', () => {
    showToast('info');
  });
  
  // Show an initial toast when the page loads (optional)
  setTimeout(() => {
    showToast('info');
  }, 1000);
});