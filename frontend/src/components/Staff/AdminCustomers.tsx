import React, { useEffect, useState } from "react";
import { listCustomers } from "../../lib/staffApi";

type UserRow = {
  _id: string;
  firstName: string;
  surname: string;
  username: string;
  accountNumber: string;
  createdAt?: string;
};

const AdminCustomers: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<UserRow[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const items = await listCustomers();
        setRows(items);
      } catch (e: any) {
        setErr(e?.message || "Failed to fetch customers");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading…</p>;
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
            {rows.map((u) => (
              <tr key={u._id}>
                <td>{u.accountNumber}</td>
                <td>{u.firstName} {u.surname}</td>
                <td>{u.username}</td>
                <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: "center", opacity: 0.7 }}>No customers yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminCustomers;
