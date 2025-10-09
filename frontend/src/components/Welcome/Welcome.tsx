import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../css/WelcomePage/Welcome.module.css";
import logo from "../../assets/logo.png";

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.welcomeContainer}>
      {/* Left Side - Image/Branding */}
      <div className={styles.leftPanel}>
        <div className={styles.imageOverlay}></div>
        <div className={styles.brandingContent}>
          <img src={logo} alt="Bank Logo" className={styles.logo} />
          <h1 className={styles.brandTitle}>SecureBank</h1>
          <p className={styles.brandSubtitle}>Your trusted financial partner</p>
        </div>
      </div>

      {/* Right Side - Get Started */}
      <div className={styles.rightPanel}>
        <div className={styles.authContainer}>
          <div className={styles.logoCircle}>
            <img src={logo} alt="Bank Logo" className={styles.logoIcon} />
          </div>

          <h2 className={styles.welcomeTitle}>Get Started</h2>
          <p className={styles.welcomeSubtitle}>
            Access your account or create a new one
          </p>

          <div className={styles.buttonGroup}>
            <button
              className={styles.loginButton}
              onClick={() => navigate("/login")}
            >
              Login
            </button>

            <button
              className={styles.registerButton}
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>

          <div className={styles.infoSection}>
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>🔒</span>
              <span>Bank-level security</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>⚡</span>
              <span>Instant transactions</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>📱</span>
              <span>24/7 access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
