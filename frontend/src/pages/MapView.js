import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import API from "../api";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN ||
  "pk.eyJ1IjoiYWJoaW5hdjMyMDRsIiwiYSI6ImNtbTU1aTdxdTAyajgycHM4NmRxcWNuMzAifQ.HWv2Fi05xRmZg3kSN65LNQ";

export default function MapView({ setPage, setChatUserId }) {
  const mapContainer = useRef(null);
  const mapRef       = useRef(null);
  const [farmerCount, setFarmerCount]     = useState(0);
  const [locationStatus, setLocationStatus] = useState("Getting your location...");

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [78.4867, 17.3850],
      zoom: 6,
    });

    mapRef.current = map;

    map.on("load", () => {
      loadFarmers(map);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            if (!mapRef.current) return;
            const { latitude, longitude } = position.coords;

            try {
              await API.put("/api/auth/location", { lat: latitude, lng: longitude });
            } catch (err) {}

            new mapboxgl.Marker({ color: "#2e7d32" })
              .setLngLat([longitude, latitude])
              .setPopup(new mapboxgl.Popup().setText("📍 You are here"))
              .addTo(mapRef.current);

            mapRef.current.flyTo({ center: [longitude, latitude], zoom: 10, speed: 1.2 });
            setLocationStatus("Showing farmers near you");
          },
          () => setLocationStatus("Location denied — showing all farmers")
        );
      } else {
        setLocationStatus("Showing all farmers");
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [setPage, setChatUserId]);

  const loadFarmers = async (map) => {
    try {
      const res = await API.get("/api/auth/map-users");
      let count = 0;

      res.data.forEach((user) => {
        if (!user.location?.lat || !user.location?.lng) return;
        count++;

        const el = document.createElement("div");
        el.style.width = "42px";
        el.style.height = "42px";
        el.style.borderRadius = "50%";
        el.style.backgroundSize = "cover";
        el.style.backgroundPosition = "center";
        el.style.border = "3px solid #2e7d32";
        el.style.cursor = "pointer";
        el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
        el.style.backgroundImage = `url(${
          user.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "Farmer")}&background=2e7d32&color=fff`
        })`;

        el.addEventListener("click", () => {
          setChatUserId(user._id);
          setPage("chat");
        });

        const popupHTML = `
          <div style="text-align:center;padding:4px 8px;font-family:sans-serif;">
            <img src="${user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "Farmer")}&background=2e7d32&color=fff`}"
              style="width:48px;height:48px;border-radius:50%;object-fit:cover;margin-bottom:6px;border:2px solid #2e7d32;" />
            <div style="font-weight:bold;font-size:14px;">${user.name || "Farmer"}</div>
            <div style="font-size:12px;color:#666;margin:2px 0;">
              ${user.badge === "expert" ? "⭐ Expert" : user.badge === "verified" ? "✅ Verified" : "🌾 Farmer"}
            </div>
          </div>
        `;

        new mapboxgl.Marker(el)
          .setLngLat([user.location.lng, user.location.lat])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupHTML))
          .addTo(map);
      });

      setFarmerCount(count);
    } catch (err) {
      console.error("Failed to load farmers:", err);
    }
  };

  useEffect(() => {
    const handler = (e) => {
      setChatUserId(e.detail);
      setPage("chat");
    };
    document.addEventListener("chatFarmer", handler);
    return () => document.removeEventListener("chatFarmer", handler);
  }, [setChatUserId, setPage]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <div style={styles.statusBar}>
        <span>🗺 {locationStatus}</span>
        {farmerCount > 0 && (
          <span style={styles.farmerBadge}>🌾 {farmerCount} farmers</span>
        )}
      </div>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}

const styles = {
  statusBar: {
    position: "absolute", top: 12, left: "50%",
    transform: "translateX(-50%)", zIndex: 10,
    background: "rgba(255,255,255,0.95)", padding: "8px 16px",
    borderRadius: 99, fontSize: 13, fontWeight: 500,
    boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
    display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap",
  },
  farmerBadge: {
    background: "#e8f5e9", color: "#2e7d32",
    padding: "2px 10px", borderRadius: 99, fontSize: 12, fontWeight: 700,
  },
};