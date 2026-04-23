import Header from "../components/Header";
import BookingList from "../components/BookingList";
import { useNavigate } from "react-router-dom";

function AdminBookingsPage({ bookings, session, onRefresh }) {
  const navigate = useNavigate();
  return (
    <div className="page-stack admin-bookings-page">
      <Header
        eyebrow="Admin bookings"
        roleLabel="Admin Console"
        title="All Bookings"
        subtitle="View every request across the system in a clean admin-only list."
        actionLabel="Go to reports"
        onActionClick={() => navigate("/admin/reports")}
      />

      <div className="row g-3 mt-1 booking-summary-row">
        <div className="col-md-4">
          <div className="card-box page-metric-card">
            <span>Total bookings</span>
            <strong>{bookings.length}</strong>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card-box page-metric-card">
            <span>Pending approvals</span>
            <strong>{bookings.filter((booking) => booking.status === "PENDING").length}</strong>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card-box page-metric-card">
            <span>Approved</span>
            <strong>{bookings.filter((booking) => booking.status === "APPROVED").length}</strong>
          </div>
        </div>
      </div>

      <BookingList
        bookings={bookings}
        refresh={onRefresh}
        session={session}
        mode="ADMIN"
        label="System-wide view"
        title="All Booking Requests"
        emptyTitle="No bookings available"
        emptyMessage="The system will show every user request here."
        className="mt-1"
      />
    </div>
  );
}

export default AdminBookingsPage;