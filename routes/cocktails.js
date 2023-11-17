const express = require("express");
const router = express.Router();
const Drink = require("../models/drink");

require("dotenv").config();

const { param, validationResult } = require("express-validator");

const MAX_IDS_PER_QUERY = process.env.MAX_IDS_PER_QUERY || 100;

router.get(
  "/:ids",
  [
    param("ids").isArray().withMessage("ids should be an array"),
    param("ids.*").trim().escape(),
  ],
  async (req, res) => {
    try {
      const targetIds = req.params.ids.split(",");

      if (targetIds.length > MAX_IDS_PER_QUERY) {
        console.log(`targetIds length is more than ${MAX_IDS_PER_QUERY}`);
        return res.status(400).json({
          message: `Cannot search for more than ${MAX_IDS_PER_QUERY} ids.`,
        });
      }

      const drinks = await Drink.find({ id: { $in: targetIds } }).exec();

      if (!drinks || drinks.length == 0) {
        console.log("No drink found with id:", targetIds);
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
