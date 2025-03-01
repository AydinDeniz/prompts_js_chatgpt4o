// HTML for the fitness tracker application (assumed to be in your HTML file)
/*
<div id="fitness-tracker">
  <form id="fitness-form">
    <input type="number" id="steps" placeholder="Steps" required />
    <input type="text" id="workouts" placeholder="Workout Description" required />
    <input type="number" id="calories" placeholder="Calories" required />
    <button type="submit">Log Activity</button>
  </form>
  <canvas id="activity-chart" width="400" height="200"></canvas>
  <ul id="activity-log"></ul>
</div>
*/

class FitnessTracker {
  constructor() {
    this.activities = JSON.parse(localStorage.getItem('activities')) || [];
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.renderActivityLog();
    this.renderChart();
  }

  setupEventListeners() {
    document.getElementById('fitness-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.logActivity();
    });
  }

  logActivity() {
    const steps = document.getElementById('steps').value;
    const workouts = document.getElementById('workouts').value;
    const calories = document.getElementById('calories').value;

    const activity = {
      date: new Date().toISOString().split('T')[0],
      steps: parseInt(steps, 10),
      workouts,
      calories: parseInt(calories, 10)
    };

    this.activities.push(activity);
    localStorage.setItem('activities', JSON.stringify(this.activities));

    this.renderActivityLog();
    this.renderChart();

    document.getElementById('fitness-form').reset();
  }

  renderActivityLog() {
    const activityLog = document.getElementById('activity-log');
    activityLog.innerHTML = '';

    this.activities.forEach(activity => {
      const listItem = document.createElement('li');
      listItem.textContent = `Date: ${activity.date}, Steps: ${activity.steps}, Workouts: ${activity.workouts}, Calories: ${activity.calories}`;
      activityLog.appendChild(listItem);
    });
  }

  renderChart() {
    const ctx = document.getElementById('activity-chart').getContext('2d');

    const data = {
      labels: this.activities.map(a => a.date),
      datasets: [
        {
          label: 'Steps',
          data: this.activities.map(a => a.steps),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Calories',
          data: this.activities.map(a => a.calories),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    };

    if (this.chart) this.chart.destroy();

    this.chart = new Chart(ctx, {
      type: 'line',
      data,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}

const fitnessTracker = new FitnessTracker();