
// User Idle Detection and Auto Logout
let idleTime = 0;
const idleLimit = 60; // Time in seconds before warning
const logoutTime = 90; // Time in seconds before auto logout

// Reset idle timer on user activity
function resetIdleTimer() {
    idleTime = 0;
    document.getElementById("idle-warning").style.display = "none";
}

// Warn user before logging out
function showWarning() {
    document.getElementById("idle-warning").style.display = "block";
}

// Log out user function
function logoutUser() {
    alert("You have been logged out due to inactivity.");
    window.location.href = "/logout"; // Change to your actual logout URL
}

// Increment idle timer every second
setInterval(() => {
    idleTime++;
    if (idleTime === idleLimit) showWarning();
    if (idleTime >= logoutTime) logoutUser();
}, 1000);

// Event listeners to detect user activity
document.addEventListener("mousemove", resetIdleTimer);
document.addEventListener("keypress", resetIdleTimer);
document.addEventListener("click", resetIdleTimer);

// Inject warning modal into DOM
document.body.innerHTML += `
    <div id="idle-warning" style="display:none; position:fixed; bottom:20px; right:20px; background:rgba(0,0,0,0.7); color:white; padding:10px; border-radius:5px;">
        You have been idle for a while. You will be logged out soon if there's no activity.
    </div>
`;
