import React from "react";
import styles from "../../css/RegisterPage/Register.module.css";

const Register: React.FC = () => {
  return (
    <div
      className={`container d-flex flex-column align-items-center mt-5 ${styles.registerContainer}`}
    >
      <img src="/logo.png" alt="Bank Logo" className={`mb-3 ${styles.logo}`} />
      <h2 className="mb-4">Register</h2>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="First Name"
      />
      <input type="text" className="form-control mb-3" placeholder="Surname" />
      <input
        type="text"
        className="form-control mb-3"
        placeholder="ID Number"
      />
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
      <input
        type="password"
        className="form-control mb-4"
        placeholder="Confirm Password"
      />

      <button className="btn btn-success w-100 mb-2">Register</button>
    </div>
  );
};

export default Register;
