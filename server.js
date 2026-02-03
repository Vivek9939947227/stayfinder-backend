const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const app = express();
app.use(cors());
app.use(express.json());
app.use(cors());
app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("StayFinder Backend is running 🚀");
});

// 🔗 MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// 🏠 Property Schema
const PropertySchema = new mongoose.Schema({
  title: String,
  type: String,
  priceDay: Number,
  priceWeek: Number,
  priceMonth: Number,
  city: String,
  area: String,
  images: [String],
  mapLink: String,
  whatsapp: String,
  upiQr: String,
  available: Boolean
});

const Property = mongoose.model("Property", PropertySchema);

// ➕ Add Property
app.post("/add-property", async (req, res) => {
  const property = new Property(req.body);
  await property.save();
  res.json({ message: "Property added successfully" });
});

// 🔍 Get All Properties
app.get("/properties", async (req, res) => {
  const properties = await Property.find();
  res.json(properties);
});

// 🔎 Get Property by ID
app.get("/property/:id", async (req, res) => {
  const property = await Property.findById(req.params.id);
  res.json(property);
});

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.post("/upload", upload.fields([
  { name: "images", maxCount: 5 },
  { name: "video", maxCount: 1 }
]), async (req, res) => {
  try {
    const imageUrls = [];
    const videoUrls = [];

    if (req.files.images) {
      for (const file of req.files.images) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          { resource_type: "image" }
        );
        imageUrls.push(result.secure_url);
      }
    }

    if (req.files.video) {
      const file = req.files.video[0];
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        { resource_type: "video" }
      );
      videoUrls.push(result.secure_url);
    }

    res.json({
      success: true,
      images: imageUrls,
      videos: videoUrls,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
