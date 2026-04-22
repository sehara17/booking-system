import { FaUser, FaUserShield } from "react-icons/fa";

function RoleLandingPage({ session, onEmailChange, onChooseRole }) {
  return (
    <div className="role-landing">
      <div className="role-landing-hero">
        <p className="section-label">Booking Suite</p>
        <h1>Choose your workspace</h1>
        <p>
          User and admin work in separate spaces. Pick the area you need and continue with your
          booking workflow.
        </p>

        <div className="landing-email-card">
          <label>Your email</label>
          <input
            className="form-control form-control-lg"
            value={session.email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="name@school.edu"
          />
        </div>
      </div>

      <div className="role-choice-grid">
        <button type="button" className="role-choice-card user-card" onClick={() => onChooseRole("USER")}>
          <div className="role-choice-icon">
            <FaUser />
          </div>
          <span className="choice-tag">User side</span>
          <h3>Create and manage requests</h3>
          <p>Submit bookings, view your own bookings, and cancel approved requests.</p>
        </button>

        <button type="button" className="role-choice-card admin-card" onClick={() => onChooseRole("ADMIN")}>
          <div className="role-choice-icon">
            <FaUserShield />
          </div>
          <span className="choice-tag">Admin side</span>
          <h3>Review and approve bookings</h3>
          <p>See all bookings, approve or reject requests, and track reports.</p>
        </button>
      </div>
    </div>
  );
}

export default RoleLandingPage;