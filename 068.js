document.addEventListener('DOMContentLoaded', () => {
    const deviceStatus = {
        'living-room-light': false,
        'thermostat': false,
        'smart-lock': false,
        'sprinkler-system': false
    };

    const energyUsageData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
            label: 'Energy Consumption (kWh)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            data: [65, 59, 80, 81, 56, 55, 40],
        }]
    };

    const ctx = document.getElementById('energy-chart').getContext('2d');
    const energyChart = new Chart(ctx, {
        type: 'bar',
        data: energyUsageData,
        options: {
            responsive: true,
            scales: {
                x: { display: true, title: { display: true, text: 'Month' } },
                y: { display: true, title: { display: true, text: 'kWh' } }
            }
        }
    });

    window.toggleDevice = (deviceId) => {
        deviceStatus[deviceId] = !deviceStatus[deviceId];
        const deviceElement = document.getElementById(deviceId);
        const button = deviceElement.querySelector('button');
        if (deviceStatus[deviceId]) {
            button.textContent = 'Turn Off';
        } else {
            button.textContent = 'Turn On';
        }
        console.log(`Device ${deviceId} is now ${deviceStatus[deviceId] ? 'on' : 'off'}.`);
    };
});