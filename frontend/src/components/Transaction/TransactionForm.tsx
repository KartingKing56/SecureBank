import React from "react";
import "../../css/TransactionPage/TransactionPage.css";

interface TransactionFormProps {
  step: number;
  form: {
    amount: string;
    currency: "ZAR" | "USD" | "EUR";
    provider: "SWIFT" | "Visa" | "Mastercard";
    agree: boolean;

    senderName: string;
    senderAccount: string;
    senderBank: string;

    benName: string;
    benAccount: string;
    benBank: string;
  };
  setForm: React.Dispatch<React.SetStateAction<any>>;
  reference?: string | null;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ step, form, setForm, reference }) => {
  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((p: any) => ({
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

          <label htmlFor="provider">Provider</label>
          <select
            id="provider"
            name="provider"
            title="Select payment provider"
            value={form.provider}
            onChange={set("provider")}
          >
            <option value="SWIFT">SWIFT</option>
            <option value="Visa" disabled>Visa</option>
            <option value="Mastercard" disabled>Mastercard</option>
          </select>

          <div className="terms">
            <input type="checkbox" id="terms" checked={form.agree} onChange={set("agree")} />
            <label htmlFor="terms">I agree to Cashmate Terms of Use</label>
          </div>
        </div>
      );

    case 2:
      return (
        <div className="form-section">
          <h2>Sender Details</h2>
          <label>Sender Name</label>
          <input type="text" placeholder="Mark Henry" value={form.senderName} onChange={set("senderName")} />
          <label>Account Number</label>
          <input type="text" placeholder="1234567890123" value={form.senderAccount} onChange={set("senderAccount")} />
          <label>Bank Name</label>
          <input type="text" placeholder="Standard Bank" value={form.senderBank} onChange={set("senderBank")} />
          <p className="muted">Note: The server uses your authenticated profile for sender info.</p>
        </div>
      );

    case 3:
      return (
        <div className="form-section">
          <h2>Beneficiary Details</h2>
          <label>Beneficiary Name</label>
          <input type="text" placeholder="John Doe" value={form.benName} onChange={set("benName")} />
          <label>Account Number</label>
          <input type="text" placeholder="1234567890123" value={form.benAccount} onChange={set("benAccount")} />
          <label>Bank Name</label>
          <input type="text" placeholder="Absa" value={form.benBank} onChange={set("benBank")} />
        </div>
      );

    case 4:
      return (
        <div className="form-section">
          <h2>Review</h2>
          <div className="review-box">
            <div className="review-section">
              <h4>From</h4>
              <p>{form.senderName || "(your profile)"}</p>
              <p>{form.senderBank || "-"}</p>
              <p>{form.senderAccount || "-"}</p>
            </div>
            <div className="review-section">
              <h4>To</h4>
              <p>{form.benName || "-"}</p>
              <p>{form.benBank || "-"}</p>
              <p>{form.benAccount || "-"}</p>
            </div>
            <div className="review-section">
              <h4>Amount</h4>
              <p>{form.currency} {form.amount || "0.00"}</p>
              <h4>Provider</h4>
              <p>{form.provider}</p>
            </div>
          </div>
        </div>
      );

    case 5:
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
