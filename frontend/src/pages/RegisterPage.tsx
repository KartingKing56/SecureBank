import React from "react";
import Register from "../components/Register/Register";
import "../css/RegisterPage/RegisterPage.css";

const RegisterPage: React.FC = () => {
  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Right side image */}
        <div className="col-md-6 d-none d-md-block p-0">
          <img
            src="/register-hero.jpg"
            alt="Registration Visual"
            className="img-fluid h-100 w-100 object-fit-cover"
          />
        </div>

        {/* Left side register form */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <Register />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
