import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import FarmerHome from "./pages/FarmerHome";
import Learn from "./pages/Learn";
import Videos from "./pages/videos";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Farmer App */}
        <Route path="/farmer" element={<FarmerHome />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/profile" element={<Profile />} />

        {/* Other roles */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
