//import styles from "../../css/AddBeneficiary/BeneficiarySelector.module.css";

interface Props {
  selected: "local" | "foreign";
  onChange: (type: "local" | "foreign") => void;
}

const BeneficiarySelector: React.FC<Props> = ({ selected, onChange }) => {
  return (
    <div className="btn-group mb-4">
      <button
        className={`btn ${
          selected === "local" ? "btn-primary" : "btn-outline-primary"
        }`}
        onClick={() => onChange("local")}
      >
        Local
      </button>
      <button
        className={`btn ${
          selected === "foreign" ? "btn-primary" : "btn-outline-primary"
        }`}
        onClick={() => onChange("foreign")}
      >
        Foreign
      </button>
    </div>
  );
};

export default BeneficiarySelector;
