import { useEffect, useState, useRef } from "react";
import API from "../api";

export default function Chat({ userId }) {
  const [messages, setMessages]     = useState([]);
  const [text, setText]             = useState("");
  const [farmerName, setFarmerName] = useState("Farmer");
  const [farmerAvatar, setFarmerAvatar] = useState(null);
  const bottomRef  = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const loadMessages = async () => {
    try {
      const res = await API.get(`/api/chat/${userId}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  const loadFarmerInfo = async () => {
    try {
      const res = await API.get(`/api/auth/user/${userId}`);
      if (res.data?.name)   setFarmerName(res.data.name);
      if (res.data?.avatar) setFarmerAvatar(res.data.avatar);
    } catch {}
  };

  useEffect(() => {
    if (!userId) return;
    loadMessages();
    loadFarmerInfo();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    const draft = text;
    setText("");
    const optimistic = { _id: Date.now(), sender: currentUser._id, text: draft, createdAt: new Date().toISOString(), pending: true };
    setMessages((prev) => [...prev, optimistic]);
    try {
      await API.post("/api/chat/send", { receiverId: userId, text: draft });
      loadMessages();
    } catch (err) {
      console.error("Failed to send:", err);
    }
  };

  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const avatarUrl = farmerAvatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(farmerName)}&background=2d6a4f&color=fff&bold=true`;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--green-50)" }}>

      {/* ── HEADER ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 16px",
        background: "linear-gradient(135deg, var(--green-900), var(--green-800))",
        boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
        paddingTop: "calc(12px + env(safe-area-inset-top, 0px))",
      }}>
        <img src={avatarUrl} alt="avatar" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.4)", flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{farmerName}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>🟢 Active farmer</div>
        </div>
        <div style={{ fontSize: 22 }}>🌾</div>
      </div>

      {/* ── MESSAGES ── */}
      <div style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 6, overflowY: "auto" }}>
        {messages.length === 0 ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 60, textAlign: "center" }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🌾</div>
            <p style={{ fontSize: 16, fontWeight: 700, color: "var(--text-muted)" }}>Say hello to {farmerName}!</p>
            <p style={{ fontSize: 13, color: "var(--text-light)", marginTop: 4 }}>Share tips, ask questions, collaborate.</p>
          </div>
        ) : (
          messages.map((m) => {
            const isMe = m.sender === currentUser._id || m.sender?._id === currentUser._id;
            return (
              <div key={m._id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 8 }}>
                {!isMe && <img src={avatarUrl} alt="" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />}
                <div style={{ maxWidth: "68%" }}>
                  <div style={{
                    padding: "10px 14px",
                    borderRadius: 18,
                    borderBottomRightRadius: isMe ? 4 : 18,
                    borderBottomLeftRadius:  isMe ? 18 : 4,
                    background: isMe ? "linear-gradient(135deg, #2e7d32, #1b5e20)" : "white",
                    color: isMe ? "white" : "var(--text-main)",
                    fontSize: 14, lineHeight: 1.5,
                    boxShadow: isMe ? "0 2px 8px rgba(46,125,50,0.3)" : "0 2px 8px rgba(0,0,0,0.08)",
                    opacity: m.pending ? 0.65 : 1,
                    wordBreak: "break-word",
                  }}>
                    {m.text}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-light)", marginTop: 3, textAlign: isMe ? "right" : "left", paddingLeft: 4, paddingRight: 4 }}>
                    {m.pending ? "Sending..." : formatTime(m.createdAt)}
                  </div>
                </div>
                {isMe && (
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--green-800)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>
                    {currentUser.name?.[0]?.toUpperCase() || "Y"}
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── INPUT ── */}
      <div style={{ display: "flex", gap: 8, padding: "10px 12px", background: "white", borderTop: "1px solid var(--green-100)", alignItems: "center" }}>
        <input
          style={{ flex: 1, padding: "11px 16px", borderRadius: 99, border: "1.5px solid var(--green-100)", fontFamily: "var(--font-main)", fontSize: 14, outline: "none", background: "var(--green-50)" }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder={`Message ${farmerName}...`}
        />
        <button
          onClick={sendMessage}
          disabled={!text.trim()}
          style={{
            width: 44, height: 44, borderRadius: "50%", border: "none",
            background: text.trim() ? "linear-gradient(135deg, #2e7d32, #1b5e20)" : "#e0e0e0",
            color: "white", fontSize: 16, cursor: text.trim() ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, transition: "background 0.2s",
            boxShadow: text.trim() ? "0 3px 10px rgba(46,125,50,0.3)" : "none",
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}