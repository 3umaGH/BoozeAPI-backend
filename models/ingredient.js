const mongoose = require("mongoose");

// Define the schema for ingredients
const ingredientSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  type: String,
  containsAlcohol: String,
  ABV: String,
  image: String,
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;