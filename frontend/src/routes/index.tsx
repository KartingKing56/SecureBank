import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AddBeneficiaryPage from "../pages/AddBeneficiaryPage";
import WelcomePage from "../pages/WelcomePage";
import DashboardPage from "../pages/DashboardPage";
import TransactionPage from "../pages/TransactionPage";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/add-beneficiary" element={<ProtectedRoute><AddBeneficiaryPage /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/create-transaction" element={<ProtectedRoute><TransactionPage /></ProtectedRoute>} />
    </Routes>
  );
};

export default AppRoutes;
