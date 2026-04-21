import { useState } from "react";
import BookingService from "../services/BookingService";

function BookingForm({ refresh }) {

  const [resourceId, setResourceId] = useState("");
  const [date, setDate] = useState("");

  const submit = async () => {
    await BookingService.create({
      resourceId,
      date,
      status: "PENDING"
    });

    setResourceId("");
    setDate("");
    refresh();
  };

  return (
    <div className="card-box">
      <h5>Create Booking</h5>

      <input
        className="form-control mb-2"
        placeholder="Resource ID"
        value={resourceId}
        onChange={(e) => setResourceId(e.target.value)}
      />

      <input
        type="date"
        className="form-control mb-2"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button className="btn btn-primary w-100" onClick={submit}>
        Create Booking
      </button>
    </div>
  );
}

export default BookingForm;