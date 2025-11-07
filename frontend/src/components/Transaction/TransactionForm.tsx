import React from "react";
import "../../css/TransactionPage/TransactionPage.css";

interface TransactionFormData {
  amount: string;
  currency: "ZAR" | "USD" | "EUR";
  swiftBic: string;
  agree: boolean;
  benName: string;
  benAccount: string;
  benBank: string;
  note?: string;
}

interface TransactionFormProps {
  step: number;
  form: TransactionFormData;
  setForm: React.Dispatch<React.SetStateAction<TransactionFormData>>;
  reference?: string | null;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ step, form, setForm, reference }) => {
  const set = (key: keyof TransactionFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((p) => ({
        ...p,
        [key]: e.target.type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : e.target.value
      }));

  switch (step) {
    case 1:
      return (
        <div className="form-section">
          <h2>Amount Details / Payment</h2>

          <label htmlFor="transactionAmount">Transaction Amount</label>
          <input
            id="transactionAmount"
            name="transactionAmount"
            type="number"
            placeholder="0.00"
            value={form.amount}
            onChange={set("amount")}
            inputMode="decimal"
            min="0"
            step="0.01"
          />

          <label htmlFor="currency">Currency</label>
          <select
            id="currency"
            name="currency"
            title="Select currency type"
            value={form.currency}
            onChange={set("currency")}
          >
            <option value="ZAR">South African Rand (ZAR)</option>
            <option value="USD">US Dollar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
          </select>

          <label htmlFor="swiftBic">SWIFT/BIC Code</label>
          <input
            id="swiftBic"
            name="swiftBic"
            type="text"
            placeholder="e.g. SBZAZAJJ"
            value={form.swiftBic}
            onChange={set("swiftBic")}
            maxLength={11}
          />
          <p className="form-text">8 or 11 characters (e.g. SBZAZAJJ or SBZAZAJJXXX)</p>

          <label htmlFor="note">Note (Optional)</label>
          <input
            id="note"
            name="note"
            type="text"
            placeholder="Payment reference or note"
            value={form.note || ""}
            onChange={set("note")}
            maxLength={140}
          />

          <div className="terms">
            <input type="checkbox" id="terms" checked={form.agree} onChange={set("agree")} />
            <label htmlFor="terms">I agree to Cashmate Terms of Use</label>
          </div>
        </div>
      );

    case 2:
      return (
        <div className="form-section">
          <h2>Beneficiary Details</h2>
          
          <label>Beneficiary Name</label>
          <input 
            type="text" 
            placeholder="John Doe" 
            value={form.benName} 
            onChange={set("benName")}
            maxLength={60}
          />
          
          <label>IBAN or Account Number</label>
          <input 
            type="text" 
            placeholder="ZA1234567890 or account number" 
            value={form.benAccount} 
            onChange={set("benAccount")}
            maxLength={34}
          />
          
          <label>Bank Name</label>
          <input 
            type="text" 
            placeholder="Absa" 
            value={form.benBank} 
            onChange={set("benBank")}
            maxLength={80}
          />
        </div>
      );

    case 3:
      return (
        <div className="form-section">
          <h2>Review</h2>
          <div className="review-box">
            <div className="review-section">
              <h4>To</h4>
              <p>{form.benName || "-"}</p>
              <p>{form.benBank || "-"}</p>
              <p>{form.benAccount || "-"}</p>
            </div>
            <div className="review-section">
              <h4>Amount</h4>
              <p>{form.currency} {form.amount || "0.00"}</p>
              <h4>SWIFT/BIC</h4>
              <p>{form.swiftBic || "-"}</p>
              {form.note && (
                <>
                  <h4>Note</h4>
                  <p>{form.note}</p>
                </>
              )}
            </div>
          </div>
        </div>
      );

    case 4:
      return (
        <div className="form-section confirmation">
          <h2>Payment Submitted</h2>
          <p>Reference - <strong>{reference || "—"}</strong></p>
        </div>
      );

    default:
      return null;
  }
};

export default TransactionForm;