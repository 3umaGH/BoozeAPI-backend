const express = require("express");
const router = express.Router();
const Drink = require("../models/drink");

require("dotenv").config();

const { param, validationResult } = require("express-validator");

const MAX_IDS_PER_QUERY = process.env.MAX_IDS_PER_QUERY || 100;
const MIN_CHAR_PER_NAME_SEARCH = process.env.MIN_CHAR_PER_NAME_SEARCH || 3;

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

router.get("*", (req, res) => {
  res.status(404).json({ message: "Not found" });
});

module.exports = router;