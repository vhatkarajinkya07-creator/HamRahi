//       don't change any thing in this until asked to AJINKYA

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Cesium from "cesium";
import { destinations, CATEGORY_THEME } from "../../data/destinations";
import { useCesiumViewer } from "../../hooks/useCesiumViewer";
import { useActiveSection } from "../../hooks/useActiveSection";
import { useIsMobile } from "../../hooks/useIsMobile";
import DestinationCard from "../DestinationCard/DestinationCard";
import DestinationDetailsPanel from "../DestinationDetailsPanel/DestinationDetailsPanel";

export default function GlobeSection() {
  const cesiumContainer = useRef(null);
  const glowEntityRef = useRef(null);
  const markerEntitiesRef = useRef([]);
  const panelRevealTimeoutRef = useRef(null);
  const { activeIndex, registerRef } = useActiveSection(destinations.length);
  const isMobile = useIsMobile(900);
  const navigate = useNavigate();

  const [phase, setPhase] = useState("establishing");
  const [panelOpen, setPanelOpen] = useState(false);

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
              isActive ? 0.62 : 0.42,
            ),
            backgroundPadding: new Cesium.Cartesian2(7, 4),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
              0,
              9000000,
            ),
          },
        });
      });

      glowEntityRef.current = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(
          destinations[0].lon,
          destinations[0].lat,
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

    if (panelRevealTimeoutRef.current) {
      clearTimeout(panelRevealTimeoutRef.current);
      panelRevealTimeoutRef.current = null;
    }

    setPanelOpen(false);
    setPhase("establishing");

    if (isMobile || !viewer || viewer.isDestroyed()) return;

    let cancelled = false;
    const dest = destinations[activeIndex];

    if (glowEntityRef.current) {
      glowEntityRef.current.position = new Cesium.ConstantPositionProperty(
        Cesium.Cartesian3.fromDegrees(dest.lon, dest.lat),
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
        "#07111f",
      ).withAlpha(isActive ? 0.62 : 0.42);
    });

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(dest.lon, dest.lat, 8000),
      duration: 4,
      maximumHeight: 8000000,
      pitchAdjustHeight: 50000,
      easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,
      complete: () => {
        if (cancelled || viewer.isDestroyed()) return;

        setPhase("streetview");

        const streetviewDuration = 4.2;

        panelRevealTimeoutRef.current = setTimeout(() => {
          if (cancelled || viewer.isDestroyed()) return;

          setPhase("arrived");
          setPanelOpen(true);
        }, Math.max(0, streetviewDuration * 1000 - 1500));

        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(dest.lon, dest.lat, 140),
          orientation: {
            heading: Cesium.Math.toRadians(42),
            pitch: Cesium.Math.toRadians(-18),
            roll: 0,
          },
          duration: streetviewDuration,
          easingFunction: Cesium.EasingFunction.QUINTIC_IN_OUT,
        });
      },
    });

    return () => {
      cancelled = true;

      if (panelRevealTimeoutRef.current) {
        clearTimeout(panelRevealTimeoutRef.current);
        panelRevealTimeoutRef.current = null;
      }
    };
  }, [activeIndex, viewerRef, isMobile]);

  const handleStartExploring = (id) => {
    navigate(`/destination/${id}`);
  };

  const activeTheme = CATEGORY_THEME[destinations[activeIndex].themeCategory];
  const activeDestination = destinations[activeIndex];

  return (
    <section
      id="destinations"
      className={`relative bg-black transition-[background] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isMobile ? "" : activeTheme
      }`}
      style={
        isMobile
          ? undefined
          : {
              background:
                "linear-gradient(180deg, #050505 0%, #0a0a0a 46%, #000000 100%)",
            }
      }
    >
      {!isMobile && (
        <>
          <div
            className="pointer-events-none absolute inset-0 transition-[background] duration-[1200ms] ease-linear"
            style={{
              background:
                "radial-gradient(circle at 25% 45%, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.42) 34%, transparent 66%)",
            }}
            aria-hidden="true"
          />

          <div
            className="sticky top-0 z-0 -mb-[100vh] h-screen w-full opacity-90 [mask-image:radial-gradient(circle_at_68%_45%,black_42%,transparent_72%)]"
            ref={cesiumContainer}
          />

          <div
            className="pointer-events-none sticky top-0 z-[1] -mb-[100vh] h-screen transition-[background] duration-[1200ms] ease-linear"
            style={{
              background:
                "radial-gradient(circle at 24% 50%, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.38) 34%, transparent 62%)",
            }}
            aria-hidden="true"
          />
        </>
      )}

      {isMobile ? (
        <div className="relative z-[2]">
          {destinations.map((dest, index) => (
            <div
              key={dest.id}
              data-index={index}
              ref={(el) => registerRef(el, index)}
              className="destination-section flex min-h-screen items-center justify-center px-5 py-[90px]"
            >
              <DestinationCard
                destination={dest}
                isActive={index === activeIndex}
                isMobile
                phase="establishing"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="relative z-[2] flex">
          <div className="flex w-[42%] flex-col">
            {destinations.map((dest, index) => (
              <div
                key={dest.id}
                data-index={index}
                ref={(el) => registerRef(el, index)}
                className="destination-section flex min-h-screen items-center px-[5vw] py-[120px] [scroll-snap-align:start]"
              >
                <DestinationCard
                  destination={dest}
                  isActive={index === activeIndex}
                  isMobile={false}
                  phase={index === activeIndex ? phase : "establishing"}
                />
              </div>
            ))}
          </div>

          <div className="sticky top-0 z-[3] flex h-screen w-[58%] items-center justify-start self-start pl-2 pr-6">
            <DestinationDetailsPanel
              destination={activeDestination}
              open={panelOpen}
              onClose={() => setPanelOpen(false)}
            />
          </div>
        </div>
      )}
    </section>
  );
}