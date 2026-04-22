import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

function ReportsPage({ bookings }) {
  const navigate = useNavigate();
  const approvedCount = bookings.filter((booking) => booking.status === "APPROVED").length;
  const pendingCount = bookings.filter((booking) => booking.status === "PENDING").length;
  const rejectedCount = bookings.filter((booking) => booking.status === "REJECTED").length;
  const approvalRate =
    bookings.length === 0 ? "0%" : `${Math.round((approvedCount / bookings.length) * 100)}%`;

  return (
    <div className="page-stack reports-page admin-reports-page">
      <Header
        eyebrow="Admin reports"
        roleLabel="Admin Console"
        title="Usage Summary"
        subtitle="Track volume, approval performance, and workload from the admin side only."
        actionLabel="Open approvals"
        onActionClick={() => navigate("/admin/approvals")}
      />

      <div className="row g-3 mt-1">
        <div className="col-lg-3 col-md-6">
          <div className="card-box report-card">
            <span>Total bookings</span>
            <strong>{bookings.length}</strong>
            <p>All requests currently loaded in the dashboard.</p>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card-box report-card">
            <span>Approval rate</span>
            <strong>{approvalRate}</strong>
            <p>Approved requests as a share of all bookings.</p>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card-box report-card">
            <span>Pending queue</span>
            <strong>{pendingCount}</strong>
            <p>Requests waiting for review or next action.</p>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card-box report-card">
            <span>Rejected</span>
            <strong>{rejectedCount}</strong>
            <p>Requests declined due to conflicts or constraints.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;