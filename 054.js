document.addEventListener('DOMContentLoaded', () => {
  const apiKey = 'YOUR_TWITTER_BEARER_TOKEN'; // Replace with your Twitter API Bearer Token
  const latestTweetsContainer = document.getElementById('latest-tweets');
  const analysisResultsContainer = document.getElementById('analysis-results');

  document.getElementById('analyze-feed').addEventListener('click', async () => {
    const username = document.getElementById('twitter-username').value;
    if (username) {
      try {
        const tweets = await fetchLatestTweets(username);
        displayLatestTweets(tweets);
        analyzeSentiment(tweets);
      } catch (error) {
        latestTweetsContainer.innerHTML = '<p>Error fetching tweets</p>';
        console.error('Error fetching tweets:', error);
      }
    }
  });

  async function fetchLatestTweets(username) {
    const response = await fetch(`https://api.twitter.com/2/tweets?ids=YOUR_USERNAME&expansions=author_id&user.fields=username`, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    return await response.json();
  }

  function displayLatestTweets(tweets) {
    latestTweetsContainer.innerHTML = '<h3>Latest Tweets:</h3>';
    tweets.forEach(tweet => {
      const tweetItem = document.createElement('p');
      tweetItem.textContent = tweet.text;
      latestTweetsContainer.appendChild(tweetItem);
    });
  }

  function analyzeSentiment(tweets) {
    analysisResultsContainer.innerHTML = '<h3>Sentiment Analysis:</h3>';
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;

    tweets.forEach(tweet => {
      const sentiment = Math.random();
      if (sentiment > 0.6) positiveCount++;
      else if (sentiment < 0.4) negativeCount++;
      else neutralCount++;
    });

    analysisResultsContainer.innerHTML += `
      <p>Positive: ${positiveCount}</p>
      <p>Negative: ${negativeCount}</p>
      <p>Neutral: ${neutralCount}</p>
    `;
  }
});