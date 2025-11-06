import React, { useEffect } from "react";
import {
  FaTachometerAlt,
  FaUser,
  FaUsers,
  FaCreditCard,
  FaHistory,
  FaChartLine,
} from "react-icons/fa";
import styles from "../../css/DashboardPage/DashboardSideBar.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (option: string) => void;
}

const DashboardSidebar: React.FC<Props> = ({ isOpen, onClose, onSelect }) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className={styles.overlay} onClick={onClose}></div>}

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <h5>Admin Panel</h5>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        <ul className={styles.sidebarList}>
          <li onClick={() => onSelect("default")}>
            <FaTachometerAlt className={styles.icon} />
            <span>Dashboard</span>
          </li>
          <li onClick={() => onSelect("user")}>
            <FaUser className={styles.icon} />
            <span>User Info</span>
          </li>
          <li onClick={() => onSelect("beneficiaries")}>
            <FaUsers className={styles.icon} />
            <span>Beneficiaries</span>
          </li>
          <li onClick={() => onSelect("card")}>
            <FaCreditCard className={styles.icon} />
            <span>Card Details</span>
          </li>
          <li onClick={() => onSelect("transactions")}>
            <FaHistory className={styles.icon} />
            <span>Transactions</span>
          </li>
          <li onClick={() => onSelect("analytics")}>
            <FaChartLine className={styles.icon} />
            <span>Reports</span>
          </li>
        </ul>
      </div>
    </>
  );
};

export default DashboardSidebar;
