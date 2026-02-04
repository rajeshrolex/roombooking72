const express = require('express');
const router = express.Router();
const { Booking, Lodge, Room } = require('../models');
const { Op, fn, col } = require('sequelize');

// Get dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        const { lodgeId } = req.query;

        // Build filter for bookings
        let bookingWhere = {};
        let lodgeWhere = {};

        // Only apply lodgeId filter if it's a valid number
        if (lodgeId && !isNaN(parseInt(lodgeId))) {
            bookingWhere.lodgeId = parseInt(lodgeId);
            lodgeWhere.id = parseInt(lodgeId);
        }

        // Get counts
        const totalLodges = await Lodge.count({ where: lodgeWhere });
        const totalBookings = await Booking.count({ where: bookingWhere });

        // Get revenue
        const revenueResult = await Booking.sum('totalAmount', { where: bookingWhere });
        const totalRevenue = revenueResult || 0;

        // Get total rooms
        let roomWhere = {};
        if (lodgeId && !isNaN(parseInt(lodgeId))) {
            roomWhere.lodgeId = parseInt(lodgeId);
        }
        const rooms = await Room.findAll({ where: roomWhere });
        const totalRooms = rooms.reduce((acc, room) => acc + (room.available || 0), 0);

        // Calculate occupancy rate (simplified)
        const confirmedBookings = await Booking.count({
            where: {
                ...bookingWhere,
                status: { [Op.in]: ['confirmed', 'checked-in'] }
            }
        });
        const occupancyRate = totalRooms > 0
            ? Math.round((confirmedBookings / totalRooms) * 100)
            : 0;

        // Get recent bookings
        const recentBookings = await Booking.findAll({
            where: bookingWhere,
            include: [{
                model: Lodge,
                as: 'lodge',
                attributes: ['name']
            }],
            order: [['createdAt', 'DESC']],
            limit: 5
        });

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
