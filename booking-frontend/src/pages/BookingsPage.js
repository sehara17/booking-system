import Header from "../components/Header";
import BookingForm from "../components/BookingForm";
import BookingList from "../components/BookingList";
import { useNavigate } from "react-router-dom";

function BookingsPage({ bookings, onRefresh, session }) {
  const navigate = useNavigate();
  const pendingCount = bookings.filter((booking) => booking.status === "PENDING").length;
  const approvedCount = bookings.filter((booking) => booking.status === "APPROVED").length;
  const rejectedCount = bookings.filter((booking) => booking.status === "REJECTED").length;

  return (
    <div className="page-stack bookings-page user-bookings-page">
      <Header
        eyebrow="User bookings"
        roleLabel="My Booking Area"
        title="Create and Track Requests"
        subtitle="Book resources, review your own request history, and cancel approved bookings when needed."
        actionLabel="Back to dashboard"
        onActionClick={() => navigate("/user/dashboard")}
      />

      <div className="row g-3 mt-1 booking-summary-row">
        <div className="col-md-4">
          <div className="card-box page-metric-card">
            <span>Total requests</span>
            <strong>{bookings.length}</strong>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card-box page-metric-card">
            <span>Pending</span>
            <strong>{pendingCount}</strong>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card-box page-metric-card">
            <span>Rejected</span>
            <strong>{rejectedCount}</strong>
          </div>
        </div>
      </div>

      <div className="row g-3 mt-1 booking-layout-row">
        <div className="col-xl-4">
          <BookingForm refresh={onRefresh} session={session} />
        </div>

        <div className="col-xl-8">
          <BookingList
            bookings={bookings}
            refresh={onRefresh}
            session={session}
            mode="USER"
            label="My requests"
            title="My Bookings"
            emptyTitle="No booking requests yet"
            emptyMessage="Create a booking request using the form on the left."
            className="booking-list-main"
          />
        </div>
      </div>
    </div>
  );
}

export default BookingsPage;