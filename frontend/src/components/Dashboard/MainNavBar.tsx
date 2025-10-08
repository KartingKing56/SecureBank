import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { HiMenuAlt2 } from "react-icons/hi";
import styles from "../../css/DashboardPage/MainNavBar.module.css";

interface Props {
  onProfileClick: () => void;
  onNavigate: (view: string) => void;
  onMenuClick?: () => void;
}

const MainNavBar: React.FC<Props> = ({ onProfileClick, onNavigate, onMenuClick }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here (e.g., clear tokens, redirect)
    navigate("/login");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.leftGroup}>
        {/* Hamburger menu for sidebar */}
        <button
          className={styles.menuButton}
          onClick={onMenuClick}
          aria-label="Open sidebar menu"
        >
          <HiMenuAlt2 size={24} />
        </button>

        <div
          className={styles.brandGroup}
          onClick={() => onNavigate("default")}
        >
          <img src="/logo.png" alt="App Logo" className={styles.logo} />
          <span className={styles.brandTitle}>MyBank</span>
        </div>
      </div>

      <div className={styles.rightGroup}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
        <FaUserCircle
          size={30}
          className={styles.profileIcon}
          onClick={onProfileClick}
        />
      </div>
    </nav>
  );
};

export default MainNavBar;
