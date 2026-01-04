import React, { useEffect, useState } from "react";
import API from "../api";
import BottomNav from "../components/BottomNav";
import "./FarmerHome.css";
import headerBg from "../assets/farmer-header.jpeg";

/* POST CARD COMPONENT */
function PostCard({ content }) {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  return (
    <div className="post-card">
      <div className="post-header">
        <span className="material-icons post-avatar">person</span>
        <span className="post-user">Ramesh · Guntur</span>
      </div>

      <div className="post-content">{content}</div>

      {/* ACTION BUTTONS */}
      <div className="post-actions">
        <span
          className={`material-icons action-btn ${liked ? "liked" : ""}`}
          onClick={() => setLiked(!liked)}
        >
          thumb_up
        </span>

        <span
          className="material-icons action-btn"
          onClick={() => setShowComments(!showComments)}
        >
          comment
        </span>
      </div>

      {/* COMMENTS SECTION */}
      {showComments && (
        <div className="comments-section">
          <div className="comment">
            <b>Suresh:</b> నీటి పరిమాణం సరిచూడండి 👍
          </div>

          <div className="comment">
            <b>Mahesh:</b> నైట్రోజన్ ఎరువులు ఉపయోగించండి
          </div>

          <div className="add-comment">
            <input
              placeholder="మీ వ్యాఖ్యను వ్రాయండి..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button onClick={() => setCommentText("")}>Post</button>
          </div>
        </div>
      )}
    </div>
  );
}

function FarmerHome() {
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);

  // Farmer-only protection
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "farmer") {
      window.location.href = "/";
    }
  }, []);

  // Fetch posts
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch posts");
    }
  };

  const handlePost = async () => {
    if (!content.trim()) return;

    try {
      await API.post("/posts", { content });
      setContent("");
      fetchPosts();
    } catch (err) {
      console.error("Failed to create post");
    }
  };

  return (
    <div className="farmer-app">
      <div className="feed-container">

        {/* HEADER */}
        <div
          className="header"
          style={{ backgroundImage: `url(${headerBg})` }}
        >
          <div className="header-content">
            <div>
              <div className="header-title">WeFarm</div>
              <div className="header-subtitle">
                అడగండి • పంచుకోండి • నేర్చుకోండి
              </div>
            </div>
            <span className="material-icons header-mic">mic</span>
          </div>
        </div>

        {/* ASK QUESTION */}
        <div className="post-box">
          <span className="material-icons avatar">person</span>

          <input
            className="post-input"
            placeholder="మీ వ్యవసాయ ప్రశ్నను అడగండి..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <span
            className="material-icons send-btn"
            onClick={handlePost}
          >
            send
          </span>
        </div>

        {/* DEMO POSTS WHEN EMPTY */}
        {posts.length === 0 && (
          <>
            <PostCard content="టమోటా పంటలో ఆకులు పసుపు రంగులో మారుతున్నాయి. ఏమి చేయాలి?" />
            <PostCard content="వరి పంటకు సరైన ఎరువు ఏది?" />
          </>
        )}

        {/* REAL POSTS */}
        {posts.map((post) => (
          <PostCard key={post._id} content={post.content} />
        ))}

      </div>

      <BottomNav />
    </div>
  );
}

export default FarmerHome;
