//don't change -AJINKYA

import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

export function useCesiumViewer(containerRef, options = {}) {
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const token = import.meta.env.VITE_CESIUM_ACCESS_TOKEN;
    if (token) {
      Cesium.Ion.defaultAccessToken = token;
    }

    const viewer = new Cesium.Viewer(containerRef.current, {
      animation: false,
      timeline: false,
      baseLayerPicker: false, 
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      fullscreenButton: false,
      infoBox: false,
      selectionIndicator: false,
      // Use OpenStreetMap imagery if no access token is set, preventing 401 Ion imagery requests and local asset 404s
      ...(token ? {} : {
        baseLayer: new Cesium.ImageryLayer(
          new Cesium.UrlTemplateImageryProvider({
            url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            minimumLevel: 0,
            maximumLevel: 19,
          })
        ),
      }),
      creditContainer: document.createElement("div"),
      contextOptions: { webgl: { alpha: true } },
      ...options,
    });

    viewer.scene.globe.enableLighting = true;
    viewer.scene.globe.showGroundAtmosphere = true;
    viewer.scene.backgroundColor = Cesium.Color.fromCssColorString("#111");
    viewer.clock.shouldAnimate = true;

    viewerRef.current = viewer;

    // Load Terrain asynchronously to prevent WebGL constructor rendering loops from halting
    if (token) {
      Cesium.Terrain.fromWorldTerrain()
        .then((provider) => {
          if (viewerRef.current && !viewerRef.current.isDestroyed()) {
            viewerRef.current.scene.terrainProvider = provider;
            viewerRef.current.scene.globe.depthTestAgainstTerrain = true;
          }
        })
        .catch((err) => {
          console.error("Cesium Terrain loading failed:", err);
        });
    }

    if (options.onReady) options.onReady(viewer);

    return () => {
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
      }
      viewerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef]);

  return viewerRef;
}
