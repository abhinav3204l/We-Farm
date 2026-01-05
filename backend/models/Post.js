const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    content: String,
    role: { type: String, default: "farmer" },
    likes: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: "posts",
  }
);

module.exports = mongoose.model("Post", postSchema);
