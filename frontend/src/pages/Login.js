import { useState } from "react";
import API from "../api";

export default function Login({ setUser, setAuthPage }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const login = async () => {
    if (!email || !password) return setError("Please fill in all fields");
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      {/* Background layers */}
      <div style={s.bgLayer1} />
      <div style={s.bgLayer2} />
      <div style={s.bgPattern} />

      {/* Floating decorative elements */}
      <div style={{ ...s.floatEl, top: "8%", left: "5%", fontSize: 48, animationDelay: "0s" }}>🌾</div>
      <div style={{ ...s.floatEl, top: "15%", right: "8%", fontSize: 36, animationDelay: "0.8s" }}>🌱</div>
      <div style={{ ...s.floatEl, bottom: "20%", left: "6%", fontSize: 32, animationDelay: "1.4s" }}>🍅</div>
      <div style={{ ...s.floatEl, bottom: "30%", right: "5%", fontSize: 40, animationDelay: "0.4s" }}>🌿</div>
      <div style={{ ...s.floatEl, top: "40%", left: "3%", fontSize: 28, animationDelay: "1.8s" }}>🌻</div>

      <div style={s.container}>
        {/* Logo */}
        <div style={s.logoWrap}>
          <div style={s.logoIcon}>🌾</div>
          <div>
            <h1 style={s.logoText}>WeFarm</h1>
            <p style={s.logoSub}>Farmer Community Platform</p>
          </div>
        </div>

        {/* Hero text */}
        <div style={s.heroText}>
          <p style={s.tagline}>Connect · Grow · Prosper</p>
          <p style={s.heroDesc}>
            Join thousands of farmers sharing knowledge, trading crops, and growing together.
          </p>
        </div>

        {/* Card */}
        <div style={s.card}>
          <h2 style={s.cardTitle}>Welcome back 👋</h2>
          <p style={s.cardSub}>Sign in to your farm community</p>

          {error && <div style={s.errorBox}>⚠️ {error}</div>}

          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input
              style={s.input}
              type="email"
              placeholder="farmer@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && login()}
            />
          </div>

          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input
              style={s.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && login()}
            />
          </div>

          <button style={{ ...s.btn, opacity: loading ? 0.8 : 1 }} onClick={login} disabled={loading}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>

          <div style={s.divider}><span style={s.dividerText}>or</span></div>

          <button style={s.secondaryBtn} onClick={() => setAuthPage("register")}>
            Create a new account
          </button>
        </div>

        {/* Feature pills */}
        <div style={s.pills}>
          {["🤖 AI Advisor", "🗺️ Farmer Map", "🛒 Marketplace", "💬 Direct Chat"].map((f, i) => (
            <span key={i} style={{ ...s.pill, animationDelay: `${i * 0.15}s` }}>{f}</span>
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:wght@700;800&display=swap');
        @keyframes floatAnim {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-12px) rotate(3deg); }
          66% { transform: translateY(-6px) rotate(-2deg); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pillIn {
          from { opacity: 0; transform: translateY(10px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #0a2e0a 0%, #1b4332 35%, #2d6a4f 65%, #40916c 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Nunito', sans-serif",
    position: "relative",
    overflow: "hidden",
    padding: "20px 16px",
  },
  bgLayer1: {
    position: "absolute", inset: 0,
    background: "radial-gradient(ellipse at 20% 50%, rgba(116,198,157,0.15) 0%, transparent 60%)",
    pointerEvents: "none",
  },
  bgLayer2: {
    position: "absolute", inset: 0,
    background: "radial-gradient(ellipse at 80% 20%, rgba(244,162,97,0.1) 0%, transparent 50%)",
    pointerEvents: "none",
  },
  bgPattern: {
    position: "absolute", inset: 0,
    backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
    backgroundSize: "30px 30px",
    pointerEvents: "none",
  },
  floatEl: {
    position: "absolute",
    animation: "floatAnim 4s ease-in-out infinite",
    opacity: 0.4,
    pointerEvents: "none",
    userSelect: "none",
  },
  container: {
    width: "100%",
    maxWidth: 400,
    position: "relative",
    zIndex: 1,
    animation: "fadeSlideUp 0.6s ease both",
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 24,
    justifyContent: "center",
  },
  logoIcon: {
    fontSize: 44,
    filter: "drop-shadow(0 4px 12px rgba(116,198,157,0.4))",
  },
  logoText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 36,
    fontWeight: 800,
    color: "white",
    lineHeight: 1,
    margin: 0,
    textShadow: "0 2px 20px rgba(0,0,0,0.3)",
  },
  logoSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    margin: 0,
    fontWeight: 600,
    letterSpacing: "0.5px",
  },
  heroText: {
    textAlign: "center",
    marginBottom: 24,
  },
  tagline: {
    fontSize: 13,
    fontWeight: 800,
    color: "#74c69d",
    letterSpacing: "2px",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  heroDesc: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 1.6,
    maxWidth: 300,
    margin: "0 auto",
  },
  card: {
    background: "rgba(255,255,255,0.97)",
    borderRadius: 24,
    padding: "28px 24px",
    boxShadow: "0 24px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)",
    marginBottom: 20,
  },
  cardTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 22,
    fontWeight: 700,
    color: "#1a2e1a",
    margin: "0 0 4px",
  },
  cardSub: {
    fontSize: 13,
    color: "#5a7a5a",
    marginBottom: 20,
  },
  errorBox: {
    background: "#fff5f5",
    border: "1px solid #ffcdd2",
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 13,
    color: "#c62828",
    marginBottom: 16,
  },
  field: { marginBottom: 14 },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 700,
    color: "#5a7a5a",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 12,
    border: "1.5px solid #d8f3dc",
    fontFamily: "'Nunito', sans-serif",
    fontSize: 14,
    color: "#1a2e1a",
    background: "#f0faf3",
    outline: "none",
    transition: "border-color 0.2s",
  },
  btn: {
    width: "100%",
    padding: "13px",
    background: "linear-gradient(135deg, #2e7d32, #1b5e20)",
    color: "white",
    border: "none",
    borderRadius: 12,
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 800,
    fontSize: 15,
    cursor: "pointer",
    marginTop: 6,
    boxShadow: "0 6px 20px rgba(46,125,50,0.35)",
    letterSpacing: "0.3px",
    transition: "transform 0.15s, box-shadow 0.15s",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    margin: "16px 0",
    "::before": { content: '""', flex: 1, height: 1, background: "#e0e0e0" },
  },
  dividerText: {
    fontSize: 12,
    color: "#aaa",
    fontWeight: 600,
    padding: "0 8px",
    background: "white",
    position: "relative",
    display: "block",
    textAlign: "center",
  },
  secondaryBtn: {
    width: "100%",
    padding: "12px",
    background: "transparent",
    color: "#2e7d32",
    border: "2px solid #2e7d32",
    borderRadius: 12,
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  pills: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  pill: {
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: 99,
    padding: "6px 14px",
    fontSize: 12,
    color: "white",
    fontWeight: 600,
    animation: "pillIn 0.5s ease both",
  },
};