import { createContext, useState } from "react";

export const UIContext = createContext();

// ── All UI strings in 3 languages ──────────────────
export const strings = {
  en: {
    feedPlaceholder:    "Ask your farming question...",
    postBtn:            "🌱 Post",
    commentPlaceholder: "Write a comment...",
    askAI:              "🎤 Ask AI by Voice",
    aiTitle:            "AI Farming Assistant",
    marketplaceTitle:   "🛒 Crop Marketplace",
    listCrop:           "List Your Crop",
    cropName:           "Crop name (e.g. Tomatoes)",
    cropDesc:           "Description (optional)",
    cropPrice:          "Price (₹)",
    cropQty:            "Quantity (e.g. 50 kg)",
    submitListing:      "📦 List for Sale",
    contactSeller:      "💬 Contact Seller",
    soldOut:            "Sold Out",
    myListings:         "My Listings",
    noListings:         "No crops listed yet",
    videosTitle:        "🎥 Farming Videos",
    langLabel:          "Language",
  },
  te: {
    feedPlaceholder:    "మీ వ్యవసాయ ప్రశ్నను అడగండి...",
    postBtn:            "🌱 పోస్ట్ చేయండి",
    commentPlaceholder: "వ్యాఖ్య రాయండి...",
    askAI:              "🎤 AI తో మాట్లాడండి",
    aiTitle:            "AI వ్యవసాయ సహాయకుడు",
    marketplaceTitle:   "🛒 పంట మార్కెట్",
    listCrop:           "మీ పంటను జాబితా చేయండి",
    cropName:           "పంట పేరు (ఉదా: టమాటాలు)",
    cropDesc:           "వివరణ (ఐచ్ఛికం)",
    cropPrice:          "ధర (₹)",
    cropQty:            "పరిమాణం (ఉదా: 50 కిలో)",
    submitListing:      "📦 అమ్మకానికి పెట్టండి",
    contactSeller:      "💬 విక్రేతను సంప్రదించండి",
    soldOut:            "అమ్ముడైంది",
    myListings:         "నా జాబితాలు",
    noListings:         "ఇంకా పంటలు జాబితా చేయలేదు",
    videosTitle:        "🎥 వ్యవసాయ వీడియోలు",
    langLabel:          "భాష",
  },
  hi: {
    feedPlaceholder:    "अपना खेती सवाल पूछें...",
    postBtn:            "🌱 पोस्ट करें",
    commentPlaceholder: "टिप्पणी लिखें...",
    askAI:              "🎤 AI से पूछें",
    aiTitle:            "AI कृषि सहायक",
    marketplaceTitle:   "🛒 फसल बाज़ार",
    listCrop:           "अपनी फसल सूचीबद्ध करें",
    cropName:           "फसल का नाम (जैसे टमाटर)",
    cropDesc:           "विवरण (वैकल्पिक)",
    cropPrice:          "कीमत (₹)",
    cropQty:            "मात्रा (जैसे 50 किलो)",
    submitListing:      "📦 बिक्री के लिए सूचीबद्ध करें",
    contactSeller:      "💬 विक्रेता से संपर्क करें",
    soldOut:            "बिक गया",
    myListings:         "मेरी सूचियाँ",
    noListings:         "अभी कोई फसल सूचीबद्ध नहीं",
    videosTitle:        "🎥 कृषि वीडियो",
    langLabel:          "भाषा",
  },
};

export function UIProvider({ children }) {
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState("en"); // en | te | hi

  const t = strings[lang] || strings.en;

  return (
    <UIContext.Provider value={{ dark, setDark, lang, setLang, t }}>
      <div className={dark ? "dark" : ""}>
        {children}
      </div>
    </UIContext.Provider>
  );
}