//import styles from "../../css/AddBeneficiary/ForeignBeneficiaryForm.module.css";

const LocalBeneficiaryForm: React.FC = () => {
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
        placeholder="Branch Code"
      />
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Account Number"
      />
      <div className="mb-3">
        <label htmlFor="accountType" className="form-label">
          Account Type
        </label>
        <select id="accountType" className="form-control">
          <option value="">Select Account Type</option>
          <option value="savings">Savings</option>
          <option value="cheque">Cheque</option>
        </select>
      </div>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Reference"
      />
      <input
        type="email"
        className="form-control mb-3"
        placeholder="Email (optional)"
      />
      <button className="btn btn-success w-100">Add Beneficiary</button>
    </form>
  );
};

export default LocalBeneficiaryForm;
