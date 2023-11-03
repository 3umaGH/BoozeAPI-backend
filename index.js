const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const checkDBConnection = require("./middleware/checkDBConnection");
const checkSecret = require("./middleware/checkSecret");
const rateLimiter = require("./middleware/rateLimiter");

const app = express();
const dir = path.resolve("public/");

app.use(checkSecret);
app.use("/api/cocktail/img", express.static("public/assets/cocktails"));
app.use("/api/ingredient/img", express.static("public/assets/ingredients"));

app.use(rateLimiter);

app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
  })
);

app.use(checkDBConnection);

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
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  }, 1000);
});

connect();

app.use("/api/cocktail", require("./routes/cocktail"));
app.use("/api/cocktails", require("./routes/cocktails"));
app.use("/api/lookup", require("./routes/lookup"));
app.use("/api/list", require("./routes/list"));

app.use("/api/ingredient", require("./routes/ingredient"));

app.get("*", (req, res) => {
  return res.status(404).json({ message: "Page not found." });
});

app.listen(process.env.LISTEN_PORT);
