document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const mainCommentForm = document.getElementById('mainCommentForm');
    const mainCommentText = document.getElementById('mainCommentText');
    const commentList = document.getElementById('commentList');
    const commentCount = document.getElementById('commentCount');
    const noCommentsMessage = document.getElementById('noCommentsMessage');
    const sortNewest = document.getElementById('sortNewest');
    const sortOldest = document.getElementById('sortOldest');
    const sortPopular = document.getElementById('sortPopular');
    const expandAllBtn = document.getElementById('expandAllBtn');
    
    // State
    let comments = [];
    let allExpanded = false;
    let currentSort = 'newest';
    let currentUser = {
      id: 'user-current',
      name: 'You',
      avatar: 'https://randomuser.me/api/portraits/men/41.jpg'
    };
    
    // Sample users for demo
    const users = [
      { id: 'user-1', name: 'Sarah Johnson', avatar: 'https://randomuser.me/api/portraits/women/33.jpg' },
      { id: 'user-2', name: 'Michael Chen', avatar: 'https://randomuser.me/api/portraits/men/62.jpg' },
      { id: 'user-3', name: 'Emma Wilson', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
      { id: 'user-4', name: 'Robert Davis', avatar: 'https://randomuser.me/api/portraits/men/22.jpg' },
      { id: 'user-5', name: 'Alexandra Lee', avatar: 'https://randomuser.me/api/portraits/women/28.jpg' }
    ];
    
    // Sample comments for demo (uncomment to start with data)
    generateSampleComments();
    
    // Add event listeners
    mainCommentForm.addEventListener('submit', handleMainCommentSubmit);
    sortNewest.addEventListener('click', () => sortComments('newest'));
    sortOldest.addEventListener('click', () => sortComments('oldest'));
    sortPopular.addEventListener('click', () => sortComments('popular'));
    expandAllBtn.addEventListener('click', toggleExpandAll);
    
    // Initialize
    renderComments();
    updateCommentCount();
    
    // Handle main comment form submission
    function handleMainCommentSubmit(e) {
      e.preventDefault();
      
      const text = mainCommentText.value.trim();
      if (text === '') return;
      
      // Create new comment
      const newComment = {
        id: 'comment-' + Date.now(),
        userId: currentUser.id,
        text: text,
        timestamp: new Date(),
        upvotes: 0,
        downvotes: 0,
        replies: [],
        expanded: true
      };
      
      // Add to comments array
      comments.unshift(newComment);
      
      // Clear form
      mainCommentText.value = '';
      
      // Update UI
      renderComments();
      updateCommentCount();
      
      // Hide no comments message
      noCommentsMessage.style.display = 'none';
    }
    
    // Handle reply submission
    function handleReplySubmit(commentId, replyText, parentId = null) {
      if (replyText.trim() === '') return;
      
      // Create new reply
      const newReply = {
        id: 'reply-' + Date.now(),
        userId: currentUser.id,
        text: replyText,
        timestamp: new Date(),
        upvotes: 0,
        downvotes: 0,
        replies: [],
        expanded: true
      };
      
      // Find the comment or reply to add this to
      if (!parentId) {
        // Direct reply to main comment
        const commentIndex = comments.findIndex(c => c.id === commentId);
        if (commentIndex !== -1) {
          comments[commentIndex].replies.unshift(newReply);
          comments[commentIndex].expanded = true; // Auto-expand when replying
        }
      } else {
        // Reply to a reply (nested)
        findAndAddNestedReply(comments, commentId, parentId, newReply);
      }
      
      // Update UI
      renderComments();
      updateCommentCount();
      
      // Return the ID of the new reply for highlighting
      return newReply.id;
    }
    
    // Find and add nested reply
    function findAndAddNestedReply(commentArray, commentId, parentId, newReply) {
      for (let comment of commentArray) {
        if (comment.id === parentId) {
          comment.replies.unshift(newReply);
          comment.expanded = true; // Auto-expand when replying
          return true;
        }
        
        if (comment.replies.length > 0) {
          if (findAndAddNestedReply(comment.replies, commentId, parentId, newReply)) {
            return true;
          }
        }
      }
      return false;
    }
    
    // Toggle comment replies visibility
    function toggleReplies(commentId) {
      // Find the comment
      const comment = findComment(comments, commentId);
      if (comment) {
        comment.expanded = !comment.expanded;
        renderComments();
      }
    }
    
    // Find a comment or reply by ID
    function findComment(commentArray, id) {
      for (let comment of commentArray) {
        if (comment.id === id) {
          return comment;
        }
        
        if (comment.replies.length > 0) {
          const found = findComment(comment.replies, id);
          if (found) return found;
        }
      }
      return null;
    }
    
    // Toggle upvote on a comment
    function toggleUpvote(commentId) {
      const comment = findComment(comments, commentId);
      if (comment) {
        if (comment.userUpvoted) {
          // Remove upvote
          comment.upvotes--;
          comment.userUpvoted = false;
        } else {
          // Add upvote, remove downvote if exists
          if (comment.userDownvoted) {
            comment.downvotes--;
            comment.userDownvoted = false;
          }
          comment.upvotes++;
          comment.userUpvoted = true;
        }
        renderComments();
      }
    }
    
    // Toggle downvote on a comment
    function toggleDownvote(commentId) {
      const comment = findComment(comments, commentId);
      if (comment) {
        if (comment.userDownvoted) {
          // Remove downvote
          comment.downvotes--;
          comment.userDownvoted = false;
        } else {
          // Add downvote, remove upvote if exists
          if (comment.userUpvoted) {
            comment.upvotes--;
            comment.userUpvoted = false;
          }
          comment.downvotes++;
          comment.userDownvoted = true;
        }
        renderComments();
      }
    }
    
    // Show reply form for a comment
    function showReplyForm(commentId) {
      // Hide all reply forms first
      document.querySelectorAll('.reply-form').forEach(form => {
        form.style.display = 'none';
      });
      
      // Show the selected reply form
      const replyForm = document.getElementById(`replyForm-${commentId}`);
      if (replyForm) {
        replyForm.style.display = 'block';
        replyForm.querySelector('textarea').focus();
      }
    }
    
    // Toggle expand all comments
    function toggleExpandAll() {
      allExpanded = !allExpanded;
      
      // Update button text
      if (allExpanded) {
        expandAllBtn.innerHTML = '<i class="fas fa-angle-double-up mr-1"></i>Collapse All';
      } else {
        expandAllBtn.innerHTML = '<i class="fas fa-angle-double-down mr-1"></i>Expand All';
      }
      
      // Expand or collapse all comments
      expandCollapseAll(comments, allExpanded);
      renderComments();
    }
    
    // Recursively expand or collapse all comments
    function expandCollapseAll(commentArray, expand) {
      for (let comment of commentArray) {
        comment.expanded = expand;
        if (comment.replies.length > 0) {
          expandCollapseAll(comment.replies, expand);
        }
      }
    }
    
    // Sort comments
    function sortComments(sortType) {
      currentSort = sortType;
      
      // Update active button
      document.querySelectorAll('.btn-group .btn').forEach(btn => {
        btn.classList.remove('active');
      });
      
      switch (sortType) {
        case 'newest':
          sortNewest.classList.add('active');
          sortCommentsRecursive(comments, (a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          break;
        case 'oldest':
          sortOldest.classList.add('active');
          sortCommentsRecursive(comments, (a, b) => new Date(a.timestamp) - new Date(b.timestamp));
          break;
        case 'popular':
          sortPopular.classList.add('active');
          sortCommentsRecursive(comments, (a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
          break;
      }
      
      renderComments();
    }
    
    // Recursively sort comments and their replies
    function sortCommentsRecursive(commentArray, compareFn) {
      // Sort this level
      commentArray.sort(compareFn);
      
      // Sort replies recursively
      for (let comment of commentArray) {
        if (comment.replies.length > 0) {
          sortCommentsRecursive(comment.replies, compareFn);
        }
      }
    }
    
    // Format timestamp
    function formatTimestamp(timestamp) {
      const now = new Date();
      const commentTime = new Date(timestamp);
      const diffSeconds = Math.floor((now - commentTime) / 1000);
      
      if (diffSeconds < 60) {
        return `${diffSeconds} seconds ago`;
      } else if (diffSeconds < 3600) {
        return `${Math.floor(diffSeconds / 60)} minutes ago`;
      } else if (diffSeconds < 86400) {
        return `${Math.floor(diffSeconds / 3600)} hours ago`;
      } else if (diffSeconds < 604800) {
        return `${Math.floor(diffSeconds / 86400)} days ago`;
      } else {
        // Format as date
        return commentTime.toLocaleDateString();
      }
    }
    
    // Get user by ID
    function getUserById(userId) {
      if (userId === currentUser.id) {
        return currentUser;
      }
      
      return users.find(user => user.id === userId) || { 
        name: 'Unknown User', 
        avatar: 'https://via.placeholder.com/40?text=?'
      };
    }
    
    // Update comment count
    function updateCommentCount() {
      let count = countAllComments(comments);
      commentCount.textContent = `${count} comment${count !== 1 ? 's' : ''}`;
    }
    
    // Count all comments and replies
    function countAllComments(commentArray) {
      let count = commentArray.length;
      
      for (let comment of commentArray) {
        if (comment.replies.length > 0) {
          count += countAllComments(comment.replies);
        }
      }
      
      return count;
    }
    
    // Render all comments
    function renderComments() {
      // Hide or show no comments message
      if (comments.length === 0) {
        noCommentsMessage.style.display = 'block';
        commentList.innerHTML = '';
        commentList.appendChild(noCommentsMessage);
        return;
      } else {
        noCommentsMessage.style.display = 'none';
      }
      
      // Clear comment list
      commentList.innerHTML = '';
      
      // Add each comment
      comments.forEach(comment => {
        const commentElement = createCommentElement(comment);
        commentList.appendChild(commentElement);
      });
    }
    
    // Create a comment element
    function createCommentElement(comment, level = 0, isReply = false) {
      const user = getUserById(comment.userId);
      const voteScore = comment.upvotes - comment.downvotes;
      
      // Create comment container
      const commentElement = document.createElement('div');
      commentElement.className = 'comment-item';
      commentElement.id = comment.id;
      
      // Create comment content
      const contentElement = document.createElement('div');
      contentElement.className = 'comment-content';
      
      // Comment header with user info
      const headerElement = document.createElement('div');
      headerElement.className = 'comment-header';
      headerElement.innerHTML = `
        <img src="${user.avatar}" alt="${user.name}" class="avatar">
        <div>
          <h6 class="user-name">${user.name}</h6>
          <span class="comment-time">${formatTimestamp(comment.timestamp)}</span>
        </div>
      `;
      
      // Comment text
      const textElement = document.createElement('div');
      textElement.className = 'comment-text';
      textElement.textContent = comment.text;
      
      // Comment footer with actions
      const footerElement = document.createElement('div');
      footerElement.className = 'd-flex align-items-center';
      
      // Vote buttons
      const voteElement = document.createElement('div');
      voteElement.className = 'vote-buttons';
      voteElement.innerHTML = `
        <button class="vote-btn ${comment.userUpvoted ? 'upvoted' : ''}" data-action="upvote" data-id="${comment.id}">
          <i class="fas fa-arrow-up"></i>
        </button>
        <span class="vote-count">${voteScore}</span>
        <button class="vote-btn ${comment.userDownvoted ? 'downvoted' : ''}" data-action="downvote" data-id="${comment.id}">
          <i class="fas fa-arrow-down"></i>
        </button>
      `;
      
      // Add event listeners for voting
      voteElement.querySelector('[data-action="upvote"]').addEventListener('click', function() {
        toggleUpvote(comment.id);
      });
      
      voteElement.querySelector('[data-action="downvote"]').addEventListener('click', function() {
        toggleDownvote(comment.id);
      });
      
      // Comment actions
      const actionsElement = document.createElement('div');
      actionsElement.className = 'comment-actions';
      
      // Reply button
      const replyButton = document.createElement('a');
      replyButton.className = 'action-btn';
      replyButton.innerHTML = '<i class="fas fa-reply"></i>Reply';
      replyButton.href = '#';
      replyButton.addEventListener('click', function(e) {
        e.preventDefault();
        showReplyForm(comment.id);
      });
      actionsElement.appendChild(replyButton);
      
      // Add voting and actions to footer
      footerElement.appendChild(voteElement);
      footerElement.appendChild(actionsElement);
      
      // Assemble comment content
      contentElement.appendChild(headerElement);
      contentElement.appendChild(textElement);
      contentElement.appendChild(footerElement);
      commentElement.appendChild(contentElement);
      
      // Create reply form
      const replyFormElement = document.createElement('div');
      replyFormElement.className = 'reply-form';
      replyFormElement.id = `replyForm-${comment.id}`;
      replyFormElement.innerHTML = `
        <div class="d-flex">
          <img src="${currentUser.avatar}" alt="${currentUser.name}" class="avatar-small mr-2">
          <div class="flex-grow-1">
            <textarea class="form-control mb-2" rows="2" placeholder="Write a reply..."></textarea>
            <div class="text-right">
              <button class="btn btn-sm btn-secondary mr-2 cancel-reply-btn">Cancel</button>
              <button class="btn btn-sm btn-primary submit-reply-btn">Post Reply</button>
            </div>
          </div>
        </div>
      `;
      
      // Add event listeners for reply form
      replyFormElement.querySelector('.submit-reply-btn').addEventListener('click', function() {
        const replyText = replyFormElement.querySelector('textarea').value;
        const parentId = isReply ? comment.id : null;
        const mainCommentId = isReply ? findMainCommentId(comments, comment.id) : comment.id;
        
        const newReplyId = handleReplySubmit(mainCommentId, replyText, parentId);
        
        // Hide the form
        replyFormElement.style.display = 'none';
        
        // Highlight the new reply
        setTimeout(() => {
          const newReplyElement = document.getElementById(newReplyId);
          if (newReplyElement) {
            newReplyElement.querySelector('.comment-content').classList.add('highlight');
            newReplyElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 100);
      });
      
      replyFormElement.querySelector('.cancel-reply-btn').addEventListener('click', function() {
        replyFormElement.style.display = 'none';
      });
      
      commentElement.appendChild(replyFormElement);
      
      // Add replies if there are any
      if (comment.replies && comment.replies.length > 0) {
        // Create toggle button for replies
        const toggleElement = document.createElement('div');
        toggleElement.className = `reply-toggle ${comment.expanded ? '' : 'collapsed'}`;
        toggleElement.innerHTML = `
          <i class="fas fa-chevron-down toggle-icon mr-1"></i>
          <span>${comment.replies.length} repl${comment.replies.length === 1 ? 'y' : 'ies'}</span>
        `;
        
        toggleElement.addEventListener('click', function() {
          toggleReplies(comment.id);
        });
        
        commentElement.appendChild(toggleElement);
        
        // Create replies container
        const repliesElement = document.createElement('div');
        repliesElement.className = `replies ${comment.expanded ? '' : 'hidden-replies'}`;
        
        // Add each reply
        comment.replies.forEach(reply => {
          const replyElement = createCommentElement(reply, level + 1, true);
          repliesElement.appendChild(replyElement);
        });
        
        commentElement.appendChild(repliesElement);
      }
      
      return commentElement;
    }
    
    // Find the main comment ID for a given reply
    function findMainCommentId(commentArray, replyId, parentId = null) {
      for (let comment of commentArray) {
        // Check if this comment has the reply
        const hasReply = comment.replies.some(r => r.id === replyId);
        if (hasReply) {
          return parentId || comment.id;
        }
        
        // Check nested replies
        for (let reply of comment.replies) {
          if (reply.id === replyId) {
            return parentId || comment.id;
          }
          
          if (reply.replies.length > 0) {
            const foundId = findMainCommentId(
              reply.replies, 
              replyId, 
              parentId || comment.id
            );
            if (foundId) return foundId;
          }
        }
      }
      return null;
    }
    
    // Generate sample comments for demo
    function generateSampleComments() {
      comments = [
        {
          id: 'comment-1',
          userId: 'user-1',
          text: "This is a great article! I've been learning JavaScript for the past year and these tips are really helpful.",
          timestamp: new Date(Date.now() - 86400000 * 2), // 2 days ago
          upvotes: 12,
          downvotes: 2,
          expanded: true,
          replies: [
            {
              id: 'reply-1',
              userId: 'user-3',
              text: 'I agree! The section on ES6 features was particularly useful for me.',
              timestamp: new Date(Date.now() - 86400000 * 1), // 1 day ago
              upvotes: 5,
              downvotes: 1,
              expanded: true,
              replies: [
                {
                  id: 'reply-2',
                  userId: 'user-1',
                  text: 'Yes, arrow functions and destructuring have really changed how I write code.',
                  timestamp: new Date(Date.now() - 3600000 * 20), // 20 hours ago
                  upvotes: 3,
                  downvotes: 0,
                  expanded: true,
                  replies: []
                }
              ]
            },
            {
              id: 'reply-3',
              userId: 'user-4',
              text: 'What resources would you recommend for someone just starting out?',
              timestamp: new Date(Date.now() - 3600000 * 10), // 10 hours ago
              upvotes: 2,
              downvotes: 0,
              expanded: true,
              replies: []
            }
          ]
        },
        {
          id: 'comment-2',
          userId: 'user-2',
          text: 'I think the article missed some important points about performance optimization. It would be great to see a follow-up focused on that topic.',
          timestamp: new Date(Date.now() - 86400000 * 1.5), // 1.5 days ago
          upvotes: 8,
          downvotes: 3,
          expanded: true,
          replies: []
        },
        {
          id: 'comment-3',
          userId: 'user-5',
          text: 'Does anyone know if these techniques work well with modern frameworks like React or Vue?',
          timestamp: new Date(Date.now() - 3600000 * 5), // 5 hours ago
          upvotes: 4,
          downvotes: 0,
          expanded: true,
          replies: [
            {
              id: 'reply-4',
              userId: 'user-2',
              text: 'Absolutely! Most of these JavaScript skills form the foundation of any framework work.',
              timestamp: new Date(Date.now() - 3600000 * 3), // 3 hours ago
              upvotes: 2,
              downvotes: 0,
              expanded: true,
              replies: []
            }
          ]
        }
      ];
    }
  });