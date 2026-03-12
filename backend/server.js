const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/* ---------------- MongoDB Connection ---------------- */

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));


/* ---------------- Uploads Folder ---------------- */

app.use("/uploads", express.static("uploads"));

/* ---------------- Multer Config ---------------- */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });


/* ---------------- Gallery Schema ---------------- */

const gallerySchema = new mongoose.Schema({
  imageUrl: String
});

const Gallery = mongoose.model("Gallery", gallerySchema);


/* ---------------- Events Schema ---------------- */

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Event = mongoose.model("Event", eventSchema);


/* ---------------- Gallery APIs ---------------- */

// GET Gallery
app.get("/gallery", async (req, res) => {
  try {
    const images = await Gallery.find();
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

// Upload Image
app.post("/gallery", upload.single("image"), async (req, res) => {
  try {

    const newImage = new Gallery({
      imageUrl: `uploads/${req.file.filename}`
    });

    await newImage.save();

    res.json({ message: "Image Uploaded Successfully" });

  } catch (error) {
    res.status(500).json({ error: "Upload Failed" });
  }
});

// Delete Image
app.delete("/gallery/:id", async (req, res) => {
  try {

    await Gallery.findByIdAndDelete(req.params.id);

    res.json({ message: "Image Deleted Successfully" });

  } catch (error) {
    res.status(500).json({ error: "Delete Failed" });
  }
});


/* ---------------- Events APIs ---------------- */

// GET Events
app.get("/events", async (req, res) => {
  try {

    const events = await Event.find().sort({ createdAt: -1 });

    res.json(events);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// ADD Event
app.post("/events", async (req, res) => {
  try {

    const { title, description, date } = req.body;

    const newEvent = new Event({
      title,
      description,
      date
    });

    await newEvent.save();

    res.json({ message: "Event Added Successfully" });

  } catch (error) {
    res.status(500).json({ error: "Failed to add event" });
  }
});

// UPDATE Event
app.put("/events/:id", async (req, res) => {
  try {

    await Event.findByIdAndUpdate(req.params.id, req.body);

    res.json({ message: "Event Updated Successfully" });

  } catch (error) {
    res.status(500).json({ error: "Update Failed" });
  }
});

// DELETE Event
app.delete("/events/:id", async (req, res) => {
  try {

    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: "Event Deleted Successfully" });

  } catch (error) {
    res.status(500).json({ error: "Delete Failed" });
  }
});


/* ---------------- Server ---------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});