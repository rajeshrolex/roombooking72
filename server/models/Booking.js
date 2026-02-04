const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    bookingId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    lodgeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'lodges',
            key: 'id'
        }
    },
    lodgeName: {
        type: DataTypes.STRING(255)
    },
    // Flattened room info
    roomType: {
        type: DataTypes.STRING(50)
    },
    roomName: {
        type: DataTypes.STRING(255)
    },
    roomPrice: {
        type: DataTypes.INTEGER
    },
    checkIn: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    checkOut: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    guests: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    rooms: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    // Flattened customer details
    customerName: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    customerMobile: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    customerEmail: {
        type: DataTypes.STRING(255)
    },
    idType: {
        type: DataTypes.STRING(50)
    },
    idNumber: {
        type: DataTypes.STRING(100)
    },
    paymentMethod: {
        type: DataTypes.ENUM('payAtLodge', 'online'),
        defaultValue: 'payAtLodge'
    },
    totalAmount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'),
        defaultValue: 'pending'
    }
}, {
    tableName: 'bookings',
    timestamps: true
});

// Virtual getter to maintain API compatibility with nested structure
Booking.prototype.toJSON = function () {
    const values = { ...this.get() };

    // Reconstruct nested room object for API compatibility
    values.room = {
        type: values.roomType,
        name: values.roomName,
        price: values.roomPrice
    };

    // Reconstruct nested customerDetails object for API compatibility
    values.customerDetails = {
        name: values.customerName,
        mobile: values.customerMobile,
        email: values.customerEmail,
        idType: values.idType,
        idNumber: values.idNumber
    };

    // Clean up flat fields from output
    delete values.roomType;
    delete values.roomName;
    delete values.roomPrice;
    delete values.customerName;
    delete values.customerMobile;
    delete values.customerEmail;
    delete values.idType;
    delete values.idNumber;

    return values;
};

module.exports = Booking;
