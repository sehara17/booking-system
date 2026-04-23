import Header from "../components/Header";
import BookingList from "../components/BookingList";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

function ApprovalsPage({ bookings, onRefresh, session }) {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("PENDING");

  const pendingBookings = bookings.filter((booking) => booking.status === "PENDING");
  const approvedCount = bookings.filter((booking) => booking.status === "APPROVED").length;
  const cancelledCount = bookings.filter((booking) => booking.status === "CANCELLED").length;
  const rejectedCount = bookings.filter((booking) => booking.status === "REJECTED").length;

  const filteredBookings = useMemo(() => {
    if (statusFilter === "ALL") return bookings;
    return bookings.filter((booking) => booking.status === statusFilter);
  }, [bookings, statusFilter]);

  const sectionTitle =
    statusFilter === "ALL" ? "All bookings" : `${statusFilter.charAt(0)}${statusFilter.slice(1).toLowerCase()} bookings`;

  const statusCounts = {
    PENDING: pendingBookings.length,
    APPROVED: approvedCount,
    REJECTED: rejectedCount,
    CANCELLED: cancelledCount,
    ALL: bookings.length,
  };

  const statusButtons = [
    { key: "PENDING", label: "Pending", activeClass: "btn-warning" },
    { key: "APPROVED", label: "Approved", activeClass: "btn-success" },
    { key: "REJECTED", label: "Rejected", activeClass: "btn-danger" },
    { key: "CANCELLED", label: "Cancelled", activeClass: "btn-primary" },
    { key: "ALL", label: "All", activeClass: "btn-dark" },
  ];

  return (
    <div className="page-stack approvals-page admin-approvals-page">
      <Header
        eyebrow="Admin approvals"
        roleLabel="Admin Console"
        title="Approval Desk"
        subtitle="Review pending requests and approve or reject them with a clear reason."
        actionLabel="View all bookings"
        onActionClick={() => navigate("/admin/bookings")}
      />

      <div className="row g-3 mt-1 booking-summary-row">
        <div className="col-lg-3 col-md-6">
          <div className="card-box page-metric-card">
            <span>Pending reviews</span>
            <strong>{pendingBookings.length}</strong>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card-box page-metric-card">
            <span>Approved</span>
            <strong>{approvedCount}</strong>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card-box page-metric-card">
            <span>Rejected</span>
            <strong>{rejectedCount}</strong>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card-box page-metric-card">
            <span>Cancelled</span>
            <strong>{cancelledCount}</strong>
          </div>
        </div>
      </div>

      <div className="card-box mt-1">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
          <p className="section-copy mb-0">
            Admin actions: approve, reject with reason, cancel with reason, or delete booking records.
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2 mt-3">
          {statusButtons.map((button) => {
            const active = statusFilter === button.key;
            return (
              <button
                key={button.key}
                type="button"
                className={`btn btn-sm ${active ? button.activeClass : "btn-outline-dark"}`}
                onClick={() => setStatusFilter(button.key)}
              >
                {button.label} ({statusCounts[button.key]})
              </button>
            );
          })}
        </div>
      </div>

      <BookingList
        bookings={filteredBookings}
        refresh={onRefresh}
        session={session}
        mode="ADMIN"
        label="Approval queue"
        title={sectionTitle}
        emptyTitle="No bookings for this status"
        emptyMessage={`No ${statusFilter.toLowerCase()} bookings are currently available.`}
        className="mt-1"
      />

      <div className="card-box mt-1">
        <p className="section-copy mb-0">
          Use the Actions column in the table to approve, reject, cancel, or delete from admin side.
        </p>
      </div>
    </div>
  );
}

export default ApprovalsPage;