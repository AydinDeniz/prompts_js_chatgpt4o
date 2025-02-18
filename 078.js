
// Restrict Special Characters in Input Field with Real-Time Feedback

document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.id = "restricted-input";
    inputField.placeholder = "Enter text (no special characters)";
    document.body.appendChild(inputField);

    const feedback = document.createElement("p");
    feedback.id = "input-feedback";
    feedback.style.color = "red";
    document.body.appendChild(feedback);

    inputField.addEventListener("input", function () {
        const regex = /^[a-zA-Z0-9 ]*$/;
        if (!regex.test(inputField.value)) {
            feedback.innerText = "Special characters are not allowed!";
            inputField.value = inputField.value.replace(/[^a-zA-Z0-9 ]/g, "");
        } else {
            feedback.innerText = "";
        }
    });
});
