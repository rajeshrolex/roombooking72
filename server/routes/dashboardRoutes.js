const express = require('express');
const router = express.Router();
const { Booking, Lodge, Room } = require('../models');

// Get dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        const { lodgeId } = req.query;

        // Build filter for bookings
        let bookingQuery = {};
        let lodgeQuery = {};
        let roomQuery = {};

        if (lodgeId) {
            // Assuming lodgeId is passed as string (ObjectId or not)
            // If it's a valid ObjectId, we use it.
            bookingQuery.lodgeId = lodgeId;
            lodgeQuery._id = lodgeId;
            roomQuery.lodgeId = lodgeId;
        }

        // Get counts
        const totalLodges = await Lodge.countDocuments(lodgeQuery);
        const totalBookings = await Booking.countDocuments(bookingQuery);

        // Get revenue
        const revenueResult = await Booking.aggregate([
            { $match: bookingQuery },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // Get total rooms
        // We can use aggregation to sum availability or just fetch and reduce
        // Room model has `available` count per room type
        const rooms = await Room.find(roomQuery);
        const totalRooms = rooms.reduce((acc, room) => acc + (room.available || 0), 0);

        // Calculate occupancy rate (simplified)
        const confirmedBookings = await Booking.countDocuments({
            ...bookingQuery,
            status: { $in: ['confirmed', 'checked-in'] }
        });

        const occupancyRate = totalRooms > 0
            ? Math.round((confirmedBookings / totalRooms) * 100)
            : 0;

        // Get recent bookings
        const recentBookings = await Booking.find(bookingQuery)
            .populate('lodge', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            totalLodges,
            totalRooms,
            totalBookings,
            totalRevenue,
            occupancyRate: Math.min(occupancyRate, 100),
            recentBookings
        });
    } catch (err) {
        console.error('Dashboard stats error:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
