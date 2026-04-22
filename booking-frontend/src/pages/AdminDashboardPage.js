import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import StatsCards from "../components/StatsCards";
import BookingList from "../components/BookingList";
import NotificationPanel from "../components/NotificationPanel";

function AdminDashboardPage({ bookings, session }) {
  const navigate = useNavigate();
  const pendingBookings = bookings.filter((booking) => booking.status === "PENDING");
  const recentBookings = [...bookings].slice(-4).reverse();

  return (
    <div className="page-stack admin-dashboard-page">
      <Header
        eyebrow="Admin area"
        roleLabel="Admin Console"
        title="Control Center"
        subtitle="Review queues, monitor approvals, and keep the booking system running smoothly."
        actionLabel="Open approvals"
        onActionClick={() => navigate("/admin/approvals")}
      />

      <StatsCards bookings={bookings} />

      <div className="row g-3 mt-1">
        <div className="col-xl-8">
          <div className="card-box dashboard-spotlight admin-spotlight">
            <div className="dashboard-spotlight-top">
              <div>
                <p className="section-label">Queue health</p>
                <h4>Admin review queue is separated from user requests</h4>
                <p>
                  Use Approvals for decisions, Bookings for a complete admin view, and Reports to
                  track the workload over time.
                </p>
              </div>

              <div className="dashboard-pulse">
                <span>Pending requests</span>
                <strong>{pendingBookings.length}</strong>
              </div>
            </div>

            <div className="admin-quick-grid">
              <button type="button" className="quick-action-tile" onClick={() => navigate("/admin/bookings") }>
                <strong>All bookings</strong>
                <span>See every request in the system</span>
              </button>

              <button type="button" className="quick-action-tile" onClick={() => navigate("/admin/approvals") }>
                <strong>Review approvals</strong>
                <span>Approve or reject pending items</span>
              </button>

              <button type="button" className="quick-action-tile" onClick={() => navigate("/admin/reports") }>
                <strong>Reports</strong>
                <span>Open trends and status metrics</span>
              </button>
            </div>
          </div>
        </div>

        <div className="col-xl-4">
          <NotificationPanel session={session} />
        </div>
      </div>

      <div className="section-heading mt-4 mb-0">
        <p className="section-label">Recent activity</p>
        <h5>Latest bookings</h5>
      </div>

      <BookingList
        bookings={recentBookings}
        refresh={() => {}}
        session={session}
        mode="NONE"
        label="Recent requests"
        title="Latest bookings"
        emptyTitle="No recent activity"
        emptyMessage="New bookings will appear here once users submit requests."
        className="dashboard-booking-list"
      />
    </div>
  );
}

export default AdminDashboardPage;