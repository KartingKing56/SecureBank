import React from "react";
import styles from "../../css/RegisterPage/Register.module.css";
// import buildingImage from "../assets/";

const Register: React.FC = () => {
  return (
    <div className={`text-center ${styles.registerContainer}`}>
      {/* Logo Section */}
      <div className={styles.logoSection}>
        <div className={styles.logoCircle}>
          <span className={styles.logoText}>CI</span>
        </div>
      </div>
      <h5 className="mb-4 fw-semibold">Register</h5>

      <input type="text" className="form-control mb-3" placeholder="First Name *" />
      <input type="text" className="form-control mb-3" placeholder="Surname *" />
      <input type="text" className="form-control mb-3" placeholder="ID Number *" />
      <input type="text" className="form-control mb-3" placeholder="Username *" />
      <input type="text" className="form-control mb-3" placeholder="Account Number *" />
      <input type="password" className="form-control mb-3" placeholder="Password *" />

      <button className="btn btn-primary w-100 mt-3">Register</button>
    </div>
  );
};

export default Register;
