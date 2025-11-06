import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/staffApi";

type Tx = {
  _id: string;
  reference: string;
  amount: string | { $numberDecimal: string };
  currency: string;
  provider: "SWIFT";
  swiftBic: string;
  beneficiary: { name: string; bankName?: string; ibanOrAccount: string };
  status: "pending" | "verified" | "queued" | "forwarded" | "failed";
  createdAt: string;
  verifiedAt?: string;
};

type QueueResponse = {
  items: Tx[];
  nextCursor: string | null;
};

const formatAmount = (a: Tx["amount"]) =>
  typeof a === "string" ? a : a?.$numberDecimal ?? "";

const Row: React.FC<{
  tx: Tx;
  onVerify: (id: string, swiftBic?: string) => Promise<void>;
  onSubmit: (id: string) => Promise<void>;
  selected: boolean;
  toggle: () => void;
}> = ({ tx, onVerify, onSubmit, selected, toggle }) => {
  const [bic, setBic] = useState(tx.swiftBic || "");
  const isPending = tx.status === "pending";
  const isVerified = tx.status === "verified";

  return (
    <tr>
      <td><input type="checkbox" checked={selected} onChange={toggle} disabled={!isVerified} /></td>
      <td>{tx.reference}</td>
      <td>{tx.beneficiary.name}</td>
      <td style={{ fontFamily: "monospace" }}>{tx.beneficiary.ibanOrAccount}</td>
      <td style={{ fontFamily: "monospace" }}>{formatAmount(tx.amount)} {tx.currency}</td>
      <td>
        <input
          value={bic}
          onChange={(e) => setBic(e.target.value.toUpperCase())}
          placeholder="SWIFT/BIC"
          style={{ width: 130 }}
          maxLength={11}
        />
      </td>
      <td>{tx.status}</td>
      <td style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => onVerify(tx._id, bic)}
          disabled={!isPending}
          className="btn btn-sm"
        >
          Verify
        </button>
        <button
          onClick={() => onSubmit(tx._id)}
          disabled={!isVerified}
          className="btn btn-sm btn-primary"
        >
          Submit
        </button>
      </td>
    </tr>
  );
};

const IntlQueue: React.FC<{ canBulkSubmit: boolean }> = ({ canBulkSubmit }) => {
  const [status, setStatus] = useState<"pending" | "verified">("pending");
  const [rows, setRows] = useState<Tx[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const selectedIds = useMemo(() => Object.keys(selected).filter((k) => selected[k]), [selected]);

  const fetchQueue = async (reset = true) => {
    const params: any = { status, limit: 50 };
    if (!reset && cursor) params.cursor = cursor;
    const { data } = await api.get<QueueResponse>("/intl/queue", { params });
    setRows((r) => (reset ? data.items : [...r, ...data.items]));
    setCursor(data.nextCursor);
  };

  useEffect(() => {
    setRows([]); setCursor(null); setSelected({});
    fetchQueue(true).catch(() => {});
  }, [status]);

  const verify = async (id: string, swiftBic?: string) => {
    await api.post(`/intl/${id}/verify`, swiftBic ? { swiftBic } : {});
    setRows((r) => r.map((x) => (x._id === id ? { ...x, status: "verified", swiftBic: swiftBic || x.swiftBic } : x)));
  };

  const submit = async (id: string) => {
    await api.post(`/intl/${id}/submit`);
    setRows((r) => r.filter((x) => x._id !== id));
  };

  const bulkSubmit = async () => {
    if (!selectedIds.length) return;
    await api.post(`/intl/submit-bulk`, { ids: selectedIds });
    setRows((r) => r.filter((x) => !selectedIds.includes(x._id)));
    setSelected({});
  };

  return (
    <div>
      <h2>International Payments Queue</h2>
      <div style={{ display: "flex", gap: 12, margin: "12px 0" }}>
        <select value={status} onChange={(e) => setStatus(e.target.value as any)}>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
        </select>
        {status === "verified" && canBulkSubmit && (
          <button onClick={bulkSubmit} className="btn btn-sm btn-primary">
            Submit Selected
          </button>
        )}
      </div>

      <div className="table-responsive">
        <table className="table" style={{ width: "100%", background: "#fff" }}>
          <thead>
            <tr>
              <th></th>
              <th>Reference</th>
              <th>Beneficiary</th>
              <th>IBAN/Account</th>
              <th>Amount</th>
              <th>SWIFT/BIC</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((tx) => {
              const isSelected = !!selected[tx._id];
              return (
                <Row
                  key={tx._id}
                  tx={tx}
                  onVerify={verify}
                  onSubmit={submit}
                  selected={isSelected}
                  toggle={() =>
                    setSelected((s) => ({ ...s, [tx._id]: !s[tx._id] }))
                  }
                />
              );
            })}
            {!rows.length && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: 24 }}>
                  No items.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {cursor && (
        <div style={{ marginTop: 12 }}>
          <button className="btn btn-sm" onClick={() => fetchQueue(false)}>
            Load more
          </button>
        </div>
      )}
    </div>
  );
};

export default IntlQueue;