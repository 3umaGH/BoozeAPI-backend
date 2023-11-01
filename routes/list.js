const express = require("express");
const router = express.Router();
const Drink = require("../models/drink");

require("dotenv").config();

router.get("/", async (req, res) => {
  try {
    const [uniqueCategories, uniqueAlcoholic, uniqueGlassType, uniqueIngredientNames] = await Promise.all([
        Drink.distinct('category'),
        Drink.distinct('alcoholic'),
        Drink.distinct('glassType'),
        Drink.distinct('ingredients.name')
      ]);
    
      return res.status(200).json({
        categories: uniqueCategories,
        alcoholic: uniqueAlcoholic,
        glassTypes: uniqueGlassType,
        ingredients: uniqueIngredientNames,
      });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("*", (req, res) => {
  res.status(404).json({ message: "Not found" });
});

module.exports = router;
