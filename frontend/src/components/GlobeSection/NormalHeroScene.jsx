// GlobeSection/NormalHeroScene.jsx
//
// Purely decorative accent for the Normal Experience — a small low-poly
// wireframe globe with a couple of orbit rings and a light scatter of
// particles. It is NOT a replacement for the Cesium globe: no terrain, no
// camera flights, no per-destination street-view. A handful of destination
// markers are placed on the sphere for flavor only.
//
// Kept intentionally cheap: low segment counts, no shadows/postprocessing,
// capped devicePixelRatio, and everything is pointer-events-none.

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

function latLonToVector3(lat, lon, radius) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function WireGlobe({ markers }) {
  const globeRef = useRef(null);
  const ringGroupRef = useRef(null);

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.55, 2), []);
  const markerPositions = useMemo(
    () => markers.map((m) => latLonToVector3(m.lat, m.lon, 1.58)),
    [markers],
  );

  useFrame((_, delta) => {
    if (globeRef.current) globeRef.current.rotation.y += delta * 0.08;
    if (ringGroupRef.current) ringGroupRef.current.rotation.z += delta * 0.035;
  });

  return (
    <group>
      <mesh ref={globeRef} geometry={geometry}>
        <meshBasicMaterial color="#dceeff" wireframe transparent opacity={0.28} />
      </mesh>

      {markerPositions.map((pos, index) => (
        <mesh key={index} position={pos}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
        </mesh>
      ))}

      <group ref={ringGroupRef}>
        <mesh rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[2.05, 0.004, 8, 96]} />
          <meshBasicMaterial color="#8fb6d9" transparent opacity={0.22} />
        </mesh>
        <mesh rotation={[Math.PI / 1.7, Math.PI / 6, 0]}>
          <torusGeometry args={[2.3, 0.004, 8, 96]} />
          <meshBasicMaterial color="#8fb6d9" transparent opacity={0.14} />
        </mesh>
      </group>
    </group>
  );
}

export default function NormalHeroScene({ markers = [], className = "" }) {
  return (
    <div
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0.2, 5.4], fov: 42 }}
      >
        <Suspense fallback={null}>
          <WireGlobe markers={markers} />
          <Sparkles count={60} size={1.6} scale={[6, 6, 6]} speed={0.2} opacity={0.35} color="#dceeff" />
        </Suspense>
      </Canvas>
    </div>
  );
}
