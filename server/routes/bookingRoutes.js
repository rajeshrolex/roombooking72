const express = require('express');
const router = express.Router();
const { Booking, Lodge } = require('../models');
const { Op } = require('sequelize');

// Generate unique booking ID
const generateBookingId = () => {
    return 'MLY' + Date.now().toString().slice(-8) + Math.random().toString(36).slice(-4).toUpperCase();
};

// Get all bookings (with optional lodge filter for admins)
router.get('/', async (req, res) => {
    try {
        const { lodgeId, status } = req.query;
        let where = {};

        if (lodgeId && !isNaN(parseInt(lodgeId))) {
            where.lodgeId = parseInt(lodgeId);
        }
        if (status && status !== 'all') {
            where.status = status;
        }

        const bookings = await Booking.findAll({
            where,
            include: [{
                model: Lodge,
                as: 'lodge',
                attributes: ['id', 'name', 'slug']
            }],
            order: [['createdAt', 'DESC']]
        });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single booking
router.get('/:id', async (req, res) => {
    try {
        const booking = await Booking.findOne({
            where: { bookingId: req.params.id },
            include: [{
                model: Lodge,
                as: 'lodge',
                attributes: ['id', 'name', 'slug', 'address', 'phone']
            }]
        });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new booking
router.post('/', async (req, res) => {
    try {
        const bookingId = generateBookingId();

        // Get lodge details
        const lodge = await Lodge.findByPk(req.body.lodgeId);
        if (!lodge) {
            return res.status(404).json({ message: 'Lodge not found' });
        }

        const booking = await Booking.create({
            bookingId,
            lodgeId: req.body.lodgeId,
            lodgeName: lodge.name,
            roomType: req.body.room?.type,
            roomName: req.body.room?.name,
            roomPrice: req.body.room?.price,
            checkIn: req.body.checkIn,
            checkOut: req.body.checkOut,
            guests: req.body.guests,
            rooms: req.body.rooms,
            customerName: req.body.customerDetails?.name,
            customerMobile: req.body.customerDetails?.mobile,
            customerEmail: req.body.customerDetails?.email,
            idType: req.body.customerDetails?.idType,
            idNumber: req.body.customerDetails?.idNumber,
            paymentMethod: req.body.paymentMethod,
            totalAmount: req.body.totalAmount,
            status: 'confirmed'
        });

        res.status(201).json(booking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update booking status (accepts both MySQL id and bookingId)
router.put('/:id', async (req, res) => {
    try {
        let booking;
        const id = req.params.id;

        // Try to find by MySQL ID first (numeric)
        if (!isNaN(parseInt(id))) {
            [, booking] = await Booking.update(
                { status: req.body.status },
                { where: { id: parseInt(id) }, returning: true }
            );
            booking = await Booking.findByPk(parseInt(id));
        }

        // If not found, try by bookingId string
        if (!booking) {
            await Booking.update(
                { status: req.body.status },
                { where: { bookingId: id } }
            );
            booking = await Booking.findOne({ where: { bookingId: id } });
        }

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json(booking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
