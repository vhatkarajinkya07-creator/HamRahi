
// don't change the things here

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "../../animations/variants";



const moods = [
  {
    label: "Beaches",
    icon: "pi pi-sun",
    count: "1,284 destinations",
    description:
      "Warm coastlines, quiet coves, barefoot resorts, and horizon-led escapes.",
    layout: "lg:col-span-7 lg:row-span-2",
    glow: "bg-sky-200/20",
  },
  {
    label: "Mountains",
    icon: "pi pi-map",
    count: "842 destinations",
    description:
      "Alpine stays, scenic drives, hiking trails, and elevated adventures.",
    layout: "lg:col-span-5",
    glow: "bg-blue-200/20",
  },
  {
    label: "Forests",
    icon: "pi pi-compass",
    count: "617 destinations",
    description:
      "Canopy hideaways, misty trails, slow cabins, and restorative green space.",
    layout: "lg:col-span-5",
    glow: "bg-emerald-100/20",
  },
  {
    label: "Cities",
    icon: "pi pi-building",
    count: "1,106 destinations",
    description:
      "Design hotels, evening skylines, culture districts, and culinary weekends.",
    layout: "lg:col-span-4",
    glow: "bg-slate-100/20",
  },
  {
    label: "Snow Destinations",
    icon: "pi pi-cloud",
    count: "392 destinations",
    description:
      "Powder mornings, thermal retreats, glassy lakes, and winter silence.",
    layout: "lg:col-span-4",
    glow: "bg-cyan-100/20",
  },
  {
    label: "Deserts",
    icon: "pi pi-globe",
    count: "528 destinations",
    description:
      "Dune camps, ancient routes, stargazing nights, and sculptural terrain.",
    layout: "lg:col-span-4",
    glow: "bg-amber-100/20",
  },
];

export default function ThemeSection() {
  return (
    <section className="relative overflow-hidden bg-[#07111f] px-[6vw] py-[120px]" id="themes">
      <div className="absolute inset-x-[8vw] top-10 h-[420px] rounded-full bg-sky-200/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-white/[0.055] blur-3xl" />
      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-16">
        <motion.div
          className="max-w-[560px]"
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.45 }}
        >
          <motion.span
            className="inline-flex items-center gap-2 font-mono text-xs uppercase text-ink-soft"
            variants={fadeUp}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white/70 shadow-[0_0_18px_rgba(255,255,255,0.6)]" />
            Browse by Mood
          </motion.span>

          <motion.h2 className="mt-5 text-5xl leading-[0.98] text-white md:text-6xl xl:text-7xl" variants={fadeUp}>
            Every journey begins with a feeling.
          </motion.h2>

          <motion.p
            className="mt-6 max-w-[500px] text-[1.02rem] leading-[1.75] text-white/62"
            variants={fadeUp}
          >
            Discover places by atmosphere, pace, and experience instead of
            starting with a map pin. Move from coastal calm to alpine clarity,
            city energy, desert quiet, or snow-lit retreats.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid auto-rows-[minmax(210px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12"
          variants={staggerContainer(0.055)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
        >
          {moods.map((mood) => (
            <motion.a
              href="#destinations"
              key={mood.label}
              className={`group relative isolate flex min-h-[210px] overflow-hidden rounded-lg border border-white/15 bg-white/[0.07] p-6 text-white backdrop-blur-2xl transition-colors duration-500 hover:border-white/30 hover:bg-white/[0.1] hover:backdrop-blur-3xl sm:min-h-[240px] ${mood.layout}`}
              variants={fadeUp}
              whileHover={{ y: -8, scale: 1.012 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <span
                className={`pointer-events-none absolute -right-16 -top-16 -z-10 h-48 w-48 rounded-full ${mood.glow} opacity-50 blur-3xl transition-opacity duration-500 group-hover:opacity-80`}
              />
              <motion.span
                className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/14 to-transparent opacity-0 blur-sm"
                initial={false}
                animate={{ x: "0%" }}
                whileHover={{ x: "330%", opacity: [0, 0.72, 0] }}
                transition={{ duration: 1.05, ease: "easeOut" }}
              />
              <span className="pointer-events-none absolute inset-px rounded-[7px] border border-white/8" />

              <div className="flex h-full w-full flex-col justify-between gap-8">
                <div className="flex items-center justify-between gap-4">
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-white/12 bg-white/[0.06] text-[1.05rem] text-white/86 backdrop-blur-xl transition-colors duration-500 group-hover:border-white/22 group-hover:bg-white/[0.1]">
                    <i className={mood.icon} aria-hidden="true" />
                  </span>
                  <span className="text-right font-mono text-[0.68rem] uppercase text-white/45">
                    {mood.count}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold leading-tight text-white lg:text-3xl">
                    {mood.label}
                  </h3>
                  <p className="mt-3 max-w-[420px] text-sm leading-[1.65] text-white/56">
                    {mood.description}
                  </p>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
