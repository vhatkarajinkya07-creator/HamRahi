import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { ProgressSpinner } from "primereact/progressspinner";
import api from "../../services/api";
import { isBackendPlaceId, mapDestinationDetails } from "../../services/destinationMapper";
import { getDestinationById, CATEGORY_THEME } from "../../data/destinations";
import { fadeUp, staggerContainer } from "../../animations/variants";

export default function Destination() {
  const { id } = useParams();
  const [destination, setDestination] = useState(() => getDestinationById(id));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishlistBusy, setWishlistBusy] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadDestination() {
      setLoading(true);
      setError("");

      if (!isBackendPlaceId(id)) {
        const fallback = getDestinationById(id);
        setDestination(fallback);
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get(`/destination/${id}`);
        if (active) setDestination(mapDestinationDetails(data));
      } catch (err) {
        if (!active) return;
        const fallback = getDestinationById(id);
        setDestination(fallback);
        setError(fallback ? "Live details are not available, showing saved preview." : err.response?.data?.message || "Destination not found.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDestination();

    return () => {
      active = false;
    };
  }, [id]);

  if (!loading && !destination) return <Navigate to="/" replace />;

  const theme = CATEGORY_THEME[destination?.themeCategory] || CATEGORY_THEME.urban;

  const addToWishlist = async () => {
    const placeId = destination.placeId || destination.id;

    if (!isBackendPlaceId(placeId)) {
      setError("Open a live destination from Discover or Search before saving it to wishlist.");
      return;
    }

    setWishlistBusy(true);
    setError("");

    try {
      await api.post(`/wishlist/${placeId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Login is required to save this destination.");
    } finally {
      setWishlistBusy(false);
    }
  };

  return (
    <div className={`min-h-screen pt-[84px] ${theme}`}>
      {loading && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-black/35 backdrop-blur-sm">
          <ProgressSpinner strokeWidth="4" />
        </div>
      )}

      {destination && (
        <>
          <section className="relative h-[62vh] min-h-[420px]">
            <img
              src={destination.heroImage}
              alt={destination.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.2)_0%,rgba(5,5,5,0.78)_100%)]" />
            <motion.div
              className="relative z-[1] flex h-full flex-col justify-end px-[6vw] pb-[50px] text-white"
              variants={staggerContainer(0.1)}
              initial="hidden"
              animate="visible"
            >
              <motion.span className="font-mono text-xs uppercase text-white/78" variants={fadeUp}>
                {destination.country}
              </motion.span>
              <motion.h1 variants={fadeUp} className="my-2 text-[clamp(2.6rem,6vw,4.5rem)]">
                {destination.name}
              </motion.h1>
              <motion.p variants={fadeUp} className="max-w-[760px] text-[1.15rem] leading-8 text-white/88">
                {destination.tagline}
              </motion.p>
            </motion.div>
          </section>

          <section className="mx-auto grid max-w-[1300px] gap-14 px-[6vw] pb-[120px] pt-[70px] max-[900px]:grid-cols-1 md:grid-cols-[1fr_320px]">
            <motion.div variants={staggerContainer(0.08)} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
              {error && <Message severity="warn" text={error} className="mb-7 w-full" />}

              <motion.p variants={fadeUp} className="mb-[22px] text-[1.1rem] leading-[1.7] text-ink-soft">
                {destination.description}
              </motion.p>

              <motion.div variants={fadeUp} className="mb-[34px] flex flex-wrap gap-2">
                {destination.tags.map((tag) => (
                  <span key={tag} className="rounded-full px-3.5 py-[7px] text-xs font-semibold text-[var(--theme-primary)]" style={{ background: "color-mix(in srgb, var(--theme-primary) 14%, white)" }}>
                    {tag}
                  </span>
                ))}
              </motion.div>

              <motion.div variants={fadeUp} className="mb-[50px] grid grid-cols-3 gap-3.5 max-[900px]:grid-cols-2">
                {destination.gallery.map((src) => (
                  <img key={src} src={src} alt={destination.name} loading="lazy" className="h-[220px] w-full rounded-[var(--radius-md)] object-cover" />
                ))}
              </motion.div>

              {destination.nearby?.length > 0 && (
                <motion.div variants={fadeUp}>
                  <h3 className="mb-[18px] text-[1.4rem]">Nearby places</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {destination.nearby.slice(0, 6).map((place) => (
                      <Link key={place.placeId} to={`/destination/${place.placeId}`} className="rounded-[18px] border border-white/50 bg-white/60 p-4 shadow-[0_18px_38px_-28px_rgba(16,26,51,0.45)] backdrop-blur-xl">
                        <strong>{place.title}</strong>
                        <p className="mt-1 font-mono text-xs text-ink-soft">
                          {Number(place.coordinates?.latitude || 0).toFixed(2)}, {Number(place.coordinates?.longitude || 0).toFixed(2)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            <motion.aside className="sticky top-[calc(84px+24px)] flex self-start flex-col gap-4 rounded-[var(--radius-lg)] border border-white/40 bg-white/70 p-7 backdrop-blur-[18px] max-[900px]:static" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Info label="Rating" value={`${destination.rating || "New"} (${Number(destination.reviews || 0).toLocaleString()})`} />
              <Info label="Weather" value={destination.weather?.condition ? `${destination.weather.condition}, ${Math.round(destination.weather.temperature)} C` : "Live soon"} />
              <Info label="Best season" value={destination.bestSeason} />
              <Info label="Coordinates" value={`${destination.lat.toFixed(2)}, ${destination.lon.toFixed(2)}`} mono />
              <Button label="Save to wishlist" icon="pi pi-heart" loading={wishlistBusy} onClick={addToWishlist} />
              <Button as={Link} to="/itinerary" label="Plan with AI" icon="pi pi-sparkles" outlined />
              <Link to="/#destinations" className="text-center text-[0.85rem] text-ink-soft">
                Back to destinations
              </Link>
            </motion.aside>
          </section>
        </>
      )}
    </div>
  );
}

function Info({ label, value, mono = false }) {
  return (
    <div className="flex justify-between gap-4 border-b border-[rgba(16,26,51,0.08)] pb-3 text-[0.9rem]">
      <span>{label}</span>
      <strong className={mono ? "font-mono text-[0.82rem]" : "text-right"}>{value}</strong>
    </div>
  );
}
