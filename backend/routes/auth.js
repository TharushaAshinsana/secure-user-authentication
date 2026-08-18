const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");

const router = express.Router();


// ===============================
// REGISTER
// ===============================

router.post("/register", async (req, res) => {

    const { username, email, password } = req.body;

    // Check empty fields
    if (!username || !email || !password) {
        return res.status(400).json({
            message: "All fields are required."
        });
    }

    try {

        // Check if email already exists
        const checkUser = "SELECT * FROM users WHERE email = ?";

        db.query(checkUser, [email], async (err, results) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Database error."
                });
            }

            if (results.length > 0) {
                return res.status(409).json({
                    message: "Email already registered."
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert user
            const sql = `
                INSERT INTO users (username, email, password)
                VALUES (?, ?, ?)
            `;

            db.query(
                sql,
                [username, email, hashedPassword],
                (err, result) => {

                    if (err) {
                        console.error(err);

                        return res.status(500).json({
                            message: "Registration failed."
                        });
                    }

                    res.status(201).json({
                        message: "Registration successful."
                    });
                }
            );
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error."
        });
    }
});


// ===============================
// LOGIN
// ===============================

router.post("/login", (req, res) => {

    const { email, password } = req.body;

    // Check empty fields
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required."
        });
    }

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Database error."
            });
        }

        // User not found
        if (results.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const user = results[0];

        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        // Login successful
        res.status(200).json({
            message: "Login successful.",
            username: user.username
        });
    });
});


module.exports = router;