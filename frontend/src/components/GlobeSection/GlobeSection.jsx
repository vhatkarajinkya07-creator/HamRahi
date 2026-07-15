import { lazy, Suspense, useEffect, useRef } from "react";
import { useModeOfView } from "../../hooks/useModeOfView";
import { useTheme } from "../../context/ThemeContext";

const GlobeSection3D = lazy(() => import("./GlobeSection3D"));
const GlobeSectionNormal = lazy(() => import("./GlobeSectionNormal"));

export default function GlobeSection({ selectedCategory, setSelectedCategory }) {
  const { modeOfView, setModeOfView } = useModeOfView();
  const { theme, setTheme } = useTheme();

  // Remember the theme that was active before entering 3D
  const prevThemeRef = useRef(null);

  // Effect 1: When modeOfView changes → manage theme
  useEffect(() => {
    if (modeOfView === "high") {
      // Entering 3D — save current theme and force dark
      if (theme !== "dark") {
        prevThemeRef.current = theme;
        setTheme("dark");
      }
    } else {
      // Leaving 3D — restore previous theme if we auto-changed it
      if (prevThemeRef.current !== null) {
        setTheme(prevThemeRef.current);
        prevThemeRef.current = null;
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modeOfView]);

  // Effect 2: When theme changes to light while in 3D → exit 3D mode
  useEffect(() => {
    if (theme === "light" && modeOfView === "high") {
      // User manually toggled to light — drop back to normal mode
      prevThemeRef.current = null; // clear so no stale restore
      setModeOfView("low");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  return (
    <Suspense fallback={null}>
      {modeOfView === "high" ? (
        <GlobeSection3D />
      ) : (
        <GlobeSectionNormal selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      )}
    </Suspense>
  );
}