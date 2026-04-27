import { useState, useRef, useContext } from "react";
import API from "../api";
import { UIContext } from "../context/UIContext";

const COOLDOWN = 20;

// Smart offline farming tips — shown when AI quota is hit
const FALLBACK_TIPS = [
  "🌾 Ensure proper irrigation — water crops early morning to reduce evaporation and fungal disease.",
  "🌿 Use neem oil spray to control pests organically — mix 5ml per litre of water and spray weekly.",
  "🍅 Yellow leaves usually mean nitrogen deficiency — apply urea or compost near the root zone.",
  "🌱 Rotate crops every season to prevent soil depletion and reduce pest buildup naturally.",
  "💧 Drip irrigation can save up to 50% water compared to flood irrigation — great for dry seasons.",
  "🌻 Test soil pH before planting — most crops grow best between pH 6.0 and 7.0.",
  "🐛 Introduce ladybugs or lacewings to naturally control aphids and mites in your field.",
  "🌾 Apply mulch around plants to retain moisture, suppress weeds, and regulate soil temperature.",
];

function getSmartTip(question) {
  const q = question.toLowerCase();
  if (q.includes("pest") || q.includes("insect") || q.includes("bug"))
    return "🐛 For pest control: spray neem oil (5ml/litre) weekly. For severe infestations, consult your local Krishi Vigyan Kendra for recommended pesticides safe for your crop.";
  if (q.includes("water") || q.includes("irrigat") || q.includes("drought"))
    return "💧 Water crops early morning (6-8am) to reduce evaporation. Check soil moisture 5cm deep — if dry, irrigate. Drip irrigation saves 50% water vs flood irrigation.";
  if (q.includes("yellow") || q.includes("leaves") || q.includes("colour") || q.includes("color"))
    return "🌿 Yellow leaves usually mean nitrogen deficiency. Apply urea (2% solution) as foliar spray or add compost near roots. If edges are brown too, check for overwatering.";
  if (q.includes("fertiliz") || q.includes("manure") || q.includes("nutrient"))
    return "🌱 For healthy crops: apply NPK 19-19-19 at transplanting. Side-dress with urea at 30 days. Add organic compost to improve soil structure long-term.";
  if (q.includes("tomato"))
    return "🍅 Tomatoes need full sun, well-drained soil, and consistent watering. Apply calcium nitrate to prevent blossom-end rot. Stake plants when 30cm tall.";
  if (q.includes("rice") || q.includes("paddy"))
    return "🌾 For paddy: maintain 5cm standing water during tillering. Apply DAP at transplanting, urea in splits. Watch for brown plant hopper — use light traps.";
  if (q.includes("soil"))
    return "🌍 Healthy soil needs organic matter — add farm yard manure or compost annually. Test pH (ideal 6-7). Deep ploughing once a year improves aeration.";
  // Default: pick a random tip
  return FALLBACK_TIPS[Math.floor(Math.random() * FALLBACK_TIPS.length)];
}

