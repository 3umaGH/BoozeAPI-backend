const express = require("express");
const router = express.Router();
const Drink = require("../models/drink");

require("dotenv").config();

const { query } = require("express-validator");

const MAX_IDS_PER_QUERY = process.env.MAX_IDS_PER_QUERY || 100;
const MIN_CHAR_PER_NAME_SEARCH = process.env.MIN_CHAR_PER_NAME_SEARCH || 3;

router.get(
  "/",
  [
    query("name").trim().escape(),
    query("glass").trim().escape(),
    query("category").trim().escape(),
    query("ingredients").trim().escape(),
    query("alcoholic").trim().escape(),
  ],
  async (req, res) => {
    try {
      const targetName = req.query.name;
      const targetGlass = req.query.glass;
      const targetCategory = req.query.category;
      const targetIngredients =
        req.query.ingredients !== "" && req.query.ingredients.split(",");
      const targetAlcoholic = req.query.alcoholic;

      const queryConditions = [];

      if (targetName) {
        if (targetName.length < MIN_CHAR_PER_NAME_SEARCH) {
          console.log(
            `targetName length is less than ${MIN_CHAR_PER_NAME_SEARCH}`
          );
          return res.status(400).json({
            message: `Please enter at least ${MIN_CHAR_PER_NAME_SEARCH} characters.`,
          });
        }

        queryConditions.push({ name: { $regex: targetName, $options: "i" } });
      }

      if (targetGlass) {
        queryConditions.push({ glassType: targetGlass });
      }

      if (targetCategory) {
        queryConditions.push({ category: targetCategory });
      }

      if (targetIngredients && targetIngredients.length > 0) {
        queryConditions.push({
          "ingredients.name": { $all: targetIngredients },
        });
      }

      if (targetAlcoholic) {
        queryConditions.push({ alcoholic: targetAlcoholic });
      }

      if (queryConditions.length === 0)
        return res.status(400).json({ message: "No parameters provided." });

      const drinks = await Drink.find({
        $and: queryConditions,
      }).exec();

      if (!drinks || drinks.length == 0) {
        console.log("No drinks found with name:", targetName);
        return res.status(404).json({ message: "Drinks not found" });
      }

      return res.status(200).json(drinks);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get("*", (req, res) => {
  res.status(404).json({ message: "Not found" });
});

module.exports = router;
