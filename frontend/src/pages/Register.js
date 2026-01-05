import React, { useState } from "react";
import API from "../api";
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

    if (!name || !email || !password || !role) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await API.post("/auth/register", form);
      alert(res.data.message || "Registered successfully");
      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
      />
      <select name="role" onChange={handleChange}>
        <option value="">Select Role</option>
        <option value="farmer">Farmer</option>
        <option value="expert">Expert</option>
      </select>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;
