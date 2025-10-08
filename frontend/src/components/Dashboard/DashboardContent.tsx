import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaExchangeAlt, FaHistory, FaChartLine } from "react-icons/fa";
import styles from "../../css/DashboardPage/DashboardContent.module.css";

interface DashboardContentProps {
  onMenuClick?: () => void; // 👈 this line is critical
}

const DashboardContent: React.FC<DashboardContentProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();

  const dashboardOptions = [
    {
      title: "Add Beneficiary",
      icon: <FaUserPlus size={40} className={styles.iconPrimary} />,
      route: "/add-beneficiary",
    },
    {
      title: "Create Transaction",
      icon: <FaExchangeAlt size={40} className={styles.iconSuccess} />,
      route: "/create-transaction",
    },
    {
      title: "Verify & Forward Payments",
      icon: <FaHistory size={40} className={styles.iconWarning} />,
      route: "/view-transactions",
    },
    {
      title: "Reports & Analytics",
      icon: <FaChartLine size={40} className={styles.iconInfo} />,
      route: "/analytics",
    },
  ];

  return (
    <div className={styles.dashboardWrapper}>
      {/* Hamburger Menu */}
      {onMenuClick && (
        <div className={styles.hamburgerMenu} onClick={onMenuClick}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}

      <div className={styles.cardGrid}>
        {dashboardOptions.map((option, index) => (
          <div
            key={index}
            className={`${styles.cardButton} shadow`}
            onClick={() => navigate(option.route)}
          >
            <div className={styles.cardInner}>
              {option.icon}
              <h5 className={styles.cardTitle}>{option.title}</h5>
            </div>
          </div>
        ))}
      </div>

      <div className={`${styles.infoBlock} shadow`}>
        <h4 className={styles.infoTitle}>International Payments Overview</h4>
        <p>
          From here, transactions are stored in a secure database and appear on the international
          payments portal. Employees can log in to:
        </p>
        <ul>
          <li>Check payer’s account and SWIFT code information</li>
          <li>Verify transactions in the “Verify & Forward Payments” section</li>
          <li>Submit payments securely to SWIFT</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardContent;
