
// Function to redirect users to specific dashboard sections based on URL query parameters

document.addEventListener("DOMContentLoaded", function () {
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    function redirectToSection() {
        const section = getQueryParam("section");
        const validSections = ["overview", "analytics", "settings", "profile"];

        if (!section || !validSections.includes(section)) {
            console.warn("Invalid or missing section parameter. Redirecting to default.");
            window.location.href = "/dashboard?section=overview";
            return;
        }

        // Simulating smooth scrolling or navigation within the dashboard
        const sectionElement = document.getElementById(section);
        if (sectionElement) {
            sectionElement.scrollIntoView({ behavior: "smooth" });
        } else {
            console.warn("Section not found in the dashboard.");
        }
    }

    redirectToSection();
});

// Example dashboard structure
document.body.innerHTML += `
    <div id="dashboard">
        <h2>Dashboard</h2>
        <div id="overview"><h3>Overview Section</h3></div>
        <div id="analytics"><h3>Analytics Section</h3></div>
        <div id="settings"><h3>Settings Section</h3></div>
        <div id="profile"><h3>Profile Section</h3></div>
    </div>
    <style>
        #dashboard div { padding: 50px; margin-top: 20px; border: 1px solid #ccc; }
    </style>
`;
