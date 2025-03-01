// HTML for the form (assumed to be in your HTML file)
/*
<form id="event-form">
  <input type="text" id="name" placeholder="Name" required />
  <input type="email" id="email" placeholder="Email" required />
  <select id="event">
    <option value="event1">Event 1</option>
    <option value="event2">Event 2</option>
    <option value="event3">Event 3</option>
  </select>
  <input type="text" id="diet" placeholder="Dietary Preferences" />
  <button type="submit">Register</button>
</form>
<div id="message"></div>
*/

document.getElementById('event-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  // Gather form data
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const event = document.getElementById('event').value;
  const diet = document.getElementById('diet').value;
  
  // Validate email (basic validation)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    document.getElementById('message').textContent = 'Invalid email address.';
    return;
  }
  
  try {
    // Send data to server
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, event, diet })
    });

    const result = await response.json();

    if (response.ok) {
      document.getElementById('message').textContent = `Registration successful! Check your email for the QR code.`;
      // Assuming that result.qrCode contains the URL of the QR code image
      // You can use this to display or download the QR code
    } else {
      document.getElementById('message').textContent = `Error: ${result.message}`;
    }
  } catch (error) {
    document.getElementById('message').textContent = 'An error occurred. Please try again later.';
  }
});