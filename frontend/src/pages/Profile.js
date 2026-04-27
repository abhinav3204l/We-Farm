import { useEffect, useState, useRef } from "react";
import API from "../api";

export default function Profile({ user, setUser }) {
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [edit, setEdit]     = useState(false);
  const [name, setName]     = useState(user?.name || "");
  const [email, setEmail]   = useState(user?.email || "");
  const [stats, setStats]   = useState({});
  const [dark, setDark]     = useState(user?.darkMode || false);
  const [saving, setSaving] = useState(false);
  const fileRef             = useRef();

  useEffect(() => {
    if (!user?._id) return;
    API.get(`/api/posts/stats/user/${user._id}`)
      .then(res => setStats(res.data))
      .catch(() => {});
  }, [user]);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await API.put("/api/auth/update", { userId: user._id, name, email, avatar, darkMode: dark });
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      setEdit(false);
    } catch (err) { console.log(err); }
    finally { setSaving(false); }
  };

  const handleAvatarUpload = async (e) => {
    const form = new FormData();
    form.append("image", e.target.files[0]);
    const res = await API.post("/api/auth/upload-avatar", form);
    setAvatar(res.data.url);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  if (!user) return null;
  const initial = name?.[0]?.toUpperCase() || "F";
  const badgeLabel = user.badge === "expert" ? "⭐ Expert Farmer" : user.badge === "verified" ? "✅ Verified" : "🌾 Farmer";

  return (
    <div className="profile-page">
      <div className="profile-card">

        {/* BANNER */}
        <div className="profile-banner">
          <div className="profile-banner-pattern" />
          <div style={{ position:"absolute", top:12, right:14, fontSize:11, fontWeight:700, background:"rgba(255,255,255,0.15)", backdropFilter:"blur(8px)", color:"white", padding:"4px 10px", borderRadius:99, border:"1px solid rgba(255,255,255,0.2)" }}>
            {badgeLabel}
          </div>
        </div>

        <div className="profile-body">
          {/* AVATAR */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
            <div className="profile-avatar-wrap">
              {avatar
                ? <img src={avatar} className="profile-avatar" alt="avatar" />
                : <div className="profile-avatar-placeholder">{initial}</div>
              }
              <div className="profile-upload-btn" onClick={() => fileRef.current.click()}>📷</div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleAvatarUpload} />
            </div>
            {!edit && (
              <button className="primary-btn" style={{ width:"auto", padding:"8px 18px", marginBottom:0 }} onClick={() => setEdit(true)}>
                ✏️ Edit
              </button>
            )}
          </div>

          {/* NAME */}
          <h2 className="profile-name" style={{ marginTop:10 }}>{name}</h2>
          <p className="profile-email">{email}</p>

          {/* STATS */}
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{stats.totalPosts    || 0}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.totalLikes    || 0}</span>
              <span className="stat-label">Likes</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.totalComments || 0}</span>
              <span className="stat-label">Comments</span>
            </div>
          </div>

          {/* EDIT FIELDS */}
          {edit && (
            <div style={{ marginBottom:14 }}>
              <input className="profile-input" value={name}  placeholder="Full name"  onChange={e => setName(e.target.value)} />
              <input className="profile-input" value={email} placeholder="Email address" onChange={e => setEmail(e.target.value)} />
            </div>
          )}

          {/* DARK MODE */}
          <label className="dark-toggle">
            <span>🌙 Dark Mode</span>
            <input type="checkbox" checked={dark} onChange={() => setDark(!dark)} style={{ width:18, height:18, accentColor:"var(--g700)" }} />
          </label>

          {/* BUTTONS */}
          {edit ? (
            <button className="primary-btn" onClick={saveProfile} disabled={saving}>
              {saving ? "⏳ Saving..." : "💾 Save Profile"}
            </button>
          ) : null}

          <button className="logout-btn" onClick={logout}>🚪 Sign Out</button>
        </div>
      </div>
    </div>
  );
}