document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const passwordInput = document.getElementById('passwordInput');
  const strengthMeter = document.getElementById('strength-meter');
  const strengthText = document.getElementById('strength-text');
  const togglePasswordButton = document.querySelector('.toggle-password');
  
  // Requirement elements
  const reqLength = document.getElementById('req-length');
  const reqLowercase = document.getElementById('req-lowercase');
  const reqUppercase = document.getElementById('req-uppercase');
  const reqNumbers = document.getElementById('req-numbers');
  const reqSpecial = document.getElementById('req-special');
  
  // Listen for password input changes
  passwordInput.addEventListener('input', updateStrengthMeter);
  
  // Toggle password visibility
  togglePasswordButton.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Toggle eye icon
    this.querySelector('i').classList.toggle('fa-eye');
    this.querySelector('i').classList.toggle('fa-eye-slash');
  });
  
  function updateStrengthMeter() {
    const password = passwordInput.value;
    let strength = calculatePasswordStrength(password);
    
    // Remove previous classes
    strengthMeter.className = 'progress-bar';
    
    // Set strength meter appearance based on score
    if (password.length === 0) {
      strengthMeter.style.width = '0%';
      strengthText.textContent = 'Password strength: None';
    } else if (strength < 20) {
      strengthMeter.classList.add('strength-very-weak');
      strengthText.textContent = 'Password strength: Very Weak';
    } else if (strength < 40) {
      strengthMeter.classList.add('strength-weak');
      strengthText.textContent = 'Password strength: Weak';
    } else if (strength < 60) {
      strengthMeter.classList.add('strength-medium');
      strengthText.textContent = 'Password strength: Medium';
    } else if (strength < 80) {
      strengthMeter.classList.add('strength-strong');
      strengthText.textContent = 'Password strength: Strong';
    } else {
      strengthMeter.classList.add('strength-very-strong');
      strengthText.textContent = 'Password strength: Very Strong';
    }
    
    // Update requirements
    updateRequirements(password);
  }
  
  function calculatePasswordStrength(password) {
    let strength = 0;
    
    // Check for empty password
    if (password.length === 0) return strength;
    
    // Criteria checks - each is worth 20 points max
    
    // Length check (up to 20 points)
    strength += Math.min(20, Math.floor(password.length * 2));
    
    // Character variety checks
    if (/[a-z]/.test(password)) strength += 10; // lowercase
    if (/[A-Z]/.test(password)) strength += 10; // uppercase
    if (/[0-9]/.test(password)) strength += 10; // numbers
    if (/[^A-Za-z0-9]/.test(password)) strength += 10; // special chars
    
    // Bonus for mixing different types of characters
    let varietyCount = 0;
    if (/[a-z]/.test(password)) varietyCount++;
    if (/[A-Z]/.test(password)) varietyCount++;
    if (/[0-9]/.test(password)) varietyCount++;
    if (/[^A-Za-z0-9]/.test(password)) varietyCount++;
    
    strength += (varietyCount - 1) * 10;
    
    // Penalties for patterns
    
    // Penalty for sequential characters
    if (/abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i.test(password)) {
      strength -= 10;
    }
    
    // Penalty for sequential numbers
    if (/012|123|234|345|456|567|678|789/.test(password)) {
      strength -= 10;
    }
    
    // Penalty for repeated characters
    if (/(.)\1\1/.test(password)) {
      strength -= 10;
    }
    
    return Math.max(0, Math.min(100, strength));
  }
  
  function updateRequirements(password) {
    // Check length requirement
    toggleRequirement(reqLength, password.length >= 8);
    
    // Check lowercase requirement
    toggleRequirement(reqLowercase, /[a-z]/.test(password));
    
    // Check uppercase requirement
    toggleRequirement(reqUppercase, /[A-Z]/.test(password));
    
    // Check numbers requirement
    toggleRequirement(reqNumbers, /[0-9]/.test(password));
    
    // Check special characters requirement
    toggleRequirement(reqSpecial, /[^A-Za-z0-9]/.test(password));
  }
  
  function toggleRequirement(element, isMet) {
    if (isMet) {
      element.classList.add('met');
      element.querySelector('i').classList.remove('fa-times-circle', 'text-danger');
      element.querySelector('i').classList.add('fa-check-circle', 'text-success');
    } else {
      element.classList.remove('met');
      element.querySelector('i').classList.remove('fa-check-circle', 'text-success');
      element.querySelector('i').classList.add('fa-times-circle', 'text-danger');
    }
  }
});