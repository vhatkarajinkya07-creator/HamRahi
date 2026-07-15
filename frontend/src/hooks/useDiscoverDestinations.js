import { useEffect, useState } from "react";
import api from "../services/api";
import { destinations as fallbackDestinations } from "../data/destinations";
import { mapDestinationSummary } from "../services/destinationMapper";

export function useDiscoverDestinations() {
  const [destinations, setDestinations] = useState(fallbackDestinations);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    let active = true;

    async function loadDiscover() {
      setStatus("loading");

      try {
        const { data } = await api.get("/destination/discover");
        if (!active) return;

        const mapped = Array.isArray(data) ? data.map(mapDestinationSummary) : [];
        setDestinations(mapped.length ? mapped : fallbackDestinations);
        setStatus("ready");
      } catch {
        if (!active) return;
        setDestinations(fallbackDestinations);
        setStatus("error");
      }
    }

    loadDiscover();

    const handleRefresh = () => {
      loadDiscover();
    };

    window.addEventListener("refresh-destinations", handleRefresh);

    return () => {
      active = false;
      window.removeEventListener("refresh-destinations", handleRefresh);
    };
  }, []);

  return { destinations, status };
}
