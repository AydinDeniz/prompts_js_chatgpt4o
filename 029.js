// HTML for the personalized health advisor (assumed to be in your HTML file)
/*
<div id="health-advisor">
  <form id="health-form">
    <input type="number" id="age" placeholder="Age" required />
    <input type="number" id="weight" placeholder="Weight (kg)" required />
    <input type="number" id="height" placeholder="Height (cm)" required />
    <select id="activity-level">
      <option value="1.2">Sedentary</option>
      <option value="1.375">Lightly Active</option>
      <option value="1.55">Moderately Active</option>
      <option value="1.725">Very Active</option>
      <option value="1.9">Super Active</option>
    </select>
    <button type="submit">Get Advice</button>
  </form>
  <div id="advice-display"></div>
</div>
*/

class HealthAdvisor {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.getElementById('health-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.provideAdvice();
    });
  }

  async provideAdvice() {
    const age = parseInt(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const activityLevel = parseFloat(document.getElementById('activity-level').value);

    const bmi = this.calculateBMI(weight, height);
    const dailyCalories = this.calculateCalories(weight, height, age, activityLevel);

    const data = { age, weight, height, activityLevel, bmi, dailyCalories };
    const advice = await this.fetchAdvice(data);

    this.displayAdvice(advice);
  }

  calculateBMI(weight, height) {
    return (weight / Math.pow(height / 100, 2)).toFixed(2);
  }

  calculateCalories(weight, height, age, activityLevel) {
    const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    return (bmr * activityLevel).toFixed(0);
  }

  async fetchAdvice(data) {
    const response = await fetch(`${this.apiUrl}/health/advice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  displayAdvice(advice) {
    const adviceDisplay = document.getElementById('advice-display');
    adviceDisplay.innerHTML = `<h3>Your Personalized Advice</h3>
                               <p>BMI: ${advice.bmi}</p>
                               <p>Daily Caloric Needs: ${advice.dailyCalories} kcal</p>
                               <p>${advice.recommendations}</p>`;
  }
}

const healthAdvisor = new HealthAdvisor('https://api.personalhealthadvisor.com');