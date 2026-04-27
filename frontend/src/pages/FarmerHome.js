import { useEffect, useState, useContext } from "react";
import API from "../api";
import FeedHero from "../components/FeedHero";
import FeedCard from "../components/FeedCard";
import { UIContext } from "../context/UIContext";
import VoiceAssistant from "../components/VoiceAssistant";

export default function FarmerHome() {
  const { t } = useContext(UIContext);
  const [posts, setPosts]           = useState([]);
  const [content, setContent]       = useState("");
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});

  const loadPosts = async () => {
    try {
      const res = await API.get("/api/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Error loading posts:", err);
    }
  };

  useEffect(() => { loadPosts(); }, []);

  const post = async () => {
    if (!content.trim()) return;
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await API.post("/api/posts", { content, user: user._id });
      setContent("");
      loadPosts();
    } catch (err) {
      console.error("Error posting:", err);
    }
  };

  const likePost = async (id) => {
    await API.put(`/api/posts/${id}/like`);
    loadPosts();
  };

  const addComment = async (id) => {
    if (!commentText[id]?.trim()) return;
    await API.post(`/api/posts/${id}/comment`, { text: commentText[id] });
    setCommentText({ ...commentText, [id]: "" });
    loadPosts();
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 16px" }}>
      <FeedHero />
      <VoiceAssistant />

      {/* POST BOX */}
      <div className="post-box">
        <textarea
          rows={3}
          placeholder={t.feedPlaceholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="post-btn" onClick={post}>{t.postBtn}</button>
      </div>

      {/* FEED */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {posts.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-light)" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🌾</div>
            <p style={{ fontWeight: 600 }}>No posts yet — be the first farmer to share!</p>
          </div>
        )}

        {posts.map((p, i) => (
          <div
            key={p._id}
            className="post-card-wrapper feed-item-animate"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <FeedCard post={p} />

            <div className="feed-actions">
              <button className="action-btn like" onClick={() => likePost(p._id)}>
                👍 <span>{p.likes}</span>
              </button>
              <button
                className="action-btn comment"
                onClick={() => setShowComments({ ...showComments, [p._id]: !showComments[p._id] })}
              >
                💬 <span>{p.comments?.length || 0}</span>
              </button>
            </div>

            {showComments[p._id] && (
              <div className="comment-section">
                {p.comments?.map((c, idx) => (
                  <div key={idx} className="comment-item">💬 {c.text}</div>
                ))}
                <div className="comment-input-row">
                  <input
                    className="comment-input"
                    placeholder={t.commentPlaceholder}
                    value={commentText[p._id] || ""}
                    onChange={(e) => setCommentText({ ...commentText, [p._id]: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && addComment(p._id)}
                  />
                  <button className="comment-send" onClick={() => addComment(p._id)}>➤</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}