const express = require("express");
const multer = require("multer");
const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/videos");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/upload", upload.single("video"), (req, res) => {
  res.send("Video uploaded successfully.");
});

app.get("/videos/:filename", (req, res) => {
  res.sendFile(`public/videos/${req.params.filename}`);
});

app.listen(3000, () => {
  console.log("Server listening on port 3000.");
});
