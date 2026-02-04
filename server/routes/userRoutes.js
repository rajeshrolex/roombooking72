const express = require('express');
const router = express.Router();
const { User, Lodge } = require('../models');
const { Op } = require('sequelize');

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            include: [{
                model: Lodge,
                as: 'lodge',
                attributes: ['id', 'name']
            }]
        });
        res.json({ success: true, users });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get user profile
router.get('/profile/:userId', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId, {
            attributes: { exclude: ['password'] }
        });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Create new user
router.post('/', async (req, res) => {
    try {
        const { name, email, password, role, lodgeId } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }

        const user = await User.create({
            name,
            email,
            password, // In production, hash this!
            role: role || 'admin',
            lodgeId: lodgeId || null
        });

        const userObj = user.toJSON();
        delete userObj.password;

        res.status(201).json({ success: true, user: userObj });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update user profile
router.put('/profile/:userId', async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        // Check if email already exists for another user
        if (email) {
            const existingUser = await User.findOne({
                where: {
                    email,
                    id: { [Op.ne]: req.params.userId }
                }
            });
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Email already in use' });
            }
        }

        await User.update(
            { name, email, phone },
            { where: { id: req.params.userId } }
        );

        const user = await User.findByPk(req.params.userId, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: 'Profile updated successfully', user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update user (full update for admin management)
router.put('/:userId', async (req, res) => {
    try {
        const { name, email, password, role, lodgeId } = req.body;

        // Check if email already exists for another user
        if (email) {
            const existingUser = await User.findOne({
                where: {
                    email,
                    id: { [Op.ne]: req.params.userId }
                }
            });
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Email already in use' });
            }
        }

        const updateData = { name, email, role, lodgeId };

        // Only update password if provided
        if (password) {
            updateData.password = password; // In production, hash this!
        }

        await User.update(updateData, { where: { id: req.params.userId } });

        const user = await User.findByPk(req.params.userId, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: 'User updated successfully', user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update password
router.put('/password/:userId', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findByPk(req.params.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check current password (in production, compare hashed passwords)
        if (user.password !== currentPassword) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }

        // Update password (in production, hash the password)
        await User.update({ password: newPassword }, { where: { id: req.params.userId } });

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Delete user
router.delete('/:userId', async (req, res) => {
    try {
        const deleted = await User.destroy({ where: { id: req.params.userId } });

        if (!deleted) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
