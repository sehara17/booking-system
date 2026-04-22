import React, { useState } from "react";
import BookingForm from "../components/BookingForm";
import BookingList from "../components/BookingList";
import NotificationPanel from "../components/NotificationPanel";

const Dashboard = () => {
  const [refreshFlag, setRefreshFlag] = useState(false);

  const refresh = () => setRefreshFlag(!refreshFlag);

  return (
    <div className="container">
      <h1>Smart Campus Dashboard</h1>

      <BookingForm refresh={refresh} />
      <BookingList refreshFlag={refreshFlag} />
      <NotificationPanel />
    </div>
  );
};

export default Dashboard;