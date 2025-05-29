document.addEventListener('DOMContentLoaded', function() {
    // Sample user data (in a real app this would come from a database)
    const userData = {
        'michael_scott': {
            name: 'Michael Scott',
            username: 'michael_scott',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            bio: 'Regional Manager at Dunder Mifflin. That\'s what she said!',
            posts: 428,
            followers: 1243,
            following: 57,
            gradient: 'blue-gradient'
        },
        'jim_halpert': {
            name: 'Jim Halpert',
            username: 'jim_halpert',
            avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
            bio: 'Sales Representative. Loves pranks and paper sales.',
            posts: 215,
            followers: 1569,
            following: 132,
            gradient: 'green-gradient'
        },
        'pam_beesly': {
            name: 'Pam Beesly',
            username: 'pam_beesly',
            avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
            bio: 'Receptionist and aspiring artist. Dog lover.',
            posts: 302,
            followers: 1427,
            following: 110,
            gradient: 'purple-gradient'
        },
        'dwight_schrute': {
            name: 'Dwight Schrute',
            username: 'dwight_schrute',
            avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
            bio: 'Assistant (to the) Regional Manager. Beet farmer. Bear expert.',
            posts: 567,
            followers: 891,
            following: 28,
            gradient: 'orange-gradient'
        },
        'angela_martin': {
            name: 'Angela Martin',
            username: 'angela_martin',
            avatar: 'https://randomuser.me/api/portraits/women/58.jpg',
            bio: 'Senior Accountant. Cat enthusiast. Standards keeper.',
            posts: 198,
            followers: 421,
            following: 16,
            gradient: 'blue-gradient'
        }
    };
    
    // DOM Elements
    const profileCardContainer = document.getElementById('profileCardContainer');
    const usernameElements = document.querySelectorAll('.username');
    
    // Keep track of open card and timers
    let activeCard = null;
    let showTimeout = null;
    let hideTimeout = null;
    
    // Create profile cards for each username
    usernameElements.forEach(element => {
        const username = element.getAttribute('data-username');
        if (userData[username]) {
            const user = userData[username];
            
            // Create a profile card for this user
            const card = createProfileCard(user);
            profileCardContainer.appendChild(card);
            
            // Setup mouse enter event
            element.addEventListener('mouseenter', function(e) {
                // Clear any hide timeout
                if (hideTimeout) {
                    clearTimeout(hideTimeout);
                    hideTimeout = null;
                }
                
                // Set a small delay before showing card
                showTimeout = setTimeout(() => {
                    // Hide any existing card
                    if (activeCard) {
                        activeCard.classList.remove('visible');
                    }
                    
                    // Position and show this card
                    positionCard(card, e.target);
                    card.classList.add('visible');
                    activeCard = card;
                }, 300);
            });
            
            // Setup mouse leave event
            element.addEventListener('mouseleave', function() {
                // Clear show timeout if exists
                if (showTimeout) {
                    clearTimeout(showTimeout);
                    showTimeout = null;
                }
                
                // Set delay before hiding
                hideTimeout = setTimeout(() => {
                    if (activeCard) {
                        activeCard.classList.remove('visible');
                        activeCard = null;
                    }
                }, 300);
            });
            
            // Setup mouse enter for the card itself
            card.addEventListener('mouseenter', function() {
                // Clear hide timeout if exists
                if (hideTimeout) {
                    clearTimeout(hideTimeout);
                    hideTimeout = null;
                }
            });
            
            // Setup mouse leave for the card
            card.addEventListener('mouseleave', function() {
                hideTimeout = setTimeout(() => {
                    card.classList.remove('visible');
                    activeCard = null;
                }, 300);
            });
        }
    });
    
    // Create profile card element
    function createProfileCard(user) {
        const card = document.createElement('div');
        card.className = 'profile-card';
        card.id = `profile-card-${user.username}`;
        
        card.innerHTML = `
            <div class="profile-card-header ${user.gradient}">
                <img src="${user.avatar}" alt="${user.name}" class="profile-avatar">
            </div>
            <div class="arrow-up"></div>
            <div class="profile-card-body">
                <h4 class="profile-name">${user.name}</h4>
                <div class="profile-username">@${user.username}</div>
                <p class="profile-bio">${user.bio}</p>
                <div class="profile-stats">
                    <div class="stat-item">
                        <span class="stat-value">${user.posts}</span>
                        <span class="stat-label">Posts</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${user.followers}</span>
                        <span class="stat-label">Followers</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${user.following}</span>
                        <span class="stat-label">Following</span>
                    </div>
                </div>
            </div>
            <div class="profile-card-footer">
                <button class="btn btn-sm btn-primary">Follow</button>
                <button class="btn btn-sm btn-outline-secondary ml-2">Message</button>
            </div>
        `;
        
        return card;
    }
    
    // Position the card relative to the username element
    function positionCard(card, element) {
        const rect = element.getBoundingClientRect();
        const cardWidth = 300; // Width of our card
        
        // Get the arrow element inside the card
        const arrow = card.querySelector('.arrow-up');
        
        // Calculate horizontal position
        let leftPos = rect.left;
        
        // Make sure card doesn't go off the right side of the screen
        if (leftPos + cardWidth > window.innerWidth - 20) {
            // If it would go offscreen, position it from the right
            leftPos = window.innerWidth - cardWidth - 20;
        }
        
        // Position arrow to align with username
        const arrowLeftPos = rect.left - leftPos + (rect.width / 2) - 10;
        arrow.style.left = `${arrowLeftPos}px`;
        
        // Position the card
        card.style.left = `${leftPos}px`;
        
        // Position below or above the username element depending on available space
        const spaceBelow = window.innerHeight - rect.bottom;
        const cardHeight = 280; // Approximate height of card
        
        if (spaceBelow < cardHeight + 10 && rect.top > cardHeight) {
            // Not enough space below, plenty above - show above
            card.style.top = `${rect.top - cardHeight - 10}px`;
            // Move arrow to bottom
            arrow.style.top = 'auto';
            arrow.style.bottom = '-10px';
            arrow.style.borderTopColor = 'white';
            arrow.style.borderBottomColor = 'transparent';
            arrow.className = 'arrow-down';
        } else {
            // Show below
            card.style.top = `${rect.bottom + 10}px`;
            // Reset arrow to top
            arrow.style.top = '-10px';
            arrow.style.bottom = 'auto';
            arrow.className = 'arrow-up';
        }
    }
});