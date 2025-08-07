const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cafe', { useNewUrlParser: true, useUnifiedTopology: true });

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', contactSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  userName: String,
  address: String,
  phone: String,
  items: [
    {
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  itemsCount: Number,
  total: Number,
  date: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

// Cart Schema (for saving cart items directly)
const cartSchema = new mongoose.Schema({
  items: Array,
  createdAt: { type: Date, default: Date.now }
});
const Cart = mongoose.model('Cart', cartSchema);

// Contact endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(200).json({ message: 'Contact saved!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Order endpoint
app.post('/api/order', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(200).json({ message: 'Order saved!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));