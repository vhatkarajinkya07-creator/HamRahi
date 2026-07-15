// ThemeSection.jsx
import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "../../animations/variants";
import { useTheme } from "../../context/ThemeContext";

const moods = [
  {
    label: "Beaches",
    icon: "pi pi-sun",
    count: "1,284 destinations",
    description: "Warm coastlines, quiet coves, barefoot resorts, and horizon-led escapes.",
    layout: "lg:col-span-7 lg:row-span-2",
    glow: "bg-sky-200/20",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    query: "beach"
  },
  {
    label: "Mountains",
    icon: "pi pi-map",
    count: "842 destinations",
    description: "Alpine stays, scenic drives, hiking trails, and elevated adventures.",
    layout: "lg:col-span-5",
    glow: "bg-blue-200/20",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    query: "mountain"
  },
  {
    label: "Forests",
    icon: "pi pi-compass",
    count: "617 destinations",
    description: "Canopy hideaways, misty trails, slow cabins, and restorative green space.",
    layout: "lg:col-span-5",
    glow: "bg-emerald-100/20",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
    query: "forest"
  },
  {
    label: "Cities",
    icon: "pi pi-building",
    count: "1,106 destinations",
    description: "Design hotels, evening skylines, culture districts, and culinary weekends.",
    layout: "lg:col-span-4",
    glow: "bg-slate-100/20",
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80",
    query: "city"
  },
  {
    label: "Snow Destinations",
    icon: "pi pi-cloud",
    count: "392 destinations",
    description: "Powder mornings, thermal retreats, glassy lakes, and winter silence.",
    layout: "lg:col-span-4",
    glow: "bg-cyan-100/20",
    image: "https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&w=800&q=80",
    query: "snow"
  },
  {
    label: "Deserts",
    icon: "pi pi-globe",
    count: "528 destinations",
    description: "Dune camps, ancient routes, stargazing nights, and sculptural terrain.",
    layout: "lg:col-span-4",
    glow: "bg-amber-100/20",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
    query: "desert"
  },
];

function DriftingConstellations({ isLight }) {
  const pointsRef = useRef(null);
  const groupRef = useRef(null);

  const particleCount = 70;
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const sp = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      sp[i] = 0.05 + Math.random() * 0.12;
    }
    return [pos, sp];
  }, []);

  // Faint connection lines between closest particles
  const linePositions = useMemo(() => {
    const lines = [];
    for (let i = 0; i < particleCount; i++) {
      const x1 = positions[i * 3];
      const y1 = positions[i * 3 + 1];
      const z1 = positions[i * 3 + 2];
      
      let closestIdx = -1;
      let minD = 999;
      for (let j = 0; j < particleCount; j++) {
        if (i === j) continue;
        const dx = x1 - positions[j * 3];
        const dy = y1 - positions[j * 3 + 1];
        const dz = z1 - positions[j * 3 + 2];
        const d = dx * dx + dy * dy + dz * dz;
        if (d < minD) {
          minD = d;
          closestIdx = j;
        }
      }
      
      if (closestIdx !== -1 && minD < 12) {
        lines.push(x1, y1, z1);
        lines.push(positions[closestIdx * 3], positions[closestIdx * 3 + 1], positions[closestIdx * 3 + 2]);
      }
    }
    return new Float32Array(lines);
  }, [positions]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.015;
      groupRef.current.rotation.x += delta * 0.008;
    }

    if (pointsRef.current) {
      const time = state.clock.getElapsedTime();
      const posArr = pointsRef.current.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3 + 1] += Math.sin(time * 0.5 + i) * 0.0015 * speeds[i];
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const color = isLight ? "#00c2a8" : "#8fb6d9";
  const size = isLight ? 0.09 : 0.06;

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color={color}
          size={size}
          sizeAttenuation
          transparent
          opacity={isLight ? 0.45 : 0.25}
          depthWrite={false}
        />
      </points>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={color}
          transparent
          opacity={isLight ? 0.12 : 0.07}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

