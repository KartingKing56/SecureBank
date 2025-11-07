import React, { useMemo, useState } from "react";
import { apiFetch } from "../../lib/api";

const NAME = /^[A-Za-z][A-Za-z .,'-]{1,59}$/;
const BANK = /^[A-Za-z0-9 .,'-]{2,80}$/;
const COUNTRY = /^[A-Z]{2}$/;
const SWIFT = /^[A-Z0-9]{8}(?:[A-Z0-9]{3})?$/;
const ACCOUNT = /^[A-Za-z0-9]{6,34}$/;
const NOTE = /^[A-Za-z0-9 .,'\-()/_]{0,140}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForeignBeneficiaryForm: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    bankName: "",
    country: "",
    swiftBic: "",
    ibanOrAccount: "",
    reference: "",
    email: "",
  });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const valid = useMemo(() => {
    if (!NAME.test(form.name.trim())) return false;
    if (form.bankName && !BANK.test(form.bankName.trim())) return false;
    if (!COUNTRY.test(form.country.trim().toUpperCase())) return false;
    if (!SWIFT.test(form.swiftBic.trim().toUpperCase())) return false;
    if (!ACCOUNT.test(form.ibanOrAccount.trim().toUpperCase())) return false;
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
          type: "foreign",
          name: form.name.trim(),
          bankName: form.bankName.trim() || undefined,
          country: form.country.trim().toUpperCase(),
          swiftBic: form.swiftBic.trim().toUpperCase(),
          ibanOrAccount: form.ibanOrAccount.trim().toUpperCase(),
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
          country: "",
          swiftBic: "",
          ibanOrAccount: "",
          reference: "",
          email: "",
        });
      } else if (res.status === 409) {
        setMsg("Duplicate beneficiary for this user.");
      } else if (res.status === 403 && data?.error === "CSRF") {
        setMsg("CSRF blocked. Refresh and try again over HTTPS.");
      } else if (res.status === 400 && data?.error === "validation_error") {
        setMsg("Validation failed. Please check your inputs.");
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
        placeholder="Beneficiary Name*"
        value={form.name}
        onChange={onChange}
        required
      />
      <input
        name="bankName"
        type="text"
        className={`form-control mb-3 ${form.bankName && !BANK.test(form.bankName) ? "is-invalid" : ""}`}
        placeholder="Bank Name (optional)"
        value={form.bankName}
        onChange={onChange}
      />
      <input
        name="country"
        type="text"
        className={`form-control mb-3 ${form.country && !COUNTRY.test(form.country.toUpperCase()) ? "is-invalid" : ""}`}
        placeholder="Country (e.g., ZA)"
        value={form.country}
        onChange={onChange}
        maxLength={2}
        required
      />
      <input
        name="swiftBic"
        type="text"
        className={`form-control mb-3 ${form.swiftBic && !SWIFT.test(form.swiftBic.toUpperCase()) ? "is-invalid" : ""}`}
        placeholder="SWIFT/BIC (e.g., BARCGB22)"
        value={form.swiftBic}
        onChange={onChange}
        required
      />
      <input
        name="ibanOrAccount"
        type="text"
        className={`form-control mb-3 ${form.ibanOrAccount && !ACCOUNT.test(form.ibanOrAccount.toUpperCase()) ? "is-invalid" : ""}`}
        placeholder="IBAN / Account Number"
        value={form.ibanOrAccount}
        onChange={onChange}
        required
      />
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

      <button className="btn btn-primary w-100" type="submit" disabled={busy || !valid}>
        {busy ? "Adding..." : "Add Beneficiary"}
      </button>

      {msg && <p className="mt-2">{msg}</p>}
    </form>
  );
};

export default ForeignBeneficiaryForm;