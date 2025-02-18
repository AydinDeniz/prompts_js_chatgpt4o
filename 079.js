
// Typing Speed and Accuracy Monitor

document.addEventListener("DOMContentLoaded", function () {
    const textArea = document.createElement("textarea");
    textArea.id = "typing-area";
    textArea.placeholder = "Start typing...";
    document.body.appendChild(textArea);

    const feedback = document.createElement("p");
    feedback.id = "typing-feedback";
    document.body.appendChild(feedback);

    let startTime = null;
    let wordCount = 0;

    textArea.addEventListener("input", function () {
        if (!startTime) startTime = new Date();

        const words = textArea.value.trim().split(/\s+/);
        wordCount = words.length;

        const elapsedTime = (new Date() - startTime) / 60000; // Convert ms to minutes
        const wpm = Math.round(wordCount / elapsedTime || 0);
        
        feedback.innerText = `Words Per Minute: ${wpm}`;
    });

    textArea.addEventListener("focus", () => startTime = null);
});
