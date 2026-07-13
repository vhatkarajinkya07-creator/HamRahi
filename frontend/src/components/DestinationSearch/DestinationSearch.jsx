// components/DestinationSearch/DestinationSearch.jsx
//
// Wires up GET /api/destination/search?q=... — this endpoint existed on the
// backend already but had no frontend UI anywhere in the app. Built to match
// the same dark-glass visual language and animation variants already used
// across Login/Wishlist/Itinerary, and reuses NormalDestinationCard +
// mapDestinationSummary so results look and behave exactly like Discover
// cards instead of introducing a new card design.

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { ProgressSpinner } from "primereact/progressspinner";
import api from "../../services/api";
import { mapDestinationSummary } from "../../services/destinationMapper";
import { fadeUp, staggerContainer } from "../../animations/variants";
import NormalDestinationCard from "../GlobeSection/NormalDestinationCard";

const DEBOUNCE_MS = 350;

export default function DestinationSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | ready | error
  const [error, setError] = useState("");
  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = query.trim();

    if (!trimmed) {
      setResults([]);
      setStatus("idle");
      setError("");
      return undefined;
    }

    debounceRef.current = setTimeout(async () => {
      const requestId = ++requestIdRef.current;
      setStatus("loading");
      setError("");

      try {
        const { data } = await api.get("/destination/search", { params: { q: trimmed } });
        if (requestId !== requestIdRef.current) return;

        const mapped = Array.isArray(data) ? data.map(mapDestinationSummary) : [];
        setResults(mapped);
        setStatus("ready");
      } catch (err) {
        if (requestId !== requestIdRef.current) return;
        setResults([]);
        setStatus("error");
        setError(err.response?.data?.message || "Could not search destinations right now.");
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const showEmpty = status === "ready" && results.length === 0;

  return (
    <section
      id="search"
      className="relative bg-[#050505] px-[6vw] pb-6 pt-16 md:pt-20"
    >
      <motion.div
        className="mx-auto max-w-[1400px]"
        variants={staggerContainer(0.08, 0.05)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.span
          className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase text-white/60 backdrop-blur-2xl"
          variants={fadeUp}
        >
          <i className="pi pi-search text-[11px]" aria-hidden="true" />
          Search destinations
        </motion.span>

        <motion.h2
          className="mt-5 max-w-[640px] text-3xl font-semibold leading-tight text-white md:text-5xl"
          variants={fadeUp}
        >
          Know where you're headed? Look it up.
        </motion.h2>

        <motion.div className="relative mt-7 max-w-[560px]" variants={fadeUp}>
          <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-white/40">
            <i className="pi pi-search" aria-hidden="true" />
          </span>
          <InputText
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a city, region, or landmark..."
            aria-label="Search destinations"
            className="w-full rounded-full border border-white/14 bg-white/[0.06] py-4 pl-12 pr-5 text-white placeholder:text-white/38 backdrop-blur-2xl"
          />
          {status === "loading" && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2">
              <ProgressSpinner strokeWidth="6" style={{ width: "22px", height: "22px" }} />
            </span>
          )}
        </motion.div>

        {error && <Message severity="error" text={error} className="mt-5 w-full max-w-[560px]" />}

        {showEmpty && (
          <div className="mt-5 max-w-[560px] rounded-2xl border border-white/12 bg-white/[0.05] px-5 py-4 text-sm text-white/56">
            No destinations matched "{query.trim()}". Try a different spelling or a nearby city.
          </div>
        )}

        {results.length > 0 && (
          <motion.div
            className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer(0.08, 0.05)}
            initial="hidden"
            animate="visible"
          >
            {results.map((dest) => (
              <NormalDestinationCard
                key={dest.id}
                destination={dest}
                isActive={false}
                onSelect={() => navigate(`/destination/${dest.placeId}`)}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
