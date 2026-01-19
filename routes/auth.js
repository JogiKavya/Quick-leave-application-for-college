const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Unified login
router.post("/login", (req, res) => {
    let { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Make role lowercase to match DB
    role = role.toLowerCase();

    const query = "SELECT * FROM users WHERE email = ? AND password = ? AND role = ?";
    db.query(query, [email, password, role], (err, results) => {
        if (err) {
            console.error("DB Error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: `Invalid ${role} credentials!` });
        }

        res.json({
            message: "Login successful",
            user: {
                id: results[0].id,
                email: results[0].email,
                role: results[0].role
            }
        });
    });
});

module.exports = router;
