import React, { useState } from "react";
import MainNavBar from "../components/Dashboard/MainNavBar";
import DashboardContent from "../components/Dashboard/DashboardContent";
import DashboardSidebar from "../components/Dashboard/DashboardSideBar";
import "../css/DashboardPage/DashboardPage.css";

const DashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<
    "default" | "user" | "beneficiaries" | "card" | "transactions" | "analytics"
  >("default");

  const handleSelect = (option: string) => {
    setActiveView(option as typeof activeView);
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
        />

        <div className="dashboard-content fade-in">
          {activeView === "default" && <DashboardContent onMenuClick={() => setSidebarOpen(true)} />}
          {activeView === "user" && <p>Showing user information...</p>}
          {activeView === "beneficiaries" && <p>Showing beneficiary list...</p>}
          {activeView === "card" && <p>Showing card details...</p>}
          {activeView === "transactions" && <p>Showing transactions for SWIFT verification...</p>}
          {activeView === "analytics" && <p>Showing reports & analytics...</p>}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
