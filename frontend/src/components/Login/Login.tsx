import React, { useEffect, useState } from "react";
import styles from "../../css/LoginPage/Login.module.css";
import { useNavigate, Link } from "react-router-dom";

const usernameRegex = /^[A-Za-z0-9_]{4,20}$/;
const accountRegex = /^\d{10}$/;

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    accountNumber: "",
    password: "",
  });
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/auth/csrf", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrf))
      .catch(() => setMessage("Failed to fetch CSRF token"));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!usernameRegex.test(form.username.trim()))
      return "Invalid username (4–20 letters, numbers, underscore)";
    if (!accountRegex.test(form.accountNumber.trim()))
      return "Invalid account number (10 digits)";
    if (!form.password) return "Password is required";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!csrfToken) {
      setMessage("CSRF token missing. Refresh and try again.");
      return;
    }

    const err = validate();
    if (err) {
      setMessage(err);
      return;
    }

    const payload = {
      username: form.username.trim().toLowerCase(),
      accountNumber: form.accountNumber.trim(),
      password: form.password,
    };

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
      }

      if (res.ok) {
        if (data.accessToken) localStorage.setItem("accessToken", data.accessToken);
        if (data.role) localStorage.setItem("role", data.role);

        if (data.role === "admin" || data.role === "employee") {
          navigate("/staff", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
        return;
      }

      if (res.status === 401) {
        setMessage("Invalid credentials");
      } else if (res.status === 403) {
        setMessage(data?.error === "employee_disabled"
          ? "Your employee account is disabled. Contact an administrator."
          : "CSRF blocked. Refresh the page and try again.");
      } else {
        setMessage(data?.error || "Login failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginContainer}>
        <div className={styles.logoSection}>
          <div className={styles.logoCircle}>
            <span className={styles.logoText}>CI</span>
          </div>
        </div>

        <h2 className={styles.heading}>Login</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.formGroup}>
            <input
              type="text"
              name="username"
              placeholder="Username *"
              value={form.username}
              onChange={handleChange}
              className={styles.input}
              required
              autoComplete="username"
              pattern="[A-Za-z0-9_]{4,20}"
            />
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              name="accountNumber"
              placeholder="Account Number *"
              value={form.accountNumber}
              onChange={handleChange}
              className={styles.input}
              required
              inputMode="numeric"
              maxLength={10}
              pattern="\\d{10}"
            />
          </div>

          <div className={styles.formGroup}>
            <input
              type="password"
              name="password"
              placeholder="Password *"
              value={form.password}
              onChange={handleChange}
              className={styles.input}
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className={styles.loginBtn} disabled={submitting}>
            {submitting ? "Signing in..." : "Login"}
          </button>
        </form>

        {message && <p className="mt-3">{message}</p>}

        <div className={styles.signupText}>
          Don’t have an account? <Link to="/register">Register!</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;