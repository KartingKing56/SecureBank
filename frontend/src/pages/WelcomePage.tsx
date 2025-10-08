import React from "react";
import Welcome from "../components/Welcome/Welcome";
import "../css/WelcomePage/WelcomePage.css";

const WelcomePage: React.FC = () => {
  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
      <Welcome />
    </div>
  );
};

export default WelcomePage;
