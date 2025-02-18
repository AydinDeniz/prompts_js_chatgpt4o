document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'YOUR_ALPHAVANTAGE_API_KEY';  // Replace with your Alpha Vantage API key
    const fetchStockButton = document.getElementById('fetch-stock');
    const stockChartCanvas = document.getElementById('stock-chart');
    let stockChart;

    fetchStockButton.addEventListener('click', () => {
        const symbol = document.getElementById('stock-symbol').value.toUpperCase();
        if (symbol) {
            fetchStockData(symbol);
        }
    });

    async function fetchStockData(symbol) {
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data['Time Series (Daily)']) {
                const timeSeries = data['Time Series (Daily)'];
                const dates = Object.keys(timeSeries).slice(0, 30); // Last 30 days
                const prices = dates.map(date => parseFloat(timeSeries[date]['4. close']));
                updateChart(dates.reverse(), prices.reverse(), symbol);
            } else {
                alert('Stock data not found. Please try another symbol.');
            }
        } catch (error) {
            console.error('Error fetching stock data:', error);
        }
    }

    function updateChart(dates, prices, symbol) {
        if (stockChart) {
            stockChart.destroy();
        }
        stockChart = new Chart(stockChartCanvas, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: `${symbol} Stock Price`,
                    data: prices,
                    fill: false,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { display: true, title: { display: true, text: 'Date' } },
                    y: { display: true, title: { display: true, text: 'Price (USD)' } }
                }
            }
        });
    }
});