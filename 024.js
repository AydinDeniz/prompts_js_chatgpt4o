// HTML for the AI-powered personal finance tracker (assumed to be in your HTML file)
/*
<div id="finance-tracker">
  <form id="transaction-form">
    <input type="text" id="transaction-description" placeholder="Description" required />
    <input type="number" id="transaction-amount" placeholder="Amount" required />
    <button type="submit">Add Transaction</button>
  </form>
  <div id="balance-display">Current Balance: $0</div>
  <canvas id="expense-chart" width="400" height="200"></canvas>
  <ul id="transaction-list"></ul>
</div>
*/

const transactionData = [];
let balance = 0;

class PersonalFinanceTracker {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.loadTransactions();
    this.updateBalance();
    this.renderChart();
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.getElementById('transaction-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.addTransaction();
    });
  }

  addTransaction() {
    const description = document.getElementById('transaction-description').value;
    const amount = parseFloat(document.getElementById('transaction-amount').value);
    const category = this.categorizeTransaction(description, amount);

    const transaction = { description, amount, category, date: new Date() };
    transactionData.push(transaction);
    this.saveTransaction(transaction);
    this.renderTransaction(transaction);
    this.updateBalance(transaction.amount);
    this.renderChart();

    document.getElementById('transaction-form').reset();
  }

  async categorizeTransaction(description, amount) {
    // Simulate AI categorization with TensorFlow.js
    await tf.ready();
    const model = await tf.loadLayersModel('path-to-your-model/model.json');
    const input = tf.tensor([[amount]]); // Example placeholder
    const prediction = model.predict(input);

    const categories = ['Food', 'Transport', 'Entertainment'];
    const index = prediction.argMax(-1).dataSync()[0];
    return categories[index];
  }

  updateBalance(amount = 0) {
    balance += amount;
    document.getElementById('balance-display').textContent = `Current Balance: $${balance.toFixed(2)}`;
  }

  renderTransaction(transaction) {
    const listItem = document.createElement('li');
    listItem.textContent = `${transaction.date.toDateString()} - ${transaction.description}: $${transaction.amount.toFixed(2)} [${transaction.category}]`;
    document.getElementById('transaction-list').appendChild(listItem);
  }

  renderChart() {
    const ctx = document.getElementById('expense-chart').getContext('2d');
    
    if (this.chart) this.chart.destroy();

    const data = this.getCategoryData();

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(data),
        datasets: [{
          data: Object.values(data),
          backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#e7e9ed']
        }]
      }
    });
  }

  getCategoryData() {
    const categoryData = {};
    transactionData.forEach(transaction => {
      if (!categoryData[transaction.category]) {
        categoryData[transaction.category] = 0;
      }
      categoryData[transaction.category] += transaction.amount;
    });
    return categoryData;
  }

  saveTransaction(transaction) {
    // Placeholder for saving transaction, assuming backend API for persistence
    fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction)
    });
  }

  loadTransactions() {
    // Placeholder for loading transaction data
    fetch('/api/transactions')
      .then(response => response.json())
      .then(data => {
        data.forEach(transaction => {
          transactionData.push(transaction);
          this.renderTransaction(transaction);
          this.updateBalance(transaction.amount);
        });
        this.renderChart();
      });
  }
}

const financeTracker = new PersonalFinanceTracker('YOUR_API_KEY');