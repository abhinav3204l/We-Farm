import { useContext } from "react";
import { UIContext } from "../context/UIContext";

const videos = [
  { title: "🌾 వరి సాగు పూర్తి సమాచారం", titleEn: "Rice farming — complete guide", link: "https://www.youtube.com/embed/TYY3pe5pNCU", tag: "Telugu" },
  { title: "🍅 Tomato farming – best practices", titleEn: "Tomato farming – best practices", link: "https://www.youtube.com/embed/_-FLCU2TRUA", tag: "English" },
  { title: "🌱 Organic farming basics", titleEn: "Organic farming basics", link: "https://www.youtube.com/embed/3viUlVOaorI", tag: "English" },
  { title: "🌿 పంట రక్షణ చర్యలు", titleEn: "Crop protection methods", link: "https://www.youtube.com/embed/5NdMndbl5jc", tag: "Telugu" },
];

export default function Videos() {
  const { t } = useContext(UIContext);

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px" }}>

      {/* Header */}
      <div style={s.header}>
        <div style={s.headerIcon}>🎥</div>
        <div>
          <h2 style={s.headerTitle}>{t?.videosTitle || "🎥 Farming Videos"}</h2>
          <p style={s.headerSub}>Learn modern farming techniques from experts</p>
        </div>
      </div>

      {/* Video grid */}
      <div style={s.grid}>
        {videos.map((v, i) => (
          <div key={i} className="post-card-wrapper feed-item-animate" style={{ animationDelay: `${i * 0.1}s`, overflow:"hidden" }}>

            {/* Video */}
            <div style={s.videoWrap}>
              <iframe
                src={v.link}
                title={v.title}
                allowFullScreen
                style={s.iframe}
                loading="lazy"
              />
            </div>

            {/* Info */}
            <div style={s.info}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                <span style={{ ...s.tag, background: v.tag === "Telugu" ? "#e8f5e9" : "#e3f2fd", color: v.tag === "Telugu" ? "#2e7d32" : "#1565c0" }}>
                  {v.tag}
                </span>
              </div>
              <p style={s.videoTitle}>{v.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  header: { display:"flex", alignItems:"center", gap:14, padding:"8px 0 20px" },
  headerIcon: { width:52, height:52, borderRadius:"var(--r-md)", background:"linear-gradient(135deg,var(--g700),var(--g900))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0, boxShadow:"0 4px 14px rgba(46,125,50,0.28)" },
  headerTitle: { fontFamily:"var(--display)", fontSize:22, color:"var(--text)", margin:0 },
  headerSub: { fontSize:13, color:"var(--muted)", marginTop:2 },
  grid: { display:"flex", flexDirection:"column", gap:16, paddingBottom:24 },
  videoWrap: { position:"relative", paddingBottom:"56.25%", height:0, overflow:"hidden" },
  iframe: { position:"absolute", top:0, left:0, width:"100%", height:"100%", border:"none" },
  info: { padding:"12px 16px 14px" },
  tag: { fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:99, letterSpacing:"0.3px" },
  videoTitle: { fontSize:14, fontWeight:700, color:"var(--text)", lineHeight:1.5 },
};