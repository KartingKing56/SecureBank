import React, { useState } from "react";
import MainNavBar from "../components/Dashboard/MainNavBar";
import DashboardSidebar from "../components/Dashboard/DashboardSideBar";
import "../css/DashboardPage/DashboardPage.css";
import { FaUsers, FaHistory, FaChartLine } from "react-icons/fa";
import IntlQueue from "../components/Staff/IntlQueue";
import EmployeeCustomers from "../components/Staff/EmployeeCustomers";

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
          {/* Quick actions */}
          <div className="row g-3 mb-3">
            <div className="col-12 col-sm-6 col-lg-4">
              <button className="btn w-100 btn-light p-3 shadow-sm d-flex align-items-center gap-2"
                      onClick={() => setActiveView("customers")}>
                <FaUsers /> Customers
              </button>
            </div>
            <div className="col-12 col-sm-6 col-lg-4">
              <button className="btn w-100 btn-light p-3 shadow-sm d-flex align-items-center gap-2"
                      onClick={() => setActiveView("payments")}>
                <FaHistory /> Payments Queue
              </button>
            </div>
            <div className="col-12 col-sm-6 col-lg-4">
              <button className="btn w-100 btn-light p-3 shadow-sm d-flex align-items-center gap-2"
                      onClick={() => setActiveView("reports")}>
                <FaChartLine /> Reports
              </button>
            </div>
          </div>

          {activeView === "dashboard" && <p>Employee dashboard overview</p>}
          {activeView === "user" && <p>Staff user info/settings</p>}
          {activeView === "customers" && <EmployeeCustomers />}
          {activeView === "payments" && <IntlQueue canBulkSubmit={true} />}
          {activeView === "reports" && <p>Reports &amp; Analytics</p>}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboardPage;
