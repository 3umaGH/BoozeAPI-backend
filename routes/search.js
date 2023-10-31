const express = require("express");
const router = express.Router();
const Drink = require("../models/drink");

require("dotenv").config();

const { query } = require("express-validator");

const MAX_IDS_PER_QUERY = process.env.MAX_IDS_PER_QUERY || 100;
const MIN_CHAR_PER_NAME_SEARCH = process.env.MIN_CHAR_PER_NAME_SEARCH || 3;

router.get("/", [query("name").trim().escape()], async (req, res) => {
  try {
    const targetName = req.query.name;

    if (targetName.length < MIN_CHAR_PER_NAME_SEARCH) {
      console.log(`targetName length is more than ${MIN_CHAR_PER_NAME_SEARCH}`);
      return res.status(400).json({
        message: `Please enter at least ${MIN_CHAR_PER_NAME_SEARCH} characters.`,
      });
    }
    const drinks = await Drink.find({
      name: { $regex: targetName, $options: "i" },
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
});

router.get("*", (req, res) => {
  res.status(404).json({ message: "Not found" });
});

module.exports = router;
