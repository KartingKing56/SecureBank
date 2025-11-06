import React, { useEffect, useState } from "react";
import { api } from "../../lib/staffApi";

type EmployeeRow = {
  _id: string;
  firstName: string;
  surname: string;
  username: string;
  accountNumber: string;
  employee?: {
    staffId?: string;
    department?: string;
    active?: boolean;
  };
  createdAt: string;
};

const AdminEmployees: React.FC = () => {
  const [rows, setRows] = useState<EmployeeRow[]>([]);
  const [form, setForm] = useState({
    firstName: "",
    surname: "",
    idNumber: "",
    username: "",
    email: "",
    password: "",
    staffId: "",
    department: "",
  });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data } = await api.get<EmployeeRow[]>("/admin/employees");
    setRows(data);
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/admin/employees", form);
      setForm({
        firstName: "",
        surname: "",
        idNumber: "",
        username: "",
        email: "",
        password: "",
        staffId: "",
        department: "",
      });
      await load();
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const toggle = async (id: string, active: boolean) => {
    await api.patch(`/admin/employees/${id}/active`, { active });
    await load();
  };

  const resetPw = async (id: string) => {
    const pw = prompt("New password (12+ strong):");
    if (!pw) return;
    await api.patch(`/admin/employees/${id}/password`, { password: pw });
    alert("Password reset.");
  };

  return (
    <div>
      <h2>Admin — Employees</h2>

      <form onSubmit={create} style={{ display: "grid", gap: 8, maxWidth: 700, marginTop: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <input placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
          <input placeholder="Surname" value={form.surname} onChange={(e) => setForm({ ...form, surname: e.target.value })} required />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <input placeholder="ID number" value={form.idNumber} onChange={(e) => setForm({ ...form, idNumber: e.target.value })} required />
          <input placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <input placeholder="Staff ID" value={form.staffId} onChange={(e) => setForm({ ...form, staffId: e.target.value })} required />
          <input placeholder="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
        </div>
        <div>
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create employee"}
          </button>
        </div>
      </form>

      <div style={{ marginTop: 24 }}>
        <h3>Existing Employees</h3>
        <div className="table-responsive">
          <table className="table" style={{ width: "100%", background: "#fff" }}>
            <thead>
              <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Staff ID</th>
                <th>Department</th>
                <th>Account</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r._id}>
                  <td>{r.username}</td>
                  <td>{r.firstName} {r.surname}</td>
                  <td>{r.employee?.staffId || "-"}</td>
                  <td>{r.employee?.department || "-"}</td>
                  <td style={{ fontFamily: "monospace" }}>{r.accountNumber}</td>
                  <td>{r.employee?.active ? "Yes" : "No"}</td>
                  <td style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-sm" onClick={() => toggle(r._id, !(r.employee?.active ?? true))}>
                      {r.employee?.active ? "Disable" : "Enable"}
                    </button>
                    <button className="btn btn-sm" onClick={() => resetPw(r._id)}>Reset PW</button>
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: 24 }}>No employees found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminEmployees;