import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import * as Cesium from "cesium";
import { useCesiumViewer } from "../../hooks/useCesiumViewer";
import { fadeUp, staggerContainer } from "../../animations/variants";

export default function Hero() {
  const cesiumContainer = useRef(null);
  const sectionRef = useRef(null);
  const viewerRef = useCesiumViewer(cesiumContainer, {
    onReady: (viewer) => {
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(0, 12, 0.7e7),
      });

      // This globe is purely decorative — kill every camera control so
      // scrolling, dragging, or trackpad swipes over the canvas never
      // rotate/zoom/pan it. This is what was causing the globe to visibly
      // "jump" whenever the page was scrolled with the cursor over it.
      const controller = viewer.scene.screenSpaceCameraController;
      controller.enableRotate = false;
      controller.enableZoom = false;
      controller.enableTilt = false;
      controller.enableTranslate = false;
      controller.enableLook = false;

      // Belt-and-suspenders: the canvas itself ignores pointer input too.
      viewer.canvas.style.pointerEvents = "none";
    },
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  // Slow cinematic auto-rotate — the only thing allowed to move the camera.
  useEffect(() => {
    let raf;
    const tick = () => {
      const viewer = viewerRef.current;
      if (viewer && !viewer.isDestroyed()) {
        viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -0.0005);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [viewerRef]);

  return (
    <section
      className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-[#0A0A0A]"
      ref={sectionRef}
    >
      {/* Globe backdrop */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none [&_canvas]:outline-none opacity-70"
        ref={cesiumContainer}
        aria-hidden="true"
      />

      {/* Heavy vignette so the map underneath reads as texture, not clutter */}
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_50%,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.18)_55%,rgba(0,0,0,0.38)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_top,rgba(10,10,10,0.95)_0%,rgba(10,10,10,0.2)_35%,rgba(10,10,10,0.5)_100%)]"
        aria-hidden="true"
      />



      {/* Glass content panel */}
      <motion.div
        className="relative z-[2] w-full max-w-[860px] mx-6 text-center flex flex-col items-center rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-[0_8px_60px_-12px_rgba(0,0,0,0.6)] px-8 py-14 md:px-16 md:py-20"
        style={{ opacity: contentOpacity, y: contentY }}
        variants={staggerContainer(0.12, 0.15)}
        initial="hidden"
        animate="visible"
      >
        {/* Live Badge */}
        <motion.div
          className="bg-white/[0.025]
border border-white/10
backdrop-blur-[24px]
shadow-[0_10px_40px_rgba(255,255,255,0.06),inset_0_1px_0_rgba(255,255,255,0.18)]"
          variants={fadeUp}
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_8px_white]" />
          <span className="text-[11px] font-semibold tracking-widest text-white/70 uppercase">
            Live from 8 destinations across the globe
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-[clamp(3rem,8vw,6.5rem)] leading-[1.02] mb-7 text-white tracking-tight font-extrabold"
          variants={fadeUp}
        >
          Explore The World,
          <br />
          One Story At A Time
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-[clamp(1rem,1.6vw,1.2rem)] text-white/55 max-w-[560px] mb-10 leading-relaxed"
          variants={fadeUp}
        >
          Discover destinations through experiences, memories, culture, adventure
          and real traveler stories. A journey built on authenticity.
        </motion.p>

        {/* CTA */}
        <motion.div className="flex flex-col items-center gap-4" variants={fadeUp}>
          <a
            href="#destinations"
            className="bg-white text-[#0A0A0A] px-10 py-4 rounded-full text-[14px] font-semibold hover:bg-white/90 transition-all active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.15)]"
          >
            Begin The Journey
          </a>
        </motion.div>
      </motion.div>

    </section>
  );
}