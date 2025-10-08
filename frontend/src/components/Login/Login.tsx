import React from "react";
import styles from "../../css/LoginPage/Login.module.css";
import { Settings } from "lucide-react"; // optional: install lucide-react if you want the settings icon

const Login: React.FC = () => {
  return (
    <div className={styles.loginWrapper}>
      <button className={styles.settingsBtn}>
        <Settings size={18} aria-hidden="true" />
        <span className="visually-hidden">Settings</span>
      </button>


      <div className={styles.loginContainer}>
        {/* Logo Section */}
        <div className={styles.logoSection}>
          <div className={styles.logoCircle}>
            <span className={styles.logoText}>CI</span>
          </div>
        </div>

        <h2 className={styles.heading}>Login</h2>

        {/* Form Fields */}
        <div className={styles.formGroup}>
          <input type="text" placeholder="Username *" className={styles.input} />
        </div>

        <div className={styles.formGroup}>
          <input
            type="text"
            placeholder="Account Number *"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <input
            type="password"
            placeholder="Password *"
            className={styles.input}
          />
        </div>

        {/* Forgot Password */}
        <div className={styles.forgotPassword}>
          <a href="#">Forgot password?</a>
        </div>

        {/* Login Button */}
        <button className={styles.loginBtn}>Login</button>

        {/* Register Link */}
        <div className={styles.signupText}>
          Don’t have an account? <a href="#">Register!</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
