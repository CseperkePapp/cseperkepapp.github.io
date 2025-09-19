// TMDb API Configuration
const TMDB_API_KEY = 'your_api_key_here';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

class MovieDatabase {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async searchMovies(query) {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`
    );
    return response.json();
  }

  async getMovieDetails(movieId) {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${this.apiKey}&append_to_response=credits,reviews,images`
    );
    return response.json();
  }

  getImageUrl(imagePath, size = 'w500') {
    return imagePath ? `https://image.tmdb.org/t/p/${size}${imagePath}` : null;
  }

  getImdbUrl(imdbId) {
    return `https://www.imdb.com/title/${imdbId}/`;
  }
}

class MovieInfoDisplay {
  constructor(containerId, movieDb) {
    this.container = document.getElementById(containerId);
    this.movieDb = movieDb;
  }

  async displayMovie(movieId) {
    try {
      const movie = await this.movieDb.getMovieDetails(movieId);
      this.renderMovieInfo(movie);
    } catch (error) {
      this.container.innerHTML = `<p>Error loading movie data: ${error.message}</p>`;
    }
  }

  renderMovieInfo(movie) {
    const posterUrl = this.movieDb.getImageUrl(movie.poster_path);
    const backdropUrl = this.movieDb.getImageUrl(movie.backdrop_path, 'w1280');
    const imdbUrl = movie.imdb_id ? this.movieDb.getImdbUrl(movie.imdb_id) : null;
    
    // Get director from credits
    const director = movie.credits?.crew?.find(person => person.job === 'Director');
    
    // Get main cast (first 5)
    const mainCast = movie.credits?.cast?.slice(0, 5) || [];
    
    // Get first review
    const firstReview = movie.reviews?.results?.[0];

    this.container.innerHTML = `
      <div class="movie-info">
        ${backdropUrl ? `<div class="movie-backdrop" style="background-image: url('${backdropUrl}')"></div>` : ''}
        
        <div class="movie-content">
          <div class="movie-header">
            ${posterUrl ? `<img src="${posterUrl}" alt="${movie.title} poster" class="movie-poster">` : ''}
            
            <div class="movie-details">
              <h1 class="movie-title">${movie.title}</h1>
              ${movie.tagline ? `<p class="movie-tagline">"${movie.tagline}"</p>` : ''}
              
              <div class="movie-meta">
                <span class="release-date">${movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}</span>
                <span class="runtime">${movie.runtime ? `${movie.runtime} min` : ''}</span>
                <span class="rating">⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}/10</span>
              </div>

              <div class="genres">
                ${movie.genres?.map(genre => `<span class="genre-tag">${genre.name}</span>`).join('') || ''}
              </div>

              ${director ? `<p class="director"><strong>Director:</strong> ${director.name}</p>` : ''}
            </div>
          </div>

          <div class="movie-body">
            ${movie.overview ? `
              <section class="overview">
                <h3>Overview</h3>
                <p>${movie.overview}</p>
              </section>
            ` : ''}

            ${mainCast.length > 0 ? `
              <section class="cast">
                <h3>Cast</h3>
                <div class="cast-list">
                  ${mainCast.map(actor => `
                    <div class="cast-member">
                      <strong>${actor.name}</strong> as ${actor.character}
                    </div>
                  `).join('')}
                </div>
              </section>
            ` : ''}

            ${firstReview ? `
              <section class="reviews">
                <h3>User Review</h3>
                <div class="review">
                  <p class="review-author"><strong>${firstReview.author}</strong></p>
                  <p class="review-content">${firstReview.content.substring(0, 300)}${firstReview.content.length > 300 ? '...' : ''}</p>
                </div>
              </section>
            ` : ''}

            <div class="external-links">
              ${imdbUrl ? `<a href="${imdbUrl}" target="_blank" class="imdb-link">View on IMDb</a>` : ''}
              <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank" class="tmdb-link">View on TMDb</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async searchAndDisplay(query) {
    try {
      const searchResults = await this.movieDb.searchMovies(query);
      if (searchResults.results && searchResults.results.length > 0) {
        // Display the first result
        await this.displayMovie(searchResults.results[0].id);
      } else {
        this.container.innerHTML = '<p>No movies found for that search.</p>';
      }
    } catch (error) {
      this.container.innerHTML = `<p>Error searching for movies: ${error.message}</p>`;
    }
  }
}

// Usage Example
document.addEventListener('DOMContentLoaded', function() {
  const movieDb = new MovieDatabase(TMDB_API_KEY);
  const movieDisplay = new MovieInfoDisplay('movie-container', movieDb);

  // Example: Display a specific movie (The Matrix = ID 603)
  movieDisplay.displayMovie(603);

  // Example: Search functionality
  const searchForm = document.getElementById('movie-search-form');
  const searchInput = document.getElementById('movie-search-input');
  
  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        movieDisplay.searchAndDisplay(query);
      }
    });
  }
});

// Alternative: Async/await function for direct use
async function displayMovieById(movieId, containerId) {
  const movieDb = new MovieDatabase(TMDB_API_KEY);
  const movieDisplay = new MovieInfoDisplay(containerId, movieDb);
  await movieDisplay.displayMovie(movieId);
}