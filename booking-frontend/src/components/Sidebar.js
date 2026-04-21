import { FaHome, FaCalendar, FaChartBar } from "react-icons/fa";

function Sidebar() {
  return (
    <div className="sidebar">
      <h4>Smart Campus</h4>
      <hr />

      <div className="sidebar-item">
        <FaHome /> Dashboard
      </div>

      <div className="sidebar-item">
        <FaCalendar /> Bookings
      </div>

      <div className="sidebar-item">
        <FaChartBar /> Reports
      </div>
    </div>
  );
}

export default Sidebar;