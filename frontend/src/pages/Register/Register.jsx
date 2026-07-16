// Register.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Message } from "primereact/message";
import { ProgressSpinner } from "primereact/progressspinner";
import { useAuth } from "../../context/AuthContext";
import GoogleAuthButton from "../../components/GoogleAuthButton/GoogleAuthButton";
import api from "../../services/api";

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    googleLogin,
    finalizeRegistration,
  } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [registrationSession, setRegistrationSession] = useState(null);
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
  };

  const handleGoogleSuccess = async (credential) => {
    setError("");

    try {
      await googleLogin(credential);

      navigate("/", {
        replace: true,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Google login failed. Please try again."
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      const data = await register(form);

      setRegistrationSession(data.registrationSession);

      setWaiting(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!registrationSession) return;

    const poll = setInterval(async () => {
      try {
        const { data } = await api.get(
          "/auth/verification-status",
          {
            params: {
              registrationSession,
            },
          }
        );

        if (!data.isVerified) return;

        clearInterval(poll);

        await finalizeRegistration(
          registrationSession
        );

        navigate("/", {
          replace: true,
        });
      }
        catch (err) {
          setError(
            err.response?.data?.message ||
            "Unable to check verification status."
          );
        }
    }, 3000);

    return () => clearInterval(poll);
  }, [
    registrationSession,
    finalizeRegistration,
    navigate,
  ]);

  if (waiting) {
    return (
      <section className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] px-5 pb-20 pt-[120px] transition-colors duration-300 flex items-center justify-center">
        <div className="mx-auto w-full max-w-[520px] rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 shadow-xl backdrop-blur-md text-center">

          <ProgressSpinner
            strokeWidth="4"
            className="mb-6"
          />

          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Email Verification
          </span>

          <h1 className="mt-3 text-4xl font-extrabold tracking-tight">
            Check your inbox
          </h1>

          <p className="mt-6 text-[var(--text-secondary)] leading-7">
            We've sent a verification link to
            <br />

            <span className="font-semibold text-[var(--text-primary)]">
              {form.email}
            </span>

            <br />
            <br />

            Verify your email and this page will
            automatically continue.
          </p>

          {error && (
            <Message
              severity="error"
              text={error}
              className="mt-6 w-full"
            />
          )}
        </div>
      </section>
    );
  }

    return (
    <section className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] px-5 pb-20 pt-[120px] transition-colors duration-300 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-[520px] w-full rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-xl backdrop-blur-md md:p-8"
      >
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          Create account
        </span>

        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
          Start with HamRahi
        </h1>

        <div className="mt-7 flex flex-col gap-5">
          <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--text-secondary)]">
            Name
            <InputText
              value={form.name}
              onChange={(event) =>
                updateField("name", event.target.value)
              }
              required
              placeholder="Your name"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--text-secondary)]">
            Email
            <InputText
              type="email"
              value={form.email}
              onChange={(event) =>
                updateField("email", event.target.value)
              }
              required
              placeholder="you@example.com"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--text-secondary)]">
            Password
            <Password
              value={form.password}
              onChange={(event) =>
                updateField("password", event.target.value)
              }
              required
              toggleMask
              feedback={false}
              inputClassName="w-full"
              className="w-full"
              placeholder="Password"
            />
          </label>
        </div>

        {error && (
          <Message
            severity="error"
            text={error}
            className="mt-5 w-full"
          />
        )}

        <Button
          type="submit"
          label="Create Account"
          icon="pi pi-user-plus"
          loading={submitting}
          className="mt-7 w-full justify-center font-bold"
        />

        <div className="mt-6 flex items-center gap-4 text-xs uppercase text-[var(--text-secondary)]/50">
          <span className="h-px flex-1 bg-[var(--border-subtle)]" />
          OR
          <span className="h-px flex-1 bg-[var(--border-subtle)]" />
        </div>

        <GoogleAuthButton
          className="mt-6"
          onSuccess={handleGoogleSuccess}
          onError={setError}
        />

        <p className="mt-5 text-center text-sm text-[var(--text-secondary)]">
          Already registered?{" "}
          <Link
            className="font-semibold text-[var(--text-primary)] hover:underline"
            to="/login"
          >
            Login
          </Link>
        </p>
      </form>
    </section>
  );
}