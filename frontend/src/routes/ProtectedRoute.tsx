import React from "react";
import { Navigate, useLocation } from "react-router-dom";

type Role = "customer" | "employee" | "admin";

type Props = {
  children: React.ReactElement;
  roles?: Role[];
};

function getAccessToken(): string | null {
  return localStorage.getItem("accessToken");
}

function getRole(): Role | null {
  const raw = localStorage.getItem("role");
  return raw === "customer" || raw === "employee" || raw === "admin" ? raw : null;
}

const ProtectedRoute: React.FC<Props> = ({ children, roles }) => {
  const location = useLocation();
  const token = getAccessToken();
  const role = getRole();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && (!role || !roles.includes(role))) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
