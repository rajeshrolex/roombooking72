const express = require('express');
const router = express.Router();
const { Lodge, Room } = require('../models');

// Get all lodges (with rooms)
router.get('/', async (req, res) => {
    try {
        const lodges = await Lodge.findAll({
            include: [{ model: Room, as: 'rooms' }],
            order: [['createdAt', 'DESC']]
        });
        res.json(lodges);
    } catch (err) {
        console.error('Error fetching lodges:', err);
        res.status(500).json({ message: err.message });
    }
});

// Get single lodge by slug
router.get('/:slug', async (req, res) => {
    try {
        const lodge = await Lodge.findOne({
            where: { slug: req.params.slug },
            include: [{ model: Room, as: 'rooms' }]
        });
        if (!lodge) {
            return res.status(404).json({ message: 'Lodge not found' });
        }
        res.json(lodge);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new lodge (admin)
router.post('/', async (req, res) => {
    try {
        const { rooms, ...lodgeData } = req.body;

        const lodge = await Lodge.create(lodgeData);

        // Create rooms if provided
        if (rooms && rooms.length > 0) {
            const roomsWithLodgeId = rooms.map(room => ({
                ...room,
                lodgeId: lodge.id
            }));
            await Room.bulkCreate(roomsWithLodgeId);
        }

        // Fetch the complete lodge with rooms
        const savedLodge = await Lodge.findByPk(lodge.id, {
            include: [{ model: Room, as: 'rooms' }]
        });

        res.status(201).json(savedLodge);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update lodge (admin)
router.put('/:id', async (req, res) => {
    try {
        const { rooms, ...lodgeData } = req.body;

        const [updated] = await Lodge.update(lodgeData, {
            where: { id: req.params.id }
        });

        if (!updated) {
            return res.status(404).json({ message: 'Lodge not found' });
        }

        // Update rooms if provided
        if (rooms) {
            // Delete existing rooms and recreate
            await Room.destroy({ where: { lodgeId: req.params.id } });
            const roomsWithLodgeId = rooms.map(room => ({
                ...room,
                lodgeId: parseInt(req.params.id)
            }));
            await Room.bulkCreate(roomsWithLodgeId);
        }

        const lodge = await Lodge.findByPk(req.params.id, {
            include: [{ model: Room, as: 'rooms' }]
        });
        res.json(lodge);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete lodge (admin)
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Lodge.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ message: 'Lodge not found' });
        }
        res.json({ message: 'Lodge deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
