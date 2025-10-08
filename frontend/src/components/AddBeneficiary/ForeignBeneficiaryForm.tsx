//import styles from "../../css/AddBeneficiary/ForeignBeneficiaryForm.module.css";

const ForeignBeneficiaryForm: React.FC = () => {
  return (
    <form>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Beneficiary Name"
      />
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Bank Name"
      />
      <input
        type="text"
        className="form-control mb-3"
        placeholder="SWIFT/BIC Code"
      />
      <input
        type="text"
        className="form-control mb-3"
        placeholder="IBAN / Account Number"
      />
      <input type="text" className="form-control mb-3" placeholder="Country" />
      <input type="text" className="form-control mb-3" placeholder="Currency" />
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Purpose of Payment"
      />
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Reference"
      />
      <button className="btn btn-success w-100">Add Beneficiary</button>
    </form>
  );
};

export default ForeignBeneficiaryForm;
