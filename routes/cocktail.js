const express = require("express");
const router = express.Router();
const Drink = require("../models/drink");

const { param, query, validationResult } = require("express-validator");

router.get(
  "/:id",
  [
    // Use express-validator to sanitize the id parameter
    param("id").trim().escape(),
  ],
  async (req, res) => {
    try {
      const targetId = req.params.id;
      const drink = await Drink.findOne({ id: targetId }).exec();

      if (!drink) {
        console.log("No drink found with id:", targetId);
        return res.status(404).json({ message: "Drink not found" });
      }

      return res.status(200).json(drink);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }
);

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
      const targetName = decodeURIComponent(req.query.name);
      const targetGlass = decodeURIComponent(req.query.glass);
      const targetCategory = decodeURIComponent(req.query.category).replace('&#x2F;', '/');
      const targetIngredients =
        req.query.ingredients !== "" &&
        decodeURIComponent(req.query.ingredients).split(",");
      const targetAlcoholic = decodeURIComponent(req.query.alcoholic);

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
        queryConditions.push({ name: { $regex: new RegExp(targetName, "i") } });
      }

      if (targetGlass) {
        queryConditions.push({
          glassType: { $regex: new RegExp(targetGlass, "i") },
        });
      }

      if (targetCategory) {
        queryConditions.push({
          category: { $regex: new RegExp(targetCategory, "i") },
        });
      }

      if (targetIngredients && targetIngredients.length > 0) {
        queryConditions.push({
          "ingredients.name": {
            $all: targetIngredients.map(
              (ingredient) => new RegExp(ingredient, "i")
            ),
          },
        });
      }

      if (targetAlcoholic) {
        queryConditions.push({
          alcoholic: { $regex: new RegExp(`^${targetAlcoholic}$`, "i") },
        });
      }

      if (queryConditions.length === 0)
        return res.status(400).json({ message: "Invalid parameters." });

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
