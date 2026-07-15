import { motion } from "framer-motion";

export default function HeroToggle({ mode, onChange }) {
  const isHigh = mode === "high";

  return (
    <div
      role="group"
      aria-label="Toggle experience mode"
      className="relative flex items-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)]/70 p-1 backdrop-blur-2xl shadow-lg transition-all duration-300"
    >
      <motion.div
        className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-[var(--text-primary)]"
        initial={false}
        animate={{ x: isHigh ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
      />

      <button
        type="button"
        onClick={() => onChange("high")}
        className={`relative z-[1] flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors duration-300 ${
          isHigh
            ? "text-[var(--bg-base)]"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        3D Experience
      </button>

      <button
        type="button"
        onClick={() => onChange("low")}
        className={`relative z-[1] rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors duration-300 ${
          !isHigh
            ? "text-[var(--bg-base)]"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        }`}
      >
        Normal Mode
      </button>
    </div>
  );
}