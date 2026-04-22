function Header({
  eyebrow = "Operations overview",
  title = "Booking Management Dashboard",
  subtitle = "Monitor requests, approve bookings, and keep resource use visible.",
  actionLabel = "Admin Panel",
  onActionClick,
  roleLabel = "Dashboard",
}) {
  return (
    <div className="page-header">
      <div>
        <p className="page-eyebrow">{eyebrow}</p>
        <div className="page-role-chip">{roleLabel}</div>
        <h3>{title}</h3>
        <p className="page-subtitle">{subtitle}</p>
      </div>

      <div className="page-actions">
        <div className="header-pill">
          <span className="header-pill-label">Today</span>
          <strong>Live activity</strong>
        </div>

        <button className="btn btn-dark header-button" onClick={onActionClick} type="button">
          {actionLabel}
        </button>
      </div>
    </div>
  );
}

export default Header;