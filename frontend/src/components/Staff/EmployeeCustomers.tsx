import React, { useEffect, useState } from "react";
import { listStaffCustomers } from "../../lib/staffApi";

type Row = {
  _id: string;
  firstName: string;
  surname: string;
  username: string;
  accountNumber: string;
  createdAt?: string;
};

const EmployeeCustomers: React.FC = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const data = await listStaffCustomers({ limit: 100 });
        setRows(data.items);
        setCursor(data.nextCursor);
      } catch (e: any) {
        setErr(e?.message || "Failed to load customers");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const loadMore = async () => {
    if (!cursor) return;
    setMoreLoading(true);
    try {
      const data = await listStaffCustomers({ limit: 100, cursor });
      setRows(prev => [...prev, ...data.items]);
      setCursor(data.nextCursor);
    } catch (e: any) {
      setErr(e?.message || "Failed to load more");
    } finally {
      setMoreLoading(false);
    }
  };

  if (loading) return <p>Loading customers…</p>;
  if (err) return <p style={{ color: "crimson" }}>{err}</p>;

  return (
    <section className="fade-in">
      <h3>Customers</h3>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Account</th>
              <th>Name</th>
              <th>Username</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r._id}>
                <td>{r.accountNumber}</td>
                <td>{r.firstName} {r.surname}</td>
                <td>{r.username}</td>
                <td>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: "center", opacity: 0.7 }}>No customers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {cursor && (
        <div className="mt-2">
          <button className="btn btn-light" onClick={loadMore} disabled={moreLoading}>
            {moreLoading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </section>
  );
};

export default EmployeeCustomers;
