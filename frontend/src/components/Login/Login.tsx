import React from "react";
import styles from "../../css/LoginPage/Login.module.css";

const Login: React.FC = () => {
  return (
    <div
      className={`container d-flex flex-column align-items-center mt-5 ${styles.loginContainer}`}
    >
      <img src="/logo.png" alt="Bank Logo" className={`mb-3 ${styles.logo}`} />
      <h2 className="mb-4">Login</h2>

      <input type="text" className="form-control mb-3" placeholder="Username" />
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Account Number"
      />
      <input
        type="password"
        className="form-control mb-3"
        placeholder="Password"
      />

      <div className="w-100 text-end mb-3">
        <a href="/forgot-password" className="text-decoration-none">
          Forgot Password?
        </a>
      </div>

      <button className="btn btn-primary w-100 mb-3">Login</button>

      <div className="text-center">
        Don’t have an account? <a href="/register">Register</a>
      </div>
    </div>
  );
};

export default Login;
