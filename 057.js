document.addEventListener('DOMContentLoaded', () => {
  const workoutList = document.getElementById('workout-list');
  const mealList = document.getElementById('meal-list');

  document.getElementById('add-workout').addEventListener('click', () => {
    const workoutName = document.getElementById('workout-name').value;
    const workoutDuration = document.getElementById('workout-duration').value;

    if (workoutName && workoutDuration) {
      addWorkout(workoutName, workoutDuration);
      document.getElementById('workout-name').value = '';
      document.getElementById('workout-duration').value = '';
    }
  });

  document.getElementById('add-meal').addEventListener('click', () => {
    const mealName = document.getElementById('meal-name').value;
    const mealCalories = document.getElementById('meal-calories').value;

    if (mealName && mealCalories) {
      addMeal(mealName, mealCalories);
      document.getElementById('meal-name').value = '';
      document.getElementById('meal-calories').value = '';
    }
  });

  function addWorkout(name, duration) {
    const workoutItem = document.createElement('li');
    workoutItem.innerHTML = `
      <div class="item-info">
        <strong>${name}</strong> - ${duration} minutes
      </div>
      <button onclick="removeItem(this)">Remove</button>
    `;
    workoutList.appendChild(workoutItem);
  }

  function addMeal(name, calories) {
    const mealItem = document.createElement('li');
    mealItem.innerHTML = `
      <div class="item-info">
        <strong>${name}</strong> - ${calories} calories
      </div>
      <button onclick="removeItem(this)">Remove</button>
    `;
    mealList.appendChild(mealItem);
  }

  window.removeItem = function(button) {
    const item = button.parentElement;
    item.parentElement.removeChild(item);
  }
});