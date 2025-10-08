import React from "react";
import AddBeneficiary from "../components/AddBeneficiary/AddBeneficiary";
import "../css/AddBenificiaryPage/AddBenificiaryPage.css";

const AddBeneficiaryPage: React.FC = () => {
  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Left side form */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <AddBeneficiary />
        </div>

        {/* Right side image */}
        <div className="col-md-6 d-none d-md-block p-0">
          <img
            src="/beneficiary-hero.jpg"
            alt="Beneficiary Visual"
            className="img-fluid h-100 w-100 object-fit-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default AddBeneficiaryPage;
