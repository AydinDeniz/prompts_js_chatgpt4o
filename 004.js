
// Form validation function
function validateAndSubmitForm() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const feedback = document.getElementById("feedback");

    // Validate name
    if (name === "" || !/^[a-zA-Z ]{2,30}$/.test(name)) {
        feedback.innerText = "Please enter a valid name (2-30 alphabetic characters).";
        return;
    }

    // Validate email
    if (email === "" || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        feedback.innerText = "Please enter a valid email address.";
        return;
    }

    // Validate phone (US format example)
    if (phone === "" || !/^\+?\d{10,15}$/.test(phone)) {
        feedback.innerText = "Please enter a valid phone number (10-15 digits, optionally prefixed with +).";
        return;
    }

    // Clear feedback
    feedback.innerText = "";

    // Data to send
    const data = { name, email, phone };

    // Send data to backend
    fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            feedback.innerText = "Submission successful!";
        } else {
            feedback.innerText = "Error: " + (result.message || "Unknown error occurred.");
        }
    })
    .catch(error => {
        feedback.innerText = "Network error: " + error.message;
    });
}

// Example HTML elements for input and feedback
document.write(`
    <form onsubmit="event.preventDefault(); validateAndSubmitForm();">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name"><br><br>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email"><br><br>
        <label for="phone">Phone:</label>
        <input type="text" id="phone" name="phone"><br><br>
        <button type="submit">Submit</button>
    </form>
    <p id="feedback" style="color: red;"></p>
`);
