import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../lib/api";

type BeneficiaryType = "local" | "foreign";
type Beneficiary = {
  _id: string;
  type: BeneficiaryType;
  name: string;
  bankName?: string;
  branchCode?: string;
  accountNumber?: string;
  ibanOrAccount?: string;
  swiftBic?: string;
  country?: string;
  email?: string;
  reference?: string;
  createdAt?: string;
};

type ListResp = {
  page: number;
  limit: number;
  total: number;
  items: Beneficiary[];
};

const typeOptions: Array<{ label: string; value?: BeneficiaryType }> = [
  { label: "All" },
  { label: "Local", value: "local" },
  { label: "Foreign", value: "foreign" },
];

const CustomerBeneficiaries: React.FC = () => {
  const [type, setType] = useState<BeneficiaryType | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [data, setData] = useState<ListResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const query = useMemo(() => {
    const s = new URLSearchParams();
    s.set("page", String(page));
    s.set("limit", String(limit));
    if (type) s.set("type", type);
    return s.toString();
  }, [page, limit, type]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr(null);

    (async () => {
      try {
        const res = await apiFetch(`/api/beneficiaries?${query}`);
        const body = (await res.json()) as ListResp;
        if (!res.ok) throw new Error((body as any)?.error || `HTTP ${res.status}`);
        if (!alive) return;
        setData(body);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message || "Failed to load beneficiaries");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [query]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <div className="fade-in">
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
        <h3 className="mb-2 mb-sm-0">Your Beneficiaries</h3>
        <div className="d-flex gap-2">
          <select
            className="form-select"
            value={type ?? ""}
            onChange={(e) => { setPage(1); setType((e.target.value || undefined) as BeneficiaryType | undefined); }}
          >
            {typeOptions.map(o => (
              <option key={o.label} value={o.value ?? ""}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p>Loading…</p>}
      {err && <p className="text-danger">{err}</p>}

      {!loading && !err && (
        <>
          <div className="card">
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Name</th>
                    <th>Bank</th>
                    <th>Account / IBAN</th>
                    <th>SWIFT / Country</th>
                    <th>Reference</th>
                    <th>Added</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.items ?? []).map((b) => (
                    <tr key={b._id}>
                      <td className="text-capitalize">{b.type}</td>
                      <td>{b.name}</td>
                      <td>{b.bankName || "—"}</td>
                      <td>{b.type === "local" ? (b.accountNumber || "—") : (b.ibanOrAccount || "—")}</td>
                      <td>
                        {b.type === "foreign"
                          ? `${b.swiftBic || "—"}${b.country ? ` / ${b.country}` : ""}`
                          : (b.branchCode || "—")}
                      </td>
                      <td>{b.reference || "—"}</td>
                      <td>{b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "—"}</td>
                    </tr>
                  ))}
                  {(data?.items?.length ?? 0) === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center opacity-75 py-4">No beneficiaries found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="d-flex align-items-center justify-content-between mt-3">
            <small>
              Page {data?.page ?? 1} of {totalPages} • Total {data?.total ?? 0}
            </small>
            <div className="btn-group">
              <button
                className="btn btn-outline-secondary"
                disabled={(data?.page ?? 1) <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </button>
              <button
                className="btn btn-outline-secondary"
                disabled={(data?.page ?? 1) >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerBeneficiaries;
