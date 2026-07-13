import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "primereact/button";
import { fadeUp, staggerContainer } from "../../animations/variants";

const pillars = [
  {
    icon: "pi-globe",
    title: "One browser, every place",
    body: "A single cinematic globe and card feed pulls destinations, weather, and nearby attractions into one continuous view instead of a dozen separate tabs.",
  },
  {
    icon: "pi-sparkles",
    title: "AI does the planning",
    body: "Tell HamRahi your days, budget, travel style, and interests. Gemini turns that into a day-by-day itinerary with timed activities and local tips.",
  },
  {
    icon: "pi-heart",
    title: "Save what matters",
    body: "Wishlist any destination you find in Discover or Search, and pick up the plan later — your saved places and itineraries stay tied to your account.",
  },
];

const steps = [
  {
    step: "01",
    title: "Discover or search",
    body: "Browse the AI-personalized Discover feed, or search directly for a city, region, or landmark you already have in mind.",
  },
  {
    step: "02",
    title: "Open a destination",
    body: "See live weather, a photo gallery, ratings, and nearby attractions pulled together into one details page.",
  },
  {
    step: "03",
    title: "Generate an itinerary",
    body: "Set your trip length, budget, travel style, and interests — HamRahi's AI itinerary planner builds the day-by-day plan for you.",
  },
  {
    step: "04",
    title: "Save and revisit",
    body: "Add destinations to your wishlist so your shortlist and plans are exactly where you left them next time you log in.",
  },
];

export default function About() {
  return (
    <section className="min-h-screen bg-[#050505] px-5 pb-24 pt-[120px] text-white">
      <div className="mx-auto max-w-[1120px]">
        <motion.div
          variants={staggerContainer(0.08, 0.05)}
          initial="hidden"
          animate="visible"
        >
          <motion.span
            className="inline-flex rounded-full border border-white/12 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase text-white/60 backdrop-blur-2xl"
            variants={fadeUp}
          >
            About HamRahi
          </motion.span>

          <motion.h1
            className="mt-6 max-w-[760px] text-5xl leading-[1.04] md:text-7xl"
            variants={fadeUp}
          >
            Travel planning, without the twenty open tabs.
          </motion.h1>

          <motion.p
            className="mt-6 max-w-[620px] text-base leading-8 text-white/62 md:text-lg"
            variants={fadeUp}
          >
            HamRahi ("humrahi" — your travel companion) is a cinematic,
            AI-powered way to explore the world and plan a trip in one place.
            Discover destinations on a 3D globe, check the weather and nearby
            attractions, and let AI turn your interests into a real day-by-day
            itinerary.
          </motion.p>

          <motion.div className="mt-9 flex flex-wrap gap-4" variants={fadeUp}>
            <Button as={Link} to="/#destinations" label="Explore destinations" icon="pi pi-compass" />
            <Button as={Link} to="/itinerary" label="Plan a trip" icon="pi pi-sparkles" outlined />
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-20 grid gap-5 md:grid-cols-3"
          variants={staggerContainer(0.08, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {pillars.map((pillar) => (
            <motion.article
              key={pillar.title}
              variants={fadeUp}
              className="rounded-[28px] border border-white/14 bg-white/[0.08] p-7 backdrop-blur-3xl"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full border border-white/14 bg-white/[0.08] text-white/80">
                <i className={`pi ${pillar.icon}`} aria-hidden="true" />
              </span>
              <h2 className="mt-6 text-xl font-semibold text-white">{pillar.title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/58">{pillar.body}</p>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          className="mt-20"
          variants={staggerContainer(0.08, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.h2 className="text-3xl font-semibold md:text-4xl" variants={fadeUp}>
            How a trip comes together
          </motion.h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {steps.map((item) => (
              <motion.div
                key={item.step}
                variants={fadeUp}
                className="rounded-[24px] border border-white/12 bg-white/[0.06] p-6 backdrop-blur-2xl"
              >
                <span className="font-mono text-xs text-white/40">{item.step}</span>
                <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-white/56">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-20 rounded-[28px] border border-white/14 bg-white/[0.08] p-8 text-center backdrop-blur-3xl md:p-12"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-3xl md:text-4xl">Built by a small team, for restless travelers.</h2>
          <p className="mx-auto mt-4 max-w-[560px] text-sm leading-7 text-white/56">
            HamRahi is a demo product built end-to-end — a Node/Express and
            MongoDB backend, Gemini-powered itinerary generation, live weather
            and nearby-place data, and a React frontend with both a 3D Cesium
            globe and a lighter Three.js mode depending on your device.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Button as={Link} to="/register" label="Create an account" icon="pi pi-user-plus" />
            <Button as={Link} to="/login" label="Login" icon="pi pi-sign-in" outlined />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
