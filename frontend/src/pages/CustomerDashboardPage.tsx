import React, { useState } from "react";
import MainNavBar from "../components/Dashboard/MainNavBar";
import DashboardContent from "../components/Dashboard/DashboardContent";
import DashboardSidebar from "../components/Dashboard/DashboardSideBar";
import "../css/DashboardPage/DashboardPage.css";

type CustomerView = "default" | "user" | "beneficiaries" | "card" | "transactions";

const CustomerDashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<CustomerView>("default");

  const handleSelect = (option: string) => {
    const allowed: CustomerView[] = ["default", "user", "beneficiaries", "card", "transactions"];
    setActiveView(allowed.includes(option as CustomerView) ? (option as CustomerView) : "default");
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
          role="customer"
        />

        <div className="dashboard-content fade-in">
          {activeView === "default" && (
            <DashboardContent role="customer" onMenuClick={() => setSidebarOpen(true)} />
          )}
          {activeView === "user" && <p>Showing user information...</p>}
          {activeView === "beneficiaries" && <p>Showing beneficiary list...</p>}
          {activeView === "card" && <p>Showing card details...</p>}
          {activeView === "transactions" && <p>Showing your recent transactions...</p>}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboardPage;