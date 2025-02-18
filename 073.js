
// Detect Internet Connection Status and Cache Form Inputs

document.addEventListener("DOMContentLoaded", function () {
    const statusIndicator = document.createElement("div");
    statusIndicator.id = "connection-status";
    statusIndicator.style.position = "fixed";
    statusIndicator.style.top = "10px";
    statusIndicator.style.right = "10px";
    statusIndicator.style.padding = "10px";
    statusIndicator.style.backgroundColor = "red";
    statusIndicator.style.color = "white";
    statusIndicator.style.display = "none";
    document.body.appendChild(statusIndicator);

    function updateConnectionStatus() {
        if (navigator.onLine) {
            statusIndicator.style.display = "none";
            syncCachedData();
        } else {
            statusIndicator.style.display = "block";
            statusIndicator.innerText = "You are offline. Data will be cached.";
        }
    }

    window.addEventListener("online", updateConnectionStatus);
    window.addEventListener("offline", updateConnectionStatus);
    updateConnectionStatus();

    // Cache form inputs when offline
    const form = document.getElementById("data-form");
    form.addEventListener("input", () => {
        if (!navigator.onLine) {
            localStorage.setItem("cachedFormData", JSON.stringify({
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                message: document.getElementById("message").value
            }));
        }
    });

    function syncCachedData() {
        const cachedData = JSON.parse(localStorage.getItem("cachedFormData"));
        if (cachedData) {
            fetch("http://localhost:3000/api/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cachedData)
            }).then(response => response.json())
              .then(() => {
                  localStorage.removeItem("cachedFormData");
                  alert("Cached data synced successfully!");
              })
              .catch(() => alert("Failed to sync cached data."));
        }
    }
});

document.body.innerHTML += `
    <form id="data-form">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name"><br><br>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email"><br><br>
        <label for="message">Message:</label>
        <textarea id="message" name="message"></textarea><br><br>
        <button type="submit">Submit</button>
    </form>
`;
