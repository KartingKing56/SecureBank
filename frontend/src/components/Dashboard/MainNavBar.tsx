import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

interface Props {
  onProfileClick: () => void;
}

const MainNavBar: React.FC<Props> = ({ onProfileClick }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here (e.g., clear tokens, redirect)
    navigate("/login");
  };

  const goHome = () => {
    navigate("/dashboard");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 py-2 shadow-sm">
      <div
        className="d-flex align-items-center gap-2"
        onClick={goHome}
        //style={{ cursor: "pointer" }}
      >
        <img
          src="/logo.png"
          alt="App Logo"
          //style={{ width: "40px", height: "40px" }}
        />
        <span className="navbar-brand mb-0 h1">MyBank</span>
        <span className="nav-link">Home</span>
      </div>

      <div className="ms-auto d-flex align-items-center gap-3">
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
        <FaUserCircle
          size={28}
          style={{ cursor: "pointer" }}
          onClick={onProfileClick}
        />
      </div>
    </nav>
  );
};

export default MainNavBar;
