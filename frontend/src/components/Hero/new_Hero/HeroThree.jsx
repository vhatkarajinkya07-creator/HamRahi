// Hero/HeroThree.jsx
//
// Lightweight, premium background for low-end devices. Inspired by
// cinematic landing pages (ambient particles, a faint wireframe wave,
// slow camera drift) rather than trying to imitate the Cesium globe.
//
// Deliberately avoids: GLTF models, HDR/environment maps, shadows, large
// textures, physics, and heavy post-processing. Everything here is a
// handful of cheap draw calls driven by simple sine-based motion.

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

// Scales particle count and mesh detail down for weaker devices, based on
// the signals already gathered by usePerformanceTier — no extra detection
// work happens here.
function computeSceneBudget(perfMeta) {
  let particleCount = 220;
  let segments = 26;

  if (perfMeta?.mobile) {
    particleCount -= 70;
    segments -= 8;
  }
  if (typeof perfMeta?.cores === "number" && perfMeta.cores <= 4) {
    particleCount -= 40;
    segments -= 4;
  }
  if (typeof perfMeta?.fps === "number" && perfMeta.fps < 40) {
    particleCount -= 40;
    segments -= 6;
  }

  return {
    particleCount: Math.max(70, particleCount),
    segments: Math.max(10, segments),
  };
}

// A low-poly plane whose vertices are displaced by two summed sine waves.
// No physics, no textures — just a wireframe for a subtle atmospheric feel.
function WaveSurface({ segments }) {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(14, 8, segments, segments);
    geo.rotateX(-Math.PI / 2.35);
    return geo;
  }, [segments]);

  const basePositions = useMemo(
    () => geometry.attributes.position.array.slice(),
    [geometry]
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const positions = geometry.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {
      const x = basePositions[i];
      const z = basePositions[i + 2];
      positions[i + 1] =
        Math.sin(x * 0.35 + t * 0.6) * 0.28 + Math.cos(z * 0.4 + t * 0.4) * 0.22;
    }

    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <mesh geometry={geometry} position={[0, -1.6, -2]}>
      <meshBasicMaterial color="#3b6f93" wireframe transparent opacity={0.22} />
    </mesh>
  );
}

// Slow, ambient camera drift. Never pointer-driven — keeps the scene calm
// and avoids extra event listeners.
function DriftingCamera() {
  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime();
    camera.position.x = Math.sin(t * 0.06) * 0.6;
    camera.position.y = 0.2 + Math.sin(t * 0.05) * 0.15;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroThree({ perfMeta }) {
  const budget = useMemo(() => computeSceneBudget(perfMeta), [perfMeta]);
  const canvasRef = useRef(null);

  return (
    <div className="absolute inset-0 h-full w-full pointer-events-none">
      <Canvas
        ref={canvasRef}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.4, 5.4], fov: 45 }}
      >
        <color attach="background" args={["#101722"]} />
        <fog attach="fog" args={["#101722", 4, 11]} />

        <Suspense fallback={null}>
          <Sparkles
            count={budget.particleCount}
            size={2.2}
            scale={[9, 5, 6]}
            speed={0.25}
            opacity={0.55}
            color="#dceeff"
          />
          <WaveSurface segments={budget.segments} />
        </Suspense>

        <DriftingCamera />
      </Canvas>
    </div>
  );
}
