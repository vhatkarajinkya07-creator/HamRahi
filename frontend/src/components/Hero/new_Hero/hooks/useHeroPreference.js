// hooks/useHeroPreference.js
//
// Persists the user's manual Hero mode choice ("cesium" | "three") so that,
// once set, it always wins over auto-detection on future visits.

import { useCallback, useState } from "react";

const STORAGE_KEY = "hero-render-mode";

function readStoredPreference() {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "cesium" || value === "three" ? value : null;
  } catch {
    // Storage unavailable (private browsing, disabled cookies, etc.)
    return null;
  }
}

export function useHeroPreference() {
  const [preference, setPreferenceState] = useState(readStoredPreference);

  const setPreference = useCallback((mode) => {
    setPreferenceState(mode);
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Non-fatal — the toggle still works for the current session.
    }
  }, []);

  const clearPreference = useCallback(() => {
    setPreferenceState(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // no-op
    }
  }, []);

  return { preference, setPreference, clearPreference };
}
