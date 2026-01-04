import React, { useEffect, useState } from "react";
import API from "../api";
import "./FarmerHome.css";

function FarmerHome() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");
      setPosts(res.data);
    } catch {
      alert("Failed to load posts");
    }
  };

  const createPost = async () => {
    if (!content) return;

    await API.post("/posts", {
      content,
      author: "Farmer",
    });

    setContent("");
    fetchPosts();
  };

  const likePost = async (id) => {
    await API.put(`/posts/${id}/like`);
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="feed">
      <h2>🌾 Farmer Feed</h2>

      <div className="create-post">
        <textarea
          placeholder="Ask a question or share farming advice..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={createPost}>Post</button>
      </div>

      {posts.map((post) => (
        <div className="post-card" key={post._id}>
          <p className="author">{post.author}</p>
          <p>{post.content}</p>
          <small>{new Date(post.createdAt).toLocaleString()}</small>

          <div className="actions">
            <button onClick={() => likePost(post._id)}>
              ❤️ {post.likes}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FarmerHome;
