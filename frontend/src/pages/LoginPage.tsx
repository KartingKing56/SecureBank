import React from "react";
import Login from "../components/Login/Login";
import "../css/LoginPage/LoginPage.css";
import bankImage from "../assets/bank.png";

const LoginPage: React.FC = () => {
  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        {/* Left side image */}
        <div className="login-image-container">
          <img src={bankImage} alt="Banking Visual" className="login-hero-image" />
          <div className="image-overlay"></div>
        </div>

        {/* Right side login */}
        <div className="login-form-container">
          <Login />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
