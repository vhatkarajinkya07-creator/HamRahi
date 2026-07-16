// VerifyEmail.jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { ProgressSpinner } from "primereact/progressspinner";
import api from "../../services/api";

export default function VerifyEmail() {
  const { verificationToken } = useParams();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const { data } = await api.post(
          `/auth/verify-email/${verificationToken}`
        );

        setStatus("success");
        setMessage(
          data.message || "Your email has been verified successfully."
        );
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "Verification link is invalid or has expired."
        );
      }
    };

    verifyEmail();
  }, [verificationToken]);

  return (
    <section className="grid min-h-screen place-items-center bg-[var(--bg-base)] text-[var(--text-primary)] px-5 pt-[84px] transition-colors duration-300">
      <div className="w-full max-w-[540px] rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 text-center shadow-xl backdrop-blur-md">

        {status === "verifying" && (
          <ProgressSpinner
            strokeWidth="4"
            className="mb-6"
          />
        )}

        <h1 className="text-4xl font-extrabold tracking-tight">
          {status === "verifying"
            ? "Verifying Email"
            : status === "success"
            ? "Email Verified"
            : "Verification Failed"}
        </h1>

        <p className="mx-auto mt-4 max-w-[420px] text-sm leading-7 text-[var(--text-secondary)]">
          {status === "verifying"
            ? "Please wait while we verify your email address..."
            : status === "success"
            ? "Your email has been successfully verified. You can safely close this tab. HamRahi will automatically complete your registration in the original window."
            : "The verification link is invalid or has expired. Please try registering again."}
        </p>

        {message && (
          <Message
            severity={status === "error" ? "error" : "success"}
            text={message}
            className="mt-6 w-full"
          />
        )}
      </div>
    </section>
  );
}