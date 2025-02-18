
// Dynamic Text Display with Rich Formatting and Validation

document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.createElement("textarea");
    inputField.id = "user-text";
    inputField.placeholder = "Enter text with simple markdown (*bold*, _italic_)...";
    
    const submitButton = document.createElement("button");
    submitButton.innerText = "Display Text";
    
    const outputDiv = document.createElement("div");
    outputDiv.id = "output";
    outputDiv.style.border = "1px solid #ccc";
    outputDiv.style.padding = "10px";
    outputDiv.style.marginTop = "10px";

    document.body.appendChild(inputField);
    document.body.appendChild(submitButton);
    document.body.appendChild(outputDiv);

    submitButton.addEventListener("click", function () {
        const userInput = sanitizeInput(inputField.value);
        const formattedText = applyFormatting(userInput);
        outputDiv.innerHTML = formattedText;
    });

    function sanitizeInput(input) {
        return input.replace(/</g, "&lt;").replace(/>/g, "&gt;"); // Prevent HTML injection
    }

    function applyFormatting(text) {
        return text
            .replace(/\*(.*?)\*/g, "<b>$1</b>")  // Bold (*text*)
            .replace(/_(.*?)_/g, "<i>$1</i>")      // Italic (_text_)
            .replace(/`(.*?)`/g, "<code>$1</code>"); // Inline code (`text`)
    }
});
