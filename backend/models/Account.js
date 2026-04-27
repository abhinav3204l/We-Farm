const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,

    role: { type: String, default: "farmer" },

    badge: {
      type: String,
      enum: ["expert", "active", "verified"],
      default: "active",
    },

    avatar: { type: String, default: "" },
    darkMode: { type: Boolean, default: false },

    // MAP FEATURE ADDITIONS
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },

    lastActive: {
      type: Date,
      default: Date.now,
    },

    ghostMode: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);