/* GRUPPARBETE */

// Importera nödvändiga moduler
const express = require('express');
const bodyParser = require('body-parser');
const Datastore = require('nedb');
const { v4: uuidv4 } = require('uuid');

// Skapa en Express-app
const app = express();

// Middleware för att tolka JSON- och URL-kodad data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Skapa och anslut till en NeDB-databas
const db = new Datastore({ filename: 'orders.db', autoload: true });

// Läs in menyn från JSON-filen
const menu = require('./menu.json');

// Endpoints för att hantera beställningar

// Endpoint för att visa hela menyn
app.get('/menu', (req, res) => {
  res.json(menu);
});

// Endpoint för att lägga till en ny beställning
app.post('/order', (req, res) => {
  const { userId, productId } = req.body;

  // Validera användarid
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'Ogiltigt användarid.' });
  }

  // Validera produktid
  const product = menu.menu.find(item => item.id === parseInt(productId));
  if (!product) {
    return res.status(400).json({ error: 'Produkten finns inte i menyn.' });
  }

  // Skapa en ny beställning
  const order = {
    id: uuidv4(),
    userId: userId,
    productId: parseInt(productId),
    timestamp: new Date().toISOString(),
    status: 'pending'
  };

  // Spara beställningen i databasen
  db.insert(order, (err, newOrder) => {
    if (err) {
      return res.status(500).json({ error: 'Kunde inte skapa beställning.' });
    }
    res.status(201).json(newOrder);
  });
});

// Endpoint för att visa pågående och tidigare beställningar för en användare
app.get('/orders/:userId', (req, res) => {
  const userId = req.params.userId;

  // Sök efter beställningar i databasen som matchar användarid
  db.find({ userId: userId }, (err, orders) => {
    if (err) {
      return res.status(500).json({ error: 'Kunde inte hämta beställningar.' });
    }
    res.json(orders);
  });
});

// Starta servern
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servern är igång på port ${PORT}`);
});
