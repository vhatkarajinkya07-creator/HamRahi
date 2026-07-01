import { useEffect, useRef } from "react";
import * as Cesium from "cesium";

// Cesium ships with a demo Ion access token by default. For this MVP we avoid
// requiring any account/token by using OpenStreetMap imagery + ArcGIS's
// public elevation service for real terrain, which both work fully offline
// of Ion.
Cesium.Ion.defaultAccessToken = undefined;

const ARCGIS_TERRAIN_URL =
  "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer";

/**
 * Boots a minimal, token-free Cesium.Viewer inside the given container ref,
 * with real-world elevation terrain (via ArcGIS) instead of a flat ellipsoid.
 * Returns a ref to the viewer instance once ready (set asynchronously).
 */
export function useCesiumViewer(containerRef, options = {}) {
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let destroyed = false;

    const imageryProvider = new Cesium.OpenStreetMapImageryProvider({
      url: "https://tile.openstreetmap.org/",
    });

    const viewer = new Cesium.Viewer(containerRef.current, {
      baseLayer: Cesium.ImageryLayer.fromProviderAsync(
        Promise.resolve(imageryProvider)
      ),
      // Start on the flat ellipsoid; swapped for real terrain once it loads.
      terrainProvider: new Cesium.EllipsoidTerrainProvider(),
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
      infoBox: false,
      selectionIndicator: false,
      creditContainer: document.createElement("div"), // hide default credits UI
      contextOptions: { webgl: { alpha: true } },
      ...options,
    });

    viewer.scene.globe.enableLighting = true;
    viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString("#e8f6ff");
    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.scene.skyAtmosphere.hueShift = -0.02;
    viewer.scene.skyAtmosphere.saturationShift = 0.1;
    viewer.scene.skyAtmosphere.brightnessShift = 0.15;
    viewer.scene.backgroundColor = Cesium.Color.TRANSPARENT;
    viewer.scene.sun.glowFactor = 1.0;
    viewer.scene.fog.enabled = true;
    viewer.scene.globe.showGroundAtmosphere = true;
    viewer.clock.shouldAnimate = true;

    // Swap in real-world elevation terrain once it's loaded, so mountains,
    // valleys, and coastlines actually have relief instead of a flat globe.
    Cesium.ArcGISTiledElevationTerrainProvider.fromUrl(ARCGIS_TERRAIN_URL)
      .then((terrainProvider) => {
        if (destroyed || viewer.isDestroyed()) return;
        viewer.terrainProvider = terrainProvider;
      })
      .catch((err) => {
        // Fall back silently to the flat ellipsoid already in use.
        console.warn("Cesium terrain failed to load, using ellipsoid:", err);
      });

    if (!destroyed) {
      viewerRef.current = viewer;
      if (options.onReady) options.onReady(viewer);
    }

    return () => {
      destroyed = true;
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
      }
      viewerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef]);

  return viewerRef;
}