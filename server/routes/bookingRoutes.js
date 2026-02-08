const express = require('express');
const router = express.Router();
const { Booking, Lodge, User, Room } = require('../models');
const { sendBookingEmails } = require('../utils/emailService');

// Generate unique booking ID
const generateBookingId = () => {
    return 'MLY' + Date.now().toString().slice(-8) + Math.random().toString(36).slice(-4).toUpperCase();
};

// Format date for email
const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
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

        // Get lodge admin email if exists
        let lodgeAdminEmail = null;
        const lodgeAdmin = await User.findOne({ lodgeId: req.body.lodgeId, role: 'admin' });
        if (lodgeAdmin) {
            lodgeAdminEmail = lodgeAdmin.email;
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
            paymentId: req.body.paymentDetails?.paymentId || null,
            paymentStatus: req.body.paymentDetails?.status || 'pending',
            status: 'confirmed'
        });

        // Update room availability - decrement by number of rooms booked
        if (req.body.room?.name && req.body.rooms) {
            const roomsBooked = parseInt(req.body.rooms) || 1;
            await Room.findOneAndUpdate(
                {
                    lodgeId: req.body.lodgeId,
                    name: req.body.room.name
                },
                {
                    $inc: { available: -roomsBooked }
                }
            );
            console.log(`Room availability updated: ${req.body.room.name} decreased by ${roomsBooked}`);
        }

        // Send email notifications (async, don't wait)
        if (req.body.customerDetails?.email) {
            sendBookingEmails({
                bookingId,
                lodgeName: lodge.name,
                roomName: req.body.room?.name || 'Room',
                guestName: req.body.customerDetails?.name,
                email: req.body.customerDetails?.email,
                phone: req.body.customerDetails?.mobile,
                checkIn: formatDate(req.body.checkIn),
                checkOut: formatDate(req.body.checkOut),
                guests: req.body.guests || 1,
                amount: req.body.totalAmount,
                paymentId: req.body.paymentDetails?.paymentId,
                paymentMethod: req.body.paymentMethod,
                paymentStatus: req.body.paymentDetails?.status || 'pending',
                lodgeAdminEmail
            }).then(result => {
                console.log('Email notifications sent:', result);
            }).catch(err => {
                console.error('Failed to send email notifications:', err);
            });
        }

        res.status(201).json({ ...booking.toObject(), bookingId });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update booking status
router.put('/:id', async (req, res) => {
    try {
        let booking;
        const id = req.params.id;
        const newStatus = req.body.status;

        // First, find the booking to get room details for availability update
        let existingBooking = await Booking.findOne({ bookingId: id });
        if (!existingBooking && id.match(/^[0-9a-fA-F]{24}$/)) {
            existingBooking = await Booking.findById(id);
        }

        // Update the booking status
        booking = await Booking.findOneAndUpdate(
            { bookingId: id },
            { status: newStatus },
            { new: true }
        );

        // If not found, and id looks like an ObjectId, try by _id
        if (!booking && id.match(/^[0-9a-fA-F]{24}$/)) {
            booking = await Booking.findByIdAndUpdate(
                id,
                { status: newStatus },
                { new: true }
            );
        }

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // If booking is cancelled or checked-out, restore room availability
        if ((newStatus === 'cancelled' || newStatus === 'checked-out') && existingBooking) {
            const roomsToRestore = parseInt(existingBooking.rooms) || 1;
            if (existingBooking.roomName && existingBooking.lodgeId) {
                await Room.findOneAndUpdate(
                    {
                        lodgeId: existingBooking.lodgeId,
                        name: existingBooking.roomName
                    },
                    {
                        $inc: { available: roomsToRestore }
                    }
                );
                console.log(`Room availability restored (${newStatus}): ${existingBooking.roomName} increased by ${roomsToRestore}`);
            }
        }

        res.json(booking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update payment status (mark as paid/received cash)
router.put('/:id/payment', async (req, res) => {
    try {
        const id = req.params.id;
        const { paymentStatus, paymentMethod, paymentId } = req.body;

        let updateData = { paymentStatus };

        // If marking as paid and no payment ID, generate one for cash
        if (paymentStatus === 'paid' && !paymentId) {
            updateData.paymentId = 'CASH_' + Date.now();
        } else if (paymentId) {
            updateData.paymentId = paymentId;
        }

        if (paymentMethod) {
            updateData.paymentMethod = paymentMethod;
        }

        let booking;

        // Try to find by bookingId first
        booking = await Booking.findOneAndUpdate(
            { bookingId: id },
            updateData,
            { new: true }
        );

        // If not found, try by _id
        if (!booking && id.match(/^[0-9a-fA-F]{24}$/)) {
            booking = await Booking.findByIdAndUpdate(
                id,
                updateData,
                { new: true }
            );
        }

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        console.log('Payment status updated:', booking.bookingId, paymentStatus);
        res.json(booking);
    } catch (err) {
        console.error('Error updating payment status:', err);
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
