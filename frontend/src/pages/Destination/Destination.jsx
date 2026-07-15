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
  const [showFlightModal, setShowFlightModal] = useState(false);

  // Reviews & ratings dynamic state
  const [reviewsList, setReviewsList] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let active = true;
    async function fetchReviews() {
      if (!isBackendPlaceId(id)) return;
      setReviewsLoading(true);
      try {
        const { data } = await api.get(`/destination/${id}/reviews`);
        if (!active) return;
        setReviewsList(data);
        const myReview = data.find(r => r.user?._id === user?.id);
        if (myReview) {
          setUserRating(myReview.rating);
          setUserComment(myReview.comment || "");
        } else {
          setUserRating(0);
          setUserComment("");
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        if (active) setReviewsLoading(false);
      }
    }
    fetchReviews();
    return () => {
      active = false;
    };
  }, [id, user]);

  const flightOptions = [
    {
      name: "Google Flights",
      logo: "pi-globe",
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      description: "Search and track airfares directly from Google. Best for date range comparison.",
      url: `https://www.google.com/travel/flights?q=flights+to+${encodeURIComponent(destination?.name || "")}`
    },
    {
      name: "Kayak",
      logo: "pi-send",
      color: "text-orange-500 bg-orange-500/10 border-orange-500/20",
      description: "Compare hundreds of travel sites at once. Offers robust email price alerts.",
      url: `https://www.kayak.com/flights/Anywhere-${encodeURIComponent(destination?.name || "")}`
    },
    {
      name: "Skyscanner",
      logo: "pi-compass",
      color: "text-teal-500 bg-teal-500/10 border-teal-500/20",
      description: "Find cheap flights using flexible date tools. Industry standard search format.",
      url: `https://www.skyscanner.com/transport/flights/anywhere/${encodeURIComponent(destination?.name || "")}`
    },
    {
      name: "Expedia",
      logo: "pi-briefcase",
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      description: "Earn points and package your flights with hotel bookings for bundle discounts.",
      url: `https://www.expedia.com/Flights-Search?destination=${encodeURIComponent(destination?.name || "")}`
    },
    {
      name: "Kiwi.com",
      logo: "pi-map",
      color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
      description: "Virtual interlining searches unique flight combinations across separate airlines.",
      url: `https://www.kiwi.com/en/search/results/anywhere/${encodeURIComponent(destination?.name || "")}`
    },
    {
      name: "Momondo",
      logo: "pi-ticket",
      color: "text-pink-500 bg-pink-500/10 border-pink-500/20",
      description: "Aggregates fares with colorful charts representing cheap, quick, and best options.",
      url: `https://www.momondo.com/flight-search/Anywhere-${encodeURIComponent(destination?.name || "")}`
    },
    {
      name: "TripAdvisor Flights",
      logo: "pi-bookmark",
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      description: "Check traveler reviews and compare flight search engines with confidence.",
      url: `https://www.tripadvisor.com/CheapFlights?geo=0&destination=${encodeURIComponent(destination?.name || "")}`
    },
    {
      name: "Skiplagged",
      logo: "pi-exclamation-triangle",
      color: "text-red-500 bg-red-500/10 border-red-500/20",
      description: "Exposes hidden-city ticketing options where the destination is a layover stop.",
      url: `https://skiplagged.com/flights/anywhere/${encodeURIComponent(destination?.name || "")}`
    }
  ];

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

  const handleSubmitReview = async () => {
    if (userRating === 0) return;
    setSubmittingReview(true);
    setSubmitError("");
    try {
      await api.post(`/destination/${id}/reviews`, {
        rating: userRating,
        comment: userComment
      });
      
      const { data: revData } = await api.get(`/destination/${id}/reviews`);
      setReviewsList(revData);

      const { data: destData } = await api.get(`/destination/${id}`);
      setDestination(mapDestinationDetails(destData));

      window.dispatchEvent(new Event("refresh-destinations"));
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async () => {
    const myReview = reviewsList.find(r => r.user?._id === user?.id);
    if (!myReview) return;
    
    setSubmittingReview(true);
    setSubmitError("");
    try {
      await api.delete(`/destination/${id}/reviews/${myReview._id}`);
      
      setUserRating(0);
      setUserComment("");

      const { data: revData } = await api.get(`/destination/${id}/reviews`);
      setReviewsList(revData);

      const { data: destData } = await api.get(`/destination/${id}`);
      setDestination(mapDestinationDetails(destData));

      window.dispatchEvent(new Event("refresh-destinations"));
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Failed to delete review.");
    } finally {
      setSubmittingReview(false);
    }
  };

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
                  <button
                    type="button"
                    onClick={() => setShowFlightModal(true)}
                    className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] p-5 text-center transition-all duration-300 hover:border-sky-400 hover:bg-sky-400/5 group shadow-sm pointer-events-auto cursor-pointer z-10"
                  >
                    <i className="pi pi-plane text-2xl text-sky-400 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold text-sm">Find Flights</span>
                    <span className="text-[10px] text-[var(--text-secondary)]">8 Options Available</span>
                  </button>
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

              {/* Dynamic Reviews & Ratings Section */}
              <motion.div id="reviews-section" variants={fadeUp} className="mt-12 pt-10 border-t border-[var(--border-subtle)]">
                <h3 className="mb-6 text-xl font-bold flex items-center gap-2">
                  <i className="pi pi-comments text-[var(--theme-primary)]" />
                  Traveler Reviews & Ratings
                </h3>

                <div className="grid gap-6 md:grid-cols-[200px_1fr]">
                  {/* Rating Summary Card */}
                  <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] p-5 text-center h-fit shadow-sm">
                    <span className="text-5xl font-extrabold text-[var(--text-primary)] leading-none">
                      {destination.rating || "New"}
                    </span>
                    <div className="flex justify-center gap-1.5 my-3 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const starVal = i + 1;
                        const ratingVal = destination.rating || 0;
                        const isFilled = ratingVal >= starVal;
                        const isHalf = !isFilled && ratingVal >= starVal - 0.7;
                        return (
                          <i
                            key={i}
                            className={`pi ${
                              isFilled ? "pi-star-fill" : isHalf ? "pi-star" : "pi-star text-[var(--text-secondary)]/20"
                            } text-sm`}
                          />
                        );
                      })}
                    </div>
                    <span className="block text-[11px] text-[var(--text-secondary)]/70 font-bold uppercase tracking-wider">
                      {Number(destination.reviews || 0).toLocaleString()} reviews
                    </span>
                  </div>

                  {/* Reviews Form & Feed */}
                  <div className="flex flex-col gap-5">
                    {/* Submission Form */}
                    {user ? (
                      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-sm">
                        <h4 className="font-bold text-sm mb-3.5 text-[var(--text-primary)]">
                          {reviewsList.some(r => r.user?._id === user.id) ? "Update your review" : "Add a review"}
                        </h4>

                        {submitError && (
                          <div className="mb-3.5 text-xs text-red-500 bg-red-500/10 border border-red-500/20 px-3.5 py-2.5 rounded-xl">
                            {submitError}
                          </div>
                        )}

                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Your Rating:</span>
                          <div className="flex gap-1.5 text-lg">
                            {Array.from({ length: 5 }).map((_, i) => {
                              const starVal = i + 1;
                              const isActive = (hoverRating || userRating) >= starVal;
                              return (
                                <button
                                  type="button"
                                  key={i}
                                  onClick={() => setUserRating(starVal)}
                                  onMouseEnter={() => setHoverRating(starVal)}
                                  onMouseLeave={() => setHoverRating(0)}
                                  className={`transition-all duration-150 p-0.5 hover:scale-120 active:scale-90 cursor-pointer ${
                                    isActive ? "text-amber-500" : "text-[var(--text-secondary)]/20"
                                  }`}
                                  aria-label={`Rate ${starVal} stars`}
                                >
                                  <i className="pi pi-star-fill" />
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <textarea
                          rows={3}
                          value={userComment}
                          onChange={(e) => setUserComment(e.target.value)}
                          placeholder="Tell us about your experience in this destination..."
                          className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] p-3.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:border-[var(--theme-primary)] focus:outline-none transition-colors duration-200"
                        />

                        <div className="flex justify-end gap-3 mt-4">
                          {reviewsList.some(r => r.user?._id === user.id) && (
                            <button
                              type="button"
                              onClick={handleDeleteReview}
                              disabled={submittingReview}
                              className="px-4 py-2 border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50"
                            >
                              Delete Review
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={handleSubmitReview}
                            disabled={submittingReview || userRating === 0}
                            className="px-5 py-2 bg-[var(--theme-primary)] hover:bg-[var(--theme-primary)]/90 text-white text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                          >
                            {submittingReview && <i className="pi pi-spinner pi-spin text-xs" />}
                            {reviewsList.some(r => r.user?._id === user.id) ? "Update Review" : "Submit Review"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)]/40 p-5 text-center backdrop-blur-md">
                        <p className="text-sm text-[var(--text-secondary)] mb-3.5">
                          Have you traveled here? Sign in to rate and share your experience with other travelers.
                        </p>
                        <Link
                          to="/login"
                          state={{ from: `/destination/${id}` }}
                          className="inline-flex h-9 items-center justify-center rounded-xl bg-[var(--theme-primary)] hover:bg-[var(--theme-primary)]/90 px-5 text-xs font-bold text-white transition-all duration-200 shadow-sm"
                        >
                          Sign In to Review
                        </Link>
                      </div>
                    )}

                    {/* Reviews Feed */}
                    <div className="flex flex-col gap-3.5 mt-1.5">
                      {reviewsLoading ? (
                        <div className="flex justify-center py-6">
                          <i className="pi pi-spinner pi-spin text-xl text-[var(--theme-primary)]" />
                        </div>
                      ) : reviewsList.length > 0 ? (
                        reviewsList.map((rev) => (
                          <div
                            key={rev._id}
                            className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)]/20 p-4.5 flex flex-col gap-2.5 shadow-sm"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="block font-bold text-xs text-[var(--text-primary)]">
                                  {rev.user?.name || "Verified Traveler"}
                                </span>
                                <span className="text-[9px] text-[var(--text-secondary)]/50 font-mono mt-0.5 block">
                                  {new Date(rev.createdAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                              <div className="flex gap-0.5 text-amber-500 text-xs">
                                {Array.from({ length: 5 }).map((_, idx) => (
                                  <i
                                    key={idx}
                                    className={`pi pi-star-fill ${
                                      idx < rev.rating ? "text-amber-500" : "text-[var(--text-secondary)]/15"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            {rev.comment && (
                              <p className="text-sm leading-relaxed text-[var(--text-secondary)] font-medium">
                                {rev.comment}
                              </p>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 rounded-2xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-secondary)]/50 text-xs">
                          <i className="pi pi-star text-xl mb-2 block opacity-40" />
                          No traveler reviews yet. Be the first to share your experience!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Sidebar Sticky Panel */}
            <motion.aside
              className="sticky top-[calc(84px+24px)] flex self-start flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-7 shadow-xl max-[900px]:static text-[var(--text-primary)]"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <Info
                label="Rating"
                value={
                  <button
                    onClick={() => {
                      document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="hover:text-[var(--theme-primary)] hover:underline flex items-center gap-1 font-bold text-right cursor-pointer border-0 bg-transparent p-0 text-sm text-[var(--text-primary)] transition-colors duration-200 focus:outline-none"
                  >
                    <span>{destination.rating || "New"}</span>
                    <span className="text-[var(--text-secondary)] font-normal text-xs">
                      ({Number(destination.reviews || 0).toLocaleString()})
                    </span>
                    <i className="pi pi-arrow-down text-[9px] text-[var(--text-secondary)]/70" />
                  </button>
                }
              />
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

          {/* Flights Modal Overlay */}
          {showFlightModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative w-full max-w-[760px] rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-2xl md:p-8 text-[var(--text-primary)] max-h-[85vh] overflow-y-auto"
              >
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                      Compare Airfares to {destination?.name}
                    </span>
                    <h3 className="mt-1 text-2xl font-extrabold tracking-tight">Select Flight Provider</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowFlightModal(false)}
                    className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] text-[var(--text-primary)] hover:bg-[var(--border-subtle)]/30 active:scale-95 transition-all shadow-sm"
                  >
                    <i className="pi pi-times text-sm" />
                  </button>
                </div>

                {/* Providers Grid */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {flightOptions.map((opt) => (
                    <a
                      key={opt.name}
                      href={opt.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)]/30 p-4 transition-all duration-300 hover:border-[var(--theme-primary)] hover:bg-[var(--bg-surface-raised)] shadow-sm hover:scale-[1.01] group"
                    >
                      <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border text-lg transition-transform group-hover:scale-110 duration-300 ${opt.color}`}>
                        <i className={`pi ${opt.logo}`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-1.5 font-sans">
                          {opt.name}
                          <i className="pi pi-external-link text-[10px] opacity-50" />
                        </h4>
                        <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-5">{opt.description}</p>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Footer Tip */}
                <div className="mt-6 border-t border-[var(--border-subtle)] pt-4 text-center">
                  <p className="text-[11px] leading-5 text-[var(--text-secondary)]">
                    <i className="pi pi-info-circle mr-1 text-[var(--theme-primary)]" />
                    All search links are pre-populated with <strong>{destination?.name}</strong>. Rates will calculate based on your current departure location.
                  </p>
                </div>
                
              </motion.div>
            </div>
          )}
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
