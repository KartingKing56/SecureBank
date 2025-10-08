import React from "react";
import Register from "../components/Register/Register";
import "../css/RegisterPage/RegisterPage.css";
import registerHero from "../assets/register-hero.webp";

const RegisterPage: React.FC = () => {
  return (
    <div className="register-page-container d-flex align-items-center justify-content-center vh-100">
      <div className="register-card d-flex flex-md-row flex-column overflow-hidden shadow">
        {/* Left side image */}
        <div className="register-image d-none d-md-block">
          <img
            src={registerHero}
            alt="Register Visual"
            className="h-100 w-100 object-fit-cover"
          />
        </div>

        {/* Right side register form */}
        <div className="register-form position-relative d-flex align-items-center justify-content-center flex-fill">
          <i
            className="bi bi-gear-fill position-absolute top-0 end-0 m-3 text-primary"
            style={{ cursor: "pointer" }}
          ></i>
          <Register />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
