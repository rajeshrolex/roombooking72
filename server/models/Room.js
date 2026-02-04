const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Room = sequelize.define('Room', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    lodgeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'lodges',
            key: 'id'
        }
    },
    type: {
        type: DataTypes.ENUM('Non-AC', 'AC', 'Family', 'Dormitory'),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    maxOccupancy: {
        type: DataTypes.INTEGER,
        defaultValue: 2
    },
    available: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    amenities: {
        type: DataTypes.TEXT,
        get() {
            const value = this.getDataValue('amenities');
            return value ? JSON.parse(value) : [];
        },
        set(value) {
            this.setDataValue('amenities', JSON.stringify(value || []));
        }
    }
}, {
    tableName: 'rooms',
    timestamps: false
});

module.exports = Room;
