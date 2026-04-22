import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8090/api",
});

const sessionHeaders = (session) => ({
  "X-User-Email": session.email,
  "X-User-Role": session.role,
});

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

  cancel(id, session) {
    return API.put(`/bookings/${id}/cancel`, {}, { headers: sessionHeaders(session) });
  }
}

const bookingService = new BookingService();

export default bookingService;