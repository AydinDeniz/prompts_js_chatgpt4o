// HTML for the voice-controlled smart home assistant (assumed to be in your HTML file)
/*
<div id="smart-home-assistant">
  <button id="start-voice-control">Start Voice Control</button>
  <div id="device-status"></div>
  <div id="log"></div>
</div>
*/

const socket = new WebSocket('wss://your-iot-server.com');

class SmartHomeAssistant {
  constructor() {
    this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    this.recognition.continuous = true;
    this.recognition.lang = 'en-US';
    this.deviceStates = {};
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.getElementById('start-voice-control').addEventListener('click', () => this.startVoiceControl());
    this.recognition.addEventListener('result', (event) => this.handleVoiceCommand(event));
    socket.addEventListener('message', (event) => this.updateDeviceStatus(JSON.parse(event.data)));
  }

  startVoiceControl() {
    this.recognition.start();
    this.logMessage('Voice control started. You can speak now.');
  }

  handleVoiceCommand(event) {
    const command = event.results[event.resultIndex][0].transcript.toLowerCase().trim();
    this.logMessage(`Recognized command: ${command}`);
    
    if (command.includes('turn on light')) {
      this.sendDeviceCommand('light', 'on');
    } else if (command.includes('turn off light')) {
      this.sendDeviceCommand('light', 'off');
    } else if (command.includes('set thermostat')) {
      const temperature = command.match(/\d+/);
      if (temperature) {
        this.sendDeviceCommand('thermostat', 'set', temperature[0]);
      }
    } else {
      this.logMessage('Unknown command.');
    }
  }

  sendDeviceCommand(device, action, value = null) {
    const command = { device, action, value };
    socket.send(JSON.stringify(command));
    this.logMessage(`Command sent: ${JSON.stringify(command)}`);
  }

  updateDeviceStatus(deviceData) {
    this.deviceStates[deviceData.device] = deviceData.status;
    this.renderDeviceStatus();
  }

  renderDeviceStatus() {
    const deviceStatusDiv = document.getElementById('device-status');
    deviceStatusDiv.innerHTML = '<h3>Device Status:</h3>';
    
    for (const [device, status] of Object.entries(this.deviceStates)) {
      const deviceElement = document.createElement('p');
      deviceElement.textContent = `${device}: ${status}`;
      deviceStatusDiv.appendChild(deviceElement);
    }
  }

  logMessage(message) {
    const logDiv = document.getElementById('log');
    const logEntry = document.createElement('div');
    logEntry.textContent = message;
    logDiv.appendChild(logEntry);
  }
}

const smartHomeAssistant = new SmartHomeAssistant();