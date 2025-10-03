import React from "react";
import styles from "../../css/DashboardPage/DashboardSideBar.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (option: string) => void;
}

const DashboardSidebar: React.FC<Props> = ({ isOpen, onClose, onSelect }) => {
  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
      <h5 className="mb-4">Menu</h5>
      <ul className="list-unstyled">
        <li className="mb-3">
          <button className="btn btn-link" onClick={() => onSelect("user")}>
            👤 View User Info
          </button>
        </li>
        <li className="mb-3">
          <button
            className="btn btn-link"
            onClick={() => onSelect("beneficiaries")}
          >
            🧾 Beneficiary List
          </button>
        </li>
        <li className="mb-3">
          <button className="btn btn-link" onClick={() => onSelect("card")}>
            💳 View Card Details
          </button>
        </li>
      </ul>
      <button className="btn btn-outline-secondary mt-4" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default DashboardSidebar;
