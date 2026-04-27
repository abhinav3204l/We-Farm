const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  text: String,
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new mongoose.Schema(
  {
    content: String,

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    likes: { type: Number, default: 0 },

    comments: {
      type: [CommentSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
