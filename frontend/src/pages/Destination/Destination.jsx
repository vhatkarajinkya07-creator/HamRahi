

//under building don't not touch the file -AJINKYA 


import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getDestinationById, CATEGORY_THEME } from "../../data/destinations";
import { communityPosts } from "../../data/community";
import { fadeUp, staggerContainer } from "../../animations/variants";

export default function Destination() {
  const { id } = useParams();
  const destination = getDestinationById(id);

  if (!destination) return <Navigate to="/" replace />;

  const posts = communityPosts.filter((p) => p.destinationId === id);
  const theme = CATEGORY_THEME[destination.themeCategory];

  return (
    <div className={`pt-[84px] ${theme}`}>
      <section className="relative h-[62vh] min-h-[420px]">
        <img
          src={destination.heroImage}
          alt={destination.name}
          className="w-full h-full object-cover absolute inset-0"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,26,51,0.25)_0%,rgba(16,26,51,0.65)_100%)]" />
        <motion.div
          className="relative z-[1] h-full flex flex-col justify-end px-[6vw] pb-[50px] text-white"
          variants={staggerContainer(0.1)}
          initial="hidden"
          animate="visible"
        >
          <motion.span
            className="font-mono text-xs tracking-[0.14em] uppercase inline-flex items-center gap-2 text-white"
            variants={fadeUp}
          >
            {destination.country}
          </motion.span>
          <motion.h1 variants={fadeUp} className="text-[clamp(2.6rem,6vw,4.5rem)] my-2">
            {destination.name}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-[1.15rem] opacity-90">
            {destination.tagline}
          </motion.p>
        </motion.div>
      </section>

      <section className="max-w-[1300px] mx-auto px-[6vw] pt-[70px] pb-[120px] grid grid-cols-[1fr_320px] max-[900px]:grid-cols-1 gap-14">
        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.p variants={fadeUp} className="text-[1.1rem] leading-[1.7] text-ink-soft mb-[22px]">
            {destination.description}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-[34px]">
            {destination.tags.map((t) => (
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
            variants={fadeUp}
            className="grid grid-cols-3 max-[900px]:grid-cols-2 gap-3.5 mb-[50px]"
          >
            {destination.gallery.map((src) => (
              <img
                key={src}
                src={src}
                alt={destination.name}
                loading="lazy"
                className="w-full h-[220px] object-cover rounded-[var(--radius-md)]"
              />
            ))}
          </motion.div>

          {posts.length > 0 && (
            <motion.div variants={fadeUp}>
              <h3 className="text-[1.4rem] mb-[18px]">Traveler moments</h3>
              <div className="flex flex-col gap-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="flex gap-3.5 items-center bg-white rounded-[var(--radius-md)] p-3 shadow-[0_8px_22px_-14px_rgba(16,26,51,0.25)]"
                  >
                    <img
                      src={post.image}
                      alt={post.caption}
                      loading="lazy"
                      className="w-[74px] h-[74px] object-cover rounded-xl"
                    />
                    <div>
                      <strong className="text-coral text-[0.88rem]">{post.username}</strong>
                      <p className="text-[0.88rem] text-ink-soft mt-[3px]">{post.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.aside
          className="self-start sticky top-[calc(84px+24px)] max-[900px]:static rounded-[var(--radius-lg)] p-7 flex flex-col gap-4 bg-white/70 border border-white/40 backdrop-blur-[18px]"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex justify-between text-[0.9rem] pb-3 border-b border-[rgba(16,26,51,0.08)]">
            <span>Rating</span>
            <strong>★ {destination.rating} ({destination.reviews.toLocaleString()})</strong>
          </div>
          <div className="flex justify-between text-[0.9rem] pb-3 border-b border-[rgba(16,26,51,0.08)]">
            <span>From</span>
            <strong>${destination.priceFrom} / trip</strong>
          </div>
          <div className="flex justify-between text-[0.9rem] pb-3 border-b border-[rgba(16,26,51,0.08)]">
            <span>Best season</span>
            <strong>{destination.bestSeason}</strong>
          </div>
          <div className="flex justify-between text-[0.9rem] pb-3 border-b border-[rgba(16,26,51,0.08)]">
            <span>Coordinates</span>
            <strong className="font-mono text-[0.82rem]">
              {destination.lat.toFixed(2)}, {destination.lon.toFixed(2)}
            </strong>
          </div>
          <button className="w-full justify-center mt-1.5 font-body font-bold text-[15px] px-7 py-3.5 rounded-full inline-flex items-center gap-2.5 transition-transform duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 bg-[var(--grad-sunrise)] text-white shadow-[0_12px_30px_-10px_rgba(255,106,77,0.55)] hover:shadow-[0_18px_40px_-8px_rgba(255,106,77,0.65)]">
            Plan This Trip →
          </button>
          <Link to="/#destinations" className="text-center text-[0.85rem] text-ink-soft">
            ← Back to all destinations
          </Link>
        </motion.aside>
      </section>
    </div>
  );
}
