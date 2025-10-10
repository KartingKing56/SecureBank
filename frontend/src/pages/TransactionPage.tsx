import React, { useState } from "react";
import TransactionForm from "../components/Transaction/TransactionForm";
import "../css/TransactionPage/TransactionPage.css";

type Provider = "SWIFT" | "Visa" | "Mastercard";
type Currency = "ZAR" | "USD" | "EUR";

const TransactionPage: React.FC = () => {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    amount: "",
    currency: "ZAR" as Currency,
    provider: "SWIFT" as Provider,
    agree: false,

    senderName: "",
    senderAccount: "",
    senderBank: "",

    benName: "",
    benAccount: "",
    benBank: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const next = () => setStep((s) => Math.min(5, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));
  const goto = (n: number) => setStep(n);

  const canProceedFromStep1 =
    !!form.amount &&
    /^\d+(\.\d{1,2})?$/.test(form.amount) &&
    form.provider === "SWIFT" &&
    form.agree;

  async function submitToServer() {
    setSubmitting(true);
    setMessage("");

    try {
      const csrfRes = await fetch("/api/auth/csrf", { method: "POST", credentials: "include" });
      const { csrf } = await csrfRes.json();

      const accessToken = localStorage.getItem("accessToken") || "";

      const payload = {
        amount: form.amount,
        currency: form.currency,
        provider: "SWIFT",
        beneficiary: {
          name: form.benName.trim(),
          bankName: form.benBank.trim() || undefined,
          ibanOrAccount: form.benAccount.trim().toUpperCase(),
        },
      };

      const res = await fetch("/api/tx", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrf,
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setReference(data.reference || null);
        setStep(5);
      } else {
        setMessage(data.error || "Transaction failed.");
      }
    } catch (e) {
      setMessage("Network error.");
    } finally {
      setSubmitting(false);
    }
  }

  const doPrimary = async () => {
    if (step < 4) {
      if (step === 1 && !canProceedFromStep1) {
        setMessage("Enter a valid amount, choose SWIFT and accept terms.");
        return;
      }
      setMessage("");
      next();
    } else if (step === 4) {
      await submitToServer();
    }
  };

  return (
    <div className="transaction-page">
      <div className="transaction-card">
        <div className="step-header">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`step ${step === s ? "active" : step > s ? "completed" : ""}`}
              onClick={() => goto(s)}
            >
              Step {s}
            </div>
          ))}
        </div>

        <div className="form-content fade-in">
          <TransactionForm step={step} form={form} setForm={setForm} reference={reference} />
        </div>

        {message && <p className="mt-2" style={{ textAlign: "center" }}>{message}</p>}

        <div className="button-group">
          {step > 1 && step < 5 && (
            <button className="btn-back" onClick={back} disabled={submitting}>
              Back
            </button>
          )}
          {step < 5 && (
            <button className="btn-proceed" onClick={doPrimary} disabled={submitting}>
              {step < 4 ? "Proceed" : submitting ? "Submitting..." : "Submit"}
            </button>
          )}
          {step === 5 && (
            <button className="btn-done" onClick={() => { setStep(1); setReference(null); }}>
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;
