document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const textInput = document.getElementById('textInput');
  const displayArea = document.getElementById('displayArea');
  const colorOptions = document.querySelectorAll('.color-option');
  const hashtagList = document.getElementById('hashtagList');
  
  // Current settings
  let currentColor = 'primary';
  
  // Initialize
  textInput.focus();
  
  // Event listener for input
  textInput.addEventListener('input', function() {
    processText();
  });
  
  // Event listeners for color options
  colorOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Remove active class from all options
      colorOptions.forEach(opt => opt.classList.remove('active'));
      
      // Add active class to selected option
      this.classList.add('active');
      
      // Update current color
      currentColor = this.getAttribute('data-color');
      
      // Reprocess text with the new color
      processText();
    });
  });
  
  // Main function to process text and highlight hashtags
  function processText() {
    const text = textInput.value;
    
    if (text.trim() === '') {
      displayArea.innerHTML = 'Your highlighted text will appear here...';
      hashtagList.innerHTML = '<p class="text-muted">No hashtags detected yet.</p>';
      return;
    }
    
    // Find all hashtags in the text
    const hashtags = findHashtags(text);
    
    // Highlight hashtags in the display area
    let processedText = text;
    
    // Sort hashtags by length (to avoid replacing partial hashtags)
    const sortedHashtags = [...hashtags].sort((a, b) => b.length - a.length);
    
    sortedHashtags.forEach(hashtag => {
      // Create a regex that matches the hashtag but not when it's part of a larger word
      const regex = new RegExp(`${escapeRegExp(hashtag)}\\b`, 'g');
      
      // Replace the hashtag with a highlighted version
      processedText = processedText.replace(
        regex, 
        `<span class="hashtag ${currentColor}">${hashtag}</span>`
      );
    });
    
    // Replace line breaks with <br> for HTML display
    processedText = processedText.replace(/\n/g, '<br>');
    
    // Update display area
    displayArea.innerHTML = processedText;
    
    // Update hashtag stats
    updateHashtagStats(hashtags);
  }
  
  // Function to find all hashtags in a text
  function findHashtags(text) {
    const hashtagRegex = /#[a-zA-Z0-9_]+\b/g;
    const matches = text.match(hashtagRegex);
    return matches || [];
  }
  
  // Function to escape special regex characters in a string
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  // Function to update hashtag statistics
  function updateHashtagStats(hashtags) {
    if (hashtags.length === 0) {
      hashtagList.innerHTML = '<p class="text-muted">No hashtags detected yet.</p>';
      return;
    }
    
    // Count occurrences of each hashtag
    const hashtagCounts = {};
    hashtags.forEach(hashtag => {
      hashtagCounts[hashtag] = (hashtagCounts[hashtag] || 0) + 1;
    });
    
    // Create HTML for hashtag list
    let listHTML = '';
    
    // Sort hashtags by count (descending)
    const sortedHashtags = Object.keys(hashtagCounts).sort((a, b) => 
      hashtagCounts[b] - hashtagCounts[a]
    );
    
    sortedHashtags.forEach(hashtag => {
      listHTML += `
        <div class="hashtag-count ${currentColor}">
          ${hashtag} 
          <span class="badge badge-${currentColor} ml-1">${hashtagCounts[hashtag]}</span>
        </div>
      `;
    });
    
    // Update hashtag list
    hashtagList.innerHTML = listHTML;
  }
});