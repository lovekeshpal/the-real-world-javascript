document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const commentBox = document.getElementById('commentBox');
  const mentionDropdown = document.getElementById('mentionDropdown');
  const mentionList = document.getElementById('mentionList');
  const postBtn = document.getElementById('postBtn');
  const commentsContainer = document.getElementById('commentsContainer');
  const availableUsers = document.getElementById('availableUsers');
  
  // Mock user data
  const users = [
    { id: 1, name: 'John Smith', username: 'johnsmith', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: 2, name: 'Emma Johnson', username: 'emmaj', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 3, name: 'Michael Brown', username: 'mbrown', avatar: 'https://randomuser.me/api/portraits/men/22.jpg' },
    { id: 4, name: 'Olivia Davis', username: 'odavis', avatar: 'https://randomuser.me/api/portraits/women/17.jpg' },
    { id: 5, name: 'William Wilson', username: 'wwilson', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
    { id: 6, name: 'Sophia Martinez', username: 'smartinez', avatar: 'https://randomuser.me/api/portraits/women/29.jpg' },
    { id: 7, name: 'James Taylor', username: 'jtaylor', avatar: 'https://randomuser.me/api/portraits/men/15.jpg' },
    { id: 8, name: 'Ava Anderson', username: 'aanderson', avatar: 'https://randomuser.me/api/portraits/women/30.jpg' }
  ];
  
  // Variables for mention detection
  let isMentioning = false;
  let mentionStart = 0;
  let mentionText = '';
  let selectedIndex = -1;
  let filteredUsers = [];
  
  // Initialize - display available users
  displayAvailableUsers();
  
  // Event listeners
  commentBox.addEventListener('input', handleInput);
  commentBox.addEventListener('keydown', handleKeyDown);
  postBtn.addEventListener('click', postComment);
  
  // Display user cards
  function displayAvailableUsers() {
    // Clear the container
    availableUsers.innerHTML = '';
    
    // Add each user card
    users.forEach(user => {
      const userCol = document.createElement('div');
      userCol.className = 'col-md-3 col-6';
      userCol.innerHTML = `
        <div class="user-card">
          <img src="${user.avatar}" class="user-card-img" alt="${user.name}">
          <div>
            <div class="user-name">${user.name}</div>
            <div class="user-handle text-muted">@${user.username}</div>
          </div>
        </div>
      `;
      availableUsers.appendChild(userCol);
    });
  }
  
  // Handle input in comment box
  function handleInput() {
    const text = commentBox.value;
    const cursorPosition = commentBox.selectionStart;
    
    // Look for @ symbol before cursor
    const beforeCursor = text.substring(0, cursorPosition);
    const mentionMatch = beforeCursor.match(/@(\w*)$/);
    
    if (mentionMatch) {
      // Start mentioning mode
      isMentioning = true;
      mentionStart = mentionMatch.index;
      mentionText = mentionMatch[1]; // Text after @
      
      // Filter users based on typed text
      filterUsers();
      
      // Position dropdown
      positionDropdown();
      
      // Show dropdown
      mentionDropdown.classList.add('show');
    } else {
      // Close dropdown if we're not mentioning anymore
      closeDropdown();
    }
  }
  
  // Filter users based on mention text
  function filterUsers() {
    // Reset selected index
    selectedIndex = -1;
    
    // Filter users based on typed text
    if (mentionText.trim() === '') {
      // Show all users if no text is typed yet
      filteredUsers = [...users];
    } else {
      // Filter by name or username
      filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(mentionText.toLowerCase()) || 
        user.username.toLowerCase().includes(mentionText.toLowerCase())
      );
    }
    
    // Clear and populate the dropdown
    mentionList.innerHTML = '';
    
    if (filteredUsers.length === 0) {
      mentionList.innerHTML = '<div class="p-3 text-center text-muted">No matching users found</div>';
    } else {
      filteredUsers.forEach(user => {
        const userElement = document.createElement('div');
        userElement.className = 'user-suggestion';
        userElement.innerHTML = `
          <img src="${user.avatar}" class="user-avatar" alt="${user.name}">
          <div class="user-info">
            <div class="user-name">${user.name}</div>
            <div class="user-handle">@${user.username}</div>
          </div>
        `;
        
        // Add click event to select this user
        userElement.addEventListener('click', () => selectUser(user));
        
        // Add to dropdown
        mentionList.appendChild(userElement);
      });
    }
  }
  
  // Handle key navigation in dropdown
  function handleKeyDown(e) {
    if (!isMentioning) return;
    
    const suggestions = mentionList.querySelectorAll('.user-suggestion');
    
    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, filteredUsers.length - 1);
        highlightSelected();
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        highlightSelected();
        break;
        
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredUsers.length) {
          selectUser(filteredUsers[selectedIndex]);
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        closeDropdown();
        break;
    }
  }
  
  // Highlight selected user
  function highlightSelected() {
    const suggestions = mentionList.querySelectorAll('.user-suggestion');
    
    // Remove active class from all suggestions
    suggestions.forEach((suggestion, index) => {
      suggestion.classList.remove('active');
    });
    
    // Add active class to selected suggestion
    if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
      suggestions[selectedIndex].classList.add('active');
      
      // Ensure the selected item is visible in the dropdown
      suggestions[selectedIndex].scrollIntoView({ block: 'nearest' });
    }
  }
  
  // Select a user from the dropdown
  function selectUser(user) {
    // Get text before and after the mention
    const text = commentBox.value;
    const beforeMention = text.substring(0, mentionStart);
    const afterMention = text.substring(commentBox.selectionStart);
    
    // Replace the current mention text with the selected user's username
    commentBox.value = beforeMention + '@' + user.username + ' ' + afterMention;
    
    // Set cursor position after the inserted mention
    const newCursorPosition = mentionStart + user.username.length + 2; // +2 for @ and space
    commentBox.focus();
    commentBox.setSelectionRange(newCursorPosition, newCursorPosition);
    
    // Close the dropdown
    closeDropdown();
  }
  
  // Position the dropdown near the current @ symbol
  function positionDropdown() {
    // Get position of textarea
    const textareaRect = commentBox.getBoundingClientRect();
    
    // Get position of current line with @ symbol
    // This is a simplified approach - for more accuracy, you'd need to measure text width
    const lines = commentBox.value.substring(0, mentionStart).split('\n');
    const lineHeight = parseInt(window.getComputedStyle(commentBox).lineHeight);
    const topOffset = (lines.length - 1) * lineHeight + 25; // 25px extra space
    
    // Set dropdown position
    mentionDropdown.style.top = `${topOffset}px`;
    mentionDropdown.style.left = '5px';
  }
  
  // Close the mention dropdown
  function closeDropdown() {
    isMentioning = false;
    mentionDropdown.classList.remove('show');
    selectedIndex = -1;
  }
  
  // Post a comment
  function postComment() {
    const commentText = commentBox.value.trim();
    
    if (commentText === '') {
      // Don't post empty comments
      return;
    }
    
    // If this is the first comment, clear the "no comments" message
    if (commentsContainer.querySelector('.text-muted')) {
      commentsContainer.innerHTML = '';
    }
    
    // Create a new comment
    const comment = document.createElement('div');
    comment.className = 'comment-item';
    
    // Format comment text to highlight mentions
    const formattedText = formatComment(commentText);
    
    // Current timestamp
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Sample commenter info (could be fetched from current user)
    comment.innerHTML = `
      <div class="comment-header">
        <img src="https://randomuser.me/api/portraits/women/44.jpg" class="commenter-avatar" alt="Your Avatar">
        <h6 class="commenter-name">You</h6>
        <span class="comment-timestamp">${timeStr}</span>
      </div>
      <div class="comment-content">
        ${formattedText}
      </div>
    `;
    
    // Add to the comments container
    commentsContainer.prepend(comment);
    
    // Clear the comment box
    commentBox.value = '';
    
    // Add a nice animation to the new comment
    comment.style.opacity = '0';
    comment.style.transform = 'translateY(10px)';
    setTimeout(() => {
      comment.style.transition = 'all 0.3s ease';
      comment.style.opacity = '1';
      comment.style.transform = 'translateY(0)';
    }, 10);
  }
  
  // Format comment text to highlight mentions
  function formatComment(text) {
    // Replace @username with styled mention
    return text.replace(/@(\w+)/g, (match, username) => {
      // Check if username exists in our users list
      const user = users.find(u => u.username === username);
      
      if (user) {
        return `<a href="#" class="user-mention" data-user-id="${user.id}">@${username}</a>`;
      } else {
        return match; // Return as is if no matching user
      }
    });
  }
});