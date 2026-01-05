import Post from "../models/Post.js";

// GET all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("GET POSTS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

// CREATE a post
export const createPost = async (req, res) => {
  try {
    console.log("POST BODY:", req.body); // 🔥 DEBUG LINE

    const { content, role } = req.body;

    if (!content || !role) {
      return res.status(400).json({ message: "Content and role required" });
    }

    const newPost = new Post({
      content,
      role,
    });

    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.error("CREATE POST ERROR:", error);
    res.status(500).json({ message: "Failed to create post" });
  }
};
