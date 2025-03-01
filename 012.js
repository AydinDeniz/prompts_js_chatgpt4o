// HTML for the form (assumed to be in your HTML file)
/*
<form id="weather-form">
  <input type="text" id="city" placeholder="Enter city" required />
  <button type="submit">Get Weather</button>
</form>
<div id="weather-display"></div>
<ul id="recent-cities"></ul>
*/

const apiKey = 'YOUR_WEATHER_API_KEY';
const recentCities = [];

document.getElementById('weather-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const city = document.getElementById('city').value;
  
  try {
    // Fetch weather data
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    
    if (response.ok) {
      // Display weather data
      const weatherInfo = `
        <h3>Weather in ${data.name}</h3>
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
      `;
      document.getElementById('weather-display').innerHTML = weatherInfo;
      
      // Update recent cities
      if (!recentCities.includes(city)) {
        if (recentCities.length >= 5) recentCities.shift();
        recentCities.push(city);
        localStorage.setItem('recentCities', JSON.stringify(recentCities));
      }
      
    } else {
      document.getElementById('weather-display').textContent = `Error: ${data.message}`;
    }
  } catch (error) {
    document.getElementById('weather-display').textContent = 'An error occurred. Please try again later.';
  }
  
  displayRecentCities();
});

function displayRecentCities() {
  const storedCities = JSON.parse(localStorage.getItem('recentCities')) || [];
  const recentCitiesList = document.getElementById('recent-cities');
  recentCitiesList.innerHTML = '';
  storedCities.forEach(city => {
    const listItem = document.createElement('li');
    listItem.textContent = city;
    recentCitiesList.appendChild(listItem);
  });
}

// Load recent cities on page load
window.onload = displayRecentCities;