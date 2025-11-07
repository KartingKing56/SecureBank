import React, { useState } from "react";
import MainNavBar from "../components/Dashboard/MainNavBar";
import DashboardSidebar from "../components/Dashboard/DashboardSideBar";
import "../css/DashboardPage/DashboardPage.css";
import IntlQueue from "../components/Staff/IntlQueue";

type EmployeeView = "dashboard" | "user" | "customers" | "payments" | "reports";

const EmployeeDashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<EmployeeView>("payments");

  const handleSelect = (option: string) => {
    const allowed: EmployeeView[] = ["dashboard", "user", "customers", "payments", "reports"];
    setActiveView(allowed.includes(option as EmployeeView) ? (option as EmployeeView) : "payments");
    setSidebarOpen(false);
  };

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
          role="employee"
        />
        <div className="dashboard-content fade-in">
          {activeView === "dashboard" && <p>Employee dashboard overview</p>}
          {activeView === "user" && <p>Staff user info/settings</p>}
          {activeView === "customers" && <p>Customers list (employee view)</p>}
          {activeView === "payments" && <IntlQueue canBulkSubmit={true} />}
          {activeView === "reports" && <p>Reports & Analytics</p>}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboardPage;