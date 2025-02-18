// HTML for the car rental booking form (assumed to be in your HTML file)
/*
<div id="car-rental">
  <form id="booking-form">
    <input type="text" id="name" placeholder="Your Name" required />
    <input type="email" id="email" placeholder="Your Email" required />
    <input type="date" id="rental-start" placeholder="Rental Start Date" required />
    <input type="date" id="rental-end" placeholder="Rental End Date" required />
    <select id="car-selection">
      <option value="">Select Car</option>
    </select>
    <input type="text" id="payment-info" placeholder="Payment Information" required />
    <button type="submit">Book Car</button>
  </form>
  <div id="available-cars">
    <h2>Available Cars</h2>
    <ul id="car-list"></ul>
  </div>
</div>
*/

class CarRentalService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.cars = [];
    this.init();
  }

  async init() {
    try {
      this.cars = await this.fetchAvailableCars();
      this.populateCarSelection();
      this.displayAvailableCars();
    } catch (error) {
      console.error('Error initializing car rental:', error);
    }

    this.setupEventListeners();
  }

  async fetchAvailableCars() {
    const response = await fetch(`${this.apiUrl}/cars/available`);
    if (!response.ok) throw new Error('Failed to fetch available cars');
    return response.json();
  }

  setupEventListeners() {
    document.getElementById('booking-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.bookCar();
    });

    document.getElementById('rental-start').addEventListener('change', () => {
      this.updateAvailableCars();
    });

    document.getElementById('rental-end').addEventListener('change', () => {
      this.updateAvailableCars();
    });
  }

  populateCarSelection() {
    const carSelection = document.getElementById('car-selection');
    carSelection.innerHTML = '<option value="">Select Car</option>';
    this.cars.forEach(car => {
      const option = document.createElement('option');
      option.value = car.id;
      option.textContent = `${car.make} ${car.model} (${car.year})`;
      carSelection.appendChild(option);
    });
  }

  displayAvailableCars() {
    const carList = document.getElementById('car-list');
    carList.innerHTML = '';
    this.cars.forEach(car => {
      const listItem = document.createElement('li');
      listItem.textContent = `${car.make} ${car.model} (${car.year})`;
      carList.appendChild(listItem);
    });
  }

  async updateAvailableCars() {
    const startDate = document.getElementById('rental-start').value;
    const endDate = document.getElementById('rental-end').value;
    
    if (startDate && endDate) {
      try {
        const response = await fetch(`${this.apiUrl}/cars/available?start=${startDate}&end=${endDate}`);
        if (!response.ok) throw new Error('Failed to update available cars');
        this.cars = await response.json();
        this.populateCarSelection();
        this.displayAvailableCars();
      } catch (error) {
        console.error('Error updating available cars:', error);
      }
    }
  }

  async bookCar() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const rentalStart = document.getElementById('rental-start').value;
    const rentalEnd = document.getElementById('rental-end').value;
    const carId = document.getElementById('car-selection').value;
    const paymentInfo = document.getElementById('payment-info').value;

    if (!carId) {
      alert('Please select a car.');
      return;
    }

    try {
      const response = await fetch(`${this.apiUrl}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, rentalStart, rentalEnd, carId, paymentInfo })
      });

      if (!response.ok) throw new Error('Failed to book car');
      alert('Car booked successfully');
      this.resetForm();
    } catch (error) {
      console.error('Error booking car:', error);
    }
  }

  resetForm() {
    document.getElementById('booking-form').reset();
    this.cars = [];
    this.populateCarSelection();
    this.displayAvailableCars();
  }
}

const carRentalService = new CarRentalService('https://api.carrentalservice.com');