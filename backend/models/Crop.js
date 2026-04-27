const mongoose = require("mongoose");

const CropSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    quantity: { type: String, required: true }, // e.g. "50 kg", "2 quintals"
    image: { type: String, default: "" },
    sold: { type: Boolean, default: false },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Crop", CropSchema);