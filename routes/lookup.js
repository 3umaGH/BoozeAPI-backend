const express = require("express");
const router = express.Router();
const Drink = require("../models/drink");

require("dotenv").config();

const { query } = require("express-validator");

const MAX_RANDOM_COCKTAILS_PER_REQUEST =
  process.env.MAX_RANDOM_COCKTAILS_PER_REQUEST || 50;

router.get("/random", [query("amount").trim().escape()], async (req, res) => {
  try {
    let amount = req.query.amount || 10;

    if (isNaN(amount)) {
      return res.status(400).json({ message: "Amount must be a number" });
    } else amount = parseFloat(amount);

    if (amount > MAX_RANDOM_COCKTAILS_PER_REQUEST)
      return res.status(400).json({
        message: `Maximum ${MAX_RANDOM_COCKTAILS_PER_REQUEST} cocktails per request.`,
      });

    const randomCocktails = await Drink.aggregate([
      { $sample: { size: amount } },
    ]).exec();

    if (!randomCocktails || randomCocktails.length === 0) {
      console.log("Unable to fetch random drinks");
      return res.status(404).json({ message: "Unable to get random drinks" });
    }

    return res.status(200).json(randomCocktails);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/popular", async (req, res) => {
  try {
    const targetIds = [
      1813057, 6183713, 6524874, 156387, 5805584, 7974211, 4131349, 2697178,
      4853541, 3215518, 3951687, 5214284, 9319833, 6830846, 5428957, 1889518,
      8111614, 338623, 6427689, 5854300,
    ];

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
});

module.exports = router;
