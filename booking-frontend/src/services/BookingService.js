import axios from "axios";

const BASE_URL = "http://localhost:8090/bookings";

class BookingService {
  getAll() {
    return axios.get(BASE_URL);
  }

  create(data) {
    return axios.post(BASE_URL, data);
  }

  update(id, action) {
    return axios.put(`${BASE_URL}/${id}/${action}`);
  }
}

export default new BookingService();