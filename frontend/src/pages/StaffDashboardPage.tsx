import React, { useEffect, useMemo, useState } from "react";
import MainNavBar from "../components/Dashboard/MainNavBar";
import DashboardSidebar from "../components/Dashboard/DashboardSideBar";
import "../css/DashboardPage/DashboardPage.css";
import IntlQueue from "../components/Staff/IntlQueue";
import AdminEmployees from "../components/Staff/AdminEmployees";
import { getAccessToken, getRole, ensureCsrf } from "../lib/staffApi";

type StaffView = "intl" | "admin";

const StaffDashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<StaffView>("intl");
  const [role, setRole] = useState<"customer" | "employee" | "admin" | null>(null);

  useEffect(() => {
    setRole(getRole());
    ensureCsrf().catch(() => {});
  }, []);

  const canSeeAdmin = useMemo(() => role === "admin", [role]);

  const handleSelect = (option: string) => {
    if (option === "admin") setActiveView("admin");
    if (option === "transactions") setActiveView("intl");
    setSidebarOpen(false);
  };

  const token = getAccessToken();
  if (!token || (role !== "admin" && role !== "employee")) {
    return (
      <div className="dashboard-layout">
        <div className="dashboard-content" style={{ padding: "3rem" }}>
          <h2>Unauthorized</h2>
          <p>You must be an employee to access this portal.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <MainNavBar
        onProfileClick={() => setSidebarOpen(true)}
        onNavigate={handleSelect}
        onMenuClick={() => setSidebarOpen(true)}
      />

      <div className="dashboard-main">
        <DashboardSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSelect={handleSelect}
        />

        <div className="dashboard-content fade-in">
          {activeView === "intl" && <IntlQueue canBulkSubmit={role === "admin" || role === "employee"} />}
          {activeView === "admin" && (canSeeAdmin ? <AdminEmployees /> : <p>Admin only.</p>)}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboardPage;