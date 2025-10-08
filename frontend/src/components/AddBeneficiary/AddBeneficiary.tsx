import React, { useState } from "react";
import BeneficiarySelector from "./BeneficiarySelector";
import LocalBeneficiaryForm from "./LocalBeneficiaryForm";
import ForeignBeneficiaryForm from "./ForeignBeneficiaryForm";

const AddBeneficiary: React.FC = () => {
  const [type, setType] = useState<"local" | "foreign">("local");

  return (
    <div className="container d-flex flex-column align-items-center text-center">
      <h2 className="mb-4 fw-semibold">Add Beneficiary</h2>
      <BeneficiarySelector selected={type} onChange={setType} />
      <div className="w-100" style={{ maxWidth: "400px" }}>
        {type === "local" ? <LocalBeneficiaryForm /> : <ForeignBeneficiaryForm />}
      </div>
    </div>
  );
};

export default AddBeneficiary;
