// HTML for Cybersecurity Threat Detection Dashboard (assumed to be in your HTML file)
/*
<div id="cybersecurity-dashboard">
  <h2>Threat Detection Dashboard</h2>
  <button id="start-monitoring">Start Monitoring</button>
  <canvas id="activity-chart" width="400" height="200"></canvas>
  <div id="alerts"></div>
</div>
*/

class CybersecurityDashboard {
  constructor(apiEndpoint) {
    this.apiEndpoint = apiEndpoint;
    this.activityData = [];
    this.threats = [];
    this.setupEventListeners();
    this.initChart();
  }

  setupEventListeners() {
    document.getElementById('start-monitoring').addEventListener('click', () => this.startMonitoring());
  }

  startMonitoring() {
    setInterval(() => this.fetchActivityData(), 5000);
  }

  async fetchActivityData() {
    try {
      const response = await fetch(`${this.apiEndpoint}/activity`);
      const data = await response.json();
      this.processActivityData(data);
      this.detectThreats(data);
    } catch (error) {
      console.error('Error fetching activity data:', error);
    }
  }

  processActivityData(data) {
    this.activityData.push(...data);
    if (this.activityData.length > 100) {
      this.activityData.splice(0, this.activityData.length - 100);
    }
    this.updateChart();
  }

  detectThreats(data) {
    data.forEach((entry) => {
      if (this.isThreat(entry)) {
        this.threats.push(entry);
        this.displayAlert(entry);
      }
    });
  }

  isThreat(activity) {
    return activity.unusualActivityScore > 8; // Some criterion for threat detection
  }

  displayAlert(threat) {
    const alertsDiv = document.getElementById('alerts');
    const alertElement = document.createElement('div');
    alertElement.textContent = `Threat Detected: ${threat.type} at ${threat.timestamp}`;
    alertsDiv.appendChild(alertElement);
  }

  initChart() {
    const ctx = document.getElementById('activity-chart').getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Activity Level',
          data: [],
          borderColor: 'rgba(54, 162, 235, 1)',
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
              text: 'Activity Level',
            },
          },
        },
      },
    });
  }

  updateChart() {
    const activityLevels = this.activityData.map((d) => d.activityLevel);
    const timestamps = this.activityData.map((d) => d.timestamp);

    this.chart.data.labels = timestamps;
    this.chart.data.datasets[0].data = activityLevels;
    this.chart.update();
  }
}

const cybersecurityDashboard = new CybersecurityDashboard('https://api.cybersecurity.com');