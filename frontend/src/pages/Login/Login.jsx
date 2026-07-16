// Login.jsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Message } from "primereact/message";
import { useAuth } from "../../context/AuthContext";
import GoogleAuthButton from "../../components/GoogleAuthButton/GoogleAuthButton";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, googleLogin } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/";

  const handleGoogleSuccess = async (credential) => {
    setError("");
    try {
      await googleLogin(credential);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Google login failed. Please try again.");
    }
  };

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const t = await login(form);
      console.log(t)
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your email and password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] px-5 pb-20 pt-[120px] transition-colors duration-300 flex items-center justify-center">
      <div className="mx-auto grid max-w-[1120px] w-full gap-8 lg:grid-cols-[1fr_430px] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2 text-xs font-semibold uppercase text-[var(--text-secondary)] shadow-sm">
            HamRahi account
          </span>
          <h1 className="mt-6 max-w-[640px] text-5xl font-extrabold tracking-tight leading-[1.05] text-[var(--text-primary)] md:text-7xl">
            Pick up your trip where you left it.
          </h1>
          <p className="mt-6 max-w-[560px] text-base leading-8 text-[var(--text-secondary)]">
            Login keeps your wishlist and AI itinerary requests connected through the backend cookie session.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-xl backdrop-blur-md md:p-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">Login</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Use the same email and password registered with HamRahi.</p>

          <div className="mt-7 flex flex-col gap-5">
            <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--text-secondary)]">
              Email
              <InputText
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                type="email"
                required
                className="w-full"
                placeholder="you@example.com"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--text-secondary)]">
              Password
              <Password
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
                required
                feedback={false}
                toggleMask
                inputClassName="w-full"
                className="w-full"
                placeholder="Password"
              />
            </label>
          </div>

          {error && <Message severity="error" text={error} className="mt-5 w-full" />}

          <Button
            type="submit"
            label="Login"
            icon="pi pi-sign-in"
            loading={submitting}
            className="mt-7 w-full justify-center font-bold"
          />

          <div className="mt-6 flex items-center gap-4 text-xs uppercase text-[var(--text-secondary)]/50">
            <span className="h-px flex-1 bg-[var(--border-subtle)]" />
            or
            <span className="h-px flex-1 bg-[var(--border-subtle)]" />
          </div>

          <GoogleAuthButton className="mt-6" onSuccess={handleGoogleSuccess} onError={setError} />

          <p className="mt-5 text-center text-sm text-[var(--text-secondary)]">
            New here? <Link className="font-semibold text-[var(--text-primary)] hover:underline" to="/register">Create account</Link>
          </p>
        </motion.form>
      </div>
    </section>
  );
}
