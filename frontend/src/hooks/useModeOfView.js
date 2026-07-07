
import { useCallback, useEffect, useState } from "react";
import Client, { ChangeModeOfView, SetModeOfView } from "../model/ClientSettings";

const listeners = new Set();

function notify() {
  for (const listener of listeners) listener(Client.modeOfView);
}

export function useModeOfView() {
  const [modeOfView, setModeOfViewState] = useState(Client.modeOfView);

  useEffect(() => {
    const listener = (mode) => setModeOfViewState(mode);
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  const setMode = useCallback((mode) => {
    SetModeOfView(Client, mode);
    notify();
  }, []);

  const toggleMode = useCallback(() => {
    ChangeModeOfView(Client);
    notify();
  }, []);

  return { modeOfView, setMode, toggleMode };
}
