const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();

app.use("/assets", express.static("assets"));
app.use(cors());

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
    connect();
  }, 10000); // 5000 milliseconds = 5 seconds

});

connect();

const searchRouter = require("./routes/search");
app.use("/search", searchRouter);

app.get("*", (req,res) => {
    res.status(404).json({ message: "Not found" });
})


app.listen(process.env.LISTEN_PORT);
