import BookingService from "../services/BookingService";

function BookingList({ bookings, refresh }) {

  const update = async (id, action) => {
    await BookingService.update(id, action);
    refresh();
  };

  const statusClass = (status) => {
    if (status === "PENDING") return "status-pending";
    if (status === "APPROVED") return "status-approved";
    if (status === "REJECTED") return "status-rejected";
    if (status === "CANCELLED") return "status-cancelled";
  };

  return (
    <div className="card-box mt-3">
      <h5>All Bookings</h5>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Resource</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map(b => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.resourceId}</td>
              <td>{b.date}</td>

              <td>
                <span className={statusClass(b.status)}>
                  {b.status}
                </span>
              </td>

              <td>
                <button className="btn btn-success btn-sm me-1"
                  onClick={() => update(b.id, "approve")}>
                  Approve
                </button>

                <button className="btn btn-danger btn-sm me-1"
                  onClick={() => update(b.id, "reject")}>
                  Reject
                </button>

                <button className="btn btn-warning btn-sm"
                  onClick={() => update(b.id, "cancel")}>
                  Cancel
                </button>
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default BookingList;