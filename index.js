const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config();

const app = express();
const dir = path.resolve("public/");

app.use(checkSecret);

app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
  })
);

app.use("/cocktails", express.static("public/assets/cocktails"));
app.use(checkDBConnection);

function checkDBConnection(req, res, next) {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    mongoose.connection.once("connected", () => {
      next();
    });
  }
}

function checkSecret(req, res, next) {
  if (req.query.key === process.env.SECRET_KEY || undefined) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Invalid key." });
  }
}

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

connect();

app.use("/search", require("./routes/search"));
app.use("/cocktail", require("./routes/cocktail"));
app.use("/cocktails", require("./routes/cocktails"));
app.use("/lookup", require("./routes/lookup"));
app.use("/list", require("./routes/list"));


app.get("*", (req, res) => {
  res.status(404).json({ message: "URL not found" });
});

app.listen(process.env.LISTEN_PORT);
