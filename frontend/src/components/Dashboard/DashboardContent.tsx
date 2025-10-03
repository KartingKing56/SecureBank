import React from "react";
import { useNavigate } from "react-router-dom";
import { FaExchangeAlt, FaHistory } from "react-icons/fa";

const DashboardOptions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-wrap justify-content-center gap-4 py-4">
      {/* Create Transaction */}
      <div
        className="card text-center shadow"
        //style={{ width: "200px", height: "200px", cursor: "pointer" }}
        onClick={() => navigate("/create-transaction")}
      >
        <div className="card-body d-flex flex-column justify-content-center align-items-center">
          <FaExchangeAlt size={40} className="mb-3 text-primary" />
          <h5 className="card-title">Create Transaction</h5>
        </div>
      </div>

      {/* View Transactions */}
      <div
        className="card text-center shadow"
        //style={{ width: "200px", height: "200px", cursor: "pointer" }}
        onClick={() => navigate("/view-transactions")}
      >
        <div className="card-body d-flex flex-column justify-content-center align-items-center">
          <FaHistory size={40} className="mb-3 text-success" />
          <h5 className="card-title">View Transactions</h5>
        </div>
      </div>
    </div>
  );
};

export default DashboardOptions;
