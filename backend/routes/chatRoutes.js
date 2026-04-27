const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const authMiddleware = require("../middleware/auth");

// ✅ Send message
router.post("/send", authMiddleware, async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    const message = new Message({
      sender: req.user.id,
      receiver: receiverId,
      text,
    });

    await message.save();

    res.json(message);
  } catch (err) {
    res.status(500).json({ message: "Error sending message" });
  }
});

// ✅ Get chat between 2 users
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});

module.exports = router;