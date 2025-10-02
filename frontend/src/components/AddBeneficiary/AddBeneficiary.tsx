import React, { useState } from "react";
import BeneficiarySelector from "./BeneficiarySelector";
import LocalBeneficiaryForm from "./LocalBeneficiaryForm";
import ForeignBeneficiaryForm from "./ForeignBeneficiaryForm";

const AddBeneficiary: React.FC = () => {
  const [type, setType] = useState<"local" | "foreign">("local");

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Add Beneficiary</h2>
      <BeneficiarySelector selected={type} onChange={setType} />
      {type === "local" ? <LocalBeneficiaryForm /> : <ForeignBeneficiaryForm />}
    </div>
  );
};

export default AddBeneficiary;
