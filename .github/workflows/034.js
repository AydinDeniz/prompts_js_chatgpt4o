// HTML for the AI-based music recommendation system (assumed to be in your HTML file)
/*
<div id="music-recommender">
  <input type="text" id="search-query" placeholder="Search for a song or artist" />
  <button id="search-button">Search</button>
  <div id="search-results"></div>
  <h3>Recommended for You</h3>
  <ul id="recommendation-list"></ul>
</div>
*/

const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken('YOUR_SPOTIFY_ACCESS_TOKEN');

class MusicRecommender {
  constructor() {
    this.setupEventListeners();
    this.loadUserHistory();
    this.generateRecommendations();
  }

  async searchTracks(query) {
    try {
      const response = await spotifyApi.searchTracks(query);
      this.displaySearchResults(response.tracks.items);
    } catch (error) {
      console.error('Error searching tracks:', error);
    }
  }

  async getTrackFeatures(trackId) {
    try {
      return await spotifyApi.getAudioFeaturesForTrack(trackId);
    } catch (error) {
      console.error('Error fetching track features:', error);
    }
  }

  async generateRecommendations() {
    const userHistory = this.loadUserHistory();
    if (userHistory.length === 0) {
      this.displayRecommendations([]);
      return;
    }

    const trackIds = userHistory.map(item => item.id);
    const response = await spotifyApi.getRecommendations({
      seed_tracks: trackIds.slice(0, 5),
      limit: 10,
    });

    this.displayRecommendations(response.tracks);
  }

  displaySearchResults(tracks) {
    const searchResultsDiv = document.getElementById('search-results');
    searchResultsDiv.innerHTML = '';

    tracks.forEach(track => {
      const trackElement = document.createElement('div');
      trackElement.className = 'search-result';
      trackElement.innerHTML = `
        <p>${track.name} by ${track.artists.map(artist => artist.name).join(', ')}</p>
        <button onclick="musicRecommender.addToHistory('${track.id}')">Add to History</button>
      `;

      searchResultsDiv.appendChild(trackElement);
    });
  }

  async addToHistory(trackId) {
    const trackFeatures = await this.getTrackFeatures(trackId);
    const userHistory = this.loadUserHistory();
    userHistory.push({ id: trackId, features: trackFeatures });
    localStorage.setItem('userMusicHistory', JSON.stringify(userHistory));

    // Re-generate recommendations after adding a new track
    this.generateRecommendations();
  }

  displayRecommendations(tracks) {
    const recommendationList = document.getElementById('recommendation-list');
    recommendationList.innerHTML = '';

    tracks.forEach(track => {
      const trackElement = document.createElement('li');
      trackElement.innerHTML = `
        <p>${track.name} by ${track.artists.map(artist => artist.name).join(', ')}</p>
        <audio controls src="${track.preview_url}">Play Sample</audio>
      `;
      recommendationList.appendChild(trackElement);
    });
  }

  loadUserHistory() {
    return JSON.parse(localStorage.getItem('userMusicHistory')) || [];
  }

  setupEventListeners() {
    document.getElementById('search-button').addEventListener('click', () => {
      const query = document.getElementById('search-query').value;
      if (query) {
        this.searchTracks(query);
      }
    });
  }
}

const musicRecommender = new MusicRecommender();