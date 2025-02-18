document.addEventListener('DOMContentLoaded', () => {
    const logDiv = document.getElementById('log');
    const apiKey = 'YOUR_API_KEY';
    const apiSecret = 'YOUR_API_SECRET';

    // Initialize WebSocket
    const socket = new WebSocket('wss://ws-feed.exchange.com');

    socket.addEventListener('open', function (event) {
        socket.send(JSON.stringify({
            type: 'subscribe',
            channels: [{ name: 'ticker', product_ids: ['BTC-USD'] }]
        }));
    });

    socket.addEventListener('message', function (event) {
        const message = JSON.parse(event.data);
        if (message.type === 'ticker') {
            log(`Price of BTC-USD: $${message.price}`);
            decideTrade(message.price);
        }
    });

    function log(message) {
        const p = document.createElement('p');
        p.textContent = message;
        logDiv.appendChild(p);
    }

    function decideTrade(price) {
        // Simple trading strategy
        if (Number(price) > 50000) {
            executeTrade('sell', 0.1);
        } else if (Number(price) < 30000) {
            executeTrade('buy', 0.1);
        }
    }

    async function executeTrade(side, amount) {
        log(`Executing ${side} order for ${amount} BTC`);
        // Here, you would interact with the actual trading API, e.g., using fetch or a library like axios
        // This is a mock and does not execute real trades; replace with actual API calls.
        /*
        const orderData = {
            side: side,
            amount: amount,
            product_id: 'BTC-USD',
            // More parameters
        };
        const response = await fetch('https://api.exchange.com/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(orderData)
        });
        const result = await response.json();
        if (result.success) {
            log(`Order successful: ${result.id}`);
        } else {
            log(`Order failed: ${result.message}`);
        }
        */
    }
});