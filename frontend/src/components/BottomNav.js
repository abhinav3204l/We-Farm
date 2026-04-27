export default function BottomNav({ setPage, activePage, lang, setLang }) {
  const tabs = [
    { key: "feed",        icon: "🌾", label: "Feed"    },
    { key: "marketplace", icon: "🛒", label: "Market"  },
    { key: "videos",      icon: "🎥", label: "Videos"  },
    { key: "map",         icon: "🗺️", label: "Map"     },
    { key: "profile",     icon: "👤", label: "Profile" },
  ];

  const langs = [
    { code: "en", label: "EN" },
    { code: "te", label: "తె" },
    { code: "hi", label: "हि" },
  ];

  return (
    <nav className="top-nav" style={{ justifyContent: "space-between", padding: "0 4px" }}>
      {/* NAV TABS */}
      <div style={{ display: "flex", flex: 1 }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={activePage === tab.key ? "active" : ""}
            onClick={() => setPage(tab.key)}
            title={tab.label}
            style={{ flex: 1 }}
          >
            <span>{tab.icon}</span>
            <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.3px" }}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* LANGUAGE SWITCHER */}
      <div style={{ display: "flex", gap: 2, padding: "0 6px" }}>
        {langs.map((l) => (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            style={{
              padding: "4px 7px",
              borderRadius: 8,
              border: lang === l.code ? "1.5px solid var(--green-700)" : "1px solid transparent",
              background: lang === l.code ? "var(--green-50)" : "transparent",
              color: lang === l.code ? "var(--green-700)" : "var(--text-muted)",
              fontFamily: "var(--font-main)",
              fontWeight: lang === l.code ? 700 : 500,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {l.label}
          </button>
        ))}
      </div>
    </nav>
  );
}