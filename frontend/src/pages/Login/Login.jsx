import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "../../animations/variants";

export default function Login() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center pt-[120px] px-6 pb-[60px] bg-cream"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 20%, rgba(0,194,168,0.18) 0%, transparent 45%), radial-gradient(circle at 80% 80%, rgba(255,106,77,0.18) 0%, transparent 45%)",
      }}
    >
      <motion.div
        className="w-full max-w-[420px] px-[38px] py-11 rounded-[var(--radius-lg)] text-center shadow-[var(--shadow-soft)] bg-white/[0.22] border border-white/40 backdrop-blur-[18px]"
        variants={staggerContainer(0.08)}
        initial="hidden"
        animate="visible"
      >
        <motion.span
          className="font-display font-extrabold text-[1.35rem] flex items-center justify-center gap-2 text-ink mb-[22px]"
          variants={fadeUp}
        >
          <span className="text-teal text-[1.1rem]">◐</span>
          Wander<span className="text-coral">Go</span>
        </motion.span>
        <motion.h1 variants={fadeUp} className="text-[1.7rem] mb-2.5">
          Welcome back, explorer
        </motion.h1>
        <motion.p variants={fadeUp} className="text-ink-soft text-[0.9rem] mb-7">
          This is a demo login — no account is created and nothing is sent
          anywhere.
        </motion.p>

        {submitted ? (
          <motion.div
            className="bg-teal-soft text-[#0a7d6c] p-4 rounded-xl font-semibold"
            variants={fadeUp}
          >
            ✓ You're signed in (demo mode). Enjoy exploring!
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            variants={fadeUp}
            className="flex flex-col gap-4 text-left"
          >
            <label className="text-[0.82rem] font-semibold text-ink-soft flex flex-col gap-1.5">
              Email
              <input
                type="email"
                placeholder="you@example.com"
                required
                className="font-body px-3.5 py-3 rounded-xl border border-[rgba(16,26,51,0.15)] bg-white/70 text-[0.95rem] focus:outline focus:outline-2 focus:outline-teal focus:outline-offset-1"
              />
            </label>
            <label className="text-[0.82rem] font-semibold text-ink-soft flex flex-col gap-1.5">
              Password
              <input
                type="password"
                placeholder="••••••••"
                required
                className="font-body px-3.5 py-3 rounded-xl border border-[rgba(16,26,51,0.15)] bg-white/70 text-[0.95rem] focus:outline focus:outline-2 focus:outline-teal focus:outline-offset-1"
              />
            </label>
            <button
              type="submit"
              className="justify-center mt-2 font-body font-bold text-[15px] px-7 py-3.5 rounded-full inline-flex items-center gap-2.5 transition-transform duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 bg-[var(--grad-sunrise)] text-white shadow-[0_12px_30px_-10px_rgba(255,106,77,0.55)] hover:shadow-[0_18px_40px_-8px_rgba(255,106,77,0.65)]"
            >
              Sign In
            </button>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
}
