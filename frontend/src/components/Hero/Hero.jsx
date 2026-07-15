//this is new toggle added hero section -AJINKYA

import { lazy, Suspense, useRef } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { fadeUp, staggerContainer } from "../../animations/variants";
import { useModeOfView } from "../../hooks/useModeOfView";
import { useTheme } from "../../context/ThemeContext";
import HeroToggle from "./HeroToggle";
const HeroCesium = lazy(() => import("./HeroCesium"));
const HeroThree = lazy(() => import("./HeroThree"));

function HeroLoadingFallback() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--bg-base)] z-50 transition-colors duration-500">
      <div className="relative flex items-center justify-center">
        {/* Glowing aura */}
        <div className="absolute h-24 w-24 rounded-full bg-[var(--theme-primary)]/20 blur-xl animate-pulse" />
        {/* Spinning indicator */}
        <div className="h-16 w-16 rounded-full border-4 border-[var(--border-subtle)] border-t-[var(--theme-primary)] animate-spin" />
      </div>
      <p className="mt-6 text-sm font-semibold tracking-widest text-[var(--theme-primary)] uppercase animate-pulse">
        Initializing 3D Space...
      </p>
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef(null);
  const { modeOfView, setModeOfView } = useModeOfView();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 104]);
  const globeScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section
      className="relative flex min-h-screen w-full items-center overflow-hidden bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-500"
      ref={sectionRef}
    >
      <AnimatePresence mode="wait">
        {modeOfView === "high" ? (
          <motion.div
            key="cesium"
            className="absolute inset-0 h-full w-full"
            initial={{ opacity: 0, scale: 1.01 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <Suspense fallback={<HeroLoadingFallback />}>
              <HeroCesium scale={globeScale} />
            </Suspense>
          </motion.div>
        ) : (
          <motion.div
            key="three"
            className="absolute inset-0 h-full w-full"
            initial={{ opacity: 0, scale: 1.01 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <Suspense fallback={<HeroLoadingFallback />}>
              <HeroThree />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      {isLight ? (
        <>
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_66%_45%,rgba(255,250,243,0)_0%,rgba(255,250,243,0.15)_44%,rgba(255,250,243,0.65)_100%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,250,243,0.85)_0%,rgba(255,250,243,0.48)_32%,rgba(255,250,243,0.05)_68%,rgba(255,250,243,0.25)_100%)]"
            aria-hidden="true"
          />
          <div
            className="absolute left-[8vw] top-[14vh] h-64 w-64 rounded-full bg-orange-100/30 blur-3xl"
            aria-hidden="true"
          />
        </>
      ) : (
        <>
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_66%_45%,rgba(255,255,255,0)_0%,rgba(16,23,34,0.08)_44%,rgba(16,23,34,0.52)_100%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(16,23,34,0.84)_0%,rgba(16,23,34,0.58)_32%,rgba(16,23,34,0.08)_68%,rgba(16,23,34,0.3)_100%)]"
            aria-hidden="true"
          />
          <div
            className="absolute left-[8vw] top-[14vh] h-64 w-64 rounded-full bg-sky-200/14 blur-3xl"
            aria-hidden="true"
          />
        </>
      )}

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--bg-base)] to-transparent"
        aria-hidden="true"
      />

      <div className="absolute right-4 top-24 z-[45] md:right-8 md:top-28">
        <HeroToggle mode={modeOfView} onChange={setModeOfView} />
      </div>

      <motion.div
        className="relative z-[2] mx-auto grid w-full max-w-[1400px] grid-cols-1 items-end gap-12 px-[6vw] py-24 lg:grid-cols-[1fr_380px] lg:py-28"
        style={{ opacity: contentOpacity, y: contentY }}
        variants={staggerContainer(0.1, 0.1)}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-[820px]">
          <motion.div
            className="inline-flex items-center gap-3 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 px-4 py-2 text-[var(--text-secondary)] backdrop-blur-2xl"
            variants={fadeUp}
          >
            <span className="h-2 w-2 rounded-full bg-[var(--theme-primary)] shadow-[0_0_16px_rgba(20,200,200,0.65)]" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Live from 8 destinations across the globe
            </span>
          </motion.div>

          <motion.h1
            className="mt-8 max-w-[900px] text-6xl font-semibold leading-[0.96] text-[var(--text-primary)] md:text-7xl xl:text-8xl"
            variants={fadeUp}
          >
            Explore the world,
            <br />
            one story at a time.
          </motion.h1>

          <motion.p
            className="mt-7 max-w-[590px] text-base leading-8 text-[var(--text-secondary)] md:text-lg"
            variants={fadeUp}
          >
            Discover destinations through atmosphere, memory, culture, and
            movement. A cinematic travel interface built for finding the feeling
            before choosing the place.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
            variants={fadeUp}
          >
            <a
              href="#destinations"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--text-primary)] px-7 text-sm font-semibold text-[var(--bg-base)] transition-all duration-300 hover:opacity-90 active:scale-[0.98] shadow-sm hover:shadow"
            >
              Begin the journey
            </a>
            <a
              href="#themes"
              className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 px-7 text-sm font-semibold text-[var(--text-primary)] backdrop-blur-xl transition-all duration-300 hover:bg-[var(--bg-surface)]/90 active:scale-[0.98]"
            >
              Browse moods
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}