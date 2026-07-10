import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Message } from "primereact/message";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await register(form);
      navigate("/verify-email", { replace: true, state: { email: form.email } });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#050505] px-5 pb-20 pt-[120px] text-white">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-[520px] rounded-[28px] border border-white/14 bg-white/[0.08] p-6 shadow-[0_30px_90px_-46px_rgba(0,0,0,1)] backdrop-blur-3xl md:p-8"
      >
        <span className="text-xs font-semibold uppercase text-white/48">Create account</span>
        <h1 className="mt-3 text-4xl">Start with HamRahi</h1>

        <div className="mt-7 flex flex-col gap-5">
          <label className="flex flex-col gap-2 text-sm font-semibold text-white/70">
            Name
            <InputText value={form.name} onChange={(event) => updateField("name", event.target.value)} required placeholder="Your name" />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-white/70">
            Email
            <InputText value={form.email} onChange={(event) => updateField("email", event.target.value)} type="email" required placeholder="you@example.com" />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-white/70">
            Password
            <Password value={form.password} onChange={(event) => updateField("password", event.target.value)} required toggleMask inputClassName="w-full" className="w-full" />
          </label>
        </div>

        {error && <Message severity="error" text={error} className="mt-5 w-full" />}

        <Button type="submit" label="Send verification email" icon="pi pi-envelope" loading={submitting} className="mt-7 w-full justify-center" />

        <p className="mt-5 text-center text-sm text-white/54">
          Already registered? <Link className="font-semibold text-white" to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
}
