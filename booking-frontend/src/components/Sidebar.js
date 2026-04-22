import {
  FaHome,
  FaCalendarAlt,
  FaChartBar,
  FaClipboardCheck,
  FaBell,
  FaLayerGroup,
  FaRegSun,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

const roleMenus = {
  USER: [
    { to: "dashboard", icon: FaHome, label: "Dashboard" },
    { to: "bookings", icon: FaCalendarAlt, label: "My Bookings" },
  ],
  ADMIN: [
    { to: "dashboard", icon: FaHome, label: "Dashboard" },
    { to: "bookings", icon: FaCalendarAlt, label: "All Bookings" },
    { to: "approvals", icon: FaClipboardCheck, label: "Approvals" },
    { to: "reports", icon: FaChartBar, label: "Reports" },
    { to: "notifications", icon: FaBell, label: "Notifications" },
  ],
};

function Sidebar({ role = "USER", basePath = "/user" }) {
  const menuItems = roleMenus[role] || roleMenus.USER;

  return (
    <aside className="sidebar-panel">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <FaLayerGroup />
        </div>

        <div>
          <p className="sidebar-kicker">Booking Suite</p>
          <h4>{role === "ADMIN" ? "Admin Console" : "User Portal"}</h4>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={`${basePath}/${item.to}`}
              className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
            >
              <span className="sidebar-icon">
                <Icon />
              </span>
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-metric">
          <span className="sidebar-metric-label">Workspace</span>
          <strong>{role === "ADMIN" ? "Admin today" : "User today"}</strong>
        </div>

        <div className="sidebar-note">
          <FaRegSun />
          <span>{role === "ADMIN" ? "Review and control bookings." : "Create and track your requests."}</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;