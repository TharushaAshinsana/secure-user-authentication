const API_URL = "http://localhost:5000";


// ===============================
// REGISTER
// ===============================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const username = document.getElementById("username").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        const message = document.getElementById("registerMessage");

        if (password !== confirmPassword) {
            message.textContent = "Passwords do not match.";
            return;
        }

        message.textContent = "Registration processing...";

        try {

            const response = await fetch(`${API_URL}/register`, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            });

            const data = await response.json();

            message.textContent = data.message;

            if (response.ok) {
                registerForm.reset();

                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1500);
            }

        } catch (error) {

            console.error(error);

            message.textContent =
                "Unable to connect to the server.";
        }
    });
}


// ===============================
// LOGIN
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        const message = document.getElementById("loginMessage");

        message.textContent = "Login processing...";

        try {

            const response = await fetch(`${API_URL}/login`, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            message.textContent = data.message;

            if (response.ok) {

                localStorage.setItem("username", data.username);

                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 1000);
            }

        } catch (error) {

            console.error(error);

            message.textContent =
                "Unable to connect to the server.";
        }
    });
}


// ===============================
// DASHBOARD
// ===============================

const welcomeMessage = document.getElementById("welcomeMessage");

if (welcomeMessage) {

    const username = localStorage.getItem("username");

    if (username) {
        welcomeMessage.textContent =
            `Welcome, ${username}! You are successfully logged in.`;
    }
}


// ===============================
// LOGOUT
// ===============================

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener("click", function () {

        localStorage.removeItem("username");

        window.location.href = "index.html";
    });
}