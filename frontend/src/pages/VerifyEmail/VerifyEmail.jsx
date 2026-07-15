// VerifyEmail.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { ProgressSpinner } from "primereact/progressspinner";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { registrationSession, finalizeRegistration } = useAuth();
  const [status, setStatus] = useState(token ? "verifying" : "waiting");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return;

    async function verifyLink() {
      try {
        await api.post(`/auth/verify-email/${token}`);
        setStatus("verified");
        setMessage("Email verified. Completing your account...");

        if (registrationSession) {
          await finalizeRegistration(registrationSession);
          navigate("/", { replace: true });
        }
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification link could not be completed.");
      }
    }

    verifyLink();
  }, [token, registrationSession, finalizeRegistration, navigate]);

  useEffect(() => {
    if (token || !registrationSession) return;

    const poll = setInterval(async () => {
      try {
        const { data } = await api.get("/auth/verification-status", {
          params: { registrationSession },
        });

        if (data.isVerified) {
          clearInterval(poll);
          setStatus("verified");
          await finalizeRegistration(registrationSession);
          navigate("/", { replace: true });
        }
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Could not check verification status.");
      }
    }, 3000);

    return () => clearInterval(poll);
  }, [token, registrationSession, finalizeRegistration, navigate]);

  return (
    <section className="grid min-h-screen place-items-center bg-[var(--bg-base)] text-[var(--text-primary)] px-5 pt-[84px] transition-colors duration-300">
      <div className="w-full max-w-[540px] rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 text-center shadow-xl backdrop-blur-md">
        <ProgressSpinner strokeWidth="4" className="mb-6" />
        <h1 className="text-4xl font-extrabold tracking-tight">Email verification</h1>
        <p className="mx-auto mt-4 max-w-[420px] text-sm leading-7 text-[var(--text-secondary)]">
          {token
            ? "We are checking your verification link."
            : "Open the verification link from your inbox. This page will finish registration automatically."}
        </p>

        {message && <Message severity={status === "error" ? "error" : "success"} text={message} className="mt-6 w-full" />}

        {!registrationSession && !token && (
          <div className="mt-7">
            <Button as={Link} to="/register" label="Register again" icon="pi pi-refresh" className="font-bold" />
          </div>
        )}
      </div>
    </section>
  );
}
