import React, { useState } from "react";
import MainNavBar from "../components/Dashboard/MainNavBar";
import DashboardContent from "../components/Dashboard/DashboardContent";
import DashboardSidebar from "../components/Dashboard/DashboardSideBar";
import "../css/DashboardPage/DashboardPage.css";
import CustomerTransactions from "../components/Customer/CustomerTransactions";
import CustomerBeneficiaries from "../components/Customer/CustomerBeneficiaries";

type CustomerView = "dashboard" | "user" | "beneficiaries" | "card" | "transactions";

const CustomerDashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<CustomerView>("dashboard");

  const handleSelect = (option: string) => {
    const allowed: CustomerView[] = ["dashboard", "user", "beneficiaries", "card", "transactions"];
    setActiveView(allowed.includes(option as CustomerView) ? (option as CustomerView) : "dashboard");
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
          {activeView === "dashboard" && (
            <DashboardContent role="customer" onMenuClick={() => setSidebarOpen(true)} />
          )}
          {activeView === "user" && <p>Showing user information…</p>}
          {activeView === "beneficiaries" && <CustomerBeneficiaries />}
          {activeView === "card" && <p>Showing card details…</p>}
          {activeView === "transactions" && <CustomerTransactions />}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboardPage;
