// Destination.jsx
import { useEffect, useState } from "react";
import { Link, Navigate, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { ProgressSpinner } from "primereact/progressspinner";
import api from "../../services/api";
import { isBackendPlaceId, mapDestinationDetails } from "../../services/destinationMapper";
import { getDestinationById } from "../../data/destinations";
import { useAuth } from "../../context/AuthContext";
import { fadeUp, staggerContainer } from "../../animations/variants";

function getThemeClassFromTag(tag) {
  if (!tag) return "theme-urban";
  const t = tag.toLowerCase().trim();
  if (t.includes("beach")) return "theme-beach";
  if (t.includes("mountain")) return "theme-mountain";
  if (t.includes("city") || t.includes("urban")) return "theme-urban";
  if (t.includes("desert")) return "theme-desert";
  if (t.includes("forest")) return "theme-forest";
  if (t.includes("snow") || t.includes("winter")) return "theme-snow";
  if (t.includes("island")) return "theme-island";
  if (t.includes("lake")) return "theme-lake";
  if (t.includes("river")) return "theme-river";
  if (t.includes("waterfall")) return "theme-waterfall";
  if (t.includes("national park")) return "theme-national-park";
  if (t.includes("historical") || t.includes("history")) return "theme-historical";
  if (t.includes("religious") || t.includes("temple") || t.includes("spiritual")) return "theme-religious";
  if (t.includes("wildlife") || t.includes("animal") || t.includes("nature")) return "theme-wildlife";
  return "theme-urban";
}

export default function Destination({ destinationId }) {
  const { id: urlId } = useParams();
  const id = destinationId || urlId;
  const navigate = useNavigate();
  const { user } = useAuth();
  const [destination, setDestination] = useState(() => getDestinationById(id));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishlistBusy, setWishlistBusy] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

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

  useEffect(() => {
    if (!user || !destination) return;

    async function checkWishlist() {
      try {
        const { data } = await api.get("/wishlist");
        const placeId = destination.placeId || destination.id;
        const found = data.some((item) => (item.placeId || item.id) === placeId);
        setIsInWishlist(found);
      } catch (err) {
        console.error("Could not check wishlist status:", err);
      }
    }

    checkWishlist();
  }, [user, destination]);

  if (!loading && !destination) return <Navigate to="/" replace />;

  const primaryTag = destination?.tags?.[0];
  const themeClass = getThemeClassFromTag(primaryTag);

  const toggleWishlist = async () => {
    if (!user) {
      navigate("/login", { state: { from: `/destination/${id}` } });
      return;
    }

    const placeId = destination.placeId || destination.id;
    setWishlistBusy(true);
    setError("");

    try {
      if (isInWishlist) {
        await api.delete(`/wishlist/${placeId}`);
        setIsInWishlist(false);
      } else {
        await api.post(`/wishlist/${placeId}`);
        setIsInWishlist(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update wishlist.");
    } finally {
      setWishlistBusy(false);
    }
  };

  const handlePlanTrip = () => {
    if (!user) {
      navigate("/login", { state: { from: `/destination/${id}` } });
    } else {
      navigate("/itinerary", { state: { placeId: destination.placeId || destination.id, destinationName: destination.name } });
    }
  };

  return (
    <div className={`min-h-screen pt-[84px] bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-300 ${themeClass}`}>
      {loading && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-black/45 backdrop-blur-sm">
          <ProgressSpinner strokeWidth="4" />
        </div>
      )}

      {destination && (
        <>
          <section className="relative h-[62vh] min-h-[420px] overflow-hidden">
            <img
              src={destination.heroImage}
              alt={destination.name}
              className="absolute inset-0 h-full w-full object-cover scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <motion.div
              className="relative z-[1] flex h-full flex-col justify-end px-[6vw] pb-[50px] text-white"
              variants={staggerContainer(0.1)}
              initial="hidden"
              animate="visible"
            >
              <motion.span className="font-mono text-xs uppercase tracking-wider text-white/80" variants={fadeUp}>
                {destination.country}
              </motion.span>
              <motion.h1 variants={fadeUp} className="my-2 text-[clamp(2.6rem,6vw,4.5rem)] font-extrabold tracking-tight">
                {destination.name}
              </motion.h1>
              <motion.p variants={fadeUp} className="max-w-[760px] text-[1.1rem] leading-8 text-white/90">
                {destination.tagline}
              </motion.p>
            </motion.div>
          </section>

          <section className="mx-auto grid max-w-[1300px] gap-14 px-[6vw] pb-[120px] pt-[70px] max-[900px]:grid-cols-1 md:grid-cols-[1fr_320px]">
            <motion.div
              variants={staggerContainer(0.08)}
              initial="hidden"
              animate="visible"
            >
              {error && <Message severity="warn" text={error} className="mb-7 w-full" />}

              <motion.p variants={fadeUp} className="mb-[22px] text-[1.08rem] leading-[1.8] text-[var(--text-secondary)]">
                {destination.description}
              </motion.p>

              {/* Tag Chips */}
              <motion.div variants={fadeUp} className="mb-[34px] flex flex-wrap gap-2">
                {destination.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full px-3.5 py-[7px] text-[11px] font-bold text-[var(--theme-primary)] border border-[var(--theme-primary)]/10"
                    style={{ background: "color-mix(in srgb, var(--theme-primary) 12%, transparent)" }}
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>

              {/* Gallery Images */}
              <motion.div variants={fadeUp} className="mb-[40px] grid grid-cols-3 gap-3.5 max-[900px]:grid-cols-2">
                {destination.gallery.map((src, i) => (
                  <img
                    key={`${src}-${i}`}
                    src={src}
                    alt={destination.name}
                    loading="lazy"
                    className="h-[220px] w-full rounded-[var(--radius-md)] object-cover shadow-sm hover:scale-[1.02] transition-transform duration-500"
                  />
                ))}
              </motion.div>

              {/* Booking Logistics Section */}
              <motion.div variants={fadeUp} className="mb-[40px] rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-bold flex items-center gap-2">
                  <i className="pi pi-bookmark-fill text-[var(--theme-primary)]" />
                  Book Your Logistics
                </h3>
                <p className="mb-6 text-sm text-[var(--text-secondary)]">
                  Compare flight options, reserve hotels, and secure dynamic local activities in {destination.name}.
                </p>
                <div className="grid gap-4 sm:grid-cols-3">
                  <a
                    href={`https://www.skyscanner.net/g/referrals/v1/flights?dest=${encodeURIComponent(destination.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] p-5 text-center transition-all duration-300 hover:border-sky-400 hover:bg-sky-400/5 group shadow-sm pointer-events-auto cursor-pointer z-10"
                  >
                    <i className="pi pi-plane text-2xl text-sky-400 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold text-sm">Find Flights</span>
                    <span className="text-[10px] text-[var(--text-secondary)]">Skyscanner</span>
                  </a>
                  <a
                    href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] p-5 text-center transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-400/5 group shadow-sm pointer-events-auto cursor-pointer z-10"
                  >
                    <i className="pi pi-building text-2xl text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold text-sm">Secure Hotels</span>
                    <span className="text-[10px] text-[var(--text-secondary)]">Booking.com</span>
                  </a>
                  <a
                    href={`https://www.tripadvisor.com/Search?q=${encodeURIComponent(destination.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] p-5 text-center transition-all duration-300 hover:border-amber-400 hover:bg-amber-400/5 group shadow-sm pointer-events-auto cursor-pointer z-10"
                  >
                    <i className="pi pi-ticket text-2xl text-amber-400 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold text-sm">Local Tours</span>
                    <span className="text-[10px] text-[var(--text-secondary)]">TripAdvisor</span>
                  </a>
                </div>
              </motion.div>

              {/* Nearby Attractions */}
              {destination.nearby?.length > 0 && (
                <motion.div variants={fadeUp}>
                  <h3 className="mb-[18px] text-[1.4rem]">Nearby places</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {destination.nearby.slice(0, 6).map((place) => (
                      <Link
                        key={place.placeId}
                        to={`/destination/${place.placeId}`}
                        className="rounded-[18px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-sm backdrop-blur-xl transition-all hover:border-[var(--theme-primary)] hover:bg-[var(--bg-surface-raised)] hover:shadow-md pointer-events-auto cursor-pointer z-10"
                      >
                        <strong className="block text-[var(--text-primary)]">{place.title}</strong>
                        <p className="mt-1 font-mono text-xs text-[var(--text-secondary)]">
                          {Number(place.coordinates?.latitude || 0).toFixed(2)}, {Number(place.coordinates?.longitude || 0).toFixed(2)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Sidebar Sticky Panel */}
            <motion.aside
              className="sticky top-[calc(84px+24px)] flex self-start flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-7 shadow-xl max-[900px]:static text-[var(--text-primary)]"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <Info label="Rating" value={`${destination.rating || "New"} (${Number(destination.reviews || 0).toLocaleString()})`} />
              <Info label="Weather" value={destination.weather?.condition ? `${destination.weather.condition}, ${Math.round(destination.weather.temperature)} C` : "Live soon"} />
              <Info label="Best season" value={destination.bestSeason} />
              <Info label="Coordinates" value={`${destination.lat.toFixed(2)}, ${destination.lon.toFixed(2)}`} mono />
              
              <button
                type="button"
                onClick={toggleWishlist}
                disabled={wishlistBusy}
                className={`w-full flex h-[52px] items-center justify-center gap-2.5 rounded-[18px] font-bold text-sm transition-all active:scale-95 shadow-sm border ${
                  isInWishlist
                    ? "border-red-500/30 bg-red-500/5 text-red-400 hover:bg-red-500/10"
                    : "border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                {wishlistBusy ? (
                  <i className="pi pi-spinner pi-spin text-sm" />
                ) : (
                  <i className={`pi ${isInWishlist ? "pi-heart-fill text-red-500" : "pi pi-heart"} text-sm`} />
                )}
                <span>{isInWishlist ? "Saved to wishlist" : "Save to wishlist"}</span>
              </button>

              <button
                type="button"
                onClick={handlePlanTrip}
                className="w-full flex h-[52px] items-center justify-center gap-2.5 rounded-[18px] border border-[var(--theme-primary)] bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] font-bold text-sm transition-all hover:bg-[var(--theme-primary)]/15 active:scale-95 shadow-sm"
              >
                <i className="pi pi-sparkles text-sm" />
                <span>Plan with AI</span>
              </button>
              
              <Link to="/#destinations" className="text-center text-[0.85rem] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mt-2">
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
    <div className="flex justify-between gap-4 border-b border-[var(--border-subtle)] pb-3 text-[0.9rem]">
      <span className="text-[var(--text-secondary)]">{label}</span>
      <strong className={mono ? "font-mono text-[0.82rem] text-[var(--text-primary)]" : "text-right text-[var(--text-primary)]"}>
        {value}
      </strong>
    </div>
  );
}
