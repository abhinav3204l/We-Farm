const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// ==============================
// GET all posts
// ==============================
router.get("/", async (req, res) => {
  try {
    console.log("GET /api/posts called"); // 🔥 DEBUG
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error("Fetch posts error:", error.message);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

// ==============================
// CREATE a new post
// ==============================
router.post("/", async (req, res) => {
  try {
    console.log("POST BODY:", req.body); // 🔥 DEBUG

    const { content, role } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Post content is required" });
    }

    const post = await Post.create({
      content,
      role: role || "farmer",
    });

    res.status(201).json(post);
  } catch (error) {
    console.error("Create post error:", error.message);
    res.status(500).json({ message: "Failed to create post" });
  }
});

// ==============================
// LIKE a post
// ==============================
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.likes = (post.likes || 0) + 1;
    await post.save();

    res.json({ likes: post.likes });
  } catch (error) {
    console.error("Like post error:", error.message);
    res.status(500).json({ message: "Failed to like post" });
  }
});

module.exports = router;
