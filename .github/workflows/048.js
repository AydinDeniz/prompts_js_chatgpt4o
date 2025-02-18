// HTML for Disaster Response Coordination System (assumed to be in your HTML file)
/*
<div id="disaster-response-coordination">
  <h2>Disaster Response Coordination System</h2>
  <div id="resource-allocation">
    <h3>Resource Allocation</h3>
    <div id="current-resources"></div>
    <button id="add-resource">Add Resource</button>
    <div id="resource-form" style="display: none;">
      <input type="text" id="resource-name" placeholder="Resource Name" />
      <input type="number" id="resource-quantity" placeholder="Quantity" />
      <button id="allocate-resource">Allocate</button>
    </div>
  </div>
  <div id="communications">
    <h3>Communications</h3>
    <textarea id="message-input" placeholder="Type your message here..."></textarea>
    <button id="send-message">Send</button>
    <div id="message-log"></div>
  </div>
  <div id="real-time-updates">
    <h3>Real-Time Updates</h3>
    <div id="updates-log"></div>
  </div>
</div>
*/

class DisasterResponseSystem {
  constructor(apiEndpoint) {
    this.apiEndpoint = apiEndpoint;
    this.resources = [];
    this.messages = [];
    this.setupEventListeners();
    this.setupWebSocket();
  }

  setupEventListeners() {
    document.getElementById('add-resource').addEventListener('click', () => this.toggleResourceForm());
    document.getElementById('allocate-resource').addEventListener('click', () => this.allocateResource());
    document.getElementById('send-message').addEventListener('click', () => this.sendMessage());
  }

  toggleResourceForm() {
    const form = document.getElementById('resource-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
  }

  allocateResource() {
    const name = document.getElementById('resource-name').value;
    const quantity = parseInt(document.getElementById('resource-quantity').value);

    if (name && quantity > 0) {
      this.resources.push({ name, quantity });
      this.updateResourceList();
      document.getElementById('resource-name').value = '';
      document.getElementById('resource-quantity').value = '';
      this.toggleResourceForm();
    } else {
      alert('Please enter valid resource details.');
    }
  }

  updateResourceList() {
    const resourceDiv = document.getElementById('current-resources');
    resourceDiv.innerHTML = this.resources.map((resource, index) => 
      `<div>Resource: ${resource.name}, Quantity: ${resource.quantity}
       <button data-index="${index}" class="adjust-button">Adjust</button></div>`
    ).join('');
    
    this.setupAdjustButtons();
  }

  setupAdjustButtons() {
    document.querySelectorAll('.adjust-button').forEach(button => {
      button.addEventListener('click', (event) => this.adjustResource(event));
    });
  }

  adjustResource(event) {
    const index = event.target.getAttribute('data-index');
    const resource = this.resources[index];
    const adjustment = prompt(`Adjust quantity for ${resource.name}:`, resource.quantity);

    if (adjustment !== null && !isNaN(parseInt(adjustment))) {
      this.resources[index].quantity = parseInt(adjustment);
      this.updateResourceList();
    }
  }

  sendMessage() {
    const message = document.getElementById('message-input').value.trim();
    if (message) {
      this.messages.push({ timestamp: new Date(), content: message });
      this.updateMessageLog();
      document.getElementById('message-input').value = '';
    }
  }

  updateMessageLog() {
    const log = document.getElementById('message-log');
    log.innerHTML = this.messages.map(m => `<div>[${m.timestamp.toLocaleString()}] ${m.content}</div>`).join('');
  }

  setupWebSocket() {
    this.socket = new WebSocket(`wss://${this.apiEndpoint}`);
    this.socket.addEventListener('message', (event) => this.handleWebSocketMessage(event));
  }

  handleWebSocketMessage(event) {
    const data = JSON.parse(event.data);
    if (data.type === 'update') {
      this.renderRealTimeUpdate(data.payload);
    }
  }

  renderRealTimeUpdate(update) {
    const updatesLog = document.getElementById('updates-log');
    const updateEntry = document.createElement('div');
    updateEntry.textContent = `Update: ${update.message} at ${new Date(update.timestamp).toLocaleTimeString()}`;
    updatesLog.appendChild(updateEntry);
  }
}

const disasterResponseSystem = new DisasterResponseSystem('api.disasterresponse.org');