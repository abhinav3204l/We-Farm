const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const User = require("../models/Account");

const router = express.Router();

/* ================= JWT MIDDLEWARE ================= */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* ================= MULTER ================= */
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    res.json(user);
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: "Email already registered" });
    console.error("Register error:", err);
    res.status(500).json({ message: "Register failed" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Wrong password" });
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        darkMode: user.darkMode,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

/* ================= GET USER BY ID (for Chat header) ================= */
router.get("/user/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name avatar badge");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

/* ================= UPDATE PROFILE ================= */
router.put("/update", async (req, res) => {
  try {
    const { userId, name, email, avatar, darkMode } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.name = name;
    user.email = email;
    user.avatar = avatar;
    user.darkMode = darkMode;
    await user.save();
    res.json(user);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Profile update failed" });
  }
});

/* ================= UPDATE LOCATION ================= */
router.put("/location", verifyToken, async (req, res) => {
  try {
    const { lat, lng } = req.body;
    if (!lat || !lng) return res.status(400).json({ message: "Invalid coordinates" });
    await User.findByIdAndUpdate(
      req.user.id,
      { location: { lat, lng }, lastActive: new Date() },
      { new: true }
    );
    res.json({ message: "Location updated" });
  } catch (err) {
    console.error("Location update error:", err);
    res.status(500).json({ message: "Location update failed" });
  }
});

/* ================= UPLOAD AVATAR ================= */
router.post("/upload-avatar", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file received" });
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await cloudinary.uploader.upload(dataURI);
    res.json({ url: result.secure_url });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Image upload failed" });
  }
});

/* ================= MAP USERS ================= */
router.get("/map-users", verifyToken, async (req, res) => {
  try {
    const users = await User.find({
      "location.lat": { $exists: true },
      ghostMode: { $ne: true },
    }).select("name avatar location badge");
    res.json(users);
  } catch (err) {
    console.error("Fetch map users error:", err);
    res.status(500).json({ message: "Failed to fetch map users" });
  }
});

module.exports = router;