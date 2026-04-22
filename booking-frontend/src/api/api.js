import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

// OPTIONAL: attach user email (simulate login)
API.interceptors.request.use((req) => {
  req.headers["userEmail"] = "testuser@gmail.com";
  return req;
});

export default API;