import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "../../context/ThemeContext";

const GLOBE_RADIUS = 2.0;

const TRAVEL_HUBS = {
  london: { lat: 51.5074, lng: -0.1278, label: "London" },
  newYork: { lat: 40.7128, lng: -74.0060, label: "New York" },
  tokyo: { lat: 35.6762, lng: 139.6503, label: "Tokyo" },
  sydney: { lat: -33.8688, lng: 151.2093, label: "Sydney" },
  cairo: { lat: 30.0444, lng: 31.2357, label: "Cairo" },
  mumbai: { lat: 19.0760, lng: 72.8777, label: "Mumbai" },
  rio: { lat: -22.9068, lng: -43.1729, label: "Rio de Janeiro" },
  paris: { lat: 48.8566, lng: 2.3522, label: "Paris" },
};

// Helper to convert latitude/longitude coordinates to 3D Cartesian vectors
function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.sin(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.cos(theta);
  return new THREE.Vector3(x, y, z);
}

// Low-GPU Wire Globe Component matching Normal Mode section style
function LowGpuGlobe({ isLight }) {
  const globeRef = useRef(null);
  const ringsRef = useRef(null);
  
  const targetRotationX = useRef(0.2);
  const targetRotationY = useRef(0.0);

  // Colors mapping based on theme
  const colors = useMemo(() => {
    if (isLight) {
      return {
        wireframe: "#2a6b8c",
        ring: "#2a6b8c",
        marker: "#ff6a4d",
      };
    } else {
      return {
        wireframe: "#dceeff",
        ring: "#8fb6d9",
        marker: "#ffd563",
      };
    }
  }, [isLight]);

  // Sizing and assets
  const globeGeometry = useMemo(() => new THREE.IcosahedronGeometry(GLOBE_RADIUS, 2), []);

  const markerPositions = useMemo(
    () => Object.values(TRAVEL_HUBS).map((h) => latLngToVector3(h.lat, h.lng, GLOBE_RADIUS + 0.02)),
    []
  );

  useFrame((state) => {
    const { x, y } = state.pointer; // Mouse normalized coordinates [-1, 1]

    // Slow auto-rotation combined with subtle mouse tilt
    targetRotationY.current = state.clock.getElapsedTime() * 0.05 + x * 0.22;
    targetRotationX.current = 0.2 - y * 0.14;

    if (globeRef.current) {
      globeRef.current.rotation.y += (targetRotationY.current - globeRef.current.rotation.y) * 0.05;
      globeRef.current.rotation.x += (targetRotationX.current - globeRef.current.rotation.x) * 0.05;
    }

    if (ringsRef.current) {
      ringsRef.current.rotation.z = state.clock.getElapsedTime() * 0.022;
    }
  });

  return (
    <group ref={globeRef} rotation={[0.2, 0, -0.1]}>
      {/* Wireframe low-poly globe core */}
      <mesh geometry={globeGeometry}>
        <meshBasicMaterial
          color={colors.wireframe}
          wireframe
          transparent
          opacity={isLight ? 0.32 : 0.22}
          depthWrite={false}
        />
      </mesh>

      {/* City Markers */}
      {markerPositions.map((pos, idx) => (
        <mesh key={`hub-${idx}`} position={pos}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshBasicMaterial color={colors.marker} transparent opacity={0.88} />
        </mesh>
      ))}

      {/* Decorative Rotating Torus Rings (Orbit Tracks) */}
      <group ref={ringsRef}>
        <mesh rotation={[Math.PI / 2.3, 0, 0]}>
          <torusGeometry args={[GLOBE_RADIUS * 1.25, 0.005, 6, 48]} />
          <meshBasicMaterial color={colors.ring} transparent opacity={isLight ? 0.18 : 0.12} />
        </mesh>
        <mesh rotation={[Math.PI / 1.7, Math.PI / 5, 0]}>
          <torusGeometry args={[GLOBE_RADIUS * 1.35, 0.005, 6, 48]} />
          <meshBasicMaterial color={colors.ring} transparent opacity={isLight ? 0.12 : 0.08} />
        </mesh>
      </group>
    </group>
  );
}

// Slow, ambient camera drift
function DriftingCamera() {
  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime();
    camera.position.x = Math.sin(t * 0.04) * 0.25;
    camera.position.y = 0.1 + Math.sin(t * 0.035) * 0.08;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroThree() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const fogColor = isLight ? "#fffaf3" : "#0d0f1c";

  return (
    <div className="absolute inset-0 h-full w-full pointer-events-none select-none">
      <Canvas
        dpr={1}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0.2, 5.0], fov: 42 }}
      >
        <fog attach="fog" args={[fogColor, 4, 9]} />

        <Suspense fallback={null}>
          {/* Low-GPU Wire Globe */}
          <LowGpuGlobe isLight={isLight} />

          {/* Faint floating sparkles */}
          <Sparkles
            count={45}
            size={isLight ? 2.0 : 1.4}
            scale={[8, 5, 7]}
            speed={0.16}
            opacity={isLight ? 0.45 : 0.3}
            color={isLight ? "#2a6b8c" : "#8fb6d9"}
          />
        </Suspense>

        <DriftingCamera />
      </Canvas>
    </div>
  );
}
