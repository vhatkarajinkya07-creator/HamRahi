import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "../../animations/variants";

const moods = [
  { label: "Beaches", icon: "🏝️", theme: "theme-beach" },
  { label: "Mountains", icon: "⛰️", theme: "theme-mountain" },
  { label: "Deserts", icon: "🏜️", theme: "theme-desert" },
  { label: "Forests", icon: "🌲", theme: "theme-forest" },
  { label: "Snow", icon: "❄️", theme: "theme-snow" },
  { label: "Cities", icon: "🏙️", theme: "theme-urban" },
];

export default function ThemeSection() {
  return (
    <section className="px-[6vw] py-[120px] max-w-[1400px] mx-auto">
      <motion.div
        className="max-w-[620px] mb-[52px]"
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <motion.span
          className="font-mono text-xs tracking-[0.14em] uppercase text-ink-soft inline-flex items-center gap-2"
          variants={fadeUp}
        >
          ● Browse by mood
        </motion.span>
        <motion.h2 className="text-[clamp(2rem,3.6vw,3rem)] my-3.5" variants={fadeUp}>
          Every trip starts with a feeling
        </motion.h2>
        <motion.p className="text-ink-soft text-[1.05rem] leading-[1.6]" variants={fadeUp}>
          Pick the world you're craving right now — the whole experience adapts,
          from colors to recommendations.
        </motion.p>
      </motion.div>

      <motion.div
        className="grid grid-cols-6 max-[980px]:grid-cols-3 max-[560px]:grid-cols-2 gap-[18px]"
        variants={staggerContainer(0.06)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {moods.map((m) => (
          <motion.a
            href="#destinations"
            key={m.label}
            className={`${m.theme} flex flex-col items-center justify-center gap-3 aspect-square rounded-[var(--radius-lg)] text-white`}
            style={{
              "--theme-primary": "inherit",
              background:
                "linear-gradient(160deg, var(--theme-primary) 0%, var(--theme-secondary) 100%)",
              boxShadow:
                "0 16px 34px -16px color-mix(in srgb, var(--theme-primary) 60%, transparent)",
            }}
            variants={fadeUp}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <span className="text-[2rem]">{m.icon}</span>
            <span className="font-bold text-[0.95rem]">{m.label}</span>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}
