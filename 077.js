
// Dark Mode Toggle with Persistent User Preference

document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.createElement("button");
    toggleButton.innerText = "Toggle Dark Mode";
    toggleButton.style.position = "fixed";
    toggleButton.style.top = "10px";
    toggleButton.style.right = "10px";
    toggleButton.style.padding = "10px";
    toggleButton.style.cursor = "pointer";
    document.body.appendChild(toggleButton);

    function applyDarkMode(enabled) {
        document.body.classList.toggle("dark-mode", enabled);
        localStorage.setItem("darkMode", enabled ? "enabled" : "disabled");
    }

    // Load user preference
    const darkModeEnabled = localStorage.getItem("darkMode") === "enabled";
    applyDarkMode(darkModeEnabled);

    toggleButton.addEventListener("click", function () {
        applyDarkMode(!document.body.classList.contains("dark-mode"));
    });
});

document.body.innerHTML += `
    <style>
        .dark-mode { background-color: #121212; color: white; }
        .dark-mode a { color: #bb86fc; }
    </style>
`;
