require("dotenv").config();
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const app = express();
const bodyParse = require("body-parser");
const path = require("path");
const vision = require("@google-cloud/vision");
app.use(express.static("frontend"));
app.use(express.static("/"));

// Creates a client
const client = new vision.ImageAnnotatorClient({
  projectId: "caramel-duality-369122",
  keyFilename: "key.json",
});

//TEST
app.use(cors());
app.use(bodyParse.urlencoded({ extended: false }));
app.use(bodyParse.json());
app.use(morgan("dev"));

// 0 = C++, 1 = C, 2 = Javascript (nodejs)
function getLanguage(languageID) {
  if (languageID == 0) {
    return "cpp";
  } else if (languageID == 1) {
    return "c";
  } else {
    return "nodejs";
  }
}

// upload image
app.post("/image/upload", async (req, res, next) => {
  try {
    // to declare some path to store your converted image
    const path = "./images/foo.png";

    const imgdata = req.body.base64image;

    // to convert base64 format into random filename
    const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, "");

    fs.writeFileSync(path, base64Data, { encoding: "base64" });

    return res.send(path);
  } catch (e) {
    next(e);
  }
});

app.get("/code_recognition", async (req, res) => {
  try {
    const [result] = await client.documentTextDetection("foo.png");
    const fullTextAnnotation = result.fullTextAnnotation;
    res.status(200).json({ output: fullTextAnnotation.text });
  } catch (e) {
    console.log(e);
  }
});

// Compile code
app.post("/compile", async (req, res) => {
  var request = require("request");
  const { languageID } = req.body;

  // 0 = C++ (versionIndex 4), 1 = C, 2 = Javascript (nodejs)
  var program = {
    script: "console.log(1 + 1)",
    language: getLanguage(languageID),
    versionIndex: "4",
    clientId: "d0c25492b573abf6ac0f5999d0f62d98",
    clientSecret:
      "f9416cae80b7afda1888d70f09a18d8f2b8672526d9486fd56d22096c6047367",
  };
  request(
    {
      url: "https://api.jdoodle.com/v1/execute",
      method: "POST",
      json: program,
    },
    function (error, response, body) {
      console.log("error:", error);
      console.log("statusCode:", response && response.statusCode);
      console.log("body:", body);
      res.status(200).json({ output: body.output });
    }
  );
});

app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Running Server at " + port));
