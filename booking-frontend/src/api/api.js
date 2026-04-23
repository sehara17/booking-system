import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8091/api";

const API = axios.create({
  baseURL: API_BASE_URL,
});

// OPTIONAL: attach user email (simulate login)
API.interceptors.request.use((req) => {
  req.headers["userEmail"] = "testuser@gmail.com";
  return req;
});

export default API;