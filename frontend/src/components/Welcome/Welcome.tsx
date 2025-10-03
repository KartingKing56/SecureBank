import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100 text-center">
      <img
        src="/logo.png"
        alt="Bank Logo"
        //style={{ width: "100px", height: "100px" }}
        className="mb-4"
      />
      <h1 className="mb-3">Welcome to Your Banking Portal</h1>
      <p className="mb-4">
        Securely manage your accounts, beneficiaries, and transactions.
      </p>

      <div className="d-flex gap-3">
        <button
          className="btn btn-primary px-4"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button
          className="btn btn-outline-primary px-4"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Welcome;
