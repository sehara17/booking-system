import React, { useCallback, useEffect, useState } from "react";
import NotificationService from "../services/NotificationService";
import { toast } from "react-toastify";

const NotificationPanel = ({ session }) => {
  const [notifications, setNotifications] = useState([]);
  const [loadError, setLoadError] = useState("");

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await NotificationService.getNotifications(session);
      setNotifications(Array.isArray(res.data) ? res.data : []);
      setLoadError("");
    } catch (error) {
      setNotifications([]);
      setLoadError(error?.response?.data?.message || "Unable to load notifications.");
    }
  }, [session]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markRead = async (id) => {
    try {
      await NotificationService.markRead(id, session);
      fetchNotifications();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to mark notification as read.");
    }
  };

  return (
    <div className="card-box notification-card">
      <div className="section-heading mb-2">
        <p className="section-label">Alerts</p>
        <h5>Notifications</h5>
      </div>

      {loadError && <p className="section-copy">{loadError}</p>}

      {notifications.length === 0 ? (
        <p className="section-copy">No new notifications.</p>
      ) : (
        notifications.slice(0, 5).map((n) => (
          <div key={n.id} className={`notification-item ${n.readStatus ? "is-read" : "is-unread"}`}>
            <p>{n.message}</p>
            {!n.readStatus && (
              <button className="btn btn-outline-dark btn-sm" onClick={() => markRead(n.id)}>
                Mark as Read
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationPanel;