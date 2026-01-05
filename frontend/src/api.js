import axios from "axios";

const API = axios.create({
  baseURL: "https://we-farm.onrender.com/api",
});

export default API;
