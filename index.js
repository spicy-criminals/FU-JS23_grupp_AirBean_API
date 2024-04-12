const express = require('express');
const Datastore = require('nedb-promise');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const { format, isBefore } = require('date-fns');
const menuData = require('./menu.json');
const { parseISO } = require('date-fns/fp');

const app = express();
const db = new Datastore({ filename: 'database.db', autoload: true });

const PORT = 8000;

// Middleware for validating user input
const validateOrder = [
    body('userId').isUUID().withMessage('Invalid user ID format'),
    body('productId').isInt().withMessage('Product ID must be an integer').custom(value => {
        const product = menuData.menu.find(item => item.id === value);
        if (!product) {
            throw new Error('Invalid product ID');
        }
        return true;
    }),
    body('price').isNumeric().withMessage('Price must be a number'),
];

// Middleware for error handling
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Invalid JSON payload' });
    }
    res.status(500).json({ error: err.message || 'Internal Server Error' });
};

// Error handling middleware
app.use(errorHandler);

// Create Account Endpoint
app.post('/signup', [
    body('username').isString().withMessage('Username must be a string'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, email, password } = req.body;
        const userId = uuidv4();
        // Check if the user already exists
        const existingUser = await db.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        // Store user data in the database
        await db.insert({ userId, username, email, password });
        res.status(201).json({ userId });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

// Place Order Endpoint
app.post('/order', validateOrder, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { userId, productId, price } = req.body;
        const product = menuData.menu.find(item => item.id === parseInt(productId));
        if (product.price !== parseFloat(price)) {
            return res.status(400).json({ error: 'Invalid price for the product' });
        }
        // Store order data in the database
        await db.insert({ userId, productId, price, timestamp: new Date() });
        res.status(201).json({ message: 'Order placed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

// Define a route handler for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

// Define a route handler to get the menu
app.get('/menu', (req, res) => {
    res.json(menuData.menu);
});

// Get Ongoing Orders Endpoint
app.get('/ongoing-orders', async (req, res) => {
    try {
        const currentTime = new Date();
        // Retrieve ongoing orders based on the current time from the database
        const ongoingOrders = await db.find({ timestamp: { $lte: currentTime } });
        res.json(ongoingOrders);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

// Get Order History Endpoint
app.get('/order-history/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        // Retrieve order history based on the user ID from the database
        const orderHistory = await db.find({ userId });
        res.json(orderHistory);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
