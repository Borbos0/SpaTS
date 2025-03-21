import axios from "axios";

const API_URL = "https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["x-auth"] = token;
  }
  return config;
});

export default api;
