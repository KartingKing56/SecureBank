import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AddBeneficiaryPage from "../pages/AddBeneficiaryPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/add-beneficiary" element={<AddBeneficiaryPage />} />
      {/* Add more routes here as needed */}
    </Routes>
  );
};

export default AppRoutes;
