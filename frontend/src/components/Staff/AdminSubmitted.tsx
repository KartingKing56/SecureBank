import React, { useEffect, useMemo, useState } from "react";
import { listAdminTransactions } from "../../lib/staffApi";

type TxRow = {
  _id: string;
  reference: string;
  amount: string | { $numberDecimal: string };
  currency: string;
  status: "queued" | "forwarded" | "failed";
  submittedBy?: string;
  submittedAt?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
};

const STATUSES = ["queued", "forwarded", "failed"] as const;
type Status = typeof STATUSES[number];

const AdminSubmitted: React.FC = () => {
  const [status, setStatus] = useState<Status>("queued");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<TxRow[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const data = await listAdminTransactions({ status, limit: 200 });
        setRows(data.items ?? data);
      } catch (e: any) {
        setErr(e?.message || "Failed to load transactions");
      } finally {
        setLoading(false);
      }
    })();
  }, [status]);

  const prettyAmount = (a: TxRow["amount"]) =>
    typeof a === "string" ? a : a?.$numberDecimal ?? "";

  return (
    <section className="fade-in">
      <div className="d-flex align-items-center gap-2 mb-3">
        {STATUSES.map(s => (
          <button
            key={s}
            className={`btn btn-sm ${status === s ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setStatus(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading && <p>Loading…</p>}
      {err && <p style={{ color: "crimson" }}>{err}</p>}

      {!loading && !err && (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(tx => (
                <tr key={tx._id}>
                  <td>{tx.reference}</td>
                  <td>{prettyAmount(tx.amount)} {tx.currency}</td>
                  <td>{tx.status}</td>
                  <td>{tx.submittedAt ? new Date(tx.submittedAt).toLocaleString() : "—"}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: "center", opacity: 0.7 }}>No results.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AdminSubmitted;
