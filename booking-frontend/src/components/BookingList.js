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

  const reject = async (id, overrideReason) => {
    const reason = (overrideReason ?? reasons[id] ?? "").trim();
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

  const rejectWithPrompt = async (id) => {
    const reason = window.prompt("Enter rejection reason:", "");
    if (reason === null) return;
    await reject(id, reason);
  };

  const deleteBooking = async (id) => {
    const ok = window.confirm("Delete this booking permanently?");
    if (!ok) return;

    try {
      await BookingService.delete(id, session);
      toast.info("Booking Deleted");
      refresh();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to delete booking.");
    }
  };

  const cancelByAdmin = async (id, overrideReason) => {
    const reason = (overrideReason ?? reasons[id] ?? "").trim();
    if (!reason) {
      toast.warning("Please provide a cancellation reason.");
      return;
    }

    try {
      await BookingService.cancelByAdmin(id, reason, session);
      updateReason(id, "");
      toast.info("Booking Cancelled by Admin");
      refresh();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to cancel booking.");
    }
  };

  const cancelByAdminWithPrompt = async (id) => {
    const reason = window.prompt("Enter cancellation reason:", "");
    if (reason === null) return;
    await cancelByAdmin(id, reason);
  };

  const cancel = async (id) => {
    const reason = (reasons[id] || "").trim();
    if (!reason) {
      toast.warning("Please provide a cancellation reason.");
      return;
    }

    try {
      await BookingService.cancel(id, reason, session);
      updateReason(id, "");
      toast.info("Booking Cancelled");
      refresh();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to cancel booking.");
    }
  };

  const editByAdminWithPrompt = async (booking) => {
    const resourceName = window.prompt("Resource name:", booking.resourceName || "");
    if (resourceName === null) return;

    const startTime = window.prompt(
      "Start time (YYYY-MM-DDTHH:mm:ss):",
      booking.startTime || ""
    );
    if (startTime === null) return;

    const endTime = window.prompt(
      "End time (YYYY-MM-DDTHH:mm:ss):",
      booking.endTime || ""
    );
    if (endTime === null) return;

    const purpose = window.prompt("Purpose:", booking.purpose || "");
    if (purpose === null) return;

    const attendeesInput = window.prompt("Attendees:", String(booking.attendees ?? 1));
    if (attendeesInput === null) return;

    const status = window.prompt(
      "Status (PENDING, APPROVED, REJECTED, CANCELLED):",
      booking.status || "PENDING"
    );
    if (status === null) return;

    let rejectionReason = booking.rejectionReason || "";
    let cancelReason = booking.cancelReason || "";

    if (status.trim().toUpperCase() === "REJECTED") {
      const input = window.prompt("Rejection reason:", rejectionReason);
      if (input === null) return;
      rejectionReason = input;
      cancelReason = "";
    }

    if (status.trim().toUpperCase() === "CANCELLED") {
      const input = window.prompt("Cancellation reason:", cancelReason || "Cancelled by admin");
      if (input === null) return;
      cancelReason = input;
      rejectionReason = "";
    }

    const attendees = Number(attendeesInput);
    if (Number.isNaN(attendees)) {
      toast.warning("Attendees must be a number.");
      return;
    }

    try {
      await BookingService.editByAdmin(
        booking.id,
        {
          resourceName,
          startTime,
          endTime,
          purpose,
          attendees,
          status,
          rejectionReason,
          cancelReason,
        },
        session
      );
      toast.success("Booking updated by admin");
      refresh();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to edit booking.");
    }
  };

  const showActions = mode === "USER" || mode === "ADMIN";
  const showAdminUserColumn = mode === "ADMIN" || mode === "ADMIN_READONLY";
  const columnCount = showAdminUserColumn ? 8 : showActions ? 7 : 6;
  const tableModeClass = mode === "ADMIN"
    ? "is-admin"
    : mode === "ADMIN_READONLY"
      ? "is-admin-readonly"
      : showActions
        ? "is-user"
        : "is-readonly";
  const columnLayout = showAdminUserColumn
    ? showActions
      ? [14, 12, 18, 18, 8, 10, 10, 10]
      : [16, 13, 20, 18, 8, 11, 14]
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
                        {booking.status === "PENDING"
                          ? "Pending approval"
                          : booking.status === "APPROVED"
                            ? "Approved"
                            : booking.rejectionReason
                              ? `Rejected: ${booking.rejectionReason}`
                              : booking.cancelReason
                                ? `Cancelled: ${booking.cancelReason}`
                                : booking.status === "CANCELLED"
                                  ? "Cancelled by user"
                                  : "-"}
                      </span>
                    </td>

                    {showActions && (
                      <td className="booking-actions-cell">
                        {mode === "USER" && (
                          <div className="booking-actions booking-actions-user">
                            {booking.status === "APPROVED" ? (
                              <div className="reject-box">
                                <input
                                  className="form-control form-control-sm"
                                  placeholder="Cancellation reason"
                                  value={reasons[booking.id] || ""}
                                  onChange={(e) => updateReason(booking.id, e.target.value)}
                                />
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => cancel(booking.id)}
                                  type="button"
                                >
                                  Cancel
                                </button>
                              </div>
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

                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => rejectWithPrompt(booking.id)}
                                  type="button"
                                >
                                  Reject
                                </button>

                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => cancelByAdminWithPrompt(booking.id)}
                                  type="button"
                                >
                                  Cancel
                                </button>

                                <button
                                  className="btn btn-outline-dark btn-sm"
                                  onClick={() => deleteBooking(booking.id)}
                                  type="button"
                                >
                                  Delete
                                </button>

                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => editByAdminWithPrompt(booking)}
                                  type="button"
                                >
                                  Edit
                                </button>
                              </>
                            ) : (
                              <div className="booking-actions booking-actions-user">
                                <span className="booking-action-hint">Reviewed</span>

                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => editByAdminWithPrompt(booking)}
                                  type="button"
                                >
                                  Edit
                                </button>

                                {booking.status === "APPROVED" && (
                                  <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => cancelByAdminWithPrompt(booking.id)}
                                    type="button"
                                  >
                                    Cancel
                                  </button>
                                )}

                                {(booking.status === "CANCELLED" || booking.status === "REJECTED" || booking.status === "APPROVED") && (
                                  <button
                                    className="btn btn-outline-dark btn-sm"
                                    onClick={() => deleteBooking(booking.id)}
                                    type="button"
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>
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