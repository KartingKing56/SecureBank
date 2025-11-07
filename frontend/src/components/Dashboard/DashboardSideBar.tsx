import React, { useEffect, useMemo } from "react";
import {
  FaTachometerAlt,
  FaUser,
  FaUsers,
  FaUserTie,
  FaCreditCard,
  FaHistory,
  FaChartLine,
} from "react-icons/fa";
import styles from "../../css/DashboardPage/DashboardSideBar.module.css";

type Role = "admin" | "employee" | "customer";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (option: string) => void;
  role: Role;
}

type MenuItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
};

const DashboardSidebar: React.FC<Props> = ({ isOpen, onClose, onSelect, role }) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const items: MenuItem[] = useMemo(() => {
    if (role === "admin") {
      return [
        { key: "dashboard", label: "Dashboard", icon: <FaTachometerAlt className={styles.icon} />},
        { key: "payments", label: "Payments Queue", icon: <FaHistory className={styles.icon} /> },
        { key: "staff", label: "Staff Users", icon: <FaUserTie className={styles.icon} /> },
        { key: "customers", label: "Customers", icon: <FaUsers className={styles.icon} /> },
        { key: "reports", label: "Reports", icon: <FaChartLine className={styles.icon} /> },
      ];
    }
    if (role === "employee") {
      return [
        { key: "dashboard", label: "Dashboard", icon: <FaTachometerAlt className={styles.icon} /> },
        { key: "user", label: "User Info", icon: <FaUser className={styles.icon} /> },
        { key: "customers", label: "Customer List", icon: <FaUsers className={styles.icon} /> },
        { key: "payments", label: "Payments Queue", icon: <FaHistory className={styles.icon} /> },
        { key: "reports", label: "Reports", icon: <FaChartLine className={styles.icon} /> },
      ];
    }
    return [
      { key: "dashboard", label: "Dashboard", icon: <FaTachometerAlt className={styles.icon} /> },
      { key: "user", label: "User Info", icon: <FaUser className={styles.icon} /> },
      { key: "beneficiaries", label: "Beneficiaries", icon: <FaUsers className={styles.icon} /> },
      { key: "card", label: "Card Details", icon: <FaCreditCard className={styles.icon} /> },
      { key: "transactions", label: "Transactions", icon: <FaHistory className={styles.icon} /> },
    ];
  }, [role]);

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <h5>{role === "admin" ? "Admin Panel" : role === "employee" ? "Staff Panel" : "Menu"}</h5>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close sidebar">✕</button>
        </div>

        <ul className={styles.sidebarList}>
          {items.map((it) => (
            <li key={it.key} onClick={() => { onSelect(it.key); onClose(); }}>
              {it.icon}
              <span>{it.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default DashboardSidebar;