function ThemeBackground3D({ isLight }) {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none select-none overflow-hidden opacity-50">
      <Canvas
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0, 5], fov: 60 }}
      >
        <Suspense fallback={null}>
          <DriftingConstellations isLight={isLight} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default function ThemeSection({ setSelectedCategory }) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const handleMoodClick = (e, q) => {
    e.preventDefault();
    if (setSelectedCategory) {
      setSelectedCategory(q);
      const destEl = document.getElementById("destinations");
      if (destEl) {
        destEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section className="relative overflow-hidden bg-[var(--bg-surface-raised)] text-[var(--text-primary)] border-t border-[var(--border-subtle)] px-[6vw] py-[120px] transition-colors duration-300" id="themes">
      {/* 3D Drifting Star Constellation Background */}
      <ThemeBackground3D isLight={isLight} />

      {!isLight && (
        <>
          <div className="absolute inset-x-[8vw] top-10 h-[420px] rounded-full bg-sky-200/5 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-white/[0.015] blur-3xl pointer-events-none" />
        </>
      )}
      
      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-16">
        <motion.div
          className="max-w-[560px]"
          variants={staggerContainer(0.08)}
          initial="hidden"
          animate="visible"
        >
          <motion.span
            className="inline-flex items-center gap-2 font-mono text-xs uppercase text-[var(--text-secondary)]"
            variants={fadeUp}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--theme-primary)] shadow-[0_0_18px_rgba(20,200,200,0.6)]" />
            Browse by Mood
          </motion.span>

          <motion.h2 className="mt-5 text-5xl leading-[0.98] text-[var(--text-primary)] md:text-6xl xl:text-7xl font-extrabold tracking-tight" variants={fadeUp}>
            Every journey begins with a feeling.
          </motion.h2>

          <motion.p
            className="mt-6 max-w-[500px] text-[1.02rem] leading-[1.75] text-[var(--text-secondary)]"
            variants={fadeUp}
          >
            Discover places by atmosphere, pace, and experience instead of starting with a map pin. Click a card to highlight matching destinations on the explore board below.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid auto-rows-[minmax(210px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12"
          variants={staggerContainer(0.055)}
          initial="hidden"
          animate="visible"
        >
          {moods.map((mood) => (
            <motion.a
              href="#destinations"
              onClick={(e) => handleMoodClick(e, mood.query)}
              key={mood.label}
              className={`group relative isolate flex min-h-[210px] overflow-hidden rounded-[20px] border border-[var(--border-subtle)] bg-[var(--bg-base)] p-6 text-white transition-all duration-500 hover:border-[var(--text-secondary)]/30 hover:shadow-xl sm:min-h-[240px] ${mood.layout}`}
              variants={fadeUp}
              whileHover={{ y: -6, scale: 1.008 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              {/* Background Thumbnail Image - Full opacity, no tint overlay */}
              <div className="absolute inset-0 -z-20">
                <img
                  src={mood.image}
                  alt={mood.label}
                  className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105 opacity-100"
                />
              </div>

              <motion.span
                className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 blur-sm"
                initial={false}
                animate={{ x: "0%" }}
                whileHover={{ x: "330%", opacity: [0, 0.5, 0] }}
                transition={{ duration: 1.05, ease: "easeOut" }}
              />
              <span className="pointer-events-none absolute inset-px rounded-[18px] border border-white/10" />

              <div className="flex h-full w-full flex-col justify-between gap-8 z-10">
                <div className="flex items-center justify-between gap-4">
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/35 backdrop-blur-md text-[1.05rem] text-white/90 transition-all duration-500 group-hover:border-white/40 group-hover:bg-black/50">
                    <i className={mood.icon} aria-hidden="true" />
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold leading-tight text-white lg:text-3xl tracking-tight drop-shadow-md">
                    {mood.label}
                  </h3>
                  <p className="mt-3 max-w-[420px] text-sm leading-[1.65] text-white/80 drop-shadow-sm">
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
