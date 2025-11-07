import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserPlus,
  FaExchangeAlt,
  FaHistory,
  FaChartLine,
  FaUserTie,
} from "react-icons/fa";
import styles from "../../css/DashboardPage/DashboardContent.module.css";

interface DashboardContentProps {
  role: "admin" | "employee" | "customer";
  onMenuClick?: () => void;
  onNavigate?: (key: "staff" | "payments" | "reports") => void;
}

type Card = {
  key: string;
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
};

const DashboardContent: React.FC<DashboardContentProps> = ({
  role,
  onMenuClick,
  onNavigate,
}) => {
  const navigate = useNavigate();

  const staffGo = (tab: "staff" | "payments" | "reports") => {
    if (onNavigate) onNavigate(tab);
    else navigate("/staff");
  };

  let cards: Card[] = [];

  if (role === "admin") {
    cards = [
      {
        key: "add-staff",
        title: "Add Staff",
        icon: <FaUserTie size={40} className={styles.iconPrimary} />,
        onClick: () => staffGo("staff"),
      },
      {
        key: "payments",
        title: "Verify & Forward Payments",
        icon: <FaHistory size={40} className={styles.iconWarning} />,
        onClick: () => staffGo("payments"),
      },
      {
        key: "reports",
        title: "Reports & Analytics",
        icon: <FaChartLine size={40} className={styles.iconInfo} />,
        onClick: () => staffGo("reports"),
      },
    ];
  } else if (role === "employee") {
    cards = [
      {
        key: "payments",
        title: "Verify & Forward Payments",
        icon: <FaHistory size={40} className={styles.iconWarning} />,
        onClick: () => staffGo("payments"),
      },
      {
        key: "reports",
        title: "Reports & Analytics Coming Soon",
        icon: <FaChartLine size={40} className={styles.iconInfo} />,
        onClick: () => staffGo("reports"),
      },
    ];
  } else {
    cards = [
      {
        key: "add-beneficiary",
        title: "Add Beneficiary",
        icon: <FaUserPlus size={40} className={styles.iconPrimary} />,
        onClick: () => navigate("/add-beneficiary"),
      },
      {
        key: "create-tx",
        title: "Create Transaction",
        icon: <FaExchangeAlt size={40} className={styles.iconSuccess} />,
        onClick: () => navigate("/create-transaction"),
      },
    ];
  }

  return (
    <div className={styles.dashboardWrapper}>
      {onMenuClick && (
        <div className={styles.hamburgerMenu} onClick={onMenuClick}>
          <span></span><span></span><span></span>
        </div>
      )}

      <div className={styles.cardGrid}>
        {cards.map((c) => (
          <div key={c.key} className={`${styles.cardButton} shadow`} onClick={c.onClick}>
            <div className={styles.cardInner}>
              {c.icon}
              <h5 className={styles.cardTitle}>{c.title}</h5>
            </div>
          </div>
        ))}
      </div>

      {role === "customer" && (
        <div className="mt-3">
          {/* <RecentTransactions /> */}
        </div>
      )}

      {role !== "customer" && (
        <div className={`${styles.infoBlock} shadow`}>
          <h4 className={styles.infoTitle}>International Payments Overview</h4>
          <p>
            Transactions are stored in a secure database and appear on the international
            payments portal. Employees can:
          </p>
          <ul>
            <li>Check payer’s account and SWIFT code information</li>
            <li>Verify transactions in the Payments Queue</li>
            <li>Submit payments securely to SWIFT</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DashboardContent;
