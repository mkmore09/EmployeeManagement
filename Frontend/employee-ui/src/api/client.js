// src/api/client.js
import axios from "axios";

export const api = axios.create({
  baseURL: "https://localhost:7022/api", // <-- change if different
});