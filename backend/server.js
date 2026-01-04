const express = require("express");
const cors = require("cors");
require("dotenv").config();

// ✅ IMPORT DB (THIS WAS MISSING / BROKEN)
require("./config/db");

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();

app.use(express.json());

 app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://wefarm-ten.vercel.app",
      "https://www.wefarm-ten.vercel.app"
    ],
    credentials: true,
  })
);


app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
  res.send("WeFarm backend is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
