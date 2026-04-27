
import axios from "axios";

const API = axios.create({
  baseURL: "172.20.10.7", // ✅ BACK TO WEB MODE
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;