import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import { destinations, CATEGORY_THEME } from "../../data/destinations";
import { useCesiumViewer } from "../../hooks/useCesiumViewer";
import { useActiveSection } from "../../hooks/useActiveSection";
import DestinationCard from "../DestinationCard/DestinationCard";
import Sidebar from "../Sidebar/Sidebar";

export default function GlobeSection() {
  const cesiumContainer = useRef(null);
  const glowEntityRef = useRef(null);
  const markerEntitiesRef = useRef([]);
  const { activeIndex, registerRef } = useActiveSection(destinations.length);

  const viewerRef = useCesiumViewer(cesiumContainer, {
    onReady: (viewer) => {
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(78, 15, 1.8e7),
      });

      // One labeled marker per destination, always visible on the globe.
      markerEntitiesRef.current = destinations.map((dest, index) => {
        const isActive = index === 0;
        return viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(dest.lon, dest.lat),
          point: {
            pixelSize: isActive ? 12 : 8,
            color: isActive
              ? Cesium.Color.fromCssColorString("#ff6a4d")
              : Cesium.Color.WHITE.withAlpha(0.85),
            outlineColor: Cesium.Color.fromCssColorString("#1c1b1b"),
            outlineWidth: 1.5,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
          label: {
            text: dest.name,
            font: isActive ? "600 15px 'Plus Jakarta Sans', sans-serif" : "500 12px 'Inter', sans-serif",
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.fromCssColorString("#1c1b1b"),
            outlineWidth: 3,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -14),
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            showBackground: true,
            backgroundColor: Cesium.Color.fromCssColorString("#0A0A0A").withAlpha(
              isActive ? 0.55 : 0.35
            ),
            backgroundPadding: new Cesium.Cartesian2(6, 3),
          },
        });
      });

      // Extra glow pulse layered on top of the active marker.
      glowEntityRef.current = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(
          destinations[0].lon,
          destinations[0].lat
        ),
        point: {
          pixelSize: 26,
          color: Cesium.Color.fromCssColorString("#ff6a4d").withAlpha(0.25),
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
      });
    },
  });

  // Fly the globe camera + move the glow pulse + re-style markers whenever
  // the active destination card changes — this is the "pulled from Earth"
  // moment.
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || viewer.isDestroyed()) return;
    const dest = destinations[activeIndex];

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(dest.lon, dest.lat, 40000),
      duration: 3,
      maximumHeight: 8_000_000, // arcs the camera way up mid-flight before descending
      pitchAdjustHeight: 50_000, // levels off to look down near the end, avoids clipping the ground
      easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,
    });

    if (glowEntityRef.current) {
      glowEntityRef.current.position = new Cesium.ConstantPositionProperty(
        Cesium.Cartesian3.fromDegrees(dest.lon, dest.lat)
      );
    }

    markerEntitiesRef.current.forEach((entity, index) => {
      const isActive = index === activeIndex;
      entity.point.pixelSize = isActive ? 12 : 8;
      entity.point.color = isActive
        ? Cesium.Color.fromCssColorString("#ff6a4d")
        : Cesium.Color.WHITE.withAlpha(0.85);
      entity.label.font = isActive
        ? "600 15px 'Plus Jakarta Sans', sans-serif"
        : "500 12px 'Inter', sans-serif";
      entity.label.backgroundColor = Cesium.Color.fromCssColorString(
        "#0A0A0A"
      ).withAlpha(isActive ? 0.55 : 0.35);
    });
  }, [activeIndex, viewerRef]);

  const activeTheme = CATEGORY_THEME[destinations[activeIndex].themeCategory];

  return (
    <section
      id="destinations"
      className={`relative transition-[background] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${activeTheme}`}
      style={{
        background:
          "linear-gradient(180deg, var(--color-cream) 0%, color-mix(in srgb, var(--theme-primary) 10%, var(--color-cream)) 100%)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none transition-[background] duration-[1200ms] ease-linear"
        style={{
          background:
            "radial-gradient(circle at 75% 30%, color-mix(in srgb, var(--theme-primary) 24%, transparent) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />
      <div
        className="sticky top-0 h-screen w-full -mb-[100vh] z-0 opacity-90 [mask-image:radial-gradient(circle_at_68%_45%,black_42%,transparent_72%)] max-[900px]:[mask-image:none] max-[900px]:opacity-35"
        ref={cesiumContainer}
      />
      <div
        className="sticky top-0 h-screen -mb-[100vh] pointer-events-none z-[1] [mix-blend-mode:screen] transition-[background] duration-[1200ms] ease-linear max-[900px]:opacity-35"
        style={{
          background:
            "radial-gradient(circle at 68% 45%, color-mix(in srgb, var(--theme-glow) 35%, transparent) 0%, transparent 55%)",
        }}
        aria-hidden="true"
      />

      <Sidebar
        items={destinations}
        activeIndex={activeIndex}
        onSelect={(index) =>
          document
            .querySelector(`.destination-section[data-index="${index}"]`)
            ?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      />

      <div className="relative z-[2]">
        {destinations.map((dest, index) => (
          <div
            key={dest.id}
            data-index={index}
            ref={(el) => registerRef(el, index)}
            className="destination-section min-h-screen flex items-center px-[6vw] py-[120px] [scroll-snap-align:start] max-[900px]:px-5 max-[900px]:py-[90px] max-[900px]:justify-center"
          >
            <DestinationCard
              destination={dest}
              isActive={index === activeIndex}
              index={index}
            />
          </div>
        ))}
      </div>
    </section>
  );
}