import { useState } from "react";
import BookingService from "../services/BookingService";

function BookingForm({ refresh, session }) {
  const [resourceName, setResourceName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [attendees, setAttendees] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");

    try {
      setLoading(true);
      await BookingService.create(
        {
          resourceName,
          startTime,
          endTime,
          purpose,
          attendees: Number(attendees),
        },
        session
      );

      setResourceName("");
      setStartTime("");
      setEndTime("");
      setPurpose("");
      setAttendees(1);
      refresh();
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Unable to create booking request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-box form-card booking-form-card">
      <div className="section-heading">
        <p className="section-label">New request</p>
        <h5>Create booking request</h5>
      </div>

      <p className="section-copy">
        Submit a room or resource request with time details. Conflict checking happens automatically.
      </p>

      {error && <div className="form-alert">{error}</div>}

      <div className="form-grid">
        <div className="form-field">
          <label>Resource name</label>
          <input
            className="form-control form-control-lg"
            placeholder="Conference Hall A"
            value={resourceName}
            onChange={(e) => setResourceName(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Purpose</label>
          <input
            className="form-control form-control-lg"
            placeholder="Team meeting, seminar, workshop"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Start time</label>
          <input
            type="datetime-local"
            className="form-control form-control-lg"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>End time</label>
          <input
            type="datetime-local"
            className="form-control form-control-lg"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Attendees</label>
          <input
            type="number"
            min="1"
            className="form-control form-control-lg"
            value={attendees}
            onChange={(e) => setAttendees(e.target.value)}
          />
        </div>
      </div>

      <button className="btn btn-primary w-100 action-button" onClick={submit} disabled={loading} type="button">
        {loading ? "Submitting..." : "Create Booking Request"}
      </button>
    </div>
  );
}

export default BookingForm;