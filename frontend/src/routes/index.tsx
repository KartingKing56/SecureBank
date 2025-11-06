import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AddBeneficiaryPage from "../pages/AddBeneficiaryPage";
import WelcomePage from "../pages/WelcomePage";
import DashboardPage from "../pages/DashboardPage";
import TransactionPage from "../pages/TransactionPage";
import ProtectedRoute from "./ProtectedRoute";
import StaffDashboardPage from "../pages/StaffDashboardPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Customer pages */}
      <Route path="/add-beneficiary" element={<ProtectedRoute><AddBeneficiaryPage /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/create-transaction" element={<ProtectedRoute><TransactionPage /></ProtectedRoute>} />

      {/* Staff Pages */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute roles={["employee", "admin"]}>
            <StaffDashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
