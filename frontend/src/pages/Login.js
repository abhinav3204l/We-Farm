import React, { useState } from "react";
import API from "../api";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      // 🔐 SAVE LOGIN SESSION
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      // 🚀 REDIRECT BASED ON ROLE
      if (res.data.role === "farmer") {
        window.location.href = "/farmer";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error(err);
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🌱 WeFarm</h1>
        <p>Farmer Community Platform</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ marginTop: "12px", fontSize: "14px" }}>
          New here?{" "}
          <a href="/register" style={{ color: "#2e7d32" }}>
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
