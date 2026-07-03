//       don't change any thing in this until asked to AJINKYA

import { useEffect, useRef, useState } from "react";
import * as Cesium from "cesium";
import { destinations, CATEGORY_THEME } from "../../data/destinations";
import { useCesiumViewer } from "../../hooks/useCesiumViewer";
import { useActiveSection } from "../../hooks/useActiveSection";
import { useIsMobile } from "../../hooks/useIsMobile";
import DestinationCard from "../DestinationCard/DestinationCard";

export default function GlobeSection() {
  const cesiumContainer = useRef(null);
  const glowEntityRef = useRef(null);
  const markerEntitiesRef = useRef([]);
  const cinematicTimeoutRef = useRef(null);
  const { activeIndex, registerRef } = useActiveSection(destinations.length);
  const isMobile = useIsMobile(900);

  // Tracks whether the camera has finished "arriving" at the active
  // destination — gates the CTA reveal on DestinationCard.
  const [isArrived, setIsArrived] = useState(isMobile);

  const viewerRef = useCesiumViewer(cesiumContainer, {
    onReady: (viewer) => {
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(78.9629, 22.5937, 4500000),
      });

      viewer.scene.globe.depthTestAgainstTerrain = true;
      viewer.scene.globe.enableLighting = true;
      viewer.scene.globe.showGroundAtmosphere = true;

      markerEntitiesRef.current = destinations.map((dest, index) => {
        const isActive = index === 0;

        return viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(dest.lon, dest.lat),
          point: {
            pixelSize: isActive ? 12 : 8,
            color: isActive
              ? Cesium.Color.WHITE
              : Cesium.Color.WHITE.withAlpha(0.78),
            outlineColor: Cesium.Color.BLACK.withAlpha(0.5),
            outlineWidth: 1.5,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          },
          label: {
            text: dest.name,
            font: isActive
              ? "600 15px 'Plus Jakarta Sans', sans-serif"
              : "500 12px 'Inter', sans-serif",
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK.withAlpha(0.72),
            outlineWidth: 3,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -16),
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            showBackground: true,
            backgroundColor: Cesium.Color.fromCssColorString("#07111f").withAlpha(
              isActive ? 0.62 : 0.42
            ),
            backgroundPadding: new Cesium.Cartesian2(7, 4),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
              0,
              9000000
            ),
          },
        });
      });

      glowEntityRef.current = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(
          destinations[0].lon,
          destinations[0].lat
        ),
        point: {
          pixelSize: 28,
          color: Cesium.Color.WHITE.withAlpha(0.2),
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
      });
    },
  });

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || viewer.isDestroyed()) return;

    let cancelled = false;
    const dest = destinations[activeIndex];

    // Reset arrival state: mobile "arrives" instantly (no cinematic zoom),
    // desktop stays hidden until the second flight completes.
    setIsArrived(isMobile);

    if (glowEntityRef.current) {
      glowEntityRef.current.position = new Cesium.ConstantPositionProperty(
        Cesium.Cartesian3.fromDegrees(dest.lon, dest.lat)
      );
    }

    markerEntitiesRef.current.forEach((entity, index) => {
      const isActive = index === activeIndex;

      entity.point.pixelSize = isActive ? 12 : 8;
      entity.point.color = isActive
        ? Cesium.Color.WHITE
        : Cesium.Color.WHITE.withAlpha(0.78);

      entity.label.font = isActive
        ? "600 15px 'Plus Jakarta Sans', sans-serif"
        : "500 12px 'Inter', sans-serif";
      entity.label.backgroundColor = Cesium.Color.fromCssColorString(
        "#07111f"
      ).withAlpha(isActive ? 0.62 : 0.42);
    });

    if (isMobile) {
      // Mobile: keep it light. One flight, no cinematic street-entry.
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(dest.lon, dest.lat, 20000),
        duration: 2,
      });
      return () => {
        cancelled = true;
      };
    }

    // Desktop — stage 1: the existing wide establishing flyTo.
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(dest.lon, dest.lat, 8000),
      duration: 4,
      maximumHeight: 8000000,
      pitchAdjustHeight: 50000,
      easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,
      complete: () => {
        if (cancelled || viewer.isDestroyed()) return;

        // brief pause before the "entering the city" push-in
        cinematicTimeoutRef.current = setTimeout(() => {
          if (cancelled || viewer.isDestroyed()) return;

          // Desktop — stage 2: cinematic close-in. Zooms low, tilts down,
          // rotates slightly — the "arriving at street level" feeling.
          viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(dest.lon, dest.lat, 350),
            orientation: {
              heading: Cesium.Math.toRadians(38),
              pitch: Cesium.Math.toRadians(-26),
              roll: 0,
            },
            duration: 3.6,
            easingFunction: Cesium.EasingFunction.QUINTIC_IN_OUT,
            complete: () => {
              if (!cancelled) setIsArrived(true);
            },
          });
        }, 350);
      },
    });

    return () => {
      cancelled = true;
      if (cinematicTimeoutRef.current) {
        clearTimeout(cinematicTimeoutRef.current);
        cinematicTimeoutRef.current = null;
      }
    };
  }, [activeIndex, viewerRef, isMobile]);

  const activeTheme = CATEGORY_THEME[destinations[activeIndex].themeCategory];

  return (
    <section
      id="destinations"
      className={`relative bg-black transition-[background] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${activeTheme}`}
      style={{
        background:
          "linear-gradient(180deg, #050505 0%, #0a0a0a 46%, #000000 100%)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none transition-[background] duration-[1200ms] ease-linear"
        style={{
          background:
            "radial-gradient(circle at 25% 45%, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.42) 34%, transparent 66%)",
        }}
        aria-hidden="true"
      />

      <div
        className="sticky top-0 h-screen w-full -mb-[100vh] z-0 opacity-90 [mask-image:radial-gradient(circle_at_68%_45%,black_42%,transparent_72%)] max-[900px]:[mask-image:none] max-[900px]:opacity-35"
        ref={cesiumContainer}
      />

      <div
        className="sticky top-0 h-screen -mb-[100vh] pointer-events-none z-[1] transition-[background] duration-[1200ms] ease-linear max-[900px]:opacity-35"
        style={{
          background:
            "radial-gradient(circle at 24% 50%, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.38) 34%, transparent 62%)",
        }}
        aria-hidden="true"
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
              arrived={index === activeIndex ? isArrived : false}
            />
          </div>
        ))}
      </div>
    </section>
  );
}