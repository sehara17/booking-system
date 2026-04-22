import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";

import RoleLandingPage from "./pages/RoleLandingPage";
import RoleShell from "./components/RoleShell";
import DashboardPage from "./pages/DashboardPage";
import BookingsPage from "./pages/BookingsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminBookingsPage from "./pages/AdminBookingsPage";
import ApprovalsPage from "./pages/ApprovalsPage";
import ReportsPage from "./pages/ReportsPage";
import BookingService from "./services/BookingService";
import NotificationPanel from "./components/NotificationPanel";
import { ToastContainer } from "react-toastify";

function NotificationsPage({ session }) {
  return (
    <div className="page-stack notifications-page">
      <div className="card-box notification-page-card">
        <div className="section-heading mb-2">
          <p className="section-label">Notifications</p>
          <h5>{session.role === "ADMIN" ? "Admin alerts" : "My alerts"}</h5>
        </div>

        <NotificationPanel session={session} />
      </div>
    </div>
  );
}

function AppRoutes({ session, bookings, loadBookings, updateSession, loadSessionRole }) {
  const navigate = useNavigate();

  const chooseRole = (role) => {
    loadSessionRole(role);
    navigate(`/${role.toLowerCase()}/dashboard`);
  };

  const switchRole = (role) => {
    loadSessionRole(role);
    navigate(`/${role.toLowerCase()}/dashboard`);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <RoleLandingPage
            session={session}
            onEmailChange={(email) => updateSession({ ...session, email })}
            onChooseRole={chooseRole}
          />
        }
      />

      <Route
        path="/user"
        element={
          <RoleShell
            role="USER"
            session={session}
            onEmailChange={(email) => updateSession({ ...session, email })}
            onSwitchRole={switchRole}
          />
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage bookings={bookings} session={session} />} />
        <Route
          path="bookings"
          element={<BookingsPage bookings={bookings} onRefresh={loadBookings} session={session} />}
        />
        <Route path="notifications" element={<NotificationsPage session={session} />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route
        path="/admin"
        element={
          <RoleShell
            role="ADMIN"
            session={session}
            onEmailChange={(email) => updateSession({ ...session, email })}
            onSwitchRole={switchRole}
          />
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage bookings={bookings} session={session} />} />
        <Route path="bookings" element={<AdminBookingsPage bookings={bookings} session={session} />} />
        <Route
          path="approvals"
          element={<ApprovalsPage bookings={bookings} onRefresh={loadBookings} session={session} />}
        />
        <Route path="reports" element={<ReportsPage bookings={bookings} />} />
        <Route path="notifications" element={<NotificationsPage session={session} />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  const [bookings, setBookings] = useState([]);
  const [session, setSession] = useState(() => {
    const savedEmail = localStorage.getItem("booking.userEmail") || "user@booking.local";
    const savedRole = localStorage.getItem("booking.userRole") || "USER";
    return { email: savedEmail, role: savedRole };
  });

  const loadBookings = useCallback(async () => {
    try {
      const res =
        session.role === "ADMIN"
          ? await BookingService.getAll(session)
          : await BookingService.getMine(session);
      setBookings(res.data);
    } catch (e) {
      setBookings([]);
    }
  }, [session]);

  const updateSession = (nextSession) => {
    setSession(nextSession);
    localStorage.setItem("booking.userEmail", nextSession.email);
    localStorage.setItem("booking.userRole", nextSession.role);
  };

  const loadSessionRole = (role) => {
    const nextSession = { ...session, role };
    updateSession(nextSession);
    return nextSession;
  };

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  return (
    <BrowserRouter>
      <AppRoutes
        session={session}
        bookings={bookings}
        loadBookings={loadBookings}
        updateSession={updateSession}
        loadSessionRole={loadSessionRole}
      />
      <ToastContainer
        position="top-right"
        autoClose={2200}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </BrowserRouter>
  );
}

export default App;