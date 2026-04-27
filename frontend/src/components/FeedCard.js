export default function FeedCard({ post }) {
  const badge = post.user?.badge;
  const name = post.user?.name || "Farmer";
  const initial = name[0].toUpperCase();

  return (
    <div className="feed-card">
      {/* Author row */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
        {post.user?.avatar ? (
          <img
            src={post.user.avatar}
            alt={name}
            style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "2px solid #74c69d" }}
          />
        ) : (
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg, #40916c, #2e7d32)",
            color: "white", display: "flex", alignItems: "center",
            justifyContent: "center", fontWeight: 800, fontSize: 15,
            flexShrink: 0,
          }}>
            {initial}
          </div>
        )}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text-main)" }}>{name}</span>
            {badge === "expert"   && <span className="badge expert">⭐ Expert</span>}
            {badge === "verified" && <span className="badge verified">✅ Verified</span>}
          </div>
          <span style={{ fontSize: 12, color: "var(--text-light)" }}>
            {new Date(post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>
      </div>

      {/* Content */}
      <p className="feed-content">{post.content}</p>
    </div>
  );
}