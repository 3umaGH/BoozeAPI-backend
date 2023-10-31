const express = require("express");
const router = express.Router();
const Drink = require("../models/drink");

const { param, validationResult } = require("express-validator");

router.get(
  "/id/:id",
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

router.get(
  "/ids/:ids",
  [
    param("ids").isArray().withMessage("ids should be an array"),
    param("ids.*").trim().escape(),
  ],
  async (req, res) => {
    try {
      const targetIds = req.params.ids.split(",");

      if (targetIds.length > 100) {
        console.log("targetIds length is more than 100");
        return res
          .status(404)
          .json({ message: "Cannot search for more than 100 ids." });
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

router.get(
    "/name/:name",
    [
      param("name").trim().escape(),
    ],
    async (req, res) => {
      try {
        const targetName = req.params.name;
        const drinks = await Drink.find({ name: { $regex: targetName, $options: 'i' } }).exec();
  
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
