import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AddBeneficiaryPage from "../pages/AddBeneficiaryPage";
import WelcomePage from "../pages/WelcomePage";
import DashboardPage from "../pages/DashboardPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/add-beneficiary" element={<AddBeneficiaryPage />} />
      <Route path="/" element={<WelcomePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      {/* Add more routes here as needed */}
    </Routes>
  );
};

export default AppRoutes;
