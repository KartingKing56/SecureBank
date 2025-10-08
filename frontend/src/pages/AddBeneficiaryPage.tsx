import React from "react";
import AddBeneficiary from "../components/AddBeneficiary/AddBeneficiary";
import "../css/AddBenificiaryPage/AddBenificiaryPage.css";

const AddBeneficiaryPage: React.FC = () => {
  return (
    <div className="beneficiary-page-container d-flex align-items-center justify-content-center vh-100">
      <div className="beneficiary-card shadow d-flex align-items-center justify-content-center">
        <AddBeneficiary />
      </div>
    </div>
  );
};

export default AddBeneficiaryPage;
