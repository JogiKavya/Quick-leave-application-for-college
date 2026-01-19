const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Apply leave
router.post("/apply", (req, res) => {
    const {
        student_id,
        email,
        leaveType,
        reason,
        parentNo,
        hostel,
        date_from,
        date_to,
        branch,
        year
    } = req.body;

    // Insert into "leaves" table
    const workflow = JSON.stringify(["coordinator", "hod"]); // default workflow
    const current_approver_index = 0;

    const query = `
        INSERT INTO leaves
        (student_id, leaveType, reason, parentNo, email, hostel, date_from, date_to, status, workflow, branch, year, current_approver_index)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        student_id,
        leaveType,
        reason,
        parentNo,
        email,
        hostel,
        date_from,
        date_to,
        "pending",
        workflow,
        branch,
        year,
        current_approver_index
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("DB Error:", err);
            res.status(500).json({ message: "Database error" });
        } else {
            res.json({ message: "Leave applied successfully" });
        }
    });
});

// Get all leaves for the logged-in student
router.get("/mystatus/:email", (req, res) => {
    const email = req.params.email;

    const query = `SELECT * FROM leaves WHERE email = ? ORDER BY id DESC`;

    db.query(query, [email], (err, results) => {
        if (err) {
            console.error("DB Error:", err);
            res.status(500).json({ message: "Database error" });
        } else {
            res.json(results);
        }
    });
});

// Get all pending leaves
// Get all pending leaves (case-insensitive)
router.get("/pending", (req, res) => {
    const query = "SELECT * FROM leaves WHERE LOWER(status) = 'pending'";
    db.query(query, (err, results) => {
        if (err) {
            console.error("DB Error:", err);
            return res.status(500).json([]);
        }
        res.json(results);
    });
});


// Update leave status (Accept / Reject)
router.put("/update/:id", (req, res) => {
    const leaveId = req.params.id;
    const { status } = req.body; // expected "accepted" or "rejected"

    const query = "UPDATE leaves SET status = ? WHERE id = ?";
    db.query(query, [status, leaveId], (err, result) => {
        if (err) {
            console.error("DB Error:", err);
            return res.status(500).json({ message: "Error updating leave" });
        }
        res.json({ message: `Leave ${status} successfully` });
    });
});

// Export router
module.exports = router;
