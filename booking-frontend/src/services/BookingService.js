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

class BookingService {
  getAll(session) {
    return API.get("/bookings", { headers: sessionHeaders(session) });
  }

  getMine(session) {
    return API.get("/bookings/my", { headers: sessionHeaders(session) });
  }

  getPending(session) {
    return API.get("/bookings/pending", { headers: sessionHeaders(session) });
  }

  create(data, session) {
    return API.post("/bookings", data, { headers: sessionHeaders(session) });
  }

  approve(id, session) {
    return API.put(`/bookings/${id}/approve`, {}, { headers: sessionHeaders(session) });
  }

  reject(id, reason, session) {
    return API.put(`/bookings/${id}/reject`, { reason }, { headers: sessionHeaders(session) });
  }

  cancel(id, reason, session) {
    return API.put(`/bookings/${id}/cancel`, { reason }, { headers: sessionHeaders(session) });
  }

  delete(id, session) {
    return API.delete(`/bookings/${id}`, { headers: sessionHeaders(session) });
  }

  cancelByAdmin(id, reason, session) {
    return API.put(`/bookings/${id}/cancel/admin`, { reason }, { headers: sessionHeaders(session) });
  }

  editByAdmin(id, data, session) {
    return API.patch(`/bookings/${id}`, data, { headers: sessionHeaders(session) });
  }
}

const bookingService = new BookingService();

export default bookingService;