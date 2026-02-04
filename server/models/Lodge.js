const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lodge = sequelize.define('Lodge', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    tagline: {
        type: DataTypes.STRING(500)
    },
    images: {
        type: DataTypes.TEXT,
        get() {
            const value = this.getDataValue('images');
            return value ? JSON.parse(value) : [];
        },
        set(value) {
            this.setDataValue('images', JSON.stringify(value || []));
        }
    },
    distance: {
        type: DataTypes.STRING(50)
    },
    distanceType: {
        type: DataTypes.ENUM('walkable', 'auto'),
        defaultValue: 'walkable'
    },
    rating: {
        type: DataTypes.DECIMAL(2, 1),
        defaultValue: 0
    },
    reviewCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    priceStarting: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    availability: {
        type: DataTypes.ENUM('available', 'limited', 'full'),
        defaultValue: 'available'
    },
    featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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
    },
    address: {
        type: DataTypes.STRING(500)
    },
    phone: {
        type: DataTypes.STRING(20)
    },
    whatsapp: {
        type: DataTypes.STRING(20)
    },
    description: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'lodges',
    timestamps: true
});

module.exports = Lodge;
