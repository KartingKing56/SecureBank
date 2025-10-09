import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AddBeneficiaryPage from "../pages/AddBeneficiaryPage";
import WelcomePage from "../pages/WelcomePage";
import DashboardPage from "../pages/DashboardPage";
import TransactionPage from "../pages/TransactionPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/add-beneficiary" element={<AddBeneficiaryPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/create-transaction" element={<TransactionPage />} />
      {/* Add more routes here if needed */}
    </Routes>
  );
};

export default AppRoutes;
