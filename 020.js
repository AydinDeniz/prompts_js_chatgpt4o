// HTML for the personalized news aggregator (assumed to be in your HTML file)
/*
<div id="news-aggregator">
  <form id="preference-form">
    <label><input type="checkbox" class="topic-checkbox" value="technology"> Technology</label>
    <label><input type="checkbox" class="topic-checkbox" value="sports"> Sports</label>
    <label><input type="checkbox" class="topic-checkbox" value="entertainment"> Entertainment</label>
    <label><input type="checkbox" class="topic-checkbox" value="science"> Science</label>
    <button type="submit">Save Preferences</button>
  </form>
  <div id="news-feed"></div>
</div>
*/

class PersonalizedNewsAggregator {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.preferences = this.loadPreferences();
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.fetchAndDisplayNews();
  }

  setupEventListeners() {
    document.getElementById('preference-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.savePreferences();
      this.fetchAndDisplayNews();
    });
  }

  loadPreferences() {
    const savedPreferences = localStorage.getItem('newsPreferences');
    return savedPreferences ? JSON.parse(savedPreferences) : [];
  }

  savePreferences() {
    const checkboxes = document.querySelectorAll('.topic-checkbox');
    const selectedTopics = Array.from(checkboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value);

    localStorage.setItem('newsPreferences', JSON.stringify(selectedTopics));
    this.preferences = selectedTopics;
  }

  async fetchAndDisplayNews() {
    try {
      const newsArticles = await this.fetchNews();
      this.displayNews(newsArticles);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  }

  async fetchNews() {
    const topicsQuery = this.preferences.join(',');
    const response = await fetch(`${this.apiUrl}/news?topics=${topicsQuery}`);
    if (!response.ok) throw new Error('Failed to fetch news articles');
    return response.json();
  }

  displayNews(articles) {
    const newsFeed = document.getElementById('news-feed');
    newsFeed.innerHTML = '';

    articles.forEach(article => {
      const articleElement = document.createElement('div');
      articleElement.className = 'news-article';
      articleElement.innerHTML = `
        <h3>${article.title}</h3>
        <p>${article.description}</p>
        <a href="${article.url}" target="_blank">Read more</a>
      `;
      newsFeed.appendChild(articleElement);
    });
  }
}

const personalizedNewsAggregator = new PersonalizedNewsAggregator('https://api.personalizednews.com');