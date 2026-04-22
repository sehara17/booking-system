import { FaCalendarCheck, FaClock, FaTimesCircle } from "react-icons/fa";

function StatsCards({ bookings }) {
  const pending = bookings.filter(b => b.status === "PENDING").length;
  const approved = bookings.filter(b => b.status === "APPROVED").length;
  const rejected = bookings.filter(b => b.status === "REJECTED").length;

  return (
    <div className="row mt-3">

      <div className="col-md-4">
        <div className="card-box stat-card stat-card-pending">
          <div className="stat-icon"><FaClock /></div>
          <div className="stat-copy">
            <h5>Pending</h5>
            <h2>{pending}</h2>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card-box stat-card stat-card-approved">
          <div className="stat-icon"><FaCalendarCheck /></div>
          <div className="stat-copy">
            <h5>Approved</h5>
            <h2>{approved}</h2>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card-box stat-card stat-card-rejected">
          <div className="stat-icon"><FaTimesCircle /></div>
          <div className="stat-copy">
            <h5>Rejected</h5>
            <h2>{rejected}</h2>
          </div>
        </div>
      </div>

    </div>
  );
}

export default StatsCards;