export default function VoiceAssistant() {
  const { t } = useContext(UIContext);
  const [listening, setListening]   = useState(false);
  const [transcript, setTranscript] = useState("");
  const [reply, setReply]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [cooldown, setCooldown]     = useState(0);
  const [source, setSource]         = useState(""); // "ai" | "smart" | "error"
  const timerRef = useRef(null);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  const startCooldown = () => {
    setCooldown(COOLDOWN);
    timerRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const speak = (text) => {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.92;
    utterance.pitch = 1.05;
    speechSynthesis.speak(utterance);
  };

  const askAI = async (text) => {
    setLoading(true);
    try {
      const res = await API.post("/api/ai/ask", { question: text });
      const answer = res.data.reply;
      setReply(answer);
      setSource("ai");
      speak(answer);
    } catch (err) {
      // If AI fails for any reason, use smart local tip
      const tip = getSmartTip(text);
      setReply(tip);
      setSource("smart");
      speak(tip);
    } finally {
      setLoading(false);
      startCooldown();
    }
  };

  const startListening = () => {
    if (!SpeechRecognition) {
      setReply("❌ Voice not supported in this browser. Please use Chrome.");
      setSource("error");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.start();
    setListening(true);
    setTranscript("");
    setReply("");
    setSource("");

    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setListening(false);
      await askAI(text);
    };

    recognition.onerror = (err) => {
      setListening(false);
      setLoading(false);
      if (err.error === "not-allowed") {
        setReply("🎤 Microphone access denied. Please allow microphone in your browser settings.");
        setSource("error");
      } else if (err.error === "no-speech") {
        setReply("🔇 No speech detected. Please try again and speak clearly.");
        setSource("error");
      } else {
        setReply("⚠️ Voice error. Please try again.");
        setSource("error");
      }
    };

    recognition.onend = () => setListening(false);
  };

  const isDisabled = listening || loading || cooldown > 0;
  const btnLabel = listening ? "🎙 Listening..." : loading ? "⏳ Getting advice..." : cooldown > 0 ? `⏱ Wait ${cooldown}s` : (t?.askAI || "🎤 Ask AI by Voice");
  const btnBg = listening ? "#e53935" : cooldown > 0 ? "#9e9e9e" : "linear-gradient(135deg,#2e7d32,#1b5e20)";

  return (
    <div className="voice-assistant">

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
        <div style={{ width:36, height:36, borderRadius:"var(--r-sm)", background:"linear-gradient(135deg,var(--g700),var(--g900))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
          🤖
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:800, fontSize:14, color:"var(--g700)" }}>{t?.aiTitle || "AI Farming Assistant"}</div>
          <div style={{ fontSize:11, color:"var(--muted)" }}>Speak your farming question in English</div>
        </div>
        {cooldown > 0 && (
          <span style={{ fontSize:11, background:"var(--amber-bg)", color:"#e65100", padding:"2px 8px", borderRadius:99, fontWeight:700 }}>
            {cooldown}s
          </span>
        )}
      </div>

      {/* Cooldown bar */}
      {cooldown > 0 && (
        <div style={{ height:3, background:"var(--g100)", borderRadius:99, marginBottom:10, overflow:"hidden" }}>
          <div style={{ height:"100%", background:"var(--amber)", borderRadius:99, width:`${(cooldown/COOLDOWN)*100}%`, transition:"width 1s linear" }} />
        </div>
      )}

      {/* Mic button */}
      <button
        onClick={startListening}
        disabled={isDisabled}
        className={listening ? "listening-pulse" : ""}
        style={{
          width:"100%", padding:"13px", color:"white", border:"none",
          borderRadius:"var(--r-sm)", fontFamily:"var(--font)",
          fontWeight:800, fontSize:15, cursor: isDisabled ? "not-allowed" : "pointer",
          background: btnBg, opacity: isDisabled && !listening ? 0.75 : 1,
          transition:"all 0.2s",
          boxShadow: listening ? "none" : "0 4px 14px rgba(46,125,50,0.28)",
        }}
      >
        {btnLabel}
      </button>

      {/* You said */}
      {transcript && (
        <div style={{ marginTop:12, background:"var(--g50)", borderRadius:"var(--r-sm)", padding:"10px 14px", borderLeft:"3px solid var(--g400)" }}>
          <div style={{ fontSize:10, fontWeight:800, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.6px", marginBottom:4 }}>You asked</div>
          <p style={{ fontSize:14, color:"var(--text)", lineHeight:1.5 }}>"{transcript}"</p>
        </div>
      )}

      {/* Reply */}
      {reply && (
        <div style={{
          marginTop:10, borderRadius:"var(--r-sm)", padding:"12px 14px",
          background: source === "error" ? "#fff5f5" : source === "smart" ? "#fff8e1" : "#e8f5e9",
          borderLeft: `3px solid ${source === "error" ? "#e53935" : source === "smart" ? "#f4a261" : "var(--g700)"}`,
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
            <div style={{ fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.6px", color: source === "error" ? "#c62828" : source === "smart" ? "#e65100" : "var(--g700)" }}>
              {source === "ai" ? "🤖 AI Reply" : source === "smart" ? "🌾 Farming Tip" : "⚠️ Notice"}
            </div>
            {source === "smart" && (
              <span style={{ fontSize:10, color:"#e65100", background:"#fff3e0", padding:"1px 6px", borderRadius:99, fontWeight:700 }}>Offline tip</span>
            )}
          </div>
          <p style={{ fontSize:14, color:"var(--text)", lineHeight:1.6 }}>{reply}</p>
          {reply && source !== "error" && (
            <button onClick={() => speak(reply)} style={{ marginTop:8, background:"none", border:"none", color:"var(--muted)", fontSize:12, cursor:"pointer", fontFamily:"var(--font)", fontWeight:600, padding:0 }}>
              🔊 Replay audio
            </button>
          )}
        </div>
      )}
    </div>
  );
}