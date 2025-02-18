// HTML for Smart Urban Transportation Scheduler (assumed to be in your HTML file)
/*
<div id="transportation-scheduler">
  <h2>Smart Urban Transportation Scheduler</h2>
  <div id="route-planner">
    <label for="start-point">Start Point:</label>
    <input type="text" id="start-point" placeholder="Enter start location" />
    <label for="end-point">End Point:</label>
    <input type="text" id="end-point" placeholder="Enter destination" />
    <button id="plan-route">Plan Route</button>
  </div>
  <div id="route-details"></div>
  <div id="real-time-updates">
    <h3>Real-Time Traffic Updates</h3>
    <div id="traffic-log"></div>
  </div>
  <div id="recommendations">
    <h3>Alternative Routes</h3>
    <ul id="alternative-list"></ul>
  </div>
</div>
*/

class UrbanTransportScheduler {
  constructor(apiEndpoint) {
    this.apiEndpoint = apiEndpoint;
    this.setupEventListeners();
    this.initWebSocket();
  }

  setupEventListeners() {
    document.getElementById('plan-route').addEventListener('click', () => this.planRoute());
  }

  async planRoute() {
    const startPoint = document.getElementById('start-point').value;
    const endPoint = document.getElementById('end-point').value;

    if (!startPoint || !endPoint) {
      alert('Please enter both start and end points.');
      return;
    }

    try {
      const response = await fetch(`${this.apiEndpoint}/plan?start=${encodeURIComponent(startPoint)}&end=${encodeURIComponent(endPoint)}`);
      const routeData = await response.json();
      this.displayRouteDetails(routeData);
      this.generateAlternativeRoutes(routeData);
    } catch (error) {
      console.error('Error planning route:', error);
    }
  }

  displayRouteDetails(routeData) {
    const routeDetailsDiv = document.getElementById('route-details');
    routeDetailsDiv.innerHTML = `
      <h3>Planned Route</h3>
      <p>Duration: ${routeData.duration} mins</p>
      <p>Distance: ${routeData.distance} km</p>
      <p>ETA: ${routeData.estimatedTimeOfArrival}</p>
    `;
  }

  generateAlternativeRoutes(routeData) {
    const alternativeList = document.getElementById('alternative-list');
    alternativeList.innerHTML = '';

    routeData.alternatives.forEach((alternative, index) => {
      alternativeList.innerHTML += `
        <li>
          Alternative ${index + 1}: Duration - ${alternative.duration} mins; Distance - ${alternative.distance} km
          <button data-index="${index}">Select Route</button>
        </li>
      `;
    });

    this.setupAlternativeSelectButtons(routeData.alternatives);
  }

  setupAlternativeSelectButtons(alternatives) {
    document.querySelectorAll('#alternative-list button').forEach(button => {
      button.addEventListener('click', event => this.selectAlternativeRoute(event, alternatives));
    });
  }

  selectAlternativeRoute(event, alternatives) {
    const index = event.target.getAttribute('data-index');
    const selectedAlternative = alternatives[index];
    this.displayRouteDetails(selectedAlternative);
  }

  initWebSocket() {
    this.socket = new WebSocket(`wss://${this.apiEndpoint}/traffic`);
    this.socket.addEventListener('message', event => this.handleTrafficUpdate(JSON.parse(event.data)));
  }

  handleTrafficUpdate(trafficData) {
    const trafficLog = document.getElementById('traffic-log');
    const updateEntry = document.createElement('div');
    updateEntry.textContent = `Traffic Alert: ${trafficData.message} at ${new Date(trafficData.timestamp).toLocaleTimeString()}`;
    trafficLog.appendChild(updateEntry);
  }
}

const urbanTransportScheduler = new UrbanTransportScheduler('api.urbantransportscheduler.org');