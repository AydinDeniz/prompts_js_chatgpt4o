// HTML for the interactive stock trading simulator (assumed to be in your HTML file)
/*
<div id="trading-simulator">
  <div id="portfolio">
    <h3>Your Portfolio</h3>
    <ul id="portfolio-list"></ul>
  </div>
  <div id="market">
    <h3>Market</h3>
    <div id="stock-chart"></div>
    <input type="number" id="trade-amount" placeholder="Trade Amount" />
    <button id="buy-button">Buy</button>
    <button id="sell-button">Sell</button>
  </div>
</div>
*/

class StockTradingSimulator {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.portfolio = {};
    this.cash = 10000; // Starting simulation cash
    this.setupWebSocket();
    this.setupEventListeners();
    this.initChart();
  }

  setupWebSocket() {
    this.socket = new WebSocket('wss://your-stock-market-websocket.com');
    this.socket.addEventListener('message', (event) => {
      const stockData = JSON.parse(event.data);
      this.updateStockData(stockData);
      this.updateChart(stockData);
    });
  }

  updateStockData(stockData) {
    this.currentStock = stockData;
    const marketDiv = document.getElementById('market');
    marketDiv.querySelector('h3').textContent = `${stockData.symbol}: $${stockData.price.toFixed(2)}`;
  }

  initChart() {
    this.chartData = {
      labels: [],
      datasets: [{
        label: 'Stock Price',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1
      }]
    };
    const ctx = document.getElementById('stock-chart').getContext('2d');
    this.stockChart = new Chart(ctx, {
      type: 'line',
      data: this.chartData
    });
  }

  updateChart(stockData) {
    this.chartData.labels.push(new Date().toLocaleTimeString());
    this.chartData.datasets[0].data.push(stockData.price);
    this.stockChart.update();
  }

  setupEventListeners() {
    document.getElementById('buy-button').addEventListener('click', () => this.executeTrade('buy'));
    document.getElementById('sell-button').addEventListener('click', () => this.executeTrade('sell'));
  }

  executeTrade(type) {
    const amount = parseFloat(document.getElementById('trade-amount').value);
    
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid trade amount.');
      return;
    }

    const cost = amount * this.currentStock.price;
    if (type === 'buy') {
      if (this.cash >= cost) {
        this.cash -= cost;
        this.addToPortfolio(this.currentStock.symbol, amount);
      } else {
        alert('Insufficient funds.');
      }
    } else if (type === 'sell') {
      if (this.portfolio[this.currentStock.symbol] >= amount) {
        this.cash += cost;
        this.removeFromPortfolio(this.currentStock.symbol, amount);
      } else {
        alert('Not enough shares to sell.');
      }
    }
    
    this.updatePortfolioDisplay();
  }

  addToPortfolio(symbol, amount) {
    if (!this.portfolio[symbol]) {
      this.portfolio[symbol] = 0;
    }
    this.portfolio[symbol] += amount;
  }

  removeFromPortfolio(symbol, amount) {
    if (this.portfolio[symbol]) {
      this.portfolio[symbol] -= amount;
      if (this.portfolio[symbol] <= 0) {
        delete this.portfolio[symbol];
      }
    }
  }

  updatePortfolioDisplay() {
    const portfolioList = document.getElementById('portfolio-list');
    portfolioList.innerHTML = `Cash: $${this.cash.toFixed(2)}`;

    for (const [symbol, amount] of Object.entries(this.portfolio)) {
      const listItem = document.createElement('li');
      listItem.textContent = `${symbol}: ${amount} shares`;
      portfolioList.appendChild(listItem);
    }
  }
}

const stockTradingSimulator = new StockTradingSimulator('https://api.stocktrading.com');