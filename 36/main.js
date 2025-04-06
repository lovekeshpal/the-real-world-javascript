document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const cardForm = document.getElementById('creditCardForm');
  
  // Input fields
  const cardNumberInput = document.getElementById('cardNumber');
  const cardHolderInput = document.getElementById('cardHolder');
  const expiryDateInput = document.getElementById('expiryDate');
  const cvvInput = document.getElementById('cvv');
  
  // Error elements
  const cardNumberError = document.getElementById('cardNumberError');
  const cardHolderError = document.getElementById('cardHolderError');
  const expiryDateError = document.getElementById('expiryDateError');
  const cvvError = document.getElementById('cvvError');
  
  // Display elements
  const cardTypeIcon = document.getElementById('cardTypeIcon');
  const cardTypeDisplay = document.getElementById('cardTypeDisplay');
  const cardNumberDisplay = document.getElementById('cardNumberDisplay');
  const cardHolderDisplay = document.getElementById('cardHolderDisplay');
  const cardExpiryDisplay = document.getElementById('cardExpiryDisplay');
  
  // Card type patterns
  const cardPatterns = {
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/,
    discover: /^6(?:011|5)/,
    generic: /^(?:62|88)/
  };
  
  // Input Event Listeners
  cardNumberInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Format with spaces in groups
    if (detectCardType(value) === 'amex') {
      // Format: XXXX XXXXXX XXXXX (4-6-5)
      value = value.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
    } else {
      // Format: XXXX XXXX XXXX XXXX (4-4-4-4)
      value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    }
    
    e.target.value = value;
    validateCardNumber(value);
    
    // Update display
    cardNumberDisplay.textContent = value || '•••• •••• •••• ••••';
  });
  
  cardHolderInput.addEventListener('input', function(e) {
    validateCardHolder(e.target.value);
    
    // Update display
    cardHolderDisplay.textContent = e.target.value || 'Your Name';
  });
  
  expiryDateInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    // Format: MM/YY
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    
    e.target.value = value;
    validateExpiryDate(value);
    
    // Update display
    cardExpiryDisplay.textContent = value || 'MM/YY';
  });
  
  cvvInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    e.target.value = value;
    validateCVV(value);
  });
  
  // Form submission
  cardForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate all fields
    const isCardNumberValid = validateCardNumber(cardNumberInput.value);
    const isCardHolderValid = validateCardHolder(cardHolderInput.value);
    const isExpiryDateValid = validateExpiryDate(expiryDateInput.value);
    const isCVVValid = validateCVV(cvvInput.value);
    
    if (isCardNumberValid && isCardHolderValid && isExpiryDateValid && isCVVValid) {
      alert('Payment information validated successfully!');
    }
  });
  
  // Validation functions
  function validateCardNumber(value) {
    const cardNumber = value.replace(/\s/g, '');
    const cardType = detectCardType(cardNumber);
    
    setCardTypeIcon(cardType);
    
    // Validate length based on card type
    let isValidLength = false;
    
    if (cardType === 'amex' && cardNumber.length === 15) {
      isValidLength = true;
    } else if (cardType !== 'amex' && cardNumber.length === 16) {
      isValidLength = true;
    }
    
    if (cardNumber.length === 0) {
      setError(cardNumberInput, cardNumberError, '');
      return false;
    } else if (!isValidLength) {
      setError(cardNumberInput, cardNumberError, 'Invalid card number length');
      return false;
    } else if (!luhnCheck(cardNumber)) {
      setError(cardNumberInput, cardNumberError, 'Invalid card number');
      return false;
    }
    
    setSuccess(cardNumberInput, cardNumberError);
    return true;
  }
  
  function validateCardHolder(value) {
    if (value.trim() === '') {
      setError(cardHolderInput, cardHolderError, 'Card holder name is required');
      return false;
    } else if (value.trim().length < 3) {
      setError(cardHolderInput, cardHolderError, 'Name is too short');
      return false;
    }
    
    setSuccess(cardHolderInput, cardHolderError);
    return true;
  }
  
  function validateExpiryDate(value) {
    if (value.length === 0) {
      setError(expiryDateInput, expiryDateError, '');
      return false;
    }
    
    const [month, year] = value.split('/');
    
    // Check format
    if (!month || !year || month.length !== 2 || year.length !== 2) {
      setError(expiryDateInput, expiryDateError, 'Invalid format (MM/YY)');
      return false;
    }
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits of year
    const currentMonth = currentDate.getMonth() + 1; // JS months are 0-indexed
    
    const expMonth = parseInt(month, 10);
    const expYear = parseInt(year, 10);
    
    // Check if month is valid
    if (expMonth < 1 || expMonth > 12) {
      setError(expiryDateInput, expiryDateError, 'Invalid month');
      return false;
    }
    
    // Check if card is expired
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      setError(expiryDateInput, expiryDateError, 'Card has expired');
      return false;
    }
    
    // Check if expiry date is too far in future (more than 10 years)
    if (expYear > currentYear + 10) {
      setError(expiryDateInput, expiryDateError, 'Expiry date too far in future');
      return false;
    }
    
    setSuccess(expiryDateInput, expiryDateError);
    return true;
  }
  
  function validateCVV(value) {
    if (value.length === 0) {
      setError(cvvInput, cvvError, '');
      return false;
    }
    
    const cardType = detectCardType(cardNumberInput.value.replace(/\s/g, ''));
    const requiredLength = cardType === 'amex' ? 4 : 3;
    
    if (value.length !== requiredLength) {
      setError(cvvInput, cvvError, `CVV must be ${requiredLength} digits`);
      return false;
    }
    
    setSuccess(cvvInput, cvvError);
    return true;
  }
  
  // Helper functions
  function detectCardType(cardNumber) {
    if (cardPatterns.visa.test(cardNumber)) return 'visa';
    if (cardPatterns.mastercard.test(cardNumber)) return 'mastercard';
    if (cardPatterns.amex.test(cardNumber)) return 'amex';
    if (cardPatterns.discover.test(cardNumber)) return 'discover';
    if (cardPatterns.generic.test(cardNumber)) return 'generic';
    return 'unknown';
  }
  
  function setCardTypeIcon(cardType) {
    // Remove all existing card type classes
    cardTypeIcon.querySelector('i').className = '';
    cardTypeDisplay.querySelector('i').className = '';
    
    switch (cardType) {
      case 'visa':
        cardTypeIcon.querySelector('i').className = 'fab fa-cc-visa visa';
        cardTypeDisplay.querySelector('i').className = 'fab fa-cc-visa';
        break;
      case 'mastercard':
        cardTypeIcon.querySelector('i').className = 'fab fa-cc-mastercard mastercard';
        cardTypeDisplay.querySelector('i').className = 'fab fa-cc-mastercard';
        break;
      case 'amex':
        cardTypeIcon.querySelector('i').className = 'fab fa-cc-amex amex';
        cardTypeDisplay.querySelector('i').className = 'fab fa-cc-amex';
        break;
      case 'discover':
        cardTypeIcon.querySelector('i').className = 'fab fa-cc-discover discover';
        cardTypeDisplay.querySelector('i').className = 'fab fa-cc-discover';
        break;
      default:
        cardTypeIcon.querySelector('i').className = 'far fa-credit-card';
        cardTypeDisplay.querySelector('i').className = 'far fa-credit-card';
    }
  }
  
  function setError(input, errorElement, message) {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    errorElement.textContent = message;
  }
  
  function setSuccess(input, errorElement) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    errorElement.textContent = '';
  }
  
  // Luhn algorithm for card validation
  function luhnCheck(cardNumber) {
    // Guard clause for empty strings
    if (!cardNumber) return false;
    
    // Convert string to array of digits
    let digits = cardNumber.split('').map(Number);
    
    // Starting from the right, double every second digit
    for (let i = digits.length - 2; i >= 0; i -= 2) {
      let doubled = digits[i] * 2;
      // If doubling results in a number > 9, subtract 9
      digits[i] = doubled > 9 ? doubled - 9 : doubled;
    }
    
    // Sum all digits
    const sum = digits.reduce((acc, digit) => acc + digit, 0);
    
    // Valid if sum is divisible by 10
    return sum % 10 === 0;
  }
});