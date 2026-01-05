import axios from "axios";

console.log("✅ USING CORRECT api.js");

const API = axios.create({
  baseURL: "https://we-farm.onrender.com/api",
});

export default API;
