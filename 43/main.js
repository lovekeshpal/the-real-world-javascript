document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const moviesTrack = document.getElementById('moviesTrack');
  const moviesCarousel = document.getElementById('moviesCarousel');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const loadingSpinner = document.getElementById('loadingSpinner');
  const errorContainer = document.getElementById('errorContainer');
  
  // Modal Elements
  const modalTitle = document.getElementById('modalTitle');
  const modalPoster = document.getElementById('modalPoster');
  const modalRating = document.getElementById('modalRating');
  const modalReleaseDate = document.getElementById('modalReleaseDate');
  const modalOverview = document.getElementById('modalOverview');
  const modalGenres = document.getElementById('modalGenres');
  const modalTrailer = document.getElementById('modalTrailer');
  
  // TMDB API Configuration
  const API_KEY = '9d2ac0e411cefe72dbf19a4500943adb'; // Replace with your TMDB API key
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
  const POSTER_SIZE = 'w500';
  
  // Carousel state
  let position = 0;
  let cardWidth = 240; // Card width + margin
  let visibleCards = 0;
  let totalCards = 0;
  
  // Fetch trending movies
  async function fetchTrendingMovies() {
    try {
      // Show loading spinner
      loadingSpinner.style.display = 'block';
      errorContainer.style.display = 'none';
      
      // Fetch movies from TMDB API
      const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch trending movies');
      }
      
      const data = await response.json();
      renderMovies(data.results);
      
      // Hide loading spinner and show carousel
      loadingSpinner.style.display = 'none';
      moviesCarousel.style.display = 'block';
      
      // Update carousel state
      updateCarouselState();
      
      // Add event listeners after movies are loaded
      window.addEventListener('resize', updateCarouselState);
      prevBtn.addEventListener('click', scrollPrev);
      nextBtn.addEventListener('click', scrollNext);
      
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      loadingSpinner.style.display = 'none';
      errorContainer.style.display = 'block';
      errorContainer.textContent = error.message || 'Unable to load trending movies. Please try again later.';
    }
  }
  
  // Render movies
  function renderMovies(movies) {
    moviesTrack.innerHTML = '';
    totalCards = movies.length;
    
    movies.forEach(movie => {
      // Create movie card
      const movieCard = document.createElement('div');
      movieCard.className = 'movie-card';
      movieCard.dataset.id = movie.id;
      
      // Create rating class based on vote average
      let ratingClass = 'rating-medium';
      if (movie.vote_average >= 7.5) {
        ratingClass = 'rating-high';
      } else if (movie.vote_average < 6) {
        ratingClass = 'rating-low';
      }
      
      // Create star rating
      const stars = getStarRating(movie.vote_average);
      
      // Format release date
      const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown';
      
      // Set HTML content
      movieCard.innerHTML = `
        <div class="movie-poster">
          <img src="${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path || ''}" alt="${movie.title}" 
            onerror="this.src='https://via.placeholder.com/220x330?text=No+Image'">
          <div class="movie-rating ${ratingClass}">${movie.vote_average.toFixed(1)}</div>
        </div>
        <div class="movie-info">
          <h3 class="movie-title">${movie.title}</h3>
          <div class="d-flex justify-content-between align-items-center">
            <span class="movie-year">${releaseYear}</span>
            <span class="stars">${stars}</span>
          </div>
        </div>
      `;
      
      // Add click event to show movie details
      movieCard.addEventListener('click', () => showMovieDetails(movie.id));
      
      // Append card to track
      moviesTrack.appendChild(movieCard);
    });
  }
  
  // Update carousel state based on screen size
  function updateCarouselState() {
    const containerWidth = moviesCarousel.clientWidth;
    const movieCard = document.querySelector('.movie-card');
    
    if (movieCard) {
      cardWidth = movieCard.offsetWidth + parseInt(getComputedStyle(movieCard).marginRight);
      visibleCards = Math.floor(containerWidth / cardWidth);
      
      // Reset position if needed
      if (position < 0) {
        position = 0;
        updateCarouselPosition();
      } else if (position > totalCards - visibleCards) {
        position = Math.max(0, totalCards - visibleCards);
        updateCarouselPosition();
      }
      
      // Update button states
      updateButtonStates();
    }
  }
  
  // Scroll to previous set of movies
  function scrollPrev() {
    position = Math.max(0, position - visibleCards);
    updateCarouselPosition();
    updateButtonStates();
  }
  
  // Scroll to next set of movies
  function scrollNext() {
    position = Math.min(totalCards - visibleCards, position + visibleCards);
    updateCarouselPosition();
    updateButtonStates();
  }
  
  // Update carousel position
  function updateCarouselPosition() {
    moviesTrack.style.transform = `translateX(-${position * cardWidth}px)`;
  }
  
  // Update button states
  function updateButtonStates() {
    prevBtn.disabled = position === 0;
    nextBtn.disabled = position >= totalCards - visibleCards;
    
    prevBtn.classList.toggle('disabled', position === 0);
    nextBtn.classList.toggle('disabled', position >= totalCards - visibleCards);
  }
  
  // Get star rating HTML
  function getStarRating(rating) {
    const fullStars = Math.floor(rating / 2);
    const halfStar = rating % 2 >= 1 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (halfStar) {
      starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
  }
  
  // Show movie details in modal
  async function showMovieDetails(movieId) {
    try {
      // Show loading in modal
      modalTitle.textContent = 'Loading...';
      modalOverview.textContent = '';
      modalRating.innerHTML = '';
      modalReleaseDate.textContent = '';
      modalGenres.innerHTML = '';
      modalTrailer.style.display = 'none';
      
      // Show modal
      $('#movieModal').modal('show');
      
      // Fetch movie details
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch movie details');
      }
      
      const movie = await response.json();
      
      // Update modal content
      modalTitle.textContent = movie.title;
      modalPoster.src = `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path || ''}`;
      modalPoster.onerror = () => {
        modalPoster.src = 'https://via.placeholder.com/500x750?text=No+Image';
      };
      
      modalRating.innerHTML = `${getStarRating(movie.vote_average)} <span class="ml-2">${movie.vote_average.toFixed(1)}/10</span>`;
      modalReleaseDate.textContent = new Date(movie.release_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      modalOverview.textContent = movie.overview;
      
      // Display genres
      modalGenres.innerHTML = '';
      movie.genres.forEach(genre => {
        const badge = document.createElement('span');
        badge.className = 'badge badge-secondary';
        badge.textContent = genre.name;
        modalGenres.appendChild(badge);
      });
      
      // Show trailer button if available
      const trailer = movie.videos.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
      if (trailer) {
        modalTrailer.href = `https://www.youtube.com/watch?v=${trailer.key}`;
        modalTrailer.style.display = 'inline-block';
      } else {
        modalTrailer.style.display = 'none';
      }
      
    } catch (error) {
      console.error('Error fetching movie details:', error);
      modalTitle.textContent = 'Error Loading Movie Details';
      modalOverview.textContent = 'Unable to load movie details. Please try again later.';
    }
  }
  
  // Initialize
  fetchTrendingMovies();
});