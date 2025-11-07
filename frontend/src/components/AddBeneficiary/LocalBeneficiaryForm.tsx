import React, { useMemo, useState } from "react";
import { apiFetch } from "../../lib/api";

const NAME = /^[A-Za-z][A-Za-z .,'-]{1,59}$/;
const BANK = /^[A-Za-z0-9 .,'-]{2,80}$/;
const BRANCH = /^[A-Za-z0-9-]{2,20}$/;
const ACCOUNT = /^[A-Za-z0-9]{6,34}$/;
const NOTE = /^[A-Za-z0-9 .,'\-()/_]{0,140}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LocalBeneficiaryForm: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    bankName: "",
    branchCode: "",
    accountNumber: "",
    reference: "",
    email: "",
  });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const valid = useMemo(() => {
    if (!NAME.test(form.name.trim())) return false;
    if (form.bankName && !BANK.test(form.bankName.trim())) return false;
    if (!BRANCH.test(form.branchCode.trim())) return false;
    if (!ACCOUNT.test(form.accountNumber.trim())) return false;
    if (form.reference && !NOTE.test(form.reference.trim())) return false;
    if (form.email && !EMAIL.test(form.email.trim())) return false;
    return true;
  }, [form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    if (!valid) {
      setMsg("Please fix the highlighted fields.");
      return;
    }

    setBusy(true);
    try {
      const res = await apiFetch("/api/beneficiaries", {
        method: "POST",
        body: JSON.stringify({
          type: "local",
          name: form.name.trim(),
          bankName: form.bankName.trim() || undefined,
          branchCode: form.branchCode.trim(),
          accountNumber: form.accountNumber.trim(),
          reference: form.reference.trim() || undefined,
          email: form.email.trim() || undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setMsg("Beneficiary added.");
        setForm({
          name: "",
          bankName: "",
          branchCode: "",
          accountNumber: "",
          reference: "",
          email: "",
        });
      } else if (res.status === 409) {
        setMsg("Duplicate beneficiary.");
      } else if (res.status === 403) {
        setMsg(data?.error === "CSRF" ? "CSRF blocked. Refresh and try again." : "Forbidden.");
      } else {
        setMsg(data?.error || "Failed to add beneficiary.");
      }
    } catch {
      setMsg("Network error.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <input
        name="name"
        type="text"
        className={`form-control mb-3 ${form.name && !NAME.test(form.name) ? "is-invalid" : ""}`}
        placeholder="Beneficiary Name"
        value={form.name}
        onChange={onChange}
        required
      />
      <div className="invalid-feedback">2–60 letters and ,.'- allowed.</div>

      <input
        name="bankName"
        type="text"
        className={`form-control mb-3 ${form.bankName && !BANK.test(form.bankName) ? "is-invalid" : ""}`}
        placeholder="Bank Name (optional)"
        value={form.bankName}
        onChange={onChange}
      />

      <input
        name="branchCode"
        type="text"
        className={`form-control mb-3 ${form.branchCode && !BRANCH.test(form.branchCode) ? "is-invalid" : ""}`}
        placeholder="Branch Code"
        value={form.branchCode}
        onChange={onChange}
        required
      />
      <div className="invalid-feedback">2–20 chars, letters/numbers/hyphen.</div>

      <input
        name="accountNumber"
        type="text"
        className={`form-control mb-3 ${form.accountNumber && !ACCOUNT.test(form.accountNumber) ? "is-invalid" : ""}`}
        placeholder="Account Number"
        value={form.accountNumber}
        onChange={onChange}
        required
      />
      <div className="invalid-feedback">6–34 chars, letters or numbers.</div>

      <input
        name="reference"
        type="text"
        className={`form-control mb-3 ${form.reference && !NOTE.test(form.reference) ? "is-invalid" : ""}`}
        placeholder="Reference (optional)"
        value={form.reference}
        onChange={onChange}
      />

      <input
        name="email"
        type="email"
        className={`form-control mb-3 ${form.email && !EMAIL.test(form.email) ? "is-invalid" : ""}`}
        placeholder="Email (optional)"
        value={form.email}
        onChange={onChange}
      />

      <button className="btn btn-primary w-100" disabled={busy || !valid}>
        {busy ? "Adding..." : "Add Beneficiary"}
      </button>
      {msg && <p className="mt-2">{msg}</p>}
    </form>
  );
};

export default LocalBeneficiaryForm;