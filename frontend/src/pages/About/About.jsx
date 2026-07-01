import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "../../animations/variants";

const stats = [
  { value: "8", label: "Curated destinations" },
  { value: "60+", label: "Experience categories" },
  { value: "12k+", label: "Community stories (demo)" },
];

export default function About() {
  return (
    <div className="pt-[84px]">
      <section className="max-w-[820px] mx-auto pt-[110px] px-6 pb-[60px] text-center">
        <motion.div variants={staggerContainer(0.1)} initial="hidden" animate="visible">
          <motion.span
            className="font-mono text-xs tracking-[0.14em] uppercase text-ink-soft inline-flex items-center gap-2"
            variants={fadeUp}
          >
            ● About WanderGo
          </motion.span>
          <motion.h1 variants={fadeUp} className="text-[clamp(2.2rem,5vw,3.4rem)] my-4 mb-5 bg-[var(--grad-brand)] bg-clip-text text-transparent">
            We think travel should feel like a story, not a spreadsheet.
          </motion.h1>
          <motion.p variants={fadeUp} className="text-[1.1rem] text-ink-soft leading-[1.7]">
            WanderGo is a demo product exploring what destination discovery could
            look like if it borrowed the best parts of Google Earth, Reels, and
            Airbnb Experiences — all in one cinematic scroll.
          </motion.p>
        </motion.div>
      </section>

      <section className="max-w-[900px] mx-auto flex justify-around flex-wrap gap-[30px] py-[50px] px-6">
        {stats.map((s) => (
          <div className="text-center" key={s.label}>
            <span className="block font-display text-[2.6rem] font-extrabold text-coral">{s.value}</span>
            <span className="text-[0.85rem] text-ink-soft uppercase tracking-[0.06em]">{s.label}</span>
          </div>
        ))}
      </section>

      <section className="max-w-[700px] mx-auto mt-10 mb-[120px] p-8 rounded-[var(--radius-lg)] bg-cream-soft text-center">
        <h3 className="mb-3">A note on this build</h3>
        <p className="text-ink-soft leading-[1.65]">
          This is an MVP / product demo. Every destination, review, and traveler
          post is static sample content used to demonstrate the design and
          interaction model — there's no backend, account system, or live
          booking behind it yet.
        </p>
      </section>
    </div>
  );
}
