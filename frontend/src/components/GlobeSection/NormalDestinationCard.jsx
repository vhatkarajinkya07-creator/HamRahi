// GlobeSection/NormalDestinationCard.jsx
//
// Same visual language as the existing DestinationCard (dark glass, rounded
// corners, backdrop blur, the same stat chips) but built for a grid browser
// rather than a scroll-driven cinematic sequence — no "phase" dimming, no
// scroll wiring, just a clean card with a hover lift and a click handler.

import { motion } from "framer-motion";
import { cardEmerge, fadeUp, staggerContainer } from "../../animations/variants";

function formatCoord(value, posLabel, negLabel) {
  const dir = value >= 0 ? posLabel : negLabel;
  return `${Math.abs(value).toFixed(2)} deg ${dir}`;
}

export default function NormalDestinationCard({ destination, isActive, onSelect }) {
  const {
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

  return (
    <motion.article
      variants={cardEmerge}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="h-full"
    >
      <motion.button
        type="button"
        onClick={onSelect}
        aria-pressed={isActive}
        className={`group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border text-left text-white shadow-[0_34px_110px_-54px_rgba(0,0,0,1)] backdrop-blur-3xl transition-colors duration-500 ${
          isActive
            ? "border-white/30 bg-white/[0.05]"
            : "border-white/12 bg-black hover:border-white/22"
        }`}
        variants={staggerContainer(0.05, 0.08)}
        whileHover={{ y: -6, scale: 1.012 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_12%,rgba(255,255,255,0.08)_0%,transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.015)_44%,rgba(255,255,255,0.035))]"
          aria-hidden="true"
        />

        <div className="relative h-[220px] overflow-hidden">
          <img
            src={heroImage}
            alt={`${name}, ${country}`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />

          <div
            className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.94)_0%,rgba(0,0,0,0.4)_52%,rgba(0,0,0,0.1)_100%)]"
            aria-hidden="true"
          />

          <motion.div
            className="absolute left-4 right-4 top-4 flex items-center justify-between gap-2"
            variants={fadeUp}
          >
            <span className="rounded-full border border-white/14 bg-black/45 px-3 py-1.5 text-[11px] font-medium uppercase text-white/84 backdrop-blur-2xl">
              {country}
            </span>
            {isActive && (
              <span className="grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-white text-[#101722]">
                <i className="pi pi-check text-[11px]" aria-hidden="true" />
              </span>
            )}
          </motion.div>

          <motion.div className="absolute inset-x-4 bottom-4" variants={fadeUp}>
            <span className="font-mono text-[10px] text-white/50">
              {formatCoord(lat, "N", "S")} / {formatCoord(lon, "E", "W")}
            </span>
            <h3 className="mt-2 text-2xl font-semibold leading-none text-white">
              {name}
            </h3>
          </motion.div>
        </div>

        <div className="flex flex-1 flex-col gap-4 px-5 pb-5 pt-5">
          <p className="text-sm font-medium leading-6 text-white/70">{tagline}</p>

          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/12 bg-white/[0.07] px-2.5 py-1 text-[10px] font-semibold text-white/68"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="line-clamp-2 text-sm leading-6 text-white/56">
            {description}
          </p>

          <div className="mt-auto grid grid-cols-3 gap-2 pt-1">
            <div className="rounded-lg border border-white/10 bg-white/[0.05] px-2 py-2 text-center">
              <span className="flex items-center justify-center gap-1 text-sm font-semibold text-white">
                <i className="pi pi-star-fill text-[0.6rem]" aria-hidden="true" />
                {rating}
              </span>
              <span className="mt-0.5 block text-[9px] uppercase text-white/40">
                rating
              </span>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.05] px-2 py-2 text-center">
              <span className="text-sm font-semibold text-white">${priceFrom}</span>
              <span className="mt-0.5 block text-[9px] uppercase text-white/40">
                from
              </span>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.05] px-2 py-2 text-center">
              <span className="text-sm font-semibold text-white">{bestSeason}</span>
              <span className="mt-0.5 block text-[9px] uppercase text-white/40">
                season
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px] text-white/42">
            <span>{reviews.toLocaleString()} reviews</span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-white/78">
              View details
              <i className="pi pi-arrow-right text-[10px]" aria-hidden="true" />
            </span>
          </div>
        </div>
      </motion.button>
    </motion.article>
  );
}
