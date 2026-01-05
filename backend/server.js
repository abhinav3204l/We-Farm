const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/db");

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

// ✅ CREATE APP FIRST
const app = express();

// ✅ MIDDLEWARE
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://wefarm-ten.vercel.app",
      "https://www.wefarm-ten.vercel.app",
    ],
  })
);

// ✅ ROUTES (AFTER app IS CREATED)
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// ✅ HEALTH CHECK
app.get("/", (req, res) => {
  res.send("WeFarm backend is running 🚀");
});

// ✅ START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
