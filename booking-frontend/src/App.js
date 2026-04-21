import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatsCards from "./components/StatsCards";
import BookingForm from "./components/BookingForm";
import BookingList from "./components/BookingList";

import { useEffect, useState } from "react";
import BookingService from "./services/BookingService";

function App() {
  const [bookings, setBookings] = useState([]);

  const loadBookings = async () => {
    const res = await BookingService.getAll();
    setBookings(res.data);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  return (
    <div className="app-wrapper">
      <Sidebar />

      <div className="main-area">
        <Header />

        <StatsCards bookings={bookings} />

        <div className="row mt-3">
          <div className="col-md-4">
            <BookingForm refresh={loadBookings} />
          </div>

          <div className="col-md-8">
            <BookingList bookings={bookings} refresh={loadBookings} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;