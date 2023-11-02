const dotenv = require("dotenv").config();

function checkSecret(req, res, next) {
  if (req.query.key === process.env.SECRET_KEY || undefined) {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Invalid key." });
  }
}

module.exports = checkSecret;
