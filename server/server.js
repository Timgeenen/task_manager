require('dotenv').config;
const express = require("express");
const mongoose = require("mongoose");
const app = express();
console.log(process.env.MONGO_URI)
mongoose.connect(
  "mongodb+srv://timmiej95:is9k5SGC6oKtw18z@cluster0.e7txv8g.mongodb.net/"
);

const cors = require("cors");
const corsOptions = { origin: "http://localhost:3000" }
app.use(cors(corsOptions));

app.get("/api", (req, res) => {
  res.json({fruits: ["apple", "banana"]});
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});