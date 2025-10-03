import React from "react";
import { useState } from "react";
import MainNavBar from "../components/Dashboard/MainNavBar";
import DashboardContent from "../components/Dashboard/DashboardContent";
import DashboardSidebar from "../components/Dashboard/DashboardSideBar";
import "../css/DashboardPage/DashboardPage.css";

const DashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<
    "default" | "user" | "beneficiaries" | "card"
  >("default");

  const handleSelect = (option: string) => {
    setActiveView(option as typeof activeView);
    setSidebarOpen(false);
  };

  return (
    <div className="container-fluid p-0 vh-100 d-flex flex-column position-relative">
      <MainNavBar onProfileClick={() => setSidebarOpen(true)} />
      <div className="flex-grow-1 overflow-auto px-4">
        <h2 className="mt-4">Welcome to your dashboard</h2>

        {activeView === "default" && <DashboardContent />}
        {activeView === "user" && <p>Showing user information...</p>}
        {activeView === "beneficiaries" && <p>Showing beneficiary list...</p>}
        {activeView === "card" && <p>Showing card details...</p>}
      </div>

      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelect={handleSelect}
      />
    </div>
  );
};

export default DashboardPage;
