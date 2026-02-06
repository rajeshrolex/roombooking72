const express = require('express');
const router = express.Router();
const { User, Lodge } = require('../models');

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        // We populate lodge info if available, similar to how other routes might need it
        // but for login, we just need user details.
        // However, converting to JSON/Object helps remove password later.
        const user = await User.findOne({ email }).populate('lodge');

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Direct password comparison (as per original code - NOT SECURE for production but matches verify script)
        if (password !== user.password) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Convert to object and remove password
        const userObj = user.toObject({ virtuals: true });
        delete userObj.password;
        delete userObj._id; // optional if id is present

        res.json({ success: true, user: userObj });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
