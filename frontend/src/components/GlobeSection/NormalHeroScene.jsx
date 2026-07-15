// GlobeSection/NormalHeroScene.jsx
import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "../../context/ThemeContext";

function latLonToVector3(lat, lon, radius) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function WireGlobe({ markers, isLight }) {
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

  // Dynamic theme colors
  const globeColor = isLight ? "#2a6b8c" : "#dceeff";
  const globeOpacity = isLight ? 0.38 : 0.28;
  const markerColor = isLight ? "#101a33" : "#ffffff";
  const ringColor = isLight ? "#101a33" : "#8fb6d9";
  const ring1Opacity = isLight ? 0.18 : 0.22;
  const ring2Opacity = isLight ? 0.12 : 0.14;

  return (
    <group>
      <mesh ref={globeRef} geometry={geometry}>
        <meshBasicMaterial color={globeColor} wireframe transparent opacity={globeOpacity} />
      </mesh>

      {markerPositions.map((pos, index) => (
        <mesh key={index} position={pos}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color={markerColor} transparent opacity={0.9} />
        </mesh>
      ))}

      <group ref={ringGroupRef}>
        <mesh rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[2.05, 0.004, 8, 96]} />
          <meshBasicMaterial color={ringColor} transparent opacity={ring1Opacity} />
        </mesh>
        <mesh rotation={[Math.PI / 1.7, Math.PI / 6, 0]}>
          <torusGeometry args={[2.3, 0.004, 8, 96]} />
          <meshBasicMaterial color={ringColor} transparent opacity={ring2Opacity} />
        </mesh>
      </group>
    </group>
  );
}

export default function NormalHeroScene({ markers = [], className = "" }) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const sparklesColor = isLight ? "#2a6b8c" : "#dceeff";
  const sparklesOpacity = isLight ? 0.55 : 0.35;

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
          <WireGlobe markers={markers} isLight={isLight} />
          <Sparkles count={60} size={1.6} scale={[6, 6, 6]} speed={0.2} opacity={sparklesOpacity} color={sparklesColor} />
        </Suspense>
      </Canvas>
    </div>
  );
}
