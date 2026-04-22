import Header from "../components/Header";
import BookingList from "../components/BookingList";
import { useNavigate } from "react-router-dom";

function ApprovalsPage({ bookings, onRefresh, session }) {
  const navigate = useNavigate();
  const pendingBookings = bookings.filter((booking) => booking.status === "PENDING");
  const approvedCount = bookings.filter((booking) => booking.status === "APPROVED").length;
  const rejectedCount = bookings.filter((booking) => booking.status === "REJECTED").length;

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
        <div className="col-md-4">
          <div className="card-box page-metric-card">
            <span>Pending reviews</span>
            <strong>{pendingBookings.length}</strong>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card-box page-metric-card">
            <span>Approved</span>
            <strong>{approvedCount}</strong>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card-box page-metric-card">
            <span>Rejected</span>
            <strong>{rejectedCount}</strong>
          </div>
        </div>
      </div>

      <BookingList
        bookings={pendingBookings}
        refresh={onRefresh}
        session={session}
        mode="ADMIN"
        label="Approval queue"
        title="Pending Bookings"
        emptyTitle="No pending approvals"
        emptyMessage="All requests are processed. New pending bookings will appear here."
        className="mt-1"
      />
    </div>
  );
}

export default ApprovalsPage;