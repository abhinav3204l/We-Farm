const express = require("express");
const Post = require("../models/Post");
const User = require("../models/Account");
const auth = require("../middleware/auth");

const router = express.Router();

/* 🔹 USER STATS */
router.get("/stats/user/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId });

    const totalPosts = posts.length;
    const totalLikes = posts.reduce((s, p) => s + p.likes, 0);
    const totalComments = posts.reduce(
      (s, p) => s + (p.comments?.length || 0),
      0
    );

    res.json({ totalPosts, totalLikes, totalComments });
  } catch {
    res.status(500).json({ message: "Stats failed" });
  }
});

/* 🔹 GET POSTS */
router.get("/", async (req, res) => {
  const posts = await Post.find()
    .populate("user", "name badge avatar")
    .sort({ createdAt: -1 });

  res.json(posts);
});

/* 🔹 CREATE POST */
router.post("/", auth, async (req, res) => {
  const post = await Post.create({
    content: req.body.content,
    user: req.user.id,
  });

  res.json(post);
});

/* 🔹 LIKE + AUTO EXPERT PROMOTION */
router.put("/:id/like", async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.likes++;
  await post.save();

  const posts = await Post.find({ user: post.user });
  const totalLikes = posts.reduce((s, p) => s + p.likes, 0);

  if (totalLikes >= 50) {
    await User.findByIdAndUpdate(post.user, {
      badge: "expert",
    });
  }

  res.json(post);
});

router.post("/:id/comment", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({ text });
    await post.save();

    res.json(post);
  } catch (err) {
    console.error("Add comment error:", err);
    res.status(500).json({ message: "Failed to add comment" });
  }
});

module.exports = router;
