// backend/models/Card.js

const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
});

 const Cards = mongoose.model('Card', cardSchema);
 
module.exports = Cards;
