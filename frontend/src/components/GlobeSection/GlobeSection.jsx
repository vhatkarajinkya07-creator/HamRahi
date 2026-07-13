import { lazy, Suspense } from "react";
import { useModeOfView } from "../../hooks/useModeOfView";

const GlobeSection3D = lazy(() => import("./GlobeSection3D"));
const GlobeSectionNormal = lazy(() => import("./GlobeSectionNormal"));

export default function GlobeSection() {
  const { modeOfView } = useModeOfView();

  return (
    <Suspense fallback={null}>
      {modeOfView === "high" ? <GlobeSection3D /> : <GlobeSectionNormal />}
    </Suspense>
  );
}