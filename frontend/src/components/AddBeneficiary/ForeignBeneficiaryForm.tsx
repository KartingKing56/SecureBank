import React, { useState } from "react";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setBusy(true);

    try {
      const csrfRes = await fetch("/api/auth/csrf", { method: "POST", credentials: "include" });
      const { csrf } = await csrfRes.json();

      const accessToken = localStorage.getItem("accessToken") || "";

      const res = await fetch("/api/beneficiaries", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrf,
          "Authorization": `Bearer ${accessToken}`,
        },
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

      const data = await res.json();
      if (res.ok) {
        setMsg("Beneficiary added.");
        setForm({ name:"", bankName:"", country:"", swiftBic:"", ibanOrAccount:"", reference:"", email:"" });
      } else {
        setMsg(data.error || "Failed to add beneficiary.");
      }
    } catch (e) {
      setMsg("Network error.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" type="text" className="form-control mb-3" placeholder="Beneficiary Name" value={form.name} onChange={onChange} required />
      <input name="bankName" type="text" className="form-control mb-3" placeholder="Bank Name" value={form.bankName} onChange={onChange} />
      <input name="country" type="text" className="form-control mb-3" placeholder="Country (e.g., GB)" value={form.country} onChange={onChange} required />
      <input name="swiftBic" type="text" className="form-control mb-3" placeholder="SWIFT/BIC (e.g., BARCGB22)" value={form.swiftBic} onChange={onChange} required />
      <input name="ibanOrAccount" type="text" className="form-control mb-3" placeholder="IBAN" value={form.ibanOrAccount} onChange={onChange} required />
      <input name="reference" type="text" className="form-control mb-3" placeholder="Reference" value={form.reference} onChange={onChange} />
      <input name="email" type="email" className="form-control mb-3" placeholder="Email (optional)" value={form.email} onChange={onChange} />
      <button className="btn btn-primary w-100" disabled={busy}>{busy ? "Adding..." : "Add Beneficiary"}</button>
      {msg && <p className="mt-2">{msg}</p>}
    </form>
  );
};

export default ForeignBeneficiaryForm;
