require("dotenv").config();
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const app = express();
const bodyParse = require("body-parser");

//TEST
app.use(cors());
app.use(bodyParse.urlencoded({ extended: true }));
app.use(bodyParse.json());
app.use(morgan("dev"));

// main endpoint
app.get("/compile", async (req, res) => {
  const code = "print(3)";
  // JDOOLE API
  
  
  res.status(200).json({ output: "3" });
});

app.get("/image/convert", async (req, res) => {
  res.status(200).json({ text: "Let's win the hackathon!!" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Running Server at " + port));