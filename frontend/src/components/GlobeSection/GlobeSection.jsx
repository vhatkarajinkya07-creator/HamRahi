import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useModeOfView } from "../../hooks/useModeOfView";
import { useTheme } from "../../context/ThemeContext";
import Globe3DLoader from "./Globe3DLoader";

const GlobeSection3D = lazy(() => import("./GlobeSection3D"));
const GlobeSectionNormal = lazy(() => import("./GlobeSectionNormal"));

// How long the loading screen is shown (ms) — gives Cesium time to fully init
const LOADER_DURATION = 4600;

export default function GlobeSection({ selectedCategory, setSelectedCategory }) {
  const { modeOfView, setModeOfView } = useModeOfView();
  const { theme, setTheme } = useTheme();

  // Remember the theme active before entering 3D
  const prevThemeRef = useRef(null);

  // Whether to show the loader overlay
  const [showLoader, setShowLoader] = useState(false);
  // Whether the 3D component itself should be mounted (so it loads in background)
  const [mount3D, setMount3D] = useState(false);

  // Effect 1: modeOfView changes → manage theme + trigger loader
  useEffect(() => {
    if (modeOfView === "high") {
      // Force dark
      if (theme !== "dark") {
        prevThemeRef.current = theme;
        setTheme("dark");
      }
      // Show loader and start mounting 3D in background
      setShowLoader(true);
      setMount3D(true);
    } else {
      // Restore theme
      if (prevThemeRef.current !== null) {
        setTheme(prevThemeRef.current);
        prevThemeRef.current = null;
      }
      // Unmount loader and 3D when going back to normal
      setShowLoader(false);
      setMount3D(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modeOfView]);

  // Effect 2: If user switches to light while in 3D → exit 3D
  useEffect(() => {
    if (theme === "light" && modeOfView === "high") {
      prevThemeRef.current = null;
      setModeOfView("low");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  return (
    <>
      {/* Loading overlay — shown on top of everything during transition */}
      {showLoader && (
        <Globe3DLoader
          duration={LOADER_DURATION}
          onDone={() => setShowLoader(false)}
        />
      )}

      {/* 3D globe — mounted in background while loader plays */}
      {mount3D && (
        <Suspense fallback={null}>
          <GlobeSection3D />
        </Suspense>
      )}

      {/* Normal section — shown when not in 3D */}
      {modeOfView !== "high" && (
        <Suspense fallback={null}>
          <GlobeSectionNormal
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </Suspense>
      )}
    </>
  );
}