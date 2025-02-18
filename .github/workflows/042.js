// HTML for Smart Agriculture Monitoring System (assumed to be in your HTML file)
/*
<div id="agriculture-monitoring">
  <h2>Smart Agriculture Dashboard</h2>
  <div id="sensor-data"></div>
  <canvas id="sensor-chart" width="400" height="200"></canvas>
  <div id="notifications"></div>
</div>
*/

class SmartAgricultureMonitoring {
  constructor(apiEndpoint) {
    this.apiEndpoint = apiEndpoint;
    this.sensorData = [];
    this.setupWebSocket();
    this.initChart();
    this.pollSensorData();
  }

  setupWebSocket() {
    this.socket = new WebSocket('wss://your-iot-server.com');
    this.socket.addEventListener('message', (event) => this.handleSocketData(JSON.parse(event.data)));
  }

  handleSocketData(data) {
    this.updateSensorData(data);
    this.displaySensorData(data);
    this.updateChart();
    this.checkConditions(data);
  }

  updateSensorData(data) {
    this.sensorData.push(data);
    if (this.sensorData.length > 100) this.sensorData.shift();
  }

  async pollSensorData() {
    try {
      const response = await fetch(`${this.apiEndpoint}/sensors`);
      const data = await response.json();
      data.forEach((entry) => this.updateSensorData(entry));
      this.displaySensorData(data[data.length - 1]);
      this.updateChart();
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    }
  }

  displaySensorData(data) {
    const sensorDataDiv = document.getElementById('sensor-data');
    sensorDataDiv.innerHTML = `
      <p>Temperature: ${data.temperature}°C</p>
      <p>Soil Moisture: ${data.soilMoisture}%</p>
      <p>Humidity: ${data.humidity}%</p>
    `;
  }

  checkConditions(data) {
    const notifications = document.getElementById('notifications');
    notifications.innerHTML = '';

    if (data.temperature > 30) {
      notifications.innerHTML += '<p>Warning: High temperature!</p>';
    }
    if (data.soilMoisture < 20) {
      notifications.innerHTML += '<p>Action Required: Low soil moisture!</p>';
    }
  }

  initChart() {
    const ctx = document.getElementById('sensor-chart').getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: 100 }, (_, i) => i + 1),
        datasets: [
          {
            label: 'Temperature (°C)',
            data: [],
            borderColor: 'rgba(255, 99, 132, 1)',
            fill: false,
          },
          {
            label: 'Soil Moisture (%)',
            data: [],
            borderColor: 'rgba(54, 162, 235, 1)',
            fill: false,
          },
          {
            label: 'Humidity (%)',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Value',
            },
          },
        },
      },
    });
  }

  updateChart() {
    const temperatureData = this.sensorData.map((d) => d.temperature);
    const moistureData = this.sensorData.map((d) => d.soilMoisture);
    const humidityData = this.sensorData.map((d) => d.humidity);

    this.chart.data.datasets[0].data = temperatureData;
    this.chart.data.datasets[1].data = moistureData;
    this.chart.data.datasets[2].data = humidityData;
    this.chart.update();
  }
}

const agricultureMonitoring = new SmartAgricultureMonitoring('https://api.smartagriculture.com');