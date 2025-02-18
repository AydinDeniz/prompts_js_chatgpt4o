document.addEventListener('DOMContentLoaded', () => {
  const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // You need to obtain an API key from OpenWeatherMap
  const weatherDisplay = document.getElementById('weather-display');

  document.getElementById('get-weather').addEventListener('click', async () => {
    const city = document.getElementById('city-input').value;
    if (city) {
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();

        if (data.cod === 200) {
          displayWeather(data);
        } else {
          weatherDisplay.innerHTML = '<p>City not found</p>';
        }
      } catch (error) {
        weatherDisplay.innerHTML = '<p>Error fetching data</p>';
        console.error('Error fetching weather data:', error);
      }
    }
  });

  function displayWeather(data) {
    const { name, main, weather } = data;
    weatherDisplay.innerHTML = `
      <h3>${name}</h3>
      <p>Temperature: ${main.temp} °C</p>
      <p>Humidity: ${main.humidity} %</p>
      <p>Condition: ${weather[0].description}</p>
    `;
  }
});