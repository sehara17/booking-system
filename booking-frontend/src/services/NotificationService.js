import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8091/api";

const API = axios.create({
  baseURL: API_BASE_URL,
});

const sessionHeaders = (session) => {
  const email = session?.email || localStorage.getItem("booking.userEmail") || "user@booking.local";
  const role = (session?.role || localStorage.getItem("booking.userRole") || "USER").toUpperCase();

  return {
    "X-User-Email": email,
    "X-User-Role": role,
  };
};

class NotificationService {
  getNotifications(session) {
    const path = session.role === "ADMIN" ? "/notifications/admin" : "/notifications/my";
    return API.get(path, { headers: sessionHeaders(session) });
  }

  markRead(id, session) {
    return API.put(`/notifications/${id}/read`, {}, { headers: sessionHeaders(session) });
  }
}

const notificationService = new NotificationService();

export default notificationService;
