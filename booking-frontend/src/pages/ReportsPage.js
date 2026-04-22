import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function ReportsPage({ bookings }) {
  const navigate = useNavigate();
  const approvedCount = bookings.filter((booking) => booking.status === "APPROVED").length;
  const pendingCount = bookings.filter((booking) => booking.status === "PENDING").length;
  const rejectedCount = bookings.filter((booking) => booking.status === "REJECTED").length;
  const cancelledCount = bookings.filter((booking) => booking.status === "CANCELLED").length;
  const approvalRate =
    bookings.length === 0 ? "0%" : `${Math.round((approvedCount / bookings.length) * 100)}%`;

  const statusData = [
    { name: "Approved", value: approvedCount, color: "#1e8f58" },
    { name: "Pending", value: pendingCount, color: "#c16f0f" },
    { name: "Rejected", value: rejectedCount, color: "#b63d2d" },
    { name: "Cancelled", value: cancelledCount, color: "#2f7dc2" },
  ];

  const monthlyMap = bookings.reduce((map, booking) => {
    const date = new Date(booking.startTime || booking.date || Date.now());
    const key = Number.isNaN(date.getTime())
      ? "Unknown"
      : date.toLocaleString("en-US", { month: "short" });
    map[key] = (map[key] || 0) + 1;
    return map;
  }, {});

  const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyData = monthOrder
    .filter((month) => monthlyMap[month])
    .map((month) => ({ month, bookings: monthlyMap[month] }));

  const exportPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Booking System Report", 14, 16);
    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 24);

    autoTable(doc, {
      startY: 30,
      head: [["Metric", "Value"]],
      body: [
        ["Total bookings", `${bookings.length}`],
        ["Approved", `${approvedCount}`],
        ["Pending", `${pendingCount}`],
        ["Rejected", `${rejectedCount}`],
        ["Cancelled", `${cancelledCount}`],
        ["Approval rate", approvalRate],
      ],
    });

    const rows = bookings.slice(0, 30).map((booking) => [
      booking.userEmail || "-",
      booking.resourceName || booking.resourceId || "-",
      booking.status || "-",
      booking.startTime ? new Date(booking.startTime).toLocaleString() : "-",
      booking.endTime ? new Date(booking.endTime).toLocaleString() : "-",
    ]);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["User", "Resource", "Status", "Start", "End"]],
      body: rows.length ? rows : [["-", "-", "-", "-", "-"]],
      styles: { fontSize: 9 },
      headStyles: { fillColor: [21, 49, 86] },
    });

    doc.save("booking-report.pdf");
  };

  return (
    <div className="page-stack reports-page admin-reports-page">
      <Header
        eyebrow="Admin reports"
        roleLabel="Admin Console"
        title="Usage Summary"
        subtitle="Track volume, approval performance, and workload from the admin side only."
        actionLabel="Export PDF"
        onActionClick={exportPdf}
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

      <div className="row g-3 mt-1">
        <div className="col-xl-7">
          <div className="card-box chart-card">
            <div className="section-heading">
              <p className="section-label">Trend</p>
              <h5>Bookings by month</h5>
            </div>
            <div className="chart-box">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyData.length ? monthlyData : [{ month: "N/A", bookings: 0 }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d7e1ec" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bookings" fill="#2f7dc2" radius={[6, 6, 0, 0]} name="Bookings" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-xl-5">
          <div className="card-box chart-card">
            <div className="section-heading">
              <p className="section-label">Distribution</p>
              <h5>Status mix</h5>
            </div>
            <div className="chart-box">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    label
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="card-box mt-2">
        <button type="button" className="btn btn-outline-dark" onClick={() => navigate("/admin/approvals")}>
          Open approvals
        </button>
      </div>
    </div>
  );
}

export default ReportsPage;