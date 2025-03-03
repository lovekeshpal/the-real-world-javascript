document.addEventListener("DOMContentLoaded", function() {
  // DOM Elements
  const addressSearch = document.getElementById("addressSearch");
  const searchBtn = document.getElementById("searchBtn");
  const addressSuggestions = document.getElementById("addressSuggestions");
  const streetAddress = document.getElementById("streetAddress");
  const city = document.getElementById("city");
  const state = document.getElementById("state");
  const zipCode = document.getElementById("zipCode");
  const addressForm = document.getElementById("addressForm");

  // Mock address database (in a real app, this would come from an API)
  const addressDatabase = [
    {
      id: 1,
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001"
    },
    {
      id: 2,
      street: "456 Park Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001"
    },
    {
      id: 3,
      street: "789 Oak Dr",
      city: "Chicago",
      state: "IL",
      zipCode: "60007"
    },
    {
      id: 4,
      street: "101 Pine St",
      city: "Seattle",
      state: "WA",
      zipCode: "98101"
    },
    {
      id: 5,
      street: "202 Maple Rd",
      city: "Austin",
      state: "TX",
      zipCode: "73301"
    }
  ];

  // Event listeners
  searchBtn.addEventListener("click", searchAddresses);
  addressSearch.addEventListener("keyup", function(e) {
    if (e.key === "Enter") {
      searchAddresses();
    }
  });

  addressForm.addEventListener("submit", function(e) {
    e.preventDefault();
    alert("Address submitted successfully!");
  });

  // Search addresses function
  function searchAddresses() {
    const query = addressSearch.value.toLowerCase().trim();
    
    // Clear previous suggestions
    addressSuggestions.innerHTML = "";
    
    // Return if query is empty
    if (query === "") return;

    // Filter addresses based on search query
    const filteredAddresses = addressDatabase.filter(address => 
      address.street.toLowerCase().includes(query) || 
      address.city.toLowerCase().includes(query) || 
      address.state.toLowerCase().includes(query) || 
      address.zipCode.includes(query)
    );

    // Display suggestions
    if (filteredAddresses.length > 0) {
      filteredAddresses.forEach(address => {
        const suggestionItem = document.createElement("div");
        suggestionItem.className = "suggestion-item";
        suggestionItem.textContent = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
        
        suggestionItem.addEventListener("click", function() {
          fillAddressForm(address);
          addressSuggestions.innerHTML = ""; // Clear suggestions after selection
        });
        
        addressSuggestions.appendChild(suggestionItem);
      });
    } else {
      const noResults = document.createElement("div");
      noResults.className = "no-results";
      noResults.textContent = "No addresses found";
      addressSuggestions.appendChild(noResults);
    }
  }

  // Fill the address form with selected address
  function fillAddressForm(address) {
    streetAddress.value = address.street;
    city.value = address.city;
    state.value = address.state;
    zipCode.value = address.zipCode;
    
    // Highlight the fields that were auto-filled
    [streetAddress, city, state, zipCode].forEach(field => {
      field.classList.add("auto-filled");
      
      // Remove highlight after a delay
      setTimeout(() => {
        field.classList.remove("auto-filled");
      }, 1500);
    });
  }
});