import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import StatsCards from "../components/StatsCards";
import BookingList from "../components/BookingList";
import NotificationPanel from "../components/NotificationPanel";

function DashboardPage({ bookings, session }) {
  const navigate = useNavigate();
  const total = bookings.length;
  const approved = bookings.filter((booking) => booking.status === "APPROVED").length;
  const pending = bookings.filter((booking) => booking.status === "PENDING").length;
  const rejected = bookings.filter((booking) => booking.status === "REJECTED").length;
  const cancelled = bookings.filter((booking) => booking.status === "CANCELLED").length;
  const approvalRate = total === 0 ? 0 : Math.round((approved / total) * 100);
  const pendingRate = total === 0 ? 0 : Math.round((pending / total) * 100);
  const recentBookings = [...bookings].slice(-5).reverse();

  return (
    <div className="page-stack dashboard-page user-dashboard-page">
      <Header
        eyebrow="User area"
        roleLabel="User Portal"
        title="Your Booking Home"
        subtitle="Create requests, track approvals, and review your own booking history in one place."
        actionLabel="New request"
        onActionClick={() => navigate("/user/bookings")}
      />

      <StatsCards bookings={bookings} />

      <div className="row g-3 mt-1">
        <div className="col-xl-8">
          <div className="card-box dashboard-spotlight">
            <div className="dashboard-spotlight-top">
              <div>
                <p className="section-label">Your snapshot</p>
                <h4>Bookings stay organized and visible</h4>
                <p>
                  You have {total} total requests. Approval rate is {approvalRate}% and the pending
                  queue is {pendingRate}% of your requests.
                </p>
              </div>

              <div className="dashboard-pulse">
                <span>Status mix</span>
                <strong>{pending <= 5 ? "Calm" : pending <= 12 ? "Active" : "Busy"}</strong>
              </div>
            </div>

            <div className="dashboard-bars">
              <div className="dashboard-bar-row">
                <div className="dashboard-bar-label">
                  <span>Approved</span>
                  }

                  export default DashboardPage;
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
                  <span>Rejected + Cancelled</span>
                  <strong>{rejected + cancelled}</strong>
                </div>
                <div className="dashboard-track">
                  <div
                    className="dashboard-fill dashboard-fill-rejected"
                    style={{ width: `${total === 0 ? 0 : Math.max(8, Math.round(((rejected + cancelled) / total) * 100))}%` }}
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
                <span>Open the booking form</span>
              </button>

              <button type="button" className="quick-action-tile" onClick={() => navigate("/user/bookings")}>
                <strong>View bookings</strong>
                <span>Review current requests</span>
              </button>

              <button type="button" className="quick-action-tile" onClick={() => navigate("/user/bookings")}>
                <strong>Cancel approved</strong>
                <span>Withdraw an approved slot</span>
              </button>
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
            emptyTitle="No dashboard activity yet"
            emptyMessage="Go to the Bookings page to create your first booking request."
            className="dashboard-booking-list"
          />
        </div>

        <div className="col-xl-4">
          <div className="card-box quick-actions-card">
            <p className="section-label">Quick notes</p>
            <h5>Today highlights</h5>
            <ul className="quick-notes-list">
              <li>
                <span className="dot dot-green" />
                Keep pending requests below 10 for smooth same-day approvals.
              </li>
              <li>
                <span className="dot dot-blue" />
                Review rejected items to detect repeat resource conflicts.
              </li>
              <li>
                <span className="dot dot-amber" />
                Use the bookings page to submit, review, and manage your requests.
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

export default DashboardPage;import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import StatsCards from "../components/StatsCards";
import BookingList from "../components/BookingList";
import NotificationPanel from "../components/NotificationPanel";

function DashboardPage({ bookings, session }) {
  const navigate = useNavigate();
  const total = bookings.length;
  const approved = bookings.filter((booking) => booking.status === "APPROVED").length;
  const pending = bookings.filter((booking) => booking.status === "PENDING").length;
  const rejected = bookings.filter((booking) => booking.status === "REJECTED").length;
  const cancelled = bookings.filter((booking) => booking.status === "CANCELLED").length;
  const approvalRate = total === 0 ? 0 : Math.round((approved / total) * 100);
  const pendingRate = total === 0 ? 0 : Math.round((pending / total) * 100);
  const recentBookings = [...bookings].slice(-5).reverse();

  return (
    <div className="page-stack dashboard-page user-dashboard-page">
      <Header
        eyebrow="User area"
        roleLabel="User Portal"
        title="Your Booking Home"
        subtitle="Create requests, track approvals, and review your own booking history in one place."
        actionLabel="New request"
        onActionClick={() => navigate("/user/bookings")}
      />

      <StatsCards bookings={bookings} />

      <div className="row g-3 mt-1">
        <div className="col-xl-8">
          <div className="card-box dashboard-spotlight">
            <div className="dashboard-spotlight-top">
              <div>
                <p className="section-label">Your snapshot</p>
                <h4>Bookings stay organized and visible</h4>
                <p>
                  You have {total} total requests. Approval rate is {approvalRate}% and the pending
                  queue is {pendingRate}% of your requests.
                </p>
              </div>

              <div className="dashboard-pulse">
                <span>Status mix</span>
                <strong>{pending <= 5 ? "Calm" : pending <= 12 ? "Active" : "Busy"}</strong>
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
                  <span>Rejected + Cancelled</span>
                  <strong>{rejected + cancelled}</strong>
                </div>
                <div className="dashboard-track">
                  <div
                    className="dashboard-fill dashboard-fill-rejected"
                    style={{ width: `${total === 0 ? 0 : Math.max(8, Math.round(((rejected + cancelled) / total) * 100))}%` }}
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
                <span>Open the booking form</span>
              </button>

              <button type="button" className="quick-action-tile" onClick={() => navigate("/user/bookings")}>
                <strong>View bookings</strong>
                <span>Review current requests</span>
              </button>

              <button type="button" className="quick-action-tile" onClick={() => navigate("/user/bookings")}>
                <strong>Cancel approved</strong>
                <span>Withdraw an approved slot</span>
              </button>
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
            emptyTitle="No dashboard activity yet"
            emptyMessage="Go to the Bookings page to create your first booking request."
            className="dashboard-booking-list"
          />
        </div>

        <div className="col-xl-4">
          <div className="card-box quick-actions-card">
            <p className="section-label">Quick notes</p>
            <h5>Today highlights</h5>
            <ul className="quick-notes-list">
              <li>
                <span className="dot dot-green" />
                Keep pending requests below 10 for smooth same-day approvals.
              </li>
              <li>
                <span className="dot dot-blue" />
                Review rejected items to detect repeat resource conflicts.
              </li>
              <li>
                <span className="dot dot-amber" />
                Use the bookings page to submit, review, and manage your requests.
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

export default DashboardPage;import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import StatsCards from "../components/StatsCards";
import BookingList from "../components/BookingList";
import NotificationPanel from "../components/NotificationPanel";

function DashboardPage({ bookings, session }) {
  const navigate = useNavigate();
  const total = bookings.length;
  const approved = bookings.filter((booking) => booking.status === "APPROVED").length;
  const pending = bookings.filter((booking) => booking.status === "PENDING").length;
  const rejected = bookings.filter((booking) => booking.status === "REJECTED").length;
  const cancelled = bookings.filter((booking) => booking.status === "CANCELLED").length;
  const approvalRate = total === 0 ? 0 : Math.round((approved / total) * 100);
  const pendingRate = total === 0 ? 0 : Math.round((pending / total) * 100);
  const recentBookings = [...bookings].slice(-5).reverse();

  return (
    <div className="page-stack dashboard-page user-dashboard-page">
      <Header
        eyebrow="User area"
        roleLabel="User Portal"
        title="Your Booking Home"
        subtitle="Create requests, track approvals, and review your own booking history in one place."
        actionLabel="New request"
        onActionClick={() => navigate("/user/bookings")}
      />

      <StatsCards bookings={bookings} />

      <div className="row g-3 mt-1">
        <div className="col-xl-8">
          <div className="card-box dashboard-spotlight">
            <div className="dashboard-spotlight-top">
              <div>
                <p className="section-label">Your snapshot</p>
                <h4>Bookings stay organized and visible</h4>
                <p>
                  You have {total} total requests. Approval rate is {approvalRate}% and the pending
                  queue is {pendingRate}% of your requests.
                </p>
              </div>

              <div className="dashboard-pulse">
                <span>Status mix</span>
                <strong>{pending <= 5 ? "Calm" : pending <= 12 ? "Active" : "Busy"}</strong>
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
                  <span>Rejected + Cancelled</span>
                  <strong>{rejected + cancelled}</strong>
                </div>
                <div className="dashboard-track">
                  <div
                    className="dashboard-fill dashboard-fill-rejected"
                    style={{ width: `${total === 0 ? 0 : Math.max(8, Math.round(((rejected + cancelled) / total) * 100))}%` }}
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
                <span>Open the booking form</span>
              </button>

              <button type="button" className="quick-action-tile" onClick={() => navigate("/user/bookings")}>
                <strong>View bookings</strong>
                <span>Review current requests</span>
              </button>

              <button type="button" className="quick-action-tile" onClick={() => navigate("/user/bookings")}>
                <strong>Cancel approved</strong>
                <span>Withdraw an approved slot</span>
              </button>
            </div>
          </div>

          <div className="card-box dashboard-table-card mt-3">
            <div className="section-heading mb-0">
              <p className="section-label">Recent activity</p>
              <h5>Latest bookings</h5>
            </div>

            <div className="mt-3">
              <BookingList
                bookings={recentBookings}
                refresh={() => {}}
                session={session}
                mode="NONE"
                label="Recent requests"
                title="Latest bookings"
                emptyTitle="No dashboard activity yet"
                emptyMessage="Go to the Bookings page to create your first booking request."
                className="dashboard-booking-list"
              />
            </div>
          </div>
        </div>

        <div className="col-xl-4">
          <div className="card-box quick-actions-card">
            <p className="section-label">Quick notes</p>
            <h5>Today highlights</h5>
            <ul className="quick-notes-list">
              <li>
                <span className="dot dot-green" />
                Keep pending requests below 10 for smooth same-day approvals.
              </li>
              <li>
                <span className="dot dot-blue" />
                Review rejected items to detect repeat resource conflicts.
              </li>
              <li>
                <span className="dot dot-amber" />
                Use the bookings page to submit, review, and manage your requests.
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

export default DashboardPage;import Header from "../components/Header";
import StatsCards from "../components/StatsCards";
import BookingList from "../components/BookingList";
import NotificationPanel from "../components/NotificationPanel";
import { useNavigate } from "react-router-dom";

function DashboardPage({ bookings, session }) {
  const navigate = useNavigate();
  const total = bookings.length;
  const approved = bookings.filter((booking) => booking.status === "APPROVED").length;
  const pending = bookings.filter((booking) => booking.status === "PENDING").length;
  const rejected = bookings.filter((booking) => booking.status === "REJECTED").length;
  const cancelled = bookings.filter((booking) => booking.status === "CANCELLED").length;

  const approvalRate = total === 0 ? 0 : Math.round((approved / total) * 100);
  const pendingRate = total === 0 ? 0 : Math.round((pending / total) * 100);
  const recentBookings = [...bookings].slice(-5).reverse();

  return (
    <div className="page-stack dashboard-page user-dashboard-page">
      <Header
        eyebrow="User area"
        roleLabel="User Portal"
        title="Your Booking Home"
        subtitle="Create requests, track approvals, and review your own booking history in one place."
        actionLabel="New request"
        onActionClick={() => navigate("/user/bookings")}
      />
      <StatsCards bookings={bookings} />

      <div className="row g-3 mt-1">
        <div className="col-xl-8">
          <div className="card-box dashboard-spotlight">
            <div className="dashboard-spotlight-top">
              <div>
                <p className="section-label">Your snapshot</p>
                <h4>Bookings stay organized and visible</h4>
                <p>
                  You have {total} total requests. Approval rate is {approvalRate}% and the pending
                  queue is {pendingRate}% of your requests.
                </p>
              </div>

              <div className="dashboard-pulse">
                <span>Status mix</span>
                <strong>{pending <= 5 ? "Calm" : pending <= 12 ? "Active" : "Busy"}</strong>
              </div>
            </div>

            <div className="dashboard-bars">
              <div className="dashboard-bar-row">
                <div className="dashboard-bar-label">
                  <span>Approved</span>
                  <strong>{approved}</strong>
                </div>
                <div className="dashboard-track">
                  <div className="dashboard-fill dashboard-fill-approved" style={{ width: `${total === 0 ? 0 : Math.max(8, Math.round((approved / total) * 100))}%` }} />
                </div>
              </div>

              <div className="dashboard-bar-row">
                <div className="dashboard-bar-label">
                  <span>Pending</span>
                  <strong>{pending}</strong>
                </div>
                <div className="dashboard-track">
                  <div className="dashboard-fill dashboard-fill-pending" style={{ width: `${total === 0 ? 0 : Math.max(8, Math.round((pending / total) * 100))}%` }} />
                </div>
              </div>

              <div className="dashboard-bar-row">
                <div className="dashboard-bar-label">
                  <span>Rejected + Cancelled</span>
                  <strong>{rejected + cancelled}</strong>
                </div>
                <div className="dashboard-track">
                  <div className="dashboard-fill dashboard-fill-rejected" style={{ width: `${total === 0 ? 0 : Math.max(8, Math.round(((rejected + cancelled) / total) * 100))}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="card-box quick-actions-card mt-3">
            <p className="section-label">Quick actions</p>
            <div className="quick-action-grid">
              <button type="button" className="quick-action-tile" onClick={() => navigate("/user/bookings")}>
                <strong>Create request</strong>
                <span>Open the booking form</span>
              </button>

              <button type="button" className="quick-action-tile" onClick={() => navigate("/user/bookings")}>
                <strong>View bookings</strong>
                <span>Review current requests</span>
              </button>

              <button type="button" className="quick-action-tile" onClick={() => navigate("/user/bookings")}>
                <strong>Cancel approved</strong>
                <span>Withdraw an approved slot</span>
              </button>
            </div>
          </div>
        </div>

        <div className="col-xl-4">
          <div className="card-box quick-actions-card">
            <p className="section-label">Quick notes</p>
            <h5>Today highlights</h5>
            <ul className="quick-notes-list">
              <li>
                <span className="dot dot-green" />
                Keep pending requests below 10 for smooth same-day approvals.
              </li>
              <li>
                <span className="dot dot-blue" />
                Review rejected items to detect repeat resource conflicts.
              </li>
              <li>
                <span className="dot dot-amber" />
                Use the bookings page to submit, review, and manage your requests.
              </li>
            </ul>
          </div>

          <div className="mt-3">
            <NotificationPanel session={session} />
          </div>
        </div>
      </div>

      <div className="card-box dashboard-table-card">
        <div className="section-heading mb-0">
          <p className="section-label">Recent activity</p>
          <h5>Latest bookings</h5>
        </div>

        <div className="table-responsive booking-table-wrap mt-3">
          <BookingList
            bookings={recentBookings}
            refresh={() => {}}
            session={session}
            mode="NONE"
            label="Recent requests"
            title="Latest bookings"
            emptyTitle="No dashboard activity yet"
            emptyMessage="Go to the Bookings page to create your first booking request."
            className="dashboard-booking-list"
          />
        </div>
      </div>

    </div>
  );
}

export default DashboardPage;
            <thead>
              <tr>
                <th>ID</th>
                <th>Resource</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan="4">
                    <div className="empty-state">
                      <h6>No dashboard activity yet</h6>
                      <p>Go to the Bookings page to create your first booking request.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.id}</td>
                    <td>{booking.resourceId}</td>
                    <td>{booking.date}</td>
                    <td>
                      <span className={`status-${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;