// HTML for AI-Powered Mental Health Assistant (assumed to be in your HTML file)
/*
<div id="mental-health-assistant">
  <div id="chat-window">
    <div id="conversation"></div>
    <input type="text" id="user-input" placeholder="Type your message here..." />
    <button id="send-message">Send</button>
  </div>
</div>
*/

class MentalHealthAssistant {
  constructor(nlpModelUrl) {
    this.nlpModelUrl = nlpModelUrl;
    this.conversation = [];
    this.loadNlpModel();
    this.setupEventListeners();
  }

  async loadNlpModel() {
    this.nlpModel = await tf.loadLayersModel(this.nlpModelUrl);
  }

  setupEventListeners() {
    document.getElementById('send-message').addEventListener('click', () => this.handleUserInput());
    document.getElementById('user-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleUserInput();
    });
  }

  handleUserInput() {
    const userInput = document.getElementById('user-input').value.trim();
    if (userInput) {
      this.addMessage('User', userInput);
      document.getElementById('user-input').value = '';
      this.respondToUser(userInput);
    }
  }

  addMessage(sender, message) {
    this.conversation.push({ sender, message });
    const conversationDiv = document.getElementById('conversation');
    const messageElement = document.createElement('div');
    messageElement.className = `${sender.toLowerCase()}-message`;
    messageElement.textContent = `${sender}: ${message}`;
    conversationDiv.appendChild(messageElement);
    conversationDiv.scrollTop = conversationDiv.scrollHeight;
  }

  async respondToUser(inputText) {
    const sentiment = this.analyzeSentiment(inputText);
    let response;

    if (sentiment < 0) {
      response = "I'm sorry to hear that you're feeling this way. Would you like to talk more about it? Or I can connect you to a professional for help.";
    } else {
      response = "Thank you for sharing that. How else can I assist you today?";
    }

    this.addMessage('Assistant', response);
  }

  analyzeSentiment(text) {
    // For simplicity, using a basic sentiment analysis; in real case, integrate a trained sentiment model
    const positiveWords = ['happy', 'great', 'fantastic', 'good'];
    const negativeWords = ['sad', 'bad', 'terrible', 'upset'];

    let score = 0;
    const words = text.split(' ');

    words.forEach((word) => {
      if (positiveWords.includes(word)) score++;
      if (negativeWords.includes(word)) score--;
    });

    return score;
  }
}

const mentalHealthAssistant = new MentalHealthAssistant('path/to/nlp-model.json');