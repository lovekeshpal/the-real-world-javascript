document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const tagInput = document.getElementById('tagInput');
  const tagsContainer = document.getElementById('tagsContainer');
  const selectedTags = document.getElementById('selectedTags');
  const noTagsMessage = document.getElementById('noTagsMessage');
  
  // Store all tags
  let tags = [];
  
  // Focus input on container click
  document.querySelector('.tag-input-container').addEventListener('click', function() {
    tagInput.focus();
  });
  
  // Add tag on Enter, comma, or space
  tagInput.addEventListener('keydown', function(e) {
    if ((e.key === 'Enter' || e.key === ',' || e.key === ' ') && tagInput.value.trim() !== '') {
      e.preventDefault();
      addTag();
    }
    
    // Remove last tag on Backspace if input is empty
    if (e.key === 'Backspace' && tagInput.value === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  });
  
  // Also add tag on blur (when input loses focus)
  tagInput.addEventListener('blur', function() {
    if (tagInput.value.trim() !== '') {
      addTag();
    }
  });
  
  // Add tag function
  function addTag() {
    // Clean up tag text - remove commas and trim
    let tagText = tagInput.value.trim();
    tagText = tagText.replace(/,/g, '').trim();
    
    if (tagText === '') return; // Skip empty tags
    
    // Check for duplicates
    if (tags.includes(tagText)) {
      highlightTag(tagText);
      tagInput.value = '';
      return;
    }
    
    // Add to array
    tags.push(tagText);
    
    // Create tag element (YouTube style)
    const tagElement = document.createElement('div');
    tagElement.className = 'tag';
    tagElement.innerHTML = `
      <span class="tag-text">${tagText}</span>
      <span class="tag-delete" data-tag="${tagText}">
        <i class="fas fa-times"></i>
      </span>
    `;
    
    // Add delete functionality
    const deleteBtn = tagElement.querySelector('.tag-delete');
    deleteBtn.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent bubble up to container
      const tagToRemove = this.getAttribute('data-tag');
      removeTag(tagToRemove);
    });
    
    // Add to container before the input
    tagsContainer.appendChild(tagElement);
    
    // Clear input
    tagInput.value = '';
    
    // Update display
    updateSelectedTags();
  }
  
  // Remove tag function
  function removeTag(tagText) {
    // Find index of tag
    const index = tags.indexOf(tagText);
    if (index !== -1) {
      // Remove from array
      tags.splice(index, 1);
      
      // Find and remove element with animation
      const tagElements = document.querySelectorAll('.tag');
      tagElements.forEach(el => {
        if (el.querySelector('.tag-text').textContent === tagText) {
          el.classList.add('removing');
          setTimeout(() => {
            el.remove();
          }, 150);
        }
      });
      
      updateSelectedTags();
    }
  }
  
  // Highlight existing tag
  function highlightTag(tagText) {
    const tagElements = document.querySelectorAll('.tag');
    tagElements.forEach(el => {
      if (el.querySelector('.tag-text').textContent === tagText) {
        // Flash effect
        el.style.backgroundColor = '#ffc107';
        setTimeout(() => {
          el.style.backgroundColor = '';
        }, 600);
      }
    });
  }
  
  // Update selected tags display
  function updateSelectedTags() {
    if (tags.length === 0) {
      noTagsMessage.style.display = 'block';
      selectedTags.innerHTML = '';
      selectedTags.appendChild(noTagsMessage);
    } else {
      noTagsMessage.style.display = 'none';
      
      // Create a badge for each tag
      selectedTags.innerHTML = tags.map(tag => 
        `<span class="badge badge-info mr-2 mb-2 p-2">${tag}</span>`
      ).join('');
    }
  }
});