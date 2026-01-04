import React, { useEffect } from "react";

function Dashboard() {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/";
    }
  }, [token]);

  return (
    <div style={{ padding: "40px" }}>
      <h1>🌱 WeFarm Dashboard</h1>
      <p>Welcome! You are logged in as:</p>
      <h3 style={{ color: "#2e7d32" }}>{role}</h3>
    </div>
  );
}

export default Dashboard;
