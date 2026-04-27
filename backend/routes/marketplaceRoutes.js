const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const Crop = require("../models/Crop");
const auth = require("../middleware/auth");

const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });

/* ── GET ALL LISTINGS ── */
router.get("/", async (req, res) => {
  try {
    const crops = await Crop.find({ sold: false })
      .populate("seller", "name avatar")
      .sort({ createdAt: -1 });
    res.json(crops);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch listings" });
  }
});

/* ── GET MY LISTINGS ── */
router.get("/mine", auth, async (req, res) => {
  try {
    const crops = await Crop.find({ seller: req.user.id })
      .sort({ createdAt: -1 });
    res.json(crops);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your listings" });
  }
});

/* ── CREATE LISTING ── */
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const { title, description, price, quantity } = req.body;

    let imageUrl = "";
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const result = await cloudinary.uploader.upload(dataURI, { folder: "wefarm_crops" });
      imageUrl = result.secure_url;
    }

    const crop = await Crop.create({
      title,
      description,
      price: Number(price),
      quantity,
      image: imageUrl,
      seller: req.user.id,
    });

    const populated = await crop.populate("seller", "name avatar");
    res.json(populated);
  } catch (err) {
    console.error("Create listing error:", err);
    res.status(500).json({ message: "Failed to create listing" });
  }
});

/* ── MARK AS SOLD ── */
router.put("/:id/sold", auth, async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ message: "Listing not found" });
    if (crop.seller.toString() !== req.user.id)
      return res.status(403).json({ message: "Not your listing" });

    crop.sold = true;
    await crop.save();
    res.json({ message: "Marked as sold" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update listing" });
  }
});

/* ── DELETE LISTING ── */
router.delete("/:id", auth, async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ message: "Not found" });
    if (crop.seller.toString() !== req.user.id)
      return res.status(403).json({ message: "Not your listing" });

    await crop.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete" });
  }
});

module.exports = router;