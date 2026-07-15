// NormalDestinationCard.jsx
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
      className="h-full"
    >
      <motion.button
        type="button"
        onClick={onSelect}
        aria-pressed={isActive}
        className={`group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border text-left transition-all duration-300 shadow-sm ${
          isActive
            ? "border-[var(--theme-primary)] bg-[var(--bg-surface-raised)] shadow-md text-[var(--text-primary)]"
            : "border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--text-secondary)]/30 hover:bg-[var(--bg-surface-raised)] text-[var(--text-primary)]"
        }`}
        variants={staggerContainer(0.05, 0.08)}
        whileHover={{ y: -6, scale: 1.008 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_12%,rgba(255,255,255,0.04)_0%,transparent_34%)]"
          aria-hidden="true"
        />

        <div className="relative h-[220px] w-full overflow-hidden shrink-0">
          <img
            src={heroImage}
            alt={`${name}, ${country}`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />

          <div
            className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.3)_52%,rgba(0,0,0,0.05)_100%)]"
            aria-hidden="true"
          />

          <motion.div
            className="absolute left-4 right-4 top-4 flex items-center justify-between gap-2"
            variants={fadeUp}
          >
            <span className="rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/90 backdrop-blur-md">
              {country}
            </span>
            {isActive && (
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--theme-primary)] text-white shadow-sm">
                <i className="pi pi-check text-[10px] font-bold" aria-hidden="true" />
              </span>
            )}
          </motion.div>

          <motion.div className="absolute inset-x-4 bottom-4" variants={fadeUp}>
            <span className="font-mono text-[10px] text-white/70">
              {formatCoord(lat, "N", "S")} / {formatCoord(lon, "E", "W")}
            </span>
            <h3 className="mt-1 text-2xl font-extrabold leading-tight text-white drop-shadow-sm">
              {name}
            </h3>
          </motion.div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5">
          <p className="text-sm font-semibold leading-relaxed text-[var(--text-secondary)]">{tagline}</p>

          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-base)] px-2.5 py-1 text-[10px] font-bold text-[var(--text-secondary)]"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]/80">
            {description}
          </p>

          {/* Stats Badges */}
          <div className="mt-auto grid grid-cols-3 gap-2 pt-2">
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-2 py-2 text-center shadow-sm">
              <span className="flex items-center justify-center gap-1 text-sm font-bold text-[var(--text-primary)]">
                <i className="pi pi-star-fill text-[0.65rem] text-[var(--theme-primary)]" aria-hidden="true" />
                {rating}
              </span>
              <span className="mt-0.5 block text-[9px] uppercase font-bold text-[var(--text-secondary)]/50">
                rating
              </span>
            </div>
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-2 py-2 text-center shadow-sm">
              <span className="text-sm font-bold text-[var(--text-primary)]">${priceFrom}</span>
              <span className="mt-0.5 block text-[9px] uppercase font-bold text-[var(--text-secondary)]/50">
                from
              </span>
            </div>
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-2 py-2 text-center shadow-sm">
              <span className="text-sm font-bold text-[var(--text-primary)]">{bestSeason}</span>
              <span className="mt-0.5 block text-[9px] uppercase font-bold text-[var(--text-secondary)]/50">
                season
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px] text-[var(--text-secondary)]/70">
            <span>{reviews.toLocaleString()} reviews</span>
            <span className="inline-flex items-center gap-1.5 font-bold text-[var(--theme-primary)] hover:underline">
              View details
              <i className="pi pi-arrow-right text-[10px]" aria-hidden="true" />
            </span>
          </div>
        </div>
      </motion.button>
    </motion.article>
  );
}
