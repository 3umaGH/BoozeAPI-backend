const mongoose = require("mongoose");

function checkDBConnection(req, res, next) {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    mongoose.connection.once("connected", () => {
      next();
    });
  }
}

module.exports = checkDBConnection;