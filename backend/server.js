const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Serve uploads folder
app.use("/uploads", express.static("uploads"));

// Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Schema
const gallerySchema = new mongoose.Schema({
  imageUrl: String,
});

const Gallery = mongoose.model("Gallery", gallerySchema);

// GET Gallery
app.get("/gallery", async (req, res) => {
  const images = await Gallery.find();
  res.json(images);
});

// POST Upload
app.post("/gallery", upload.single("image"), async (req, res) => {
  const newImage = new Gallery({
    imageUrl: `uploads/${req.file.filename}`,
  });
  await newImage.save();
  res.json({ message: "Image Uploaded" });
});

// DELETE Image
app.delete("/gallery/:id", async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: "Image Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete Failed" });
  }
});

// Start Server
app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});