import React, { useEffect, useMemo, useState } from "react";
import { listMyTransactions } from "../../lib/customerApi";

type TxStatus = "pending" | "verified" | "queued" | "forwarded" | "failed";
type Tx = {
  _id: string;
  amount: string | number;
  currency: string;
  provider?: string;
  status: TxStatus;
  note?: string;
  beneficiary?: any;
  createdAt?: string;
};

type ListResp = {
  page: number;
  limit: number;
  total: number;
  items: Tx[];
};

const statuses: Array<{ label: string; value?: TxStatus }> = [
  { label: "All" },
  { label: "Pending", value: "pending" },
  { label: "Queued", value: "queued" },
  { label: "Forwarded", value: "forwarded" },
  { label: "Failed", value: "failed" },
];

const CustomerTransactions: React.FC = () => {
  const [status, setStatus] = useState<TxStatus | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [data, setData] = useState<{
    page: number; limit: number; total: number; items: Tx[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const q = useMemo(() => {
    const s = new URLSearchParams();
    s.set("page", String(page));
    s.set("limit", String(limit));
    if (status) s.set("status", status);
    return s.toString();
  }, [page, limit, status]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr(null);

    (async () => {
      try {
        const body = await listMyTransactions({ page, limit, status });
        if (!alive) return;
        setData(body);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message || "Failed to load transactions");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [page, limit, status]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <div className="fade-in">
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
        <h3 className="mb-2 mb-sm-0">Your Transactions</h3>
        <div className="d-flex gap-2">
          <select
            className="form-select"
            value={status ?? ""}
            onChange={(e) => { setPage(1); setStatus((e.target.value || undefined) as TxStatus | undefined); }}
          >
            {statuses.map(s => (
              <option key={s.label} value={s.value ?? ""}>{s.label}</option>
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
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Provider</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.items ?? []).map((t) => (
                    <tr key={t._id}>
                      <td>{t.createdAt ? new Date(t.createdAt).toLocaleString() : "—"}</td>
                      <td>
                        {(() => {
                          const amt = typeof t.amount === "string" ? t.amount : String(t.amount);
                          return `${amt} ${t.currency ?? ""}`.trim();
                        })()}
                      </td>
                      <td className="text-capitalize">{t.status}</td>
                      <td>{t.provider || "—"}</td>
                      <td>{t.note || "—"}</td>
                    </tr>
                  ))}
                  {(data?.items?.length ?? 0) === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center opacity-75 py-4">
                        No transactions found.
                      </td>
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

export default CustomerTransactions;
