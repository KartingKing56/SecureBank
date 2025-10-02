import React from "react";

const Login: React.FC = () => {
  return (
    <div
      className="container d-flex flex-column align-items-center mt-5"
      //style={{ maxWidth: "400px" }}
    >
      <img
        src="/logo.png"
        alt="Bank Logo"
        className="mb-3"
        //style={{ width: "80px", height: "80px" }}
      />
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
        Don’t have an account? <a href="/signup">Sign up</a>
      </div>
    </div>
  );
};

export default Login;
