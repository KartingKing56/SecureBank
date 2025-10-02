import React from "react";

const Register: React.FC = () => {
  return (
    <div
      className="container d-flex flex-column align-items-center mt-5"
      //style={{ maxWidth: "500px" }}
    >
      <img
        src="/logo.png"
        alt="Bank Logo"
        className="mb-3"
        //style={{ width: "80px", height: "80px" }}
      />
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
      <button className="btn btn-outline-secondary w-100">Cancel</button>
    </div>
  );
};

export default Register;
