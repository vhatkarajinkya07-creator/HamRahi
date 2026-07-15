// GlobeSection/GlobeSectionNormal.jsx
import { lazy, Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fadeUp, staggerContainer } from "../../animations/variants";
import { useDiscoverDestinations } from "../../hooks/useDiscoverDestinations";
import NormalDestinationGrid from "./NormalDestinationGrid";
import NormalDestinationPanel from "./NormalDestinationPanel";

const NormalHeroScene = lazy(() => import("./NormalHeroScene"));

export default function GlobeSectionNormal({ selectedCategory, setSelectedCategory }) {
  const { destinations, status } = useDiscoverDestinations();
  const [activeId, setActiveId] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  // Dynamically sort destinations based on selectedCategory tag matches
  const sortedDestinations = selectedCategory
    ? [...destinations].sort((a, b) => {
        const aTag = a.tags?.[0]?.toLowerCase() || "";
        const bTag = b.tags?.[0]?.toLowerCase() || "";
        
        const aMatch = aTag.includes(selectedCategory.toLowerCase()) ? 1 : 0;
        const bMatch = bTag.includes(selectedCategory.toLowerCase()) ? 1 : 0;
        
        return bMatch - aMatch; // Move matches to the top (descending)
      })
    : destinations;

  const activeDestination =
    sortedDestinations.find((dest) => dest.id === activeId) ?? sortedDestinations[0];

  const handleSelect = (id) => {
    setActiveId(id);
    setPanelOpen(true);
  };

  useEffect(() => {
    if (sortedDestinations.length > 0) {
      const exists = sortedDestinations.some((dest) => dest.id === activeId);
      if (!activeId || !exists) {
        setActiveId(sortedDestinations[0].id);
      }
    }
  }, [sortedDestinations, activeId]);

  return (
    <section
      id="destinations"
      className="relative overflow-hidden bg-[var(--bg-base)] text-[var(--text-primary)] px-[6vw] py-24 md:py-32 transition-colors duration-300"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 82% 8%, rgba(0,0,0,0.02) 0%, transparent 42%)",
        }}
        aria-hidden="true"
      />

      <Suspense fallback={null}>
        <NormalHeroScene
          markers={sortedDestinations}
          className="absolute right-[-6vw] top-[-8vh] h-[420px] w-[420px] opacity-70 md:right-[2vw] md:h-[520px] md:w-[520px]"
        />
      </Suspense>

      <motion.div
        className="relative z-[2] mx-auto max-w-[1400px]"
        variants={staggerContainer(0.08, 0.05)}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-wrap items-center gap-4">
          <motion.div
            className="inline-flex items-center gap-3 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2 text-[var(--text-secondary)] shadow-sm"
            variants={fadeUp}
          >
            <span className="h-2 w-2 rounded-full bg-[var(--theme-primary)] shadow-[0_0_16px_rgba(20,200,200,0.65)]" />
            <span className="text-xs font-semibold uppercase">
              {status === "loading" ? "Loading live destinations" : `${destinations.length} destinations, one browser`}
            </span>
          </motion.div>

          {/* Active Category Sort Badge */}
          {selectedCategory && (
            <motion.div
              className="inline-flex items-center gap-2 rounded-full bg-[var(--theme-primary)]/10 border border-[var(--theme-primary)]/20 px-3.5 py-1.5 text-xs font-bold text-[var(--theme-primary)]"
              variants={fadeUp}
            >
              <i className="pi pi-filter text-[10px]" />
              <span>SORTED BY: {selectedCategory.toUpperCase()}</span>
              <button
                onClick={() => setSelectedCategory(null)}
                className="ml-1 hover:text-[var(--text-primary)] transition-colors"
                aria-label="Clear category sort"
              >
                <i className="pi pi-times text-[10px]" />
              </button>
            </motion.div>
          )}
        </div>

        <motion.h2
          className="mt-6 max-w-[720px] text-4xl font-extrabold leading-[1.02] text-[var(--text-primary)] md:text-6xl"
          variants={fadeUp}
        >
          Every destination, without the flight time.
        </motion.h2>

        <motion.p
          className="mt-5 max-w-[560px] text-base leading-8 text-[var(--text-secondary)] md:text-lg"
          variants={fadeUp}
        >
          A lighter way to browse the same places — pick a card to see ratings, pricing, and the season to go.
        </motion.p>

        <motion.div className="mt-14" variants={fadeUp}>
          <NormalDestinationGrid
            destinations={sortedDestinations}
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
