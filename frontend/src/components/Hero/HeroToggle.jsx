import { motion } from "framer-motion";

export default function HeroToggle({ mode, onChange }) {
  const isHigh = mode === "high";

  return (
    <div
      role="group"
      aria-label="Toggle experience mode"
      className="relative flex items-center rounded-full border border-white/14 bg-white/[0.08] p-1 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.28)]"
    >
      <motion.div
        className="absolute inset-y-1 w-[calc(50%-4px)] rounded-full bg-white"
        initial={false}
        animate={{ x: isHigh ? 4 : "calc(100% + 4px)" }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
      />

      <button
        type="button"
        onClick={() => onChange("high")}
        className={`relative z-[1] flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors duration-300 ${
          isHigh ? "text-[#101722]" : "text-white/70 hover:text-white"
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        3D Experience
      </button>

      <button
        type="button"
        onClick={() => onChange("low")}
        className={`relative z-[1] rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors duration-300 ${
          !isHigh ? "text-[#101722]" : "text-white/70 hover:text-white"
        }`}
      >
        Normal Mode
      </button>
    </div>
  );
}