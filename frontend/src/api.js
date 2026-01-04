import axios from "axios";

const API = axios.create({
  baseURL: "https://wefarm-backend.onrender.com/api",
});

export default API;
