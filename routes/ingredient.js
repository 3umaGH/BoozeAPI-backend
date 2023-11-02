const express = require("express");
const router = express.Router();
const Drink = require("../models/drink");

const { param, validationResult } = require("express-validator");
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

router.get("*", (req, res) => {
  res.status(404).json({ message: "Not found" });
});

module.exports = router;
