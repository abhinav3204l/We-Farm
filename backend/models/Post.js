const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    role: {
      type: String,
      default: "farmer",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
