import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      // SAVE SESSION
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      // SPA NAVIGATION (NO PAGE RELOAD)
      navigate("/farmer");
    } catch (err) {
      alert("Invalid email or password");
      console.error(err);
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
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        <p style={{ marginTop: "10px" }}>
          New user? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
