document.addEventListener('DOMContentLoaded', () => {
  const apiKey = 'YOUR_SPOONACULAR_API_KEY'; // Replace with your Spoonacular API key
  const recipeResults = document.getElementById('recipe-results');
  const mealPlanList = document.getElementById('meal-plan-list');

  document.getElementById('find-recipes').addEventListener('click', async () => {
    const ingredients = document.getElementById('ingredient-input').value;
    if (ingredients) {
      try {
        const response = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredients)}&number=5&apiKey=${apiKey}`);
        const recipes = await response.json();
        displayRecipes(recipes);
      } catch (error) {
        recipeResults.innerHTML = '<p>Error fetching recipes</p>';
        console.error('Error fetching recipes:', error);
      }
    }
  });

  function displayRecipes(recipes) {
    recipeResults.innerHTML = '<h3>Recipes:</h3>';
    recipes.forEach(recipe => {
      const recipeItem = document.createElement('div');
      recipeItem.innerHTML = `
        <p>${recipe.title}</p>
        <button onclick="addToMealPlan('${recipe.title}')">Add to Meal Plan</button>
      `;
      recipeResults.appendChild(recipeItem);
    });
  }

  window.addToMealPlan = function(recipeTitle) {
    const mealPlanItem = document.createElement('li');
    mealPlanItem.textContent = recipeTitle;
    mealPlanList.appendChild(mealPlanItem);
  }
});