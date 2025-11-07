import React, { useMemo, useState } from "react";
import MainNavBar from "../components/Dashboard/MainNavBar";
import DashboardSidebar from "../components/Dashboard/DashboardSideBar";
import "../css/DashboardPage/DashboardPage.css";
import AdminSubmitted from "../components/Staff/AdminSubmitted";
import { FaUserTie, FaUsers, FaHistory, FaPlus } from "react-icons/fa";
import IntlQueue from "../components/Staff/IntlQueue";
import AdminDashboard from "../components/Staff/AdminDashboard";
import { createEmployee } from "../lib/staffApi";
import { ensureCsrf } from "../lib/csrf";
import AdminCustomers from "../components/Staff/AdminCustomers";

type AdminView = "staff" | "customers" | "payments" | "submitted" | "reports";

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

const AdminDashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<AdminView>("staff");

  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [form, setForm] = useState<NewStaff>({
    firstName: "",
    surname: "",
    idNumber: "",
    username: "",
    password: "",
    department: "",
    staffId: "",
  });

  const handleSelect = (option: string) => {
    const allowed: AdminView[] = ["staff", "customers", "payments", "reports"];
    setActiveView(allowed.includes(option as AdminView) ? (option as AdminView) : "staff");
    setSidebarOpen(false);
  };

  const openModal = () => {
    setMsg("");
    setForm({
      firstName: "",
      surname: "",
      idNumber: "",
      username: "",
      password: "",
      department: "",
      staffId: "",
    });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const valid = useMemo(() => {
    if (!nameRx.test(form.firstName.trim())) return false;
    if (!nameRx.test(form.surname.trim())) return false;
    if (!idRx.test(form.idNumber.trim())) return false;
    if (!usernameRx.test(form.username.trim())) return false;
    if (!strongPwRx.test(form.password)) return false;
    if (form.staffId && !staffIdRx.test(form.staffId.trim().toUpperCase())) return false;
    return true;
  }, [form]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) {
      setMsg("Please fix highlighted fields.");
      return;
    }

    setSubmitting(true);
    setMsg("");
    try {
      await ensureCsrf();
      await createEmployee({
        firstName: form.firstName.trim(),
        surname: form.surname.trim(),
        idNumber: form.idNumber.trim(),
        username: form.username.trim().toLowerCase(),
        password: form.password,
        department: form.department?.trim() || undefined,
        staffId: form.staffId?.trim().toUpperCase() || undefined,
      });
      setShowModal(false);
      setRefreshKey((k) => k + 1);
    } catch (err: any) {
      setMsg(err?.message || "Failed to create staff.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <MainNavBar
        onProfileClick={() => setSidebarOpen(true)}
        onNavigate={handleSelect}
        onMenuClick={() => setSidebarOpen(true)}
      />

      <div className="dashboard-main">
        <DashboardSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSelect={handleSelect}
          role="admin"
        />

        <div className="dashboard-content fade-in">
          {/* Quick actions */}
          <div className="row g-3 mb-3">
            <div className="col-12 col-sm-6 col-lg-3">
              <button
                className="btn w-100 btn-light p-3 shadow-sm d-flex align-items-center gap-2"
                onClick={openModal}
              >
                <FaPlus /> Add Staff
              </button>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <button
                className="btn w-100 btn-light p-3 shadow-sm d-flex align-items-center gap-2"
                onClick={() => setActiveView("staff")}
              >
                <FaUserTie /> Staff Users
              </button>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <button
                className="btn w-100 btn-light p-3 shadow-sm d-flex align-items-center gap-2"
                onClick={() => setActiveView("customers")}
              >
                <FaUsers /> Customers
              </button>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <button
                className="btn w-100 btn-light p-3 shadow-sm d-flex align-items-center gap-2"
                onClick={() => setActiveView("payments")}
              >
                <FaHistory /> Payments Queue
              </button>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <button
                className="btn w-100 btn-light p-3 shadow-sm d-flex align-items-center gap-2"
                onClick={() => setActiveView("submitted")}
              >
                <FaHistory /> Submitted Payments
              </button>
            </div>
          </div>

          {/* Views */}
          {activeView === "staff" && <AdminDashboard key={refreshKey} />}
          {activeView === "customers" && <AdminCustomers />}            {/* NEW */}
          {activeView === "payments" && <IntlQueue canBulkSubmit={true} />}
          {activeView === "submitted" && <AdminSubmitted />}            {/* NEW */}
          {activeView === "reports" && <p>Reports &amp; Analytics Coming Soon</p>}
        </div>
      </div>

      {showModal && (
        <>
          <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-modal="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Staff Member</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={closeModal}
                  />
                </div>

                <form onSubmit={submit} noValidate>
                  <div className="modal-body">
                    {msg && <div className="alert alert-danger py-2">{msg}</div>}

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">First Name*</label>
                        <input
                          className={`form-control ${
                            form.firstName && !nameRx.test(form.firstName) ? "is-invalid" : ""
                          }`}
                          name="firstName"
                          value={form.firstName}
                          onChange={onChange}
                          required
                        />
                        <div className="invalid-feedback">2–40 letters only.</div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Surname*</label>
                        <input
                          className={`form-control ${
                            form.surname && !nameRx.test(form.surname) ? "is-invalid" : ""
                          }`}
                          name="surname"
                          value={form.surname}
                          onChange={onChange}
                          required
                        />
                        <div className="invalid-feedback">2–40 letters only.</div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">South African ID*</label>
                        <input
                          className={`form-control ${
                            form.idNumber && !idRx.test(form.idNumber) ? "is-invalid" : ""
                          }`}
                          name="idNumber"
                          value={form.idNumber}
                          onChange={onChange}
                          inputMode="numeric"
                          maxLength={13}
                          required
                        />
                        <div className="invalid-feedback">Must be exactly 13 digits.</div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Username*</label>
                        <input
                          className={`form-control ${
                            form.username && !usernameRx.test(form.username) ? "is-invalid" : ""
                          }`}
                          name="username"
                          value={form.username}
                          onChange={onChange}
                          required
                        />
                        <div className="invalid-feedback">4–20 chars: letters, numbers, _</div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Password* (strong)</label>
                        <input
                          type="password"
                          className={`form-control ${
                            form.password && !strongPwRx.test(form.password) ? "is-invalid" : ""
                          }`}
                          name="password"
                          value={form.password}
                          onChange={onChange}
                          required
                        />
                        <div className="form-text">
                          Min 12 chars, include upper, lower, number, special (e.g. <code>StrongPass#2025</code>)
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Department</label>
                        <input
                          className="form-control"
                          name="department"
                          value={form.department}
                          onChange={onChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Staff ID (optional)</label>
                        <input
                          className={`form-control ${
                            form.staffId && !staffIdRx.test(form.staffId.toUpperCase())
                              ? "is-invalid"
                              : ""
                          }`}
                          name="staffId"
                          value={form.staffId}
                          onChange={onChange}
                          placeholder="e.g. OPS-001"
                        />
                        <div className="invalid-feedback">3–32 chars, A–Z, 0–9, hyphen.</div>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary" onClick={closeModal}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={submitting || !valid}>
                      {submitting ? "Creating..." : "Create Staff"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Backdrop */}
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default AdminDashboardPage;