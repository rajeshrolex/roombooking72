const express = require('express');
const router = express.Router();
const { Booking, Lodge } = require('../models');

// Generate unique booking ID
const generateBookingId = () => {
    return 'MLY' + Date.now().toString().slice(-8) + Math.random().toString(36).slice(-4).toUpperCase();
};

// Get all bookings (with optional lodge filter for admins)
router.get('/', async (req, res) => {
    try {
        const { lodgeId, status } = req.query;
        let query = {};

        // Mongoose query building
        // Mongoose query building
        if (lodgeId && lodgeId !== 'undefined' && lodgeId !== 'null') {
            // Handle case where lodgeId might be passed as "null" string or actual id
            query.lodgeId = lodgeId;
        }

        if (status && status !== 'all') {
            query.status = status;
        }

        const bookings = await Booking.find(query)
            .populate('lodge', 'name slug')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single booking
router.get('/:id', async (req, res) => {
    try {
        const booking = await Booking.findOne({ bookingId: req.params.id })
            .populate('lodge', 'name slug address phone');

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
        const lodge = await Lodge.findById(req.body.lodgeId);
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

// Update booking status
router.put('/:id', async (req, res) => {
    try {
        let booking;
        const id = req.params.id;

        // Try to find by _id (if valid ObjectId) or bookingId
        // Mongoose findOneAndUpdate with $or or check validity

        // Strategy: First try by bookingId as it's our custom ID and unique
        booking = await Booking.findOneAndUpdate(
            { bookingId: id },
            { status: req.body.status },
            { new: true }
        );

        // If not found, and id looks like an ObjectId, try by _id
        if (!booking && id.match(/^[0-9a-fA-F]{24}$/)) {
            booking = await Booking.findByIdAndUpdate(
                id,
                { status: req.body.status },
                { new: true }
            );
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
