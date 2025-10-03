import React from "react";
import Login from "../components/Login/Login";
import "../css/LoginPage/LoginPage.css";

const LoginPage: React.FC = () => {
  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Left side image */}
        <div className="col-md-6 d-none d-md-block p-0">
          <img
            src="/bank-hero.jpg"
            alt="Banking Visual"
            className="img-fluid h-100 w-100 object-fit-cover"
          />
        </div>

        {/* Right side login */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <Login />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
