import React, { useState } from "react";
import TransactionForm from "../components/Transaction/TransactionForm";
import "../css/TransactionPage/TransactionPage.css";
import { createTransaction } from "../lib/txApi";

type Currency = "ZAR" | "USD" | "EUR";

interface TransactionFormData {
  amount: string;
  currency: Currency;
  swiftBic: string;
  agree: boolean;
  benName: string;
  benAccount: string;
  benBank: string;
  note?: string;
}

const TransactionPage: React.FC = () => {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState<TransactionFormData>({
    amount: "",
    currency: "ZAR",
    swiftBic: "",
    agree: false,
    benName: "",
    benAccount: "",
    benBank: "",
    note: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const next = () => setStep((s) => Math.min(5, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));
  const goto = (n: number) => setStep(n);

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(form.amount && 
                  parseFloat(form.amount) > 0 && 
                  form.swiftBic && 
                  form.swiftBic.length >= 8 && 
                  form.agree);
      case 2:
        return !!(form.benName.trim() && 
                  form.benAccount.trim() && 
                  form.benBank.trim());
      default:
        return true;
    }
  };

  const canProceed = validateStep(step);

  async function submitToServer() {
    setSubmitting(true);
    setMessage("");

    try {
      const result = await createTransaction({
        amount: form.amount,
        currency: form.currency,
        swiftBic: form.swiftBic,
        benName: form.benName,
        benAccount: form.benAccount,
        benBank: form.benBank,
        note: form.note
      });

      setReference(result.reference || null);
      setStep(5);
    } catch (error: any) {
      setMessage(error.message || "Transaction failed.");
    } finally {
      setSubmitting(false);
    }
  }

  const doPrimary = async () => {
    if (step < 4) {
      if (!canProceed) {
        if (step === 1) {
          setMessage("Please enter valid amount, SWIFT/BIC code (min 8 chars), and accept terms.");
        } else if (step === 2) {
          setMessage("Please fill all beneficiary details.");
        }
        return;
      }
      setMessage("");
      next();
    } else if (step === 4) {
      await submitToServer();
    }
  };

  const stepTitles = [
    "Amount & Payment",
    "Beneficiary Details", 
    "Review",
    "Confirmation",
    "Complete"
  ];

  return (
    <div className="transaction-page">
      <div className="transaction-card">
        <div className="step-header">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`step ${step === s ? "active" : step > s ? "completed" : ""}`}
              onClick={() => s < step && goto(s)}
            >
              <div className="step-number">{s}</div>
              <div className="step-title">{stepTitles[s-1]}</div>
            </div>
          ))}
        </div>

        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((step - 1) / 4) * 100}%` }}
          ></div>
        </div>

        <div className="form-content fade-in">
          <TransactionForm 
            step={step} 
            form={form} 
            setForm={setForm} 
            reference={reference} 
          />
        </div>

        {message && (
          <div className={`message ${message.includes("failed") ? "error" : "info"}`}>
            {message}
          </div>
        )}

        <div className="button-group">
          {step > 1 && step < 5 && (
            <button className="btn-back" onClick={back} disabled={submitting}>
              Back
            </button>
          )}
          {step < 5 && (
            <button 
              className="btn-proceed" 
              onClick={doPrimary} 
              disabled={submitting || (step < 4 && !canProceed)}
            >
              {step < 4 ? "Continue" : submitting ? "Processing..." : "Submit Payment"}
            </button>
          )}
          {step === 5 && (
            <button 
              className="btn-done" 
              onClick={() => { 
                setStep(1); 
                setReference(null);
                setForm({
                  amount: "",
                  currency: "ZAR",
                  swiftBic: "",
                  agree: false,
                  benName: "",
                  benAccount: "",
                  benBank: "",
                  note: "",
                });
              }}
            >
              New Transaction
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;