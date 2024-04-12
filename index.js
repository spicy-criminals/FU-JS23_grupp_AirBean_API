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

// Middleware för validering av användarinput
const validateOrder = [
    body('userId').isUUID().withMessage('Ogiltigt användar-ID-format'),
    body('productId').isInt().withMessage('Produkt-ID måste vara ett heltal').custom(value => {
        const produkt = menyData.meny.find(item => item.id === value);
        if (!produkt) {
            throw new Error('Ogiltigt produkt-ID');
        }
        return true;
    }),
    body('price').isNumeric().withMessage('Priset måste vara ett nummer'),
];

// Middleware för hantering av fel
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Ogiltigt JSON-innehåll' });
    }
    res.status(500).json({ error: err.message || 'Internt serverfel' });
};

// Middleware för felhantering
app.use(errorHandler);

// Slutpunkt för att skapa konto
app.post('/signup', [
    body('username').isString().withMessage('Användarnamn måste vara en sträng'),
    body('email').isEmail().withMessage('Ogiltig e-postadress'),
    body('password').isLength({ min: 6 }).withMessage('Lösenordet måste vara minst 6 tecken långt'),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, email, password } = req.body;
        const userId = uuidv4();
        // Kontrollera om användaren redan finns
        const existingUser = await db.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Användaren finns redan' });
        }
        // Lagra användardata i databasen
        await db.insert({ userId, username, email, password });
        res.status(201).json({ userId });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internt serverfel' });
    }
});

// Slutpunkt för att placera en order
app.post('/order', validateOrder, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { userId, productId, price } = req.body;
        const product = menuData.menu.find(item => item.id === parseInt(productId));
        if (product.price !== parseFloat(price)) {
            return res.status(400).json({ error: 'Ogiltigt pris för produkten' });
        }
        // Lagra orderdata i databasen
        await db.insert({ userId, productId, price, timestamp: new Date() });
        res.status(201).json({ message: 'Order placerad framgångsrikt' });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internt serverfel' });
    }
});

// Ange en rutt-hanterare för rot-URL:en
app.get('/', (req, res) => {
    res.send('Välkommen till AirBean-API:et');
});

// Ange en rutt-hanterare för att hämta menyn
app.get('/menu', (req, res) => {
    res.json(menuData.menu);
});

// Ange en rutt-hanterare för att hämta en specifik menyartikel med dess ID
app.get('/menu/:itemId', (req, res) => {
    const itemId = parseInt(req.params.itemId);  // Se till att parametern behandlas som ett heltal
    const item = menuData.menu.find(item => item.id === itemId);  // Sök efter artikeln med ID

    if (!item) {
        return res.status(404).json({ error: 'Artikeln hittades inte' });  // Returnera ett fel om artikeln inte finns
    }

    res.json(item);  // Returnera den funna artikeln
});

// Get Ongoing Orders Endpoint
app.get('/ongoing-orders', async (req, res) => {
    try {
        const currentTime = new Date();
        const ongoingOrders = await db.find({});
        const filteredOngoingOrders = ongoingOrders.filter(order => {
            const orderTime = new Date(order.timestamp);
            return isBefore(orderTime, currentTime);
        });
        res.json(filteredOngoingOrders);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

// Slutpunkt för att hämta pågående beställningar
app.get('/ongoing-orders', async (req, res) => {
    try {
        const currentTime = new Date();
        const ongoingOrders = await db.find({});
        const filteredOngoingOrders = ongoingOrders.filter(order => {
            const orderTime = new Date(order.timestamp);
            return isBefore(orderTime, currentTime);
        });
        res.json(filteredOngoingOrders);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internt serverfel' });
    }
});

// Slutpunkt för att hämta beställningshistorik
app.get('/order-history/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        // Hämta beställningshistorik baserat på användar-ID från databasen
        const orderHistory = await db.find({ userId });
        res.json(orderHistory);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internt serverfel' });
    }
});

// Starta servern
const server = app.listen(PORT, () => {
    console.log(`Servern körs på port ${PORT}`);
});
