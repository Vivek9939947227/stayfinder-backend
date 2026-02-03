const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
