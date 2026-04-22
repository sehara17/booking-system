import { useMemo, useState } from "react";
import BookingService from "../services/BookingService";

function formatDateTime(value) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
}

function BookingList({
  bookings,
  refresh = () => {},
  session,
  mode = "USER",
  label = "Live queue",
  title = "Bookings",
  emptyTitle = "No bookings yet",
  emptyMessage = "Create the first booking from the form on the left.",
  className = "",
}) {
  const [reasons, setReasons] = useState({});

  const sortedBookings = useMemo(
    () => [...bookings].sort((a, b) => new Date(b.startTime || 0) - new Date(a.startTime || 0)),
    [bookings]
  );

  const statusClass = (status) => {
    if (status === "PENDING") return "status-pending";
    if (status === "APPROVED") return "status-approved";
    if (status === "REJECTED") return "status-rejected";
    if (status === "CANCELLED") return "status-cancelled";
    return "status-pending";
  };

  const updateReason = (id, value) => {
    setReasons((current) => ({ ...current, [id]: value }));
  };

  const approve = async (id) => {
    await BookingService.approve(id, session);
    refresh();
  };

  const reject = async (id) => {
    const reason = (reasons[id] || "").trim();
    if (!reason) {
      window.alert("Please give a rejection reason.");
      return;
    }

    await BookingService.reject(id, reason, session);
    updateReason(id, "");
    refresh();
  };

  const cancel = async (id) => {
    await BookingService.cancel(id, session);
    refresh();
  };

  const showActions = mode !== "NONE";
  const showAdminUserColumn = mode === "ADMIN";
  const columnCount = showAdminUserColumn ? 8 : showActions ? 7 : 6;

  return (
    <div className={`card-box table-card ${className}`.trim()}>
      <div className="section-heading">
        <p className="section-label">{label}</p>
        <h5>{title}</h5>
      </div>

      <div className="table-responsive booking-table-wrap">
        <table className="table align-middle booking-table">
          <thead>
            <tr>
              {showAdminUserColumn && <th>User</th>}
              <th>Resource</th>
              <th>Time</th>
              <th>Purpose</th>
              <th>Attendees</th>
              <th>Status</th>
              <th>Reason</th>
              {showActions && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {sortedBookings.length === 0 ? (
              <tr>
                <td colSpan={columnCount}>
                  <div className="empty-state">
                    <h6>{emptyTitle}</h6>
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedBookings.map((booking) => {
                const isPending = booking.status === "PENDING";

                return (
                  <tr key={booking.id}>
                    {showAdminUserColumn && <td>{booking.userEmail || "-"}</td>}
                    <td>{booking.resourceName || booking.resourceId || "-"}</td>
                    <td>
                      <div className="booking-time-cell">
                        <span>{formatDateTime(booking.startTime || booking.date)}</span>
                        {booking.endTime && <small>to {formatDateTime(booking.endTime)}</small>}
                      </div>
                    </td>
                    <td>{booking.purpose || "-"}</td>
                    <td>{booking.attendees ?? "-"}</td>
                    <td>
                      <span className={statusClass(booking.status)}>{booking.status}</span>
                    </td>
                    <td>
                      <span className="booking-reason">
                        {booking.rejectionReason ? booking.rejectionReason : "-"}
                      </span>
                    </td>

                    {showActions && (
                      <td>
                        {mode === "USER" && (
                          <div className="booking-actions booking-actions-user">
                            {booking.status === "APPROVED" ? (
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => cancel(booking.id)}
                                type="button"
                              >
                                Cancel
                              </button>
                            ) : (
                              <span className="booking-action-hint">
                                {booking.status === "PENDING" ? "Waiting for approval" : "No action available"}
                              </span>
                            )}
                          </div>
                        )}

                        {mode === "ADMIN" && (
                          <div className="booking-actions booking-actions-admin">
                            {isPending ? (
                              <>
                                <button
                                  className="btn btn-success btn-sm"
                                  onClick={() => approve(booking.id)}
                                  type="button"
                                >
                                  Approve
                                </button>

                                <div className="reject-box">
                                  <input
                                    className="form-control form-control-sm"
                                    placeholder="Rejection reason"
                                    value={reasons[booking.id] || ""}
                                    onChange={(e) => updateReason(booking.id, e.target.value)}
                                  />
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => reject(booking.id)}
                                    type="button"
                                  >
                                    Reject
                                  </button>
                                </div>
                              </>
                            ) : (
                              <span className="booking-action-hint">Reviewed</span>
                            )}
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookingList;