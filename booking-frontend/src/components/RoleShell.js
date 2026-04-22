import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function RoleShell({ role, session, onEmailChange, onSwitchRole }) {
  const navigate = useNavigate();

  if (session.role !== role) {
    return <Navigate to={`/${session.role.toLowerCase()}/dashboard`} replace />;
  }

  return (
    <div className="app-wrapper">
      <Sidebar role={role} basePath={`/${role.toLowerCase()}`} />

      <main className="main-area">
        <div className="card-box session-toolbar mb-3">
          <div className="session-field">
            <label>Email</label>
            <input
              className="form-control"
              value={session.email}
              onChange={(e) => onEmailChange(e.target.value)}
            />
          </div>

          <div className="session-field">
            <label>Current area</label>
            <div className={`role-pill ${role === "ADMIN" ? "admin" : "user"}`}>
              {role === "ADMIN" ? "Admin" : "User"}
            </div>
          </div>

          <button
            type="button"
            className="btn btn-outline-dark switch-role-btn"
            onClick={() => {
              const nextRole = role === "ADMIN" ? "USER" : "ADMIN";
              onSwitchRole(nextRole);
              navigate(`/${nextRole.toLowerCase()}/dashboard`);
            }}
          >
            Switch to {role === "ADMIN" ? "User" : "Admin"}
          </button>
        </div>

        <Outlet />
      </main>
    </div>
  );
}

export default RoleShell;