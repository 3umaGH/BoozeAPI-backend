const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config();

const app = express();
const dir = path.resolve("public/");

app.use(cors());
app.use("/cocktails", express.static("public/assets/cocktails"));

// DB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// Connect to MongoDB
const connect = () => {
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
};

// Listen for the connection event
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected");
});

// Listen for the error event
mongoose.connection.on("error", (err) => {
  console.log("Mongoose connection error: " + err);
});

// Listen for the disconnection event
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected trying to reconnect.");

  setTimeout(() => {
    mongoose.connect(uri, options);
  }, 1000);
});

function checkSecret(req, res, next) {
  if (req.query.key === process.env.SECRET_KEY || undefined) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Invalid key." });
  }
}

app.use("/search", checkSecret, require("./routes/search"));
app.use("/cocktail", checkSecret, require("./routes/cocktail"));
app.use("/cocktails", checkSecret, require("./routes/cocktails"));
app.use("/lookup", checkSecret, require("./routes/lookup"));
app.use("/list", checkSecret, require("./routes/list"));

app.get("*", (req, res) => {
  res.status(404).json({ message: "URL not found" });
});

connect();

app.listen(process.env.LISTEN_PORT);
