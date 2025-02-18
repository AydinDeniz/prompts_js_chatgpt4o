
// Lightweight Authentication System with JSON File Storage

const fs = require("fs");
const bcrypt = require("bcrypt");
const usersFile = "users.json";

// Load users from JSON file
function loadUsers() {
    if (!fs.existsSync(usersFile)) {
        fs.writeFileSync(usersFile, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(usersFile, "utf8"));
}

// Save users to JSON file
function saveUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Register a new user
async function registerUser(username, password) {
    let users = loadUsers();
    if (users.some(user => user.username === username)) {
        return "Error: Username already exists.";
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    saveUsers(users);
    return "User registered successfully!";
}

// Validate user login
async function loginUser(username, password) {
    let users = loadUsers();
    const user = users.find(user => user.username === username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return "Error: Invalid username or password.";
    }

    return "Login successful!";
}

// Example usage
(async () => {
    console.log(await registerUser("testUser", "securePass123"));
    console.log(await loginUser("testUser", "securePass123"));
    console.log(await loginUser("testUser", "wrongPass"));
})();
