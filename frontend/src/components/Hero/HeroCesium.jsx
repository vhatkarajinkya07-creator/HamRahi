

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as Cesium from "cesium";
import { useCesiumViewer } from "../../hooks/useCesiumViewer";

export default function HeroCesium({ scale }) {
  const cesiumContainer = useRef(null);
  const viewerRef = useCesiumViewer(cesiumContainer, {
    onReady: (viewer) => {
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(78, 12, 0.7e7),
      });

      const controller = viewer.scene.screenSpaceCameraController;
      controller.enableRotate = false;
      controller.enableZoom = false;
      controller.enableTilt = false;
      controller.enableTranslate = false;
      controller.enableLook = false;
      viewer.canvas.style.pointerEvents = "none";
    },
  });

  useEffect(() => {
    let raf;

    const tick = () => {
      const viewer = viewerRef.current;
      if (viewer && !viewer.isDestroyed()) {
        viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -0.00042);
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [viewerRef]);

  return (
    <motion.div
      className="absolute inset-0 h-full w-full pointer-events-none [&_canvas]:outline-none"
      ref={cesiumContainer}
      aria-hidden="true"
      style={{ scale }}
    />
  );
}
