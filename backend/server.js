const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/db");

const authRoutes        = require("./routes/authRoutes");
const postRoutes        = require("./routes/postRoutes");
const chatRoutes        = require("./routes/chatRoutes");
const aiRoutes          = require("./routes/aiRoutes");
const marketplaceRoutes = require("./routes/marketplaceRoutes");

const app = express();

app.use(cors({
  origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth",        authRoutes);
app.use("/api/posts",       postRoutes);
app.use("/api/chat",        chatRoutes);
app.use("/api/ai",          aiRoutes);
app.use("/api/marketplace", marketplaceRoutes);

app.get("/", (req, res) => res.send("WeFarm API is running..."));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});