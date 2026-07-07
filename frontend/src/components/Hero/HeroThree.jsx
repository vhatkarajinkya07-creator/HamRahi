
import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
const SCENE_BUDGET = {
  particleCount: 180,
  segments: 22,
};

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

export default function HeroThree() {
  const budget = SCENE_BUDGET;
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
