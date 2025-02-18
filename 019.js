// HTML for the healthcare appointment scheduler (assumed to be in your HTML file)
/*
<div id="appointment-scheduler">
  <form id="appointment-form">
    <input type="text" id="patient-name" placeholder="Patient Name" required />
    <input type="email" id="patient-email" placeholder="Patient Email" required />
    <input type="datetime-local" id="appointment-date" required />
    <select id="doctor-selection">
      <option value="">Select Doctor</option>
    </select>
    <button type="submit">Book Appointment</button>
  </form>
  <div id="appointment-calendar"></div>
</div>
*/

class HealthcareAppointmentScheduler {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.doctors = [];
    this.init();
  }

  async init() {
    try {
      this.doctors = await this.fetchDoctors();
      this.populateDoctorSelection();
      this.setupCalendar();
    } catch (error) {
      console.error('Error initializing appointment scheduler:', error);
    }

    this.setupEventListeners();
  }

  async fetchDoctors() {
    const response = await fetch(`${this.apiUrl}/doctors`);
    if (!response.ok) throw new Error('Failed to fetch doctors');
    return response.json();
  }

  populateDoctorSelection() {
    const doctorSelection = document.getElementById('doctor-selection');
    doctorSelection.innerHTML = '<option value="">Select Doctor</option>';
    this.doctors.forEach(doctor => {
      const option = document.createElement('option');
      option.value = doctor.id;
      option.textContent = `${doctor.name} (${doctor.specialization})`;
      doctorSelection.appendChild(option);
    });
  }

  setupCalendar() {
    const calendarEl = document.getElementById('appointment-calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      events: `${this.apiUrl}/appointments`,
    });
    calendar.render();
  }

  setupEventListeners() {
    document.getElementById('appointment-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.bookAppointment();
    });
  }

  async bookAppointment() {
    const patientName = document.getElementById('patient-name').value;
    const patientEmail = document.getElementById('patient-email').value;
    const appointmentDate = document.getElementById('appointment-date').value;
    const doctorId = document.getElementById('doctor-selection').value;

    if (!doctorId) {
      alert('Please select a doctor.');
      return;
    }

    const appointmentData = {
      patientName,
      patientEmail,
      appointmentDate,
      doctorId,
    };

    try {
      const response = await fetch(`${this.apiUrl}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) throw new Error('Failed to book appointment');
      
      alert('Appointment booked successfully');
      this.resetForm();
      this.setupCalendar();
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  }

  resetForm() {
    document.getElementById('appointment-form').reset();
  }
}

const healthcareAppointmentScheduler = new HealthcareAppointmentScheduler('https://api.healthcareappointments.com');