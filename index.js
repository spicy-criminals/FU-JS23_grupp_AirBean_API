const express = require('express'); // Importerar Express-biblioteket för att hantera HTTP-anrop.
const Datastore = require('nedb-promise'); // Importerar NeDB-promise, en inbäddad databas för Node.js som använder promises.
const { v4: uuidv4 } = require('uuid'); // Importerar uuid för att generera unika identifierare.
const { body, validationResult } = require('express-validator'); // Importerar valideringsverktyg från express-validator.
const { format, isBefore } = require('date-fns'); // Importerar datumfunktioner från date-fns.
const menuData = require('./menu.json'); // Laddar menydata från en lokal JSON-fil.
const { parseISO } = require('date-fns/fp'); // Importerar en funktion för att tolka ISO-strängar från date-fns/fp.

// Skapar en ny Express-applikation.
const app = express(); 

// Skapar en ny databasinstans, specificerar filnamnet och att databasen ska laddas automatiskt.
const db = new Datastore({ filename: 'database.db', autoload: true });

// Definierar portnummer som servern ska lyssna på.
const PORT = 8000;

// Middleware för validering av användarinput
const validateOrder = [
    // Validerar att 'userId' är ett giltigt UUID-format
    body('userId').isUUID().withMessage('Ogiltigt användar-ID-format'),

    // Validerar att 'productId' är ett heltal och verifierar dess giltighet mot en produktlista
    body('productId').isInt().withMessage('Produkt-ID måste vara ett heltal').custom(value => {
        // Söker igenom menydata för att hitta en produkt med angivet ID
        const produkt = menyData.meny.find(item => item.id === value);
        // Om inget giltigt produkt-ID hittas, kastas ett fel
        if (!produkt) {
            throw new Error('Ogiltigt produkt-ID');
        }
        // Returnerar sant om produkt-ID är giltigt
        return true;
    }),

    // Validerar att 'price' är ett numeriskt värde
    body('price').isNumeric().withMessage('Priset måste vara ett nummer'),
];

// Middleware för hantering av fel
const errorHandler = (err, req, res, next) => {
    // Skriver ut felstacken till konsolen för debugging
    console.error(err.stack);

    // Kontrollerar om felet är ett SyntaxError, har status 400 och är relaterat till request body
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        // Returnerar ett felmeddelande med status 400 om JSON-innehållet i body är ogiltigt
        return res.status(400).json({ error: 'Ogiltigt JSON-innehåll' });
    }

    // För alla andra typer av fel, returneras status 500 och ett generellt felmeddelande
    res.status(500).json({ error: err.message || 'Internt serverfel' });
};

// Middleware för felhantering
app.use(errorHandler);

// Slutpunkt för att skapa konto
app.post('/signup', [
    // Validerar att 'username' är en sträng
    body('username').isString().withMessage('Användarnamn måste vara en sträng'),

    // Validerar att 'email' är en giltig e-postadress
    body('email').isEmail().withMessage('Ogiltig e-postadress'),

    // Validerar att 'password' är minst 6 tecken långt
    body('password').isLength({ min: 6 }).withMessage('Lösenordet måste vara minst 6 tecken långt'),
], async (req, res) => {
    try {
        // Extraherar valideringsfel från requesten
        const errors = validationResult(req);
        // Om valideringsfel finns, returnera felmeddelande med status 400
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Extraherar 'username', 'email' och 'password' från request body
        const { username, email, password } = req.body;

        // Skapar ett unikt användar-ID med uuidv4
        const userId = uuidv4();

        // Kontrollera om en användare med samma e-postadress redan finns
        const existingUser = await db.findOne({ email });
        if (existingUser) {
            // Om användaren redan finns, returnera ett felmeddelande med status 400
            return res.status(400).json({ error: 'Användaren finns redan' });
        }

        // Lagra den nya användarens data i databasen
        await db.insert({ userId, username, email, password });

        // Returnera användar-ID med status 201 skapat
        res.status(201).json({ userId });
    } catch (error) {
        // Hantera eventuella serverfel och returnera status 500 med felmeddelande
        res.status(500).json({ error: error.message || 'Internt serverfel' });
    }
});

// Slutpunkt för att placera en order
app.post('/order', validateOrder, async (req, res) => {
    try {
        // Extraherar valideringsfel från requesten
        const errors = validationResult(req);
        // Om valideringsfel finns, returnera felmeddelande med status 400
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Extraherar 'userId', 'productId', och 'price' från request body
        const { userId, productId, price } = req.body;

        // Söker efter produkten i menyn baserat på 'productId' och konverterar 'productId' till ett heltal
        const product = menuData.menu.find(item => item.id === parseInt(productId));

        // Kontrollerar att det angivna priset matchar produktens pris i datan, konverterar 'price' till flyttal
        if (product.price !== parseFloat(price)) {
            // Om priset inte stämmer, returnera ett felmeddelande med status 400
            return res.status(400).json({ error: 'Ogiltigt pris för produkten' });
        }

        // Lagra orderdata i databasen med ett tidsstämpel för när ordern skapades
        await db.insert({ userId, productId, price, timestamp: new Date() });

        // Returnera ett framgångsmeddelande med status 201 att ordern har placerats
        res.status(201).json({ message: 'Order placerad framgångsrikt' });
    } catch (error) {
        // Hantera eventuella serverfel och returnera status 500 med felmeddelande
        res.status(500).json({ error: error.message || 'Internt serverfel' });
    }
});

// Ange en rutt-hanterare för rot-URL:en
app.get('/', (req, res) => {
    // Skickar ett välkomstmeddelande som svar till klienten
    res.send('Välkommen till AirBean-API:et');
});

// Ange en rutt-hanterare för att hämta menyn
app.get('/menu', (req, res) => {
    // Skickar hela menyn som ett JSON-objekt som svar till klienten
    res.json(menuData.menu);
});

// Ange en rutt-hanterare för att hämta en specifik menyartikel med dess ID
app.get('/menu/:itemId', (req, res) => {
    // Konverterar itemId från sträng till heltal för korrekt jämförelse
    const itemId = parseInt(req.params.itemId);

    // Söker igenom menyn för att hitta en artikel vars ID matchar det angivna itemId
    const item = menuData.menu.find(item => item.id === itemId);

    // Kontrollerar om artikeln finns i menyn
    if (!item) {
        // Om artikeln inte finns, returnera status 404 med ett felmeddelande
        return res.status(404).json({ error: 'Artikeln hittades inte' });
    }

    // Om artikeln finns, returnera den som ett JSON-objekt
    res.json(item);
});

// Slutpunkt för att hämta pågående beställningar
app.get('/ongoing-orders', async (req, res) => {
    try {
        // Skapar en tidsstämpel för aktuell tid
        const currentTime = new Date();

        // Hämtar alla beställningar från databasen
        const ongoingOrders = await db.find({});

        // Filtrerar ut de beställningar vars tid är före nuvarande tid
        const filteredOngoingOrders = ongoingOrders.filter(order => {
            const orderTime = new Date(order.timestamp);  // Konverterar beställningens tidstämpel till Date-objekt
            return isBefore(orderTime, currentTime);  // Kontrollerar om beställningens tid är före nuvarande tid
        });

        // Returnerar de filtrerade pågående beställningarna som ett JSON-objekt
        res.json(filteredOngoingOrders);
    } catch (error) {
        // Hanterar eventuella fel och returnerar status 500 med felmeddelande
        res.status(500).json({ error: error.message || 'Internt serverfel' });
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