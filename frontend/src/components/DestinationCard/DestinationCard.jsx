import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cardEmerge, fadeUp, staggerContainer } from "../../animations/variants";

function formatCoord(value, posLabel, negLabel) {
  const dir = value >= 0 ? posLabel : negLabel;
  return `${Math.abs(value).toFixed(2)} deg ${dir}`;
}

const PHASE_LABEL = {
  establishing: "Arriving",
  streetview: "Entering destination",
  arrived: "Arrived",
};

export default function DestinationCard({
  destination,
  isActive,
  isMobile = false,
  phase = "establishing",
}) {
  const {
    id,
    name,
    country,
    tagline,
    description,
    rating,
    reviews,
    tags,
    heroImage,
    lat,
    lon,
    priceFrom,
    bestSeason,
  } = destination;

  const isDimmed = !isMobile && phase !== "establishing";

  return (
    <motion.article
      className="mr-auto w-full max-w-130"
      variants={cardEmerge}
      initial="hidden"
      animate={isActive ? "visible" : "hidden"}
    >
      <motion.div
        className={`relative isolate flex min-h-210 flex-col overflow-hidden rounded-2xl border border-white/12 bg-black text-white shadow-[0_34px_110px_-54px_rgba(0,0,0,1)] backdrop-blur-3xl transition-[filter] duration-700 ease-out ${
          isDimmed ? "brightness-[0.55] saturate-[0.7] blur-[1px]" : ""
        }`}
        variants={staggerContainer(0.055, 0.12)}
        whileHover={!isDimmed ? { y: -6, scale: 1.01 } : undefined}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_12%,rgba(255,255,255,0.08)_0%,transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.015)_44%,rgba(255,255,255,0.035))]"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute inset-px -z-10 rounded-[15px] border border-white/8 bg-white/2.5"
          aria-hidden="true"
        />

        <div className="relative h-117.5 overflow-hidden">
          <img
            src={heroImage}
            alt={`${name}, ${country}`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div
            className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.96)_0%,rgba(0,0,0,0.48)_48%,rgba(0,0,0,0.14)_100%)]"
            aria-hidden="true"
          />

          <motion.div
            className="absolute left-5 right-5 top-5 flex items-center justify-between gap-3"
            variants={fadeUp}
          >
            <span className="rounded-full border border-white/14 bg-black/45 px-3.5 py-2 text-xs font-medium uppercase text-white/84 backdrop-blur-2xl">
              {country}
            </span>

            <span className="grid h-11 w-11 place-items-center rounded-full border border-white/14 bg-black/45 text-white/88 backdrop-blur-2xl">
              <i className="pi pi-map-marker" aria-hidden="true" />
            </span>
          </motion.div>

          <motion.div className="absolute inset-x-5 bottom-5" variants={fadeUp}>
            <span className="font-mono text-[11px] text-white/58">
              {formatCoord(lat, "N", "S")} / {formatCoord(lon, "E", "W")}
            </span>

            <h2 className="mt-3 text-5xl font-semibold leading-none text-white">
              {name}
            </h2>

            <p className="mt-4 text-base font-medium leading-7 text-white/76">
              {tagline}
            </p>
          </motion.div>
        </div>

        <div className="flex flex-1 flex-col px-6 pb-6 pt-6">
          <motion.div className="flex flex-wrap gap-2" variants={fadeUp}>
            {tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/12 bg-white/[0.07] px-3.5 py-2 text-xs font-semibold text-white/72 backdrop-blur-xl"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.p
            className="mt-6 text-base leading-8 text-white/64"
            variants={fadeUp}
          >
            {description}
          </motion.p>

          <motion.div className="mt-7 grid grid-cols-3 gap-3" variants={fadeUp}>
            <div className="rounded-xl border border-white/12 bg-white/6 p-4 backdrop-blur-xl">
              <span className="flex items-center gap-1.5 text-base font-semibold text-white">
                <i className="pi pi-star-fill text-[0.7rem]" aria-hidden="true" />
                {rating}
              </span>
              <span className="mt-1 block text-[10px] uppercase text-white/42">
                rating
              </span>
            </div>

            <div className="rounded-xl border border-white/12 bg-white/6 p-4 backdrop-blur-xl">
              <span className="text-base font-semibold text-white">
                ${priceFrom}
              </span>
              <span className="mt-1 block text-[10px] uppercase text-white/42">
                price
              </span>
            </div>

            <div className="rounded-xl border border-white/12 bg-white/6 p-4 backdrop-blur-xl">
              <span className="text-base font-semibold text-white">
                {bestSeason}
              </span>
              <span className="mt-1 block text-[10px] uppercase text-white/42">
                season
              </span>
            </div>
          </motion.div>

          <motion.div className="mt-5 text-sm text-white/46" variants={fadeUp}>
            {reviews.toLocaleString()} traveler reviews
          </motion.div>

          <motion.div className="mt-auto pt-6 min-h-14" variants={fadeUp}>
            {isMobile ? (
              // Mobile: no globe, no cinematic sequence — one button, direct nav.
              <Link
                to={`/destination/${id}`}
                className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-black transition-all duration-300 hover:bg-white/88 active:scale-[0.98]"
              >
                Explore {name}
                <i className="pi pi-arrow-right text-xs" aria-hidden="true" />
              </Link>
            ) : (
              // Desktop: no button here at all — the popup is the CTA,
              // and it opens automatically once the flight finishes.
              <div className="flex h-14 items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-white/38">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/45" />
                {PHASE_LABEL[phase]}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.article> 
  );
}