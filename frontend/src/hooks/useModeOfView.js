import { useSyncExternalStore, useCallback } from "react";
import Client, { SetModeOfView } from "../model/ClientSettings";

const listeners = new Set();

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return Client.modeOfView;
}

function notify() {
  listeners.forEach((listener) => listener());
}

export function useModeOfView() {
  const modeOfView = useSyncExternalStore(subscribe, getSnapshot);

  const setModeOfView = useCallback((nextMode) => {
    SetModeOfView(Client, nextMode);
    notify();
  }, []);

  return { modeOfView, setModeOfView };
}