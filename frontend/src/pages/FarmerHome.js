import React, { useEffect, useState } from "react";
import API from "../api";
import "./FarmerHome.css";

function FarmerHome() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to load posts", err);
      alert("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  // Create post
  const createPost = async () => {
    if (!content.trim()) return;

    try {
      await API.post("/posts", {
        content,
        role: "farmer",
      });
      setContent("");
      fetchPosts();
    } catch (err) {
      alert("Failed to create post");
    }
  };

  // Like post (safe for old posts)
  const likePost = async (id) => {
    try {
      await API.put(`/posts/${id}/like`);
      fetchPosts();
    } catch (err) {
      alert("Failed to like post");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading feed...</p>;
  }

  return (
    <div className="feed">
      <h2>🌾 Farmer Feed</h2>

      {/* Create Post */}
      <div className="create-post">
        <textarea
          placeholder="Ask a question or share farming advice..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={createPost}>Post</button>
      </div>

      {/* Posts */}
      {posts.length === 0 && <p>No posts yet.</p>}

      {posts.map((post) => (
        <div className="post-card" key={post._id}>
          <p className="author">
            {post.author || post.role || "Farmer"}
          </p>

          <p className="content">{post.content}</p>

          <small className="time">
            {new Date(post.createdAt).toLocaleString()}
          </small>

          <div className="actions">
            <button onClick={() => likePost(post._id)}>
              ❤️ {post.likes || 0}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FarmerHome;
