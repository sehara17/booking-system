import { useMemo, useState } from "react";
import BookingService from "../services/BookingService";
import { toast } from "react-toastify";

function formatDateTime(value) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
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
    try {
      await BookingService.approve(id, session);
      toast.success("Booking Approved");
      refresh();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to approve booking.");
    }
  };

  const reject = async (id) => {
    const reason = (reasons[id] || "").trim();
    if (!reason) {
      toast.warning("Please provide a rejection reason.");
      return;
    }

    try {
      await BookingService.reject(id, reason, session);
      updateReason(id, "");
      toast.error("Booking Rejected");
      refresh();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to reject booking.");
    }
  };

  const cancel = async (id) => {
    try {
      await BookingService.cancel(id, session);
      toast.info("Booking Cancelled");
      refresh();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to cancel booking.");
    }
  };

  const showActions = mode !== "NONE";
  const showAdminUserColumn = mode === "ADMIN";
  const columnCount = showAdminUserColumn ? 8 : showActions ? 7 : 6;
  const tableModeClass = showAdminUserColumn ? "is-admin" : showActions ? "is-user" : "is-readonly";
  const columnLayout = showAdminUserColumn
    ? [14, 12, 18, 18, 8, 10, 10, 10]
    : showActions
      ? [14, 18, 21, 11, 11, 11, 14]
      : [15, 22, 22, 11, 12, 18];

  return (
    <div className={`card-box table-card booking-list-card ${className}`.trim()}>
      <div className="section-heading">
        <p className="section-label">{label}</p>
        <h5>{title}</h5>
        <p className="booking-list-copy">{sortedBookings.length} records shown</p>
      </div>

      <div className="table-responsive booking-table-wrap">
        <table className={`table align-middle booking-table ${tableModeClass}`.trim()}>
          <colgroup>
            {columnLayout.map((width, index) => (
              <col key={`${tableModeClass}-col-${index}`} style={{ width: `${width}%` }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {showAdminUserColumn && <th className="booking-col-user">User</th>}
              <th className="booking-col-resource">Resource</th>
              <th className="booking-col-time">Time</th>
              <th className="booking-col-purpose">Purpose</th>
              <th className="booking-col-attendees">Attendees</th>
              <th className="booking-col-status">Status</th>
              <th className="booking-col-notes">Notes</th>
              {showActions && <th className="booking-col-actions">Actions</th>}
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
                    {showAdminUserColumn && <td className="booking-user-cell booking-col-user">{booking.userEmail || "-"}</td>}
                    <td className="booking-resource-cell booking-col-resource">{booking.resourceName || booking.resourceId || "-"}</td>
                    <td className="booking-time-col">
                      <div className="booking-time-cell">
                        <span>{formatDateTime(booking.startTime || booking.date)}</span>
                        {booking.endTime && <small>Ends {formatDateTime(booking.endTime)}</small>}
                      </div>
                    </td>
                    <td className="booking-purpose-cell booking-col-purpose">{booking.purpose || "-"}</td>
                    <td className="booking-attendee-cell booking-col-attendees">{booking.attendees ?? "-"}</td>
                    <td className="booking-status-col">
                      <span className={statusClass(booking.status)}>{booking.status}</span>
                    </td>
                    <td className="booking-notes-col">
                      <span className="booking-reason">
                        {booking.rejectionReason ? booking.rejectionReason : "-"}
                      </span>
                    </td>

                    {showActions && (
                      <td className="booking-actions-cell">
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