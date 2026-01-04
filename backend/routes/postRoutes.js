const express = require("express");
const Post = require("../models/Post");

const router = express.Router(); // 

// CREATE A POST
router.post("/", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Post content is required" });
    }

    const post = await Post.create({
      content,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to create post" });
  }
});

// GET ALL POSTS
router.get("/", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

module.exports = router;
