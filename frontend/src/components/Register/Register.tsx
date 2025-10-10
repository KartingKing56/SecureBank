import React, { useState, useEffect, useMemo } from "react";
import styles from "../../css/RegisterPage/Register.module.css";

const regex = {
  firstName: /^[A-Za-z]{2,30}$/,
  surname: /^[A-Za-z]{2,40}$/,
  idNumber: /^\d{13}$/,
  username: /^[A-Za-z0-9_]{4,20}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/,
};

type Form = {
  firstName: string;
  surname: string;
  idNumber: string;
  username: string;
  password: string;
  confirmPassword: string;
};

const Register: React.FC = () => {
  
    const [form, setForm] = useState<Form>({
      firstName: "",
      surname: "",
      idNumber: "",
      username: "",
      password: "",
      confirmPassword: "",
    });

    const [csrfToken, setCsrfToken] = useState<string | null>(null);
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
    const [submitting, setSubmitting] = useState(false);

    React.useEffect(() => {
      fetch("/api/auth/csrf", {
        method: "POST",
        credentials: "include",
      })
      .then((res) => res.json())
      .then(({ csrf }) => setCsrfToken(csrf))
      .catch(() => setMessage("Failed to fetch CSRF token"));
    }, []);

    const setField = 
      (name: keyof Form) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      };

    const validate = (data: Form) => {
      const e: Partial<Record<keyof Form, string>> = {};
      if (!regex.firstName.test(data.firstName)) e.firstName = "Letters only, 2–30 chars";
      if (!regex.surname.test(data.surname)) e.surname = "Letters only, 2–40 chars";
      if (!regex.idNumber.test(data.idNumber)) e.idNumber = "Must be exactly 13 digits";
      if (!regex.username.test(data.username)) e.username = "4–20 chars: letters, numbers, underscore";
      if (!regex.password.test(data.password))
        e.password = "12+ chars incl. upper, lower, number, special";
      if (data.confirmPassword !== data.password) e.confirmPassword = "Passwords do not match";
      return e;
    };

    const formIsValid = useMemo(() => Object.keys(validate(form)).length === 0, [form]);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setMessage("Processing...");

      const trimmed: Form = {
        firstName: form.firstName.trim(),
        surname: form.surname.trim(),
        idNumber: form.idNumber.trim(),
        username: form.username.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      };

      const v = validate(trimmed);
      if (Object.keys(v).length) {
        setErrors(v);
        setMessage("Please fix the highlighted fields.");
        return;
      }

      setSubmitting(true);
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken ?? "",
          },
          credentials: "include",
          body: JSON.stringify(trimmed),
        });

        const data = await res.json();
        if (res.ok) {
          setMessage(`Account created! Your account number: ${data.accountNumber}`);
          setForm({
            firstName: "",
            surname: "",
            idNumber: "",
            username: "",
            password: "",
            confirmPassword: "",
          });
          setErrors({});
        } else {
          setMessage(`${data.error || "Registration Failed."}`);
        }
      } catch {
        setMessage("Something went wrong. Try again later.");
      } finally {
        setSubmitting(false);
      }
    };

  return (
    <form onSubmit={handleSubmit} className={`text-center ${styles.registerContainer}`} noValidate>
      <div className={styles.logoSection}>
        <div className={styles.logoCircle}>
          <span className={styles.logoText}>CI</span>
        </div>
      </div>
      <h5 className="mb-4 fw-semibold">Register</h5>

      <input 
          type="text" 
          className="form-control mb-3" 
          name="firstName" placeholder="First Name" 
          value={form.firstName} 
          onChange={setField("firstName")}
          pattern="[A-Za-z]{2,30}"
          autoComplete="given-name"
          aria-invalid={!!errors.firstName}
          aria-describedby="err-firstName"
      />
      {errors.firstName && <small id="err-firstName" className="text-danger d-block mb-2">{errors.firstName}</small>}

      <input 
        type="text" 
        className="form-control mb-3" 
        name="surname" 
        placeholder="Surname" 
        value={form.surname} 
        onChange={setField("surname")}
        pattern="[A-Za-z]{2,40}"
        autoComplete="family-name"
        aria-invalid={!!errors.surname}
        aria-describedby="err-surname"
      />
      {errors.surname && <small id="err-surname" className="text-danger d-block mb-2">{errors.surname}</small>}

      <input 
        type="text" 
        className="form-control mb-3" 
        name="idNumber" 
        placeholder="ID Number" 
        value={form.idNumber} 
        onChange={setField("idNumber")}
        inputMode="numeric"
        maxLength={13}
        pattern="\d{13}"
        aria-invalid={!!errors.idNumber}
        aria-describedby="err-idNumber"
      />
      {errors.idNumber && <small id="err-idNumber" className="text-danger d-block mb-2">{errors.idNumber}</small>}

      <input 
        type="text" 
        className="form-control mb-3" 
        name="username" 
        placeholder="Username" 
        value={form.username} 
        onChange={setField("username")}
        pattern="[A-Za-z0-9_]{4,20}"
        autoComplete="username"
        aria-invalid={!!errors.username}
        aria-describedby="err-username"
      />
      {errors.username && <small id="err-username" className="text-danger d-block mb-2">{errors.username}</small>}

      <input 
        type="password" 
        className="form-control mb-3" 
        name="password" 
        placeholder="Password" 
        value={form.password} 
        onChange={setField("password")}
        autoComplete="new-password"
        aria-invalid={!!errors.password}
        aria-describedby="err-password"
      />
      {errors.password && <small id="err-password" className="text-danger d-block mb-2">{errors.password}</small>}

      <input 
        type="password" 
        className="form-control mb-3" 
        name="confirmPassword" 
        placeholder="Confirm Password" 
        value={form.confirmPassword} 
        onChange={setField("confirmPassword")}
        autoComplete="new-password"
        aria-invalid={!!errors.confirmPassword}
        aria-describedby="err-confirmPassword"
      />
      {errors.confirmPassword && ( <small id="err-confirmPassword" className="text-danger d-block mb-2"> {errors.confirmPassword} </small> )}

      <button 
        type="submit" 
        className="btn btn-primary w-100 mt-3"
        disabled={submitting || !formIsValid}
        >
          {submitting ? "Registering..." : "Register"}
      </button>

      {message && <p className="mt-3">{message}</p>}
    </form>
  );
};

export default Register;