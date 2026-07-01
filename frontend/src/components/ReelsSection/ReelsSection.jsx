import { motion } from "framer-motion";
import { communityPosts } from "../../data/community";
import { getDestinationById } from "../../data/destinations";
import { fadeUp, staggerContainer } from "../../animations/variants";

export default function ReelsSection() {
  return (
    <section className="px-[6vw] pt-[110px] pb-[140px] max-w-[1400px] mx-auto">
      <motion.div
        className="mb-11"
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <motion.span
          className="font-mono text-xs tracking-[0.14em] uppercase text-ink-soft inline-flex items-center gap-2"
          variants={fadeUp}
        >
          ● From the community
        </motion.span>
        <motion.h2 className="text-[clamp(2rem,3.6vw,3rem)] mt-3" variants={fadeUp}>
          Real trips. Real moments.
        </motion.h2>
      </motion.div>

      <motion.div
        className="[column-count:4] [column-width:260px] [column-gap:20px] max-[720px]:[column-count:2] max-[720px]:[column-width:160px]"
        variants={staggerContainer(0.05)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {communityPosts.map((post) => {
          const dest = getDestinationById(post.destinationId);
          return (
            <motion.article
              key={post.id}
              className="[break-inside:avoid] mb-5 rounded-[var(--radius-md)] overflow-hidden bg-white shadow-[0_10px_30px_-16px_rgba(16,26,51,0.25)]"
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <div className="relative">
                <img src={post.image} alt={post.caption} loading="lazy" className="w-full block" />
                {post.type === "reel" && (
                  <span className="absolute top-3 right-3 bg-[rgba(16,26,51,0.55)] text-white text-[11px] font-bold px-2.5 py-[5px] rounded-full backdrop-blur-[4px]">
                    ▶ Reel
                  </span>
                )}
                <span className="absolute bottom-3 left-3 font-mono text-[11px] text-white bg-[rgba(16,26,51,0.45)] px-2.5 py-1 rounded-full">
                  {dest?.name}
                </span>
              </div>
              <div className="px-4 pt-3.5 pb-[18px]">
                <span className="font-bold text-[0.85rem] text-coral">{post.username}</span>
                <p className="text-[0.9rem] text-ink-soft my-1.5 mb-2.5 leading-[1.45]">{post.caption}</p>
                <span className="text-[0.8rem] font-bold text-ink">♥ {post.likes.toLocaleString()}</span>
              </div>
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}
