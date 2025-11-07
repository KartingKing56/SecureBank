import type { ReactElement, ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AddBeneficiaryPage from "../pages/AddBeneficiaryPage";
import WelcomePage from "../pages/WelcomePage";
import TransactionPage from "../pages/TransactionPage";
import ProtectedRoute from "./ProtectedRoute";
import CustomerDashboardPage from "../pages/CustomerDashboardPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import EmployeeDashboardPage from "../pages/EmployeeDashboardPage";

type Role = "customer" | "employee" | "admin";

interface RoleRouteProps {
  roles: Role[];
  children: ReactElement;
}

const RoleRoute = ({ roles, children }: RoleRouteProps) => {
  const role = localStorage.getItem("role") as Role | null;
  if (!role || !roles.includes(role)) return <Navigate to="/login" replace />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Customer Pages */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <RoleRoute roles={["customer"]}>
              <CustomerDashboardPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/add-beneficiary"
        element={
          <ProtectedRoute>
            <RoleRoute roles={["customer"]}>
              <AddBeneficiaryPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/create-transaction"
        element={
          <ProtectedRoute>
            <RoleRoute roles={["customer"]}>
              <TransactionPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Employee Pages */}
      <Route 
        path="/staff"
        element={
          <ProtectedRoute>
            <RoleRoute roles={["employee"]}>
              <EmployeeDashboardPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Admin Pages */}
      <Route 
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleRoute roles={["admin"]}>
              <AdminDashboardPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
