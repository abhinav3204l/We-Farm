const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    content: String,
    author: String,
    likes: Number,
  },
  { timestamps: true, collection: "posts" } // 👈 FORCE collection name
);

module.exports = mongoose.model("Post", postSchema);
