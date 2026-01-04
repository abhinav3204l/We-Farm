import React, { useState } from "react";
import axios from "axios";
import "./Register.css";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    const { name, email, password, role } = form;

    // Frontend validation (important)
    if (!name || !email || !password || !role) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );

      alert(res.data.message || "Registered successfully");
      window.location.href = "/";
    } catch (err) {
      console.error("Register error:", err.response?.data);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🌱 WeFarm</h1>
        <p>Create your account</p>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="">Select Role</option>
          <option value="farmer">Farmer</option>
          <option value="consumer">Consumer</option>
          <option value="youth">Youth</option>
        </select>

        <button onClick={handleRegister}>Register</button>

        <p style={{ marginTop: "16px", fontSize: "14px" }}>
          Already have an account?{" "}
          <a href="/" style={{ color: "#2e7d32", fontWeight: "bold" }}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
