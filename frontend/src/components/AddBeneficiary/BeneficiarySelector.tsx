import React from "react";

interface Props {
  selected: "local" | "foreign";
  onChange: (type: "local" | "foreign") => void;
}

const BeneficiarySelector: React.FC<Props> = ({ selected, onChange }) => {
  return (
    <div className="btn-group mb-4" role="group" aria-label="Beneficiary type">
      <button
        type="button"
        className={`btn ${selected === "local" ? "btn-primary" : "btn-outline-primary"}`}
        aria-pressed={selected === "local"}
        onClick={() => onChange("local")}
      >
        Local
      </button>

      <button
        type="button"
        className={`btn ${selected === "foreign" ? "btn-primary" : "btn-outline-primary"}`}
        aria-pressed={selected === "foreign"}
        onClick={() => onChange("foreign")}
      >
        Foreign
      </button>
    </div>
  );
};

export default BeneficiarySelector;
