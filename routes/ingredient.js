const express = require("express");
const router = express.Router();
const Drink = require("../models/drink");

const { param, query, validationResult } = require("express-validator");
const Ingredient = require("../models/ingredient");

router.get(
  "/:id",
  [
    // Use express-validator to sanitize the id parameter
    param("id").trim().escape(),
  ],
  async (req, res) => {
    try {
      const targetId = req.params.id;
      const drink = await Ingredient.findOne({ id: targetId }).exec();

      if (!drink) {
        console.log("No ingredient found with id:", targetId);
        return res.status(404).json({ message: "Ingredient not found" });
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
  ],
  async (req, res) => {
    try {
      const targetName = decodeURIComponent(req.query.name);
  
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

      if (queryConditions.length === 0)
        return res.status(400).json({ message: "Invalid parameters." });

      const drinks = await Ingredient.find({
        $and: queryConditions,
      }).exec();

      if (!drinks || drinks.length == 0) {
        console.log("No ingredients found with name:", targetName);
        return res.status(404).json({ message: "Ingredients not found" });
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
