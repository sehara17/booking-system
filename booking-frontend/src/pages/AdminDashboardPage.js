import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import StatsCards from "../components/StatsCards";
import BookingList from "../components/BookingList";
import NotificationPanel from "../components/NotificationPanel";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function AdminDashboardPage({ bookings, session }) {
  const navigate = useNavigate();
  const pendingBookings = bookings.filter((booking) => booking.status === "PENDING");
  const recentBookings = [...bookings].slice(-4).reverse();
  const approvedBookings = bookings.filter((booking) => booking.status === "APPROVED").length;
  const rejectedBookings = bookings.filter((booking) => booking.status === "REJECTED").length;
  const cancelledBookings = bookings.filter((booking) => booking.status === "CANCELLED").length;

  const queueData = [
    { name: "Approved", value: approvedBookings },
    { name: "Pending", value: pendingBookings.length },
    { name: "Rejected", value: rejectedBookings },
    { name: "Cancelled", value: cancelledBookings },
  ];

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

            <div className="chart-box mt-3">
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={queueData} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="adminQueueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2f7dc2" stopOpacity={0.55} />
                      <stop offset="95%" stopColor="#2f7dc2" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d7e1ec" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#2f7dc2" fill="url(#adminQueueFill)" />
                </AreaChart>
              </ResponsiveContainer>
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