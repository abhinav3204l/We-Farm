import { useEffect, useState, useContext, useRef } from "react";
import API from "../api";
import { UIContext } from "../context/UIContext";

export default function Marketplace({ setPage, setChatUserId }) {
  const { t } = useContext(UIContext);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [listings, setListings]     = useState([]);
  const [showForm, setShowForm]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab]               = useState("browse"); // browse | mine

  const [title, setTitle]       = useState("");
  const [desc, setDesc]         = useState("");
  const [price, setPrice]       = useState("");
  const [quantity, setQuantity] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview]   = useState("");
  const fileRef = useRef();

  const loadListings = async () => {
    setLoading(true);
    try {
      const endpoint = tab === "mine" ? "/api/marketplace/mine" : "/api/marketplace";
      const res = await API.get(endpoint);
      setListings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadListings(); }, [tab]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const submitListing = async () => {
    if (!title.trim() || !price || !quantity.trim()) return;
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("title", title);
      form.append("description", desc);
      form.append("price", price);
      form.append("quantity", quantity);
      if (imageFile) form.append("image", imageFile);

      await API.post("/api/marketplace", form);
      setTitle(""); setDesc(""); setPrice(""); setQuantity("");
      setImageFile(null); setPreview("");
      setShowForm(false);
      setTab("mine");
      loadListings();
    } catch (err) {
      console.error("Listing error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const contactSeller = (sellerId) => {
    setChatUserId(sellerId);
    setPage("chat");
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 16px" }}>

      {/* HEADER */}
      <div style={s.header}>
        <div>
          <h2 style={s.headerTitle}>{t.marketplaceTitle}</h2>
          <p style={s.headerSub}>Buy & sell crops directly with farmers</p>
        </div>
        <button style={s.listBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? "✕ Cancel" : "+ List Crop"}
        </button>
      </div>

      {/* LIST CROP FORM */}
      {showForm && (
        <div style={s.formCard}>
          <h3 style={s.formTitle}>{t.listCrop}</h3>

          {/* Image upload */}
          <div style={s.imageUploadArea} onClick={() => fileRef.current.click()}>
            {preview ? (
              <img src={preview} alt="preview" style={s.imagePreview} />
            ) : (
              <div style={s.imagePlaceholder}>
                <span style={{ fontSize: 32 }}>📸</span>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Tap to add crop photo</span>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />
          </div>

          <input style={s.input} placeholder={t.cropName} value={title} onChange={e => setTitle(e.target.value)} />
          <input style={s.input} placeholder={t.cropDesc} value={desc} onChange={e => setDesc(e.target.value)} />

          <div style={{ display: "flex", gap: 10 }}>
            <input style={{ ...s.input, flex: 1 }} placeholder={t.cropPrice} type="number" value={price} onChange={e => setPrice(e.target.value)} />
            <input style={{ ...s.input, flex: 1 }} placeholder={t.cropQty} value={quantity} onChange={e => setQuantity(e.target.value)} />
          </div>

          <button
            style={{ ...s.submitBtn, opacity: submitting ? 0.7 : 1 }}
            onClick={submitListing}
            disabled={submitting}
          >
            {submitting ? "Listing..." : t.submitListing}
          </button>
        </div>
      )}

      {/* TABS */}
      <div style={s.tabs}>
        {["browse", "mine"].map(key => (
          <button
            key={key}
            style={{ ...s.tab, ...(tab === key ? s.tabActive : {}) }}
            onClick={() => setTab(key)}
          >
            {key === "browse" ? "🌾 Browse All" : `📦 ${t.myListings}`}
          </button>
        ))}
      </div>

      {/* LISTINGS */}
      {loading ? (
        <div style={s.empty}>⏳ Loading...</div>
      ) : listings.length === 0 ? (
        <div style={s.empty}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>🌾</div>
          <p style={{ fontWeight: 700, color: "var(--text-muted)" }}>{t.noListings}</p>
          {tab === "mine" && (
            <button style={{ ...s.submitBtn, marginTop: 14, width: "auto", padding: "10px 24px" }} onClick={() => setShowForm(true)}>
              + List your first crop
            </button>
          )}
        </div>
      ) : (
        <div style={s.grid}>
          {listings.map((crop, i) => (
            <div key={crop._id} style={{ ...s.cropCard, animationDelay: `${i * 0.05}s` }} className="feed-item-animate">

              {/* Crop image */}
              {crop.image ? (
                <img src={crop.image} alt={crop.title} style={s.cropImage} />
              ) : (
                <div style={s.cropImagePlaceholder}>🌾</div>
              )}

              <div style={s.cropBody}>
                {/* Title + sold badge */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={s.cropTitle}>{crop.title}</span>
                  {crop.sold && <span style={s.soldBadge}>{t.soldOut}</span>}
                </div>

                {/* Description */}
                {crop.description && (
                  <p style={s.cropDesc}>{crop.description}</p>
                )}

                {/* Price + qty */}
                <div style={s.cropMeta}>
                  <span style={s.cropPrice}>₹{crop.price}</span>
                  <span style={s.cropQty}>📦 {crop.quantity}</span>
                </div>

                {/* Seller row */}
                <div style={s.sellerRow}>
                  <img
                    src={crop.seller?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(crop.seller?.name || "F")}&background=2d6a4f&color=fff`}
                    alt="seller"
                    style={s.sellerAvatar}
                  />
                  <span style={s.sellerName}>{crop.seller?.name || "Farmer"}</span>

                  {/* Only show contact if not your own listing */}
                  {crop.seller?._id !== currentUser?._id && !crop.sold && (
                    <button style={s.contactBtn} onClick={() => contactSeller(crop.seller._id)}>
                      {t.contactSeller}
                    </button>
                  )}

                  {/* Mark sold button for own listings */}
                  {crop.seller?._id === currentUser?._id && !crop.sold && (
                    <button
                      style={s.soldBtn}
                      onClick={async () => {
                        await API.put(`/api/marketplace/${crop._id}/sold`);
                        loadListings();
                      }}
                    >
                      ✓ Mark Sold
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "8px 0 16px",
  },
  headerTitle: {
    fontFamily: "var(--font-display)", fontSize: 22, color: "var(--text-main)",
  },
  headerSub: {
    fontSize: 13, color: "var(--text-muted)", marginTop: 2,
  },
  listBtn: {
    padding: "9px 16px", background: "linear-gradient(135deg, #2e7d32, #1b5e20)",
    color: "white", border: "none", borderRadius: "var(--radius-sm)",
    fontFamily: "var(--font-main)", fontWeight: 700, fontSize: 14,
    cursor: "pointer", boxShadow: "0 3px 10px rgba(46,125,50,0.25)",
    whiteSpace: "nowrap",
  },
  formCard: {
    background: "var(--card-bg)", borderRadius: "var(--radius-lg)",
    padding: "18px 16px", marginBottom: 20,
    boxShadow: "var(--shadow-md)", border: "1px solid rgba(46,125,50,0.08)",
  },
  formTitle: {
    fontSize: 16, fontWeight: 700, color: "var(--text-main)", marginBottom: 14,
  },
  imageUploadArea: {
    width: "100%", height: 160, borderRadius: "var(--radius-sm)",
    border: "2px dashed var(--green-400)", cursor: "pointer",
    overflow: "hidden", marginBottom: 12,
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "var(--green-50)",
  },
  imagePreview: { width: "100%", height: "100%", objectFit: "cover" },
  imagePlaceholder: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
  },
  input: {
    width: "100%", padding: "10px 14px", borderRadius: "var(--radius-sm)",
    border: "1.5px solid var(--green-100)", fontFamily: "var(--font-main)",
    fontSize: 14, background: "var(--green-50)", outline: "none",
    marginBottom: 10, color: "var(--text-main)",
  },
  submitBtn: {
    width: "100%", padding: 12,
    background: "linear-gradient(135deg, #2e7d32, #1b5e20)",
    color: "white", border: "none", borderRadius: "var(--radius-sm)",
    fontFamily: "var(--font-main)", fontWeight: 700, fontSize: 15,
    cursor: "pointer", boxShadow: "0 4px 12px rgba(46,125,50,0.25)",
  },
  tabs: {
    display: "flex", gap: 8, marginBottom: 16,
  },
  tab: {
    flex: 1, padding: "9px 0", background: "var(--card-bg)",
    border: "1px solid var(--green-100)", borderRadius: "var(--radius-sm)",
    fontFamily: "var(--font-main)", fontWeight: 600, fontSize: 13,
    cursor: "pointer", color: "var(--text-muted)",
  },
  tabActive: {
    background: "var(--green-100)", color: "var(--green-800)",
    borderColor: "var(--green-400)",
  },
  empty: {
    textAlign: "center", padding: "50px 0",
    color: "var(--text-light)", fontSize: 15,
  },
  grid: {
    display: "flex", flexDirection: "column", gap: 14, paddingBottom: 24,
  },
  cropCard: {
    background: "var(--card-bg)", borderRadius: "var(--radius-lg)",
    overflow: "hidden", boxShadow: "var(--shadow-sm)",
    border: "1px solid rgba(46,125,50,0.07)",
    display: "flex", flexDirection: "column",
  },
  cropImage: { width: "100%", height: 200, objectFit: "cover" },
  cropImagePlaceholder: {
    width: "100%", height: 120, background: "var(--green-50)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 52,
  },
  cropBody: { padding: "14px 16px" },
  cropTitle: {
    fontSize: 16, fontWeight: 700, color: "var(--text-main)",
  },
  soldBadge: {
    fontSize: 11, padding: "2px 8px", borderRadius: 99,
    background: "#ffebee", color: "#c62828", fontWeight: 700,
  },
  cropDesc: {
    fontSize: 13, color: "var(--text-muted)", marginBottom: 8, lineHeight: 1.5,
  },
  cropMeta: {
    display: "flex", alignItems: "center", gap: 12, marginBottom: 12,
  },
  cropPrice: {
    fontSize: 20, fontWeight: 800, color: "var(--green-700)",
  },
  cropQty: {
    fontSize: 13, color: "var(--text-muted)",
    background: "var(--green-50)", padding: "3px 10px",
    borderRadius: 99, border: "1px solid var(--green-100)",
  },
  sellerRow: {
    display: "flex", alignItems: "center", gap: 8,
    paddingTop: 10, borderTop: "1px solid var(--green-100)",
  },
  sellerAvatar: {
    width: 28, height: 28, borderRadius: "50%", objectFit: "cover",
    border: "2px solid var(--green-100)",
  },
  sellerName: {
    fontSize: 13, fontWeight: 600, color: "var(--text-muted)", flex: 1,
  },
  contactBtn: {
    padding: "6px 12px", background: "var(--green-700)", color: "white",
    border: "none", borderRadius: 99, fontSize: 12, fontWeight: 700,
    cursor: "pointer",
  },
  soldBtn: {
    padding: "6px 12px", background: "#fff3e0", color: "#e65100",
    border: "1px solid #ffcc80", borderRadius: 99, fontSize: 12,
    fontWeight: 700, cursor: "pointer",
  },
};