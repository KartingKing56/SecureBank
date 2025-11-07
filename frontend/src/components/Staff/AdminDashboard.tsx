import React, { useEffect, useMemo, useState } from "react";
import { listEmployees, listCustomers, createEmployee } from "../../lib/staffApi";

type UserRow = {
  _id: string;
  firstName: string;
  surname: string;
  username: string;
  accountNumber: string;
  role: "customer" | "employee" | "admin";
  employee?: { staffId?: string; department?: string; active?: boolean } | null;
  createdAt?: string;
};

type NewStaff = {
  firstName: string;
  surname: string;
  idNumber: string;
  username: string;
  password: string;
  department?: string;
  staffId?: string;
};

const nameRx = /^[A-Za-z]{2,40}$/;
const usernameRx = /^[A-Za-z0-9_]{4,20}$/;
const idRx = /^\d{13}$/;
const strongPwRx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;
const staffIdRx = /^[A-Z0-9\-]{3,32}$/;

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<UserRow[]>([]);
  const [customers, setCustomers] = useState<UserRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string>("");

  const [form, setForm] = useState<NewStaff>({
    firstName: "",
    surname: "",
    idNumber: "",
    username: "",
    password: "",
    department: "",
    staffId: "",
  });

  useEffect(() => {
    const run = async () => {
      try {
        const [emps, custs] = await Promise.all([listEmployees(), listCustomers()]);
        setEmployees(emps);
        setCustomers(custs);
      } catch (e: any) {
        setError(e?.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const resetForm = () =>
    setForm({
      firstName: "",
      surname: "",
      idNumber: "",
      username: "",
      password: "",
      department: "",
      staffId: "",
    });

  const valid = useMemo(() => {
    if (!nameRx.test(form.firstName.trim())) return false;
    if (!nameRx.test(form.surname.trim())) return false;
    if (!idRx.test(form.idNumber.trim())) return false;
    if (!usernameRx.test(form.username.trim())) return false;
    if (!strongPwRx.test(form.password)) return false;
    if (form.staffId && !staffIdRx.test(form.staffId.trim().toUpperCase())) return false;
    return true;
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = () => {
    setMsg("");
    resetForm();
    setShowModal(true);
  };

  const submitNewStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) {
      setMsg("Please fix the highlighted fields.");
      return;
    }
    setSubmitting(true);
    setMsg("");
    try {
      const payload: NewStaff = {
        firstName: form.firstName.trim(),
        surname: form.surname.trim(),
        idNumber: form.idNumber.trim(),
        username: form.username.trim().toLowerCase(),
        password: form.password,
        department: form.department?.trim() || undefined,
        staffId: form.staffId?.trim().toUpperCase() || undefined,
      };
      const created = await createEmployee(payload);

      setEmployees((prev) => [
        {
          _id: created.id || created._id,
          firstName: created.firstName,
          surname: created.surname,
          username: created.username,
          accountNumber: created.accountNumber,
          role: "employee",
          employee: {
            staffId: created.employee?.staffId,
            department: created.employee?.department,
            active: true,
          },
        },
        ...prev,
      ]);

      setShowModal(false);
      resetForm();
    } catch (e: any) {
      setMsg(e?.message || "Failed to create staff member");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2>Admin — User Management</h2>
        <button onClick={openModal} className="btn btn-primary">+ Add Staff</button>
      </div>

      {/* Lists */}
      <div style={{ display: "grid", gap: 24, gridTemplateColumns: "1fr 1fr" }}>
        <section>
          <h3>Staff</h3>
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>Staff ID</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Department</th>
                  <th>Active</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((u) => (
                  <tr key={u._id}>
                    <td>{u.employee?.staffId || "—"}</td>
                    <td>{u.firstName} {u.surname}</td>
                    <td>{u.username}</td>
                    <td>{u.employee?.department || "—"}</td>
                    <td>{u.employee?.active ? "Yes" : "No"}</td>
                  </tr>
                ))}
                {employees.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: "center", opacity: 0.7 }}>No staff yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section>
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
                {customers.map((u) => (
                  <tr key={u._id}>
                    <td>{u.accountNumber}</td>
                    <td>{u.firstName} {u.surname}</td>
                    <td>{u.username}</td>
                    <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign: "center", opacity: 0.7 }}>No customers yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Add Staff Member</h3>
            <form onSubmit={submitNewStaff}>
              <div className="grid-2">
                <label>
                  First Name*
                  <input name="firstName" value={form.firstName} onChange={handleChange} required />
                </label>
                <label>
                  Surname*
                  <input name="surname" value={form.surname} onChange={handleChange} required />
                </label>
                <label>
                  South African ID*
                  <input name="idNumber" value={form.idNumber} onChange={handleChange} required />
                </label>
                <label>
                  Username*
                  <input name="username" value={form.username} onChange={handleChange} required />
                </label>
                <label>
                  Password* (12+ strong)
                  <input type="password" name="password" value={form.password} onChange={handleChange} required />
                </label>
                <label>
                  Department
                  <input name="department" value={form.department} onChange={handleChange} />
                </label>
                <label>
                  Staff ID (optional)
                  <input name="staffId" value={form.staffId} onChange={handleChange} placeholder="e.g. OPS-001" />
                </label>
              </div>

              {msg && <p style={{ color: "crimson" }}>{msg}</p>}

              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button type="button" className="btn" onClick={() => setShowModal(false)} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting || !valid}>
                  {submitting ? "Creating…" : "Create Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;