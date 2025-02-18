// HTML for the robotics control system (assumed to be in your HTML file)
/*
<div id="robot-control-system">
  <div id="control-panel">
    <button id="forward-button">Move Forward</button>
    <button id="backward-button">Move Backward</button>
    <button id="left-button">Turn Left</button>
    <button id="right-button">Turn Right</button>
    <button id="stop-button">Stop</button>
  </div>
  <div id="command-log"></div>
</div>
*/

const { Board, Motor } = require("johnny-five");
const board = new Board();

class RoboticsControlSystem {
  constructor() {
    this.setupHardware();
    this.setupEventListeners();
  }

  setupHardware() {
    board.on("ready", () => {
      this.leftMotor = new Motor({
        pins: { pwm: 9, dir: 8 },
      });
      this.rightMotor = new Motor({
        pins: { pwm: 10, dir: 11 },
      });
    });
  }

  setupEventListeners() {
    document.getElementById("forward-button").addEventListener("click", () => this.moveForward());
    document.getElementById("backward-button").addEventListener("click", () => this.moveBackward());
    document.getElementById("left-button").addEventListener("click", () => this.turnLeft());
    document.getElementById("right-button").addEventListener("click", () => this.turnRight());
    document.getElementById("stop-button").addEventListener("click", () => this.stop());
  }

  moveForward() {
    if (board.isReady) {
      this.leftMotor.forward(255);
      this.rightMotor.forward(255);
      this.logCommand("Moving forward");
    }
  }

  moveBackward() {
    if (board.isReady) {
      this.leftMotor.reverse(255);
      this.rightMotor.reverse(255);
      this.logCommand("Moving backward");
    }
  }

  turnLeft() {
    if (board.isReady) {
      this.leftMotor.reverse(255);
      this.rightMotor.forward(255);
      this.logCommand("Turning left");
    }
  }

  turnRight() {
    if (board.isReady) {
      this.leftMotor.forward(255);
      this.rightMotor.reverse(255);
      this.logCommand("Turning right");
    }
  }

  stop() {
    if (board.isReady) {
      this.leftMotor.stop();
      this.rightMotor.stop();
      this.logCommand("Stop");
    }
  }

  logCommand(message) {
    const logElement = document.getElementById("command-log");
    const logEntry = document.createElement("div");
    logEntry.textContent = message;
    logElement.appendChild(logEntry);
  }
}

const roboticsControlSystem = new RoboticsControlSystem();