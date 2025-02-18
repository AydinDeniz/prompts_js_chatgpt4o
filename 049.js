// HTML for Sustainable Energy Management System (assumed to be in your HTML file)
/*
<div id="energy-management-system">
  <h2>Sustainable Energy Management</h2>
  <div id="energy-status">
    <h3>Current Consumption</h3>
    <p id="total-consumption"></p>
    <p id="solar-production"></p>
    <p id="battery-status"></p>
    <button id="toggle-battery">Toggle Battery Storage</button>
  </div>
  <div id="energy-controls">
    <h3>Device Management</h3>
    <ul id="device-list"></ul>
  </div>
  <div id="energy-analytics">
    <h3>Energy Analytics</h3>
    <canvas id="energy-chart" width="400" height="200"></canvas>
  </div>
  <div id="action-recommendations">
    <h3>Action Recommendations</h3>
    <div id="recommendations-list"></div>
  </div>
</div>
*/

class EnergyManagementSystem {
  constructor(apiEndpoint) {
    this.apiEndpoint = apiEndpoint;
    this.devices = [
      { name: 'Air Conditioner', consumption: 3500, status: 'off' },
      { name: 'Washing Machine', consumption: 500, status: 'off' },
      { name: 'Refrigerator', consumption: 150, status: 'on' }
    ];
    this.batteryStorageActive = false;
    this.energyData = [];
    this.setupEventListeners();
    this.loadEnergyData();
  }

  setupEventListeners() {
    document.getElementById('toggle-battery').addEventListener('click', () => this.toggleBatteryStorage());
    this.updateDeviceControls();
  }

  toggleBatteryStorage() {
    this.batteryStorageActive = !this.batteryStorageActive;
    this.updateBatteryStatus();
  }

  updateBatteryStatus() {
    document.getElementById('battery-status').textContent = `Battery Storage: ${this.batteryStorageActive ? 'Active' : 'Inactive'}`;
  }

  updateDeviceControls() {
    const deviceList = document.getElementById('device-list');
    deviceList.innerHTML = this.devices.map((device, index) => 
      `<li>${device.name} - Status: ${device.status} 
        <button data-index="${index}" class="toggle-device">${device.status === 'on' ? 'Turn Off' : 'Turn On'}</button>
      </li>`
    ).join('');
    
    this.setupDeviceToggleButtons();
  }

  setupDeviceToggleButtons() {
    document.querySelectorAll('.toggle-device').forEach(button => {
      button.addEventListener('click', (event) => this.toggleDeviceStatus(event));
    });
  }

  toggleDeviceStatus(event) {
    const index = event.target.getAttribute('data-index');
    const device = this.devices[index];
    device.status = device.status === 'on' ? 'off' : 'on';
    this.updateDeviceControls();
    this.calculateTotalConsumption();
  }

  async loadEnergyData() {
    try {
      const response = await fetch(`${this.apiEndpoint}/energy`);
      const data = await response.json();
      this.energyData = data;
      this.renderEnergyStatus();
      this.calculateTotalConsumption();
      this.updateEnergyChart();
      this.generateActionRecommendations();
    } catch (error) {
      console.error('Error loading energy data:', error);
    }
  }

  renderEnergyStatus() {
    const totalConsumption = this.energyData.reduce((acc, entry) => acc + entry.consumption, 0);
    const solarProduction = this.energyData.reduce((acc, entry) => acc + entry.solarProduction, 0);

    document.getElementById('total-consumption').textContent = `Total Consumption: ${totalConsumption} kWh`;
    document.getElementById('solar-production').textContent = `Solar Production: ${solarProduction} kWh`;
  }

  calculateTotalConsumption() {
    const deviceConsumption = this.devices.reduce((acc, device) => device.status === 'on' ? acc + device.consumption : acc, 0);
    const solarProduction = this.energyData.reduce((acc, entry) => acc + entry.solarProduction, 0);
    const netConsumption = deviceConsumption - solarProduction;
    document.getElementById('total-consumption').textContent = `Total Consumption: ${netConsumption} kWh`;
  }

  initEnergyChart() {
    const ctx = document.getElementById('energy-chart').getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.energyData.map(entry => entry.timestamp),
        datasets: [{
          label: 'Energy Consumption',
          data: this.energyData.map(entry => entry.consumption),
          borderColor: 'rgba(54, 162, 235, 1)',
          fill: false,
        },{
          label: 'Solar Production',
          data: this.energyData.map(entry => entry.solarProduction),
          borderColor: 'rgba(255, 206, 86, 1)',
          fill: false,
        }],
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
              text: 'kWh',
            },
          },
        },
      },
    });
  }

  updateEnergyChart() {
    if (!this.chart) this.initEnergyChart();
    
    this.chart.data.labels = this.energyData.map(entry => entry.timestamp);
    this.chart.data.datasets[0].data = this.energyData.map(entry => entry.consumption);
    this.chart.data.datasets[1].data = this.energyData.map(entry => entry.solarProduction);
    this.chart.update();
  }

  generateActionRecommendations() {
    const recommendationsDiv = document.getElementById('recommendations-list');
    recommendationsDiv.innerHTML = '';

    const highConsumptionDevices = this.devices.filter(device => device.status === 'on' && device.consumption > 3000);
    if (highConsumptionDevices.length > 0) {
      highConsumptionDevices.forEach(device => {
        recommendationsDiv.innerHTML += `<div>Consider turning off ${device.name} to save energy.</div>`;
      });
    } else {
      recommendationsDiv.innerHTML = '<div>Your energy management is optimal!</div>';
    }
  }
}

const energyManagementSystem = new EnergyManagementSystem('https://api.sustainableenergy.org');