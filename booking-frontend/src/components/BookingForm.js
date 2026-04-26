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

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (!resourceName.trim() || !purpose.trim() || !startTime || !endTime) {
      setError("Please complete all required fields before submitting.");
      return;
    }

    if (new Date(endTime) <= new Date(startTime)) {
      setError("End time must be later than start time.");
      return;
    }

    const normalizedAttendees = Number(attendees);
    if (!Number.isFinite(normalizedAttendees) || normalizedAttendees < 1) {
      setError("Attendees must be at least 1.");
      return;
    }

    try {
      setLoading(true);
      await BookingService.create(
        {
          resourceName,
          startTime,
          endTime,
          purpose,
          attendees: normalizedAttendees,
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
    <form className="card-box form-card booking-form-card" onSubmit={submit}>
      <div className="section-heading booking-form-head">
        <p className="section-label">Booking request</p>
        <h5>Create a new booking</h5>
        <p className="booking-form-hint">
          Fill in resource details and timing. Overlap checks happen automatically before approval.
        </p>
      </div>

      {error && <div className="form-alert">{error}</div>}

      <div className="form-grid">
        <div className="form-field form-field-wide">
          <label htmlFor="resourceName">Resource name</label>
          <input
            id="resourceName"
            className="form-control form-control-lg"
            placeholder="Conference Hall A"
            value={resourceName}
            onChange={(e) => setResourceName(e.target.value)}
          />
        </div>

        <div className="form-field form-field-wide">
          <label htmlFor="purpose">Purpose</label>
          <input
            id="purpose"
            className="form-control form-control-lg"
            placeholder="Team meeting, seminar, workshop"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="startTime">Start time</label>
          <input
            id="startTime"
            type="datetime-local"
            className="form-control form-control-lg"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="endTime">End time</label>
          <input
            id="endTime"
            type="datetime-local"
            className="form-control form-control-lg"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="attendees">Attendees</label>
          <input
            id="attendees"
            type="number"
            min="1"
            className="form-control form-control-lg"
            value={attendees}
            onChange={(e) => setAttendees(e.target.value)}
          />
        </div>
      </div>

      <div className="booking-submit-row">
        <p className="submit-meta">Status: request will be sent as pending for admin approval.</p>
        <button className="btn btn-primary action-button" disabled={loading} type="submit">
          {loading ? "Submitting..." : "Create booking request"}
        </button>
      </div>
    </form>
  );
}

export default BookingForm;