import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cardEmerge, fadeUp, staggerContainer } from "../../animations/variants";

function formatCoord(value, posLabel, negLabel) {
  const dir = value >= 0 ? posLabel : negLabel;
  return `${Math.abs(value).toFixed(2)}° ${dir}`;
}

export default function DestinationCard({ destination, isActive }) {
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

  return (
    <motion.div
      className="grid grid-cols-[0.9fr_1.1fr] max-[900px]:grid-cols-1 max-w-[1100px] mx-auto w-full rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-soft)]"
      variants={cardEmerge}
      initial="hidden"
      animate={isActive ? "visible" : "hidden"}
    >
      <div className="relative min-h-[460px] max-[900px]:min-h-[260px]">
        <img
          src={heroImage}
          alt={`${name}, ${country}`}
          loading="lazy"
          className="w-full h-full object-cover absolute inset-0"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,26,51,0.05)_0%,rgba(16,26,51,0.35)_100%)]" />
        <span className="absolute bottom-[18px] left-[18px] font-mono text-[11px] tracking-[0.06em] text-white bg-[rgba(16,26,51,0.45)] px-3 py-1.5 rounded-full backdrop-blur-[6px]">
          {formatCoord(lat, "N", "S")} · {formatCoord(lon, "E", "W")}
        </span>
      </div>

      <motion.div
        className="px-11 py-[46px] max-[900px]:px-6 max-[900px]:py-[30px] flex flex-col justify-center gap-1.5 bg-white/[0.55] border border-white/40 backdrop-blur-[18px]"
        variants={staggerContainer(0.06, 0.25)}
        initial="hidden"
        animate={isActive ? "visible" : "hidden"}
      >
        <motion.span
          className="font-mono text-[13px] text-[var(--theme-primary)] tracking-[0.12em] uppercase"
          variants={fadeUp}
        >
          {country}
        </motion.span>
        <motion.h2 className="text-[clamp(2rem,3.2vw,2.8rem)] text-ink my-1 mb-1.5" variants={fadeUp}>
          {name}
        </motion.h2>
        <motion.p className="font-bold text-[var(--theme-primary)] mb-3" variants={fadeUp}>
          {tagline}
        </motion.p>
        <motion.p className="text-ink-soft leading-[1.65] mb-[18px]" variants={fadeUp}>
          {description}
        </motion.p>

        <motion.div className="flex flex-wrap gap-2 mb-[22px]" variants={fadeUp}>
          {tags.slice(0, 4).map((t) => (
            <span
              key={t}
              className="text-xs font-semibold px-3.5 py-[7px] rounded-full text-[var(--theme-primary)] brightness-[0.85]"
              style={{ background: "color-mix(in srgb, var(--theme-primary) 14%, white)" }}
            >
              {t}
            </span>
          ))}
        </motion.div>

        <motion.div
          className="flex gap-[26px] mb-[26px] py-[18px] border-t border-b border-[rgba(16,26,51,0.08)]"
          variants={fadeUp}
        >
          <div className="flex flex-col gap-0.5">
            <span className="font-display font-bold text-[1.1rem]">★ {rating}</span>
            <span className="text-[11px] text-ink-soft uppercase tracking-[0.06em]">
              {reviews.toLocaleString()} reviews
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-display font-bold text-[1.1rem]">${priceFrom}</span>
            <span className="text-[11px] text-ink-soft uppercase tracking-[0.06em]">from / trip</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-display font-bold text-[1.1rem]">{bestSeason}</span>
            <span className="text-[11px] text-ink-soft uppercase tracking-[0.06em]">best season</span>
          </div>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Link
            to={`/destination/${id}`}
            className="self-start font-body font-bold text-[15px] px-7 py-3.5 rounded-full inline-flex items-center gap-2.5 transition-transform duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 bg-[var(--grad-sunrise)] text-white shadow-[0_12px_30px_-10px_rgba(255,106,77,0.55)] hover:shadow-[0_18px_40px_-8px_rgba(255,106,77,0.65)]"
          >
            Explore {name} →
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
