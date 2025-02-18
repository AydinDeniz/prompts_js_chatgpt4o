// HTML for Remote Medical Diagnosis Platform (assumed to be in your HTML file)
/*
<div id="medical-diagnosis-platform">
  <h2>Remote Medical Diagnosis</h2>
  <textarea id="symptom-input" placeholder="Describe your symptoms..."></textarea>
  <button id="submit-symptoms">Submit</button>
  <div id="diagnosis-result"></div>
  <video id="video-feed" autoplay muted></video>
</div>
*/

class RemoteMedicalDiagnosis {
  constructor(apiEndpoint) {
    this.apiEndpoint = apiEndpoint;
    this.setupEventListeners();
    this.initVideoFeed();
  }

  setupEventListeners() {
    document.getElementById('submit-symptoms').addEventListener('click', () => this.processSymptoms());
  }

  async processSymptoms() {
    const symptoms = document.getElementById('symptom-input').value.trim();
    if (!symptoms) {
      alert('Please describe your symptoms.');
      return;
    }
    
    await this.getDiagnosis(symptoms);
  }

  async getDiagnosis(symptoms) {
    try {
      const response = await fetch(`${this.apiEndpoint}/diagnosis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms }),
      });
      const result = await response.json();
      this.displayDiagnosis(result);
    } catch (error) {
      console.error('Error diagnosing symptoms:', error);
      alert('Error getting diagnosis. Please try again later.');
    }
  }

  displayDiagnosis(result) {
    const diagnosisDiv = document.getElementById('diagnosis-result');
    diagnosisDiv.innerHTML = `<h3>Diagnosis Result</h3><p>${result.diagnosis}</p>`;
  }

  async initVideoFeed() {
    const video = document.getElementById('video-feed');
    
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = mediaStream;
    } catch (error) {
      console.error('Error accessing the camera:', error);
    }
  }
}

const remoteMedicalDiagnosis = new RemoteMedicalDiagnosis('https://api.remotemedical.com');