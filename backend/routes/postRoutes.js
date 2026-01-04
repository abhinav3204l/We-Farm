const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// ✅ Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

// ✅ Create a post
router.post("/", async (req, res) => {
  try {
    const { content, author } = req.body;

    const post = new Post({
      content,
      author: author || "Farmer",
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to create post" });
  }
});

// ✅ Like a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.likes += 1;
    await post.save();
    res.json({ likes: post.likes });
  } catch (err) {
    res.status(500).json({ message: "Failed to like post" });
  }
});

module.exports = router;
