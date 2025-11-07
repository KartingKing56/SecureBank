import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BeneficiarySelector from "./BeneficiarySelector";
import LocalBeneficiaryForm from "./LocalBeneficiaryForm";
import ForeignBeneficiaryForm from "./ForeignBeneficiaryForm";

const AddBeneficiary: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const initial = params.get("type") === "foreign" ? "foreign" : "local";
  const [type, setType] = useState<"local" | "foreign">(initial);

  useEffect(() => {
    const next = new URLSearchParams(params);
    next.set("type", type);
    setParams(next, { replace: true });
  }, [type]);

  return (
    <div className="container d-flex flex-column align-items-center text-center">
      <h2 className="mb-4 fw-semibold">Add Beneficiary</h2>
      <BeneficiarySelector selected={type} onChange={setType} />
      <div className="w-100" style={{ maxWidth: 400 }}>
        {type === "local" ? <LocalBeneficiaryForm /> : <ForeignBeneficiaryForm />}
      </div>
    </div>
  );
};

export default AddBeneficiary;
