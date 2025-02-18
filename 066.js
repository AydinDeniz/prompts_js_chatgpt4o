document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'YOUR_NEWS_API_KEY';  // Replace with your News API key
    const newsOutput = document.getElementById('news-output');
    const fetchNewsButton = document.getElementById('fetch-news');
    const natural = window.natural;  // We'll use a simplified NLP by linking such a library

    fetchNewsButton.addEventListener('click', () => {
        const keyword = document.getElementById('keyword').value;
        const language = document.getElementById('language').value;
        fetchNews(keyword, language);
    });

    async function fetchNews(keyword, language) {
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(keyword)}&language=${language}&apiKey=${apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.articles.length > 0) {
                displayNews(data.articles.slice(0, 10));
            } else {
                newsOutput.innerHTML = '<p>No articles found for the topic specified.</p>';
            }
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    }

    function displayNews(articles) {
        newsOutput.innerHTML = '';
        articles.forEach(article => {
            const articleElement = document.createElement('div');
            articleElement.classList.add('article');
            articleElement.innerHTML = `
                <h3>${article.title}</h3>
                <p>${article.description || 'No description available'}</p>
                <p class="sentiment">Sentiment: ${analyzeSentiment(article.description || article.content)}</p>
                <a href="${article.url}" target="_blank">Read more</a>
            `;
            newsOutput.appendChild(articleElement);
        });
    }

    function analyzeSentiment(text) {
        if (!text) return 'Neutral';
        const totalWords = text.split(' ').length;

        // A very simplistic sentiment analysis approach; replace with Natural or any library
        const positiveWords = ['good', 'great', 'positive', 'successful', 'happy'];
        const negativeWords = ['bad', 'poor', 'negative', 'unsuccessful', 'sad'];

        let positivityScore = 0;
        let negativityScore = 0;

        positiveWords.forEach(word => {
            if (text.toLowerCase().includes(word.toLowerCase())) positivityScore++;
        });

        negativeWords.forEach(word => {
            if (text.toLowerCase().includes(word.toLowerCase())) negativityScore++;
        });

        if (positivityScore > negativityScore) {
            return 'Positive';
        } else if (negativityScore > positivityScore) {
            return 'Negative';
        } else {
            return 'Neutral';
        }
    }
});