const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import db (this initializes Sequelize and all models)
const { sequelize, User, Lodge, Room } = require('./models');

// Import routes
const lodgeRoutes = require('./routes/lodgeRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const userRoutes = require('./routes/userRoutes');

console.log('Routes loaded:', { lodgeRoutes: !!lodgeRoutes, bookingRoutes: !!bookingRoutes, dashboardRoutes: !!dashboardRoutes, userRoutes: !!userRoutes });

// Basic test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
});

// Inline test route for lodges
app.get('/api/lodges-test', async (req, res) => {
    try {
        const lodges = await Lodge.findAll({
            include: [{ model: Room, as: 'rooms' }]
        });
        res.json(lodges);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Auth Route
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        if (password !== user.password) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const userObj = user.toJSON();
        delete userObj.password;

        res.json({ success: true, user: userObj });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Register routes
app.use('/api/lodges', lodgeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);

console.log('Routes registered successfully');

const PORT = process.env.PORT || 5000;

// Connect to MySQL and start server
sequelize.authenticate()
    .then(() => {
        console.log('MySQL Connected');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('MySQL Connection Error:', err);
    });
