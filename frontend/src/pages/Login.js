import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import bg from "../assets/farmer-bg.jpg";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      // Save token in browser
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      alert("Login successful!");

      if (res.data.role === "farmer") {
          window.location.href = "/farmer";
        } else {
            window.location.href = "/dashboard";
}


      // later we will redirect to dashboard
      // window.location.href = "/dashboard";
    } catch (error) {
      alert("Invalid email or password");
    }
  };

  return (
    <div
      className="login-container"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="login-card">
        <h1>🌱 WeFarm</h1>
        <p>Connecting Farmers, Youth & Consumers</p>

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

        <button onClick={handleLogin}>Login</button>

        <p style={{ marginTop: "16px", fontSize: "14px" }}>
          Don’t have an account?{" "}
          <a
            href="/register"
            style={{ color: "#2e7d32", fontWeight: "bold" }}
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
