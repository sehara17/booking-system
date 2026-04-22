import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8090/api",
});

const sessionHeaders = (session) => ({
  "X-User-Email": session.email,
  "X-User-Role": session.role,
});

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
