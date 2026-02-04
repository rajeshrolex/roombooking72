const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(20),
        defaultValue: ''
    },
    role: {
        type: DataTypes.ENUM('super_admin', 'admin'),
        defaultValue: 'admin'
    },
    lodgeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'lodges',
            key: 'id'
        }
    }
}, {
    tableName: 'users',
    timestamps: true
});

module.exports = User;
