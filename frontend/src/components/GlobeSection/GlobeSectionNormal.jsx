// GlobeSection/GlobeSectionNormal.jsx
//
// The Normal Experience: a modern destination browser that shares data and
// visual language with the Cesium High Mode, but trades the cinematic
// camera-flight sequence for a responsive card grid, a lightweight Three.js
// decorative globe, and a details modal — all considerably cheaper to run.

import { lazy, Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "../../animations/variants";
import { useDiscoverDestinations } from "../../hooks/useDiscoverDestinations";
import NormalDestinationGrid from "./NormalDestinationGrid";
import NormalDestinationPanel from "./NormalDestinationPanel";

const NormalHeroScene = lazy(() => import("./NormalHeroScene"));

export default function GlobeSectionNormal() {
  const { destinations, status } = useDiscoverDestinations();
  const [activeId, setActiveId] = useState(destinations[0]?.id);
  const [panelOpen, setPanelOpen] = useState(false);

  const activeDestination =
    destinations.find((dest) => dest.id === activeId) ?? destinations[0];

  const handleSelect = (id) => {
    setActiveId(id);
    setPanelOpen(true);
  };

  useEffect(() => {
    if (!activeId && destinations[0]?.id) {
      setActiveId(destinations[0].id);
    }
  }, [activeId, destinations]);

  return (
    <section
      id="destinations"
      className="relative overflow-hidden bg-[#050505] px-[6vw] py-24 md:py-32"
      style={{
        background:
          "linear-gradient(180deg, #050505 0%, #0a0a0a 46%, #000000 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 82% 8%, rgba(255,255,255,0.06) 0%, transparent 42%)",
        }}
        aria-hidden="true"
      />

      <Suspense fallback={null}>
        <NormalHeroScene
          markers={destinations}
          className="absolute right-[-6vw] top-[-8vh] h-[420px] w-[420px] opacity-70 md:right-[2vw] md:h-[520px] md:w-[520px]"
        />
      </Suspense>

      <motion.div
        className="relative z-[2] mx-auto max-w-[1400px]"
        variants={staggerContainer(0.08, 0.05)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div
          className="inline-flex items-center gap-3 rounded-full border border-white/14 bg-white/[0.08] px-4 py-2 text-white/72 backdrop-blur-2xl"
          variants={fadeUp}
        >
          <span className="h-2 w-2 rounded-full bg-white shadow-[0_0_16px_rgba(255,255,255,0.65)]" />
          <span className="text-xs font-semibold uppercase">
            {status === "loading" ? "Loading live destinations" : `${destinations.length} destinations, one browser`}
          </span>
        </motion.div>

        <motion.h2
          className="mt-6 max-w-[720px] text-4xl font-semibold leading-[1.02] text-white md:text-6xl"
          variants={fadeUp}
        >
          Every destination, without the flight time.
        </motion.h2>

        <motion.p
          className="mt-5 max-w-[560px] text-base leading-8 text-white/60 md:text-lg"
          variants={fadeUp}
        >
          A lighter way to browse the same places — pick a card to see ratings,
          pricing, and the season to go.
        </motion.p>

        <motion.div className="mt-14" variants={fadeUp}>
          <NormalDestinationGrid
            destinations={destinations}
            activeId={activeId}
            onSelect={handleSelect}
          />
        </motion.div>
      </motion.div>

      <NormalDestinationPanel
        destination={activeDestination}
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
      />
    </section>
  );
}
