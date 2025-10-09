import React, { useState } from "react";
import styles from "../../css/RegisterPage/Register.module.css";

const Register: React.FC = () => {
  
    const [form, setForm] = useState({
      firstName: "",
      surname: "",
      idNumber: "",
      username: "",
      password: "",
      confirmPassword: "",
    });

    const [csrfToken, setCsrfToken] = useState<string | null>(null);
    const [message, setMessage] = useState("");

    React.useEffect(() => {
      fetch("https://localhost:8443/api/auth/csrf", {
        method: "POST",
        credentials: "include",
      })
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrf))
      .catch(() => setMessage("Failed to fetch CSRF token"));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const key = name.toLowerCase().replace(" ", "");
      setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setMessage("Processing...");

      try {
        const res = await fetch("https://localhost:8443/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken ?? "",
          },
          credentials: "include",
          body: JSON.stringify(form),
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
        } else {
          setMessage(`${data.error || "Registration Failed."}`);
        }
      } catch (err) {
        console.error(err);
        setMessage("Something went wrong. Try again later.");
      }
    };

  return (
    <form onSubmit={handleSubmit} className={`text-center ${styles.registerContainer}`}>
      <div className={styles.logoSection}>
        <div className={styles.logoCircle}>
          <span className={styles.logoText}>CI</span>
        </div>
      </div>
      <h5 className="mb-4 fw-semibold">Register</h5>

      <input type="text" className="form-control mb-3" placeholder="First Name" value={form.firstName} onChange={handleChange} />
      <input type="text" className="form-control mb-3" placeholder="Surname" value={form.surname} onChange={handleChange}/>
      <input type="text" className="form-control mb-3" placeholder="ID Number" value={form.idNumber} onChange={handleChange} />
      <input type="text" className="form-control mb-3" placeholder="Username" value={form.username} onChange={handleChange}/>
      <input type="password" className="form-control mb-3" placeholder="Password" value={form.password} onChange={handleChange}/>
      <input type="password" className="form-control mb-3" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange}/>

      <button type="submit" className="btn btn-primary w-100 mt-3">Register</button>

      {message && <p className="mt-3">{message}</p>}
    </form>
  );
};

export default Register;