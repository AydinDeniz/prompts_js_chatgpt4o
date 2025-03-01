// HTML for the advanced polling system (assumed to be in your HTML file)
/*
<div id="poll-creation">
  <form id="poll-form">
    <input type="text" id="poll-question" placeholder="Poll Question" required />
    <input type="text" id="poll-option-1" placeholder="Option 1" required />
    <input type="text" id="poll-option-2" placeholder="Option 2" required />
    <input type="text" id="poll-option-3" placeholder="Option 3" />
    <button type="submit">Create Poll</button>
  </form>
</div>
<div id="poll-list"></div>
<div id="poll-results" style="display: none;">
  <h2 id="result-question"></h2>
  <ul id="result-options"></ul>
  <button id="back-button">Back to Polls</button>
</div>
*/

class AdvancedPollingSystem {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.polls = [];
    this.init();
  }

  async init() {
    try {
      this.polls = await this.fetchPolls();
      this.displayPolls();
    } catch (error) {
      console.error('Error initializing polling system:', error);
    }

    this.setupEventListeners();
  }

  async fetchPolls() {
    const response = await fetch(`${this.apiUrl}/polls`);
    if (!response.ok) throw new Error('Failed to fetch polls');
    return response.json();
  }

  setupEventListeners() {
    document.getElementById('poll-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.createPoll();
    });

    document.getElementById('back-button').addEventListener('click', () => {
      document.getElementById('poll-results').style.display = 'none';
      document.getElementById('poll-list').style.display = 'block';
    });
  }

  async createPoll() {
    const question = document.getElementById('poll-question').value;
    const options = [1, 2, 3].map(i => document.getElementById(`poll-option-${i}`).value).filter(option => option);

    if (options.length < 2) {
      alert('Please provide at least two options.');
      return;
    }

    try {
      const response = await fetch(`${this.apiUrl}/polls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, options })
      });

      if (!response.ok) throw new Error('Failed to create poll');
      const newPoll = await response.json();
      this.polls.push(newPoll);
      this.displayPolls();
    } catch (error) {
      console.error('Error creating poll:', error);
    }
  }

  displayPolls() {
    const pollList = document.getElementById('poll-list');
    pollList.innerHTML = '';
    
    this.polls.forEach(poll => {
      const pollElement = document.createElement('div');
      pollElement.className = 'poll';
      pollElement.innerHTML = `
        <h3>${poll.question}</h3>
        <button data-id="${poll.id}">View Results</button>
      `;
      pollList.appendChild(pollElement);

      pollElement.querySelector('button').addEventListener('click', () => {
        this.loadPollResults(poll.id);
      });
    });
  }

  async loadPollResults(pollId) {
    try {
      const response = await fetch(`${this.apiUrl}/polls/${pollId}/results`);
      if (!response.ok) throw new Error('Failed to fetch poll results');
      const results = await response.json();
      this.displayPollResults(results);
    } catch (error) {
      console.error('Error loading poll results:', error);
    }
  }

  displayPollResults(results) {
    const resultOptions = document.getElementById('result-options');
    document.getElementById('result-question').textContent = results.question;
    resultOptions.innerHTML = '';

    results.options.forEach(option => {
      const listItem = document.createElement('li');
      listItem.textContent = `${option.text}: ${option.votes} votes`;
      resultOptions.appendChild(listItem);
    });

    document.getElementById('poll-list').style.display = 'none';
    document.getElementById('poll-results').style.display = 'block';
  }
}

const pollingSystem = new AdvancedPollingSystem('https://api.yourpollingsystem.com');