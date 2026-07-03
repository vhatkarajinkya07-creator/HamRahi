

import { useEffect, useRef, useState } from "react";
import { detectPerformance } from "../utils/detectPerformance";

export function usePerformanceTier() {
  const [tier, setTier] = useState(null); // "high" | "low" | null (detecting)
  const [meta, setMeta] = useState(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    let cancelled = false;

    detectPerformance().then((result) => {
      if (cancelled) return;
      setTier(result.tier);
      setMeta(result.meta);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { tier, meta, isDetecting: tier === null };
}
