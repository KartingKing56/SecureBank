import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import styles from "../../css/DashboardPage/MainNavBar.module.css";

interface Props {
  onProfileClick: () => void;
  onNavigate: (View: string) => void;
}

const MainNavBar: React.FC<Props> = ({ onProfileClick, onNavigate }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here (e.g., clear tokens, redirect)
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 py-2 shadow-sm">
      <div
        className={`d-flex align-items-center gap-2 ${styles.brandGroup}`}
        onClick={() => onNavigate("default")}
      >
        <img src="/logo.png" alt="App Logo" className={styles.logo} />
        <span className="navbar-brand mb-0 h1">MyBank</span>
        <span className="nav-link">Home</span>
      </div>

      <div className="ms-auto d-flex align-items-center gap-3">
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
        <FaUserCircle
          size={28}
          className={styles.profileIcon}
          onClick={onProfileClick}
        />
      </div>
    </nav>
  );
};

export default MainNavBar;
