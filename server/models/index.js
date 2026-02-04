const sequelize = require('../config/database');
const Lodge = require('./Lodge');
const Room = require('./Room');
const Booking = require('./Booking');
const User = require('./User');

// Define associations
Lodge.hasMany(Room, { as: 'rooms', foreignKey: 'lodgeId', onDelete: 'CASCADE' });
Room.belongsTo(Lodge, { foreignKey: 'lodgeId' });

Lodge.hasMany(Booking, { foreignKey: 'lodgeId' });
Booking.belongsTo(Lodge, { as: 'lodge', foreignKey: 'lodgeId' });

Lodge.hasMany(User, { foreignKey: 'lodgeId' });
User.belongsTo(Lodge, { as: 'lodge', foreignKey: 'lodgeId' });

module.exports = {
    sequelize,
    Lodge,
    Room,
    Booking,
    User
};
