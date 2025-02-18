
// Auto-Save Feature for Web Form

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("auto-save-form");
    const feedback = document.getElementById("save-status");

    // Load saved data from local storage on page load
    function loadSavedData() {
        const savedData = JSON.parse(localStorage.getItem("autoSavedForm"));
        if (savedData) {
            document.getElementById("name").value = savedData.name || "";
            document.getElementById("email").value = savedData.email || "";
            document.getElementById("message").value = savedData.message || "";
            feedback.innerText = "Form data restored from last session.";
        }
    }

    // Save form data to local storage
    function saveFormData() {
        const formData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            message: document.getElementById("message").value
        };
        localStorage.setItem("autoSavedForm", JSON.stringify(formData));
        feedback.innerText = "Form data auto-saved.";
    }

    // Event listeners
    form.addEventListener("input", () => saveFormData());
    loadSavedData();
});

document.body.innerHTML += `
    <form id="auto-save-form">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name"><br><br>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email"><br><br>
        <label for="message">Message:</label>
        <textarea id="message" name="message"></textarea><br><br>
        <button type="submit">Submit</button>
    </form>
    <p id="save-status" style="color: green;"></p>
`;
