const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  name: String,
  amount: String,
});

// Define the schema for drinks
const drinkSchema = new mongoose.Schema({
  id: String,
  name: String,
  category: String,
  alcoholic: String,
  glassType: String,
  instructions: String,
  image: String,
  ingredients: [ingredientSchema],
});

const Drink = mongoose.model('Drink', drinkSchema);

module.exports = Drink;