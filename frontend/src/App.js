import { useState, useContext } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FarmerHome from "./pages/FarmerHome";
import Videos from "./pages/Videos";
import Profile from "./pages/Profile";
import MapView from "./pages/MapView";
import BottomNav from "./components/BottomNav";
import Chat from "./pages/Chat";
import Marketplace from "./pages/Marketplace";
import { UIContext } from "./context/UIContext";
import "./wefarm-global.css";

function AppInner() {
  const { lang, setLang } = useContext(UIContext);

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [authPage, setAuthPage]   = useState("login");
  const [page, setPage]           = useState("feed");
  const [chatUserId, setChatUserId] = useState(null);

  if (!user) {
    return authPage === "login"
      ? <Login setUser={setUser} setAuthPage={setAuthPage} />
      : <Register setUser={setUser} setAuthPage={setAuthPage} />;
  }

  return (
    <div>
      <BottomNav setPage={setPage} activePage={page} lang={lang} setLang={setLang} />

      <div className="page-wrapper">
        {page === "feed"        && <FarmerHome />}
        {page === "videos"      && <Videos />}
        {page === "profile"     && <Profile user={user} setUser={setUser} />}
        {page === "map"         && <MapView setPage={setPage} setChatUserId={setChatUserId} />}
        {page === "chat"        && <Chat userId={chatUserId} />}
        {page === "marketplace" && <Marketplace setPage={setPage} setChatUserId={setChatUserId} />}
      </div>
    </div>
  );
}

export default function App() {
  return <AppInner />;
}