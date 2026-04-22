import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import StatsCards from "../components/StatsCards";
import BookingList from "../components/BookingList";
import NotificationPanel from "../components/NotificationPanel";

function DashboardPage({ bookings, session }) {
  const navigate = useNavigate();

  const total = bookings.length;
  const approved = bookings.filter((b) => b.status === "APPROVED").length;
  const pending = bookings.filter((b) => b.status === "PENDING").length;
  const rejected = bookings.filter((b) => b.status === "REJECTED").length;
  const cancelled = bookings.filter((b) => b.status === "CANCELLED").length;

  const approvalRate = total === 0 ? 0 : Math.round((approved / total) * 100);
  const pendingRate = total === 0 ? 0 : Math.round((pending / total) * 100);
  const reviewed = approved + rejected + cancelled;

  const recentBookings = [...bookings].slice(-5).reverse();

  return (
    <div className="page-stack dashboard-page user-dashboard-page">
      <Header
        eyebrow="User area"
        roleLabel="User Portal"
        title="Your Booking Home"
        subtitle="Create requests, track approvals, and review your booking history with a clear status summary."
        actionLabel="New request"
        onActionClick={() => navigate("/user/bookings")}
      />

      <StatsCards bookings={bookings} />

      <div className="row g-3 mt-1">
        <div className="col-xl-8">
          <div className="card-box dashboard-spotlight">
            <div className="dashboard-spotlight-top">
              <div>
                <p className="section-label">Overview</p>
                <h4>Track request progress in one place</h4>
                <p>
                  You have {total} requests in total. {reviewed} are reviewed and {pending} are still
                  waiting in queue.
                </p>
              </div>

              <div className="dashboard-pulse">
                <span>Approval ratio</span>
                <strong>{approvalRate}%</strong>
                <small>Pending ratio: {pendingRate}%</small>
              </div>
            </div>

            <div className="dashboard-bars">
              <div className="dashboard-bar-row">
                <div className="dashboard-bar-label">
                  <span>Approved</span>
                  <strong>{approved}</strong>
                </div>
                <div className="dashboard-track">
                  <div
                    className="dashboard-fill dashboard-fill-approved"
                    style={{ width: `${total === 0 ? 0 : Math.max(8, Math.round((approved / total) * 100))}%` }}
                  />
                </div>
              </div>

              <div className="dashboard-bar-row">
                <div className="dashboard-bar-label">
                  <span>Pending</span>
                  <strong>{pending}</strong>
                </div>
                <div className="dashboard-track">
                  <div
                    className="dashboard-fill dashboard-fill-pending"
                    style={{ width: `${total === 0 ? 0 : Math.max(8, Math.round((pending / total) * 100))}%` }}
                  />
                </div>
              </div>

              <div className="dashboard-bar-row">
                <div className="dashboard-bar-label">
                  <span>Rejected and cancelled</span>
                  <strong>{rejected + cancelled}</strong>
                </div>
                <div className="dashboard-track">
                  <div
                    className="dashboard-fill dashboard-fill-rejected"
                    style={{
                      width: `${
                        total === 0 ? 0 : Math.max(8, Math.round(((rejected + cancelled) / total) * 100))
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card-box quick-actions-card mt-3">
            <p className="section-label">Quick actions</p>
            <div className="quick-action-grid">
              <button type="button" className="quick-action-tile" onClick={() => navigate("/user/bookings")}>
                <strong>Create request</strong>
                <span>Submit a new resource booking request.</span>
              </button>

              <button type="button" className="quick-action-tile" onClick={() => navigate("/user/bookings")}>
                <strong>Review statuses</strong>
                <span>Open your bookings and track approval progress.</span>
              </button>

              <button type="button" className="quick-action-tile" onClick={() => navigate("/user/notifications")}>
                <strong>Read alerts</strong>
                <span>Check updates from admin and system notifications.</span>
              </button>
            </div>
          </div>

          <BookingList
            bookings={recentBookings}
            refresh={() => {}}
            session={session}
            mode="NONE"
            label="Recent activity"
            title="Latest bookings"
            emptyTitle="No booking activity yet"
            emptyMessage="Create your first booking request to populate this dashboard section."
            className="dashboard-booking-list"
          />
        </div>

        <div className="col-xl-4">
          <div className="card-box quick-actions-card">
            <p className="section-label">Planning notes</p>
            <h5>Best practices</h5>
            <ul className="quick-notes-list">
              <li>
                <span className="dot dot-amber" />
                Keep pending queue manageable by checking updates daily.
              </li>
              <li>
                <span className="dot dot-blue" />
                Include clear purpose notes to speed up admin decisions.
              </li>
              <li>
                <span className="dot dot-green" />
                Cancel unused approved slots early to free resources for others.
              </li>
            </ul>
          </div>

          <div className="mt-3">
            <NotificationPanel session={session} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;