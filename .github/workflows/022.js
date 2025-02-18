// HTML for the smart home dashboard (assumed to be in your HTML file)
/*
<div id="smart-home-dashboard">
  <div id="controls">
    <button id="toggle-light">Toggle Light</button>
    <button id="adjust-thermostat">Adjust Thermostat</button>
  </div>
  <div id="data-visualization">
    <svg id="temperature-chart" width="600" height="400"></svg>
    <svg id="energy-chart" width="600" height="400"></svg>
  </div>
</div>
*/

const socket = new WebSocket('wss://your-iot-server.com');

class SmartHomeDashboard {
  constructor() {
    this.initControls();
    this.initDataVisualization();
    this.setupWebSocket();
  }

  initControls() {
    document.getElementById('toggle-light').addEventListener('click', () => {
      this.sendCommand({ device: 'light', action: 'toggle' });
    });

    document.getElementById('adjust-thermostat').addEventListener('click', () => {
      const newTemperature = prompt('Set thermostat temperature:');
      this.sendCommand({ device: 'thermostat', temperature: newTemperature });
    });
  }

  sendCommand(command) {
    socket.send(JSON.stringify(command));
  }

  initDataVisualization() {
    this.temperatureData = [];
    this.energyData = [];
    this.createChart('temperature-chart', this.temperatureData, 'Temperature (°C)', 'red');
    this.createChart('energy-chart', this.energyData, 'Energy Consumption (kWh)', 'blue');
  }

  createChart(containerId, data, label, color) {
    const svg = d3.select(`#${containerId}`);
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;

    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.value));

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    x.domain(d3.extent(data, d => d.date));
    y.domain(d3.extent(data, d => d.value));

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append('g')
      .call(d3.axisLeft(y).ticks(6));

    g.append('text')
      .attr('fill', color)
      .attr('x', 10)
      .attr('y', 10)
      .text(label);

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 1.5)
      .attr('d', line);
  }

  updateChart(data, chartType) {
    const chartId = chartType === 'temperature' ? 'temperature-chart' : 'energy-chart';
    const svg = d3.select(`#${chartId} g`);

    const x = d3.scaleTime().range([0, +svg.attr('width') - 70]);
    const y = d3.scaleLinear().range([+svg.attr('height') - 50, 0]);

    x.domain(d3.extent(data, d => d.date));
    y.domain(d3.extent(data, d => d.value));

    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.value));

    svg.select('path')
      .datum(data)
      .attr('d', line);
  }

  setupWebSocket() {
    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'temperature') {
        this.temperatureData.push({ date: new Date(data.timestamp), value: data.value });
        this.updateChart(this.temperatureData, 'temperature');
      }

      if (data.type === 'energy') {
        this.energyData.push({ date: new Date(data.timestamp), value: data.value });
        this.updateChart(this.energyData, 'energy');
      }
    });
  }
}

const smartHomeDashboard = new SmartHomeDashboard();