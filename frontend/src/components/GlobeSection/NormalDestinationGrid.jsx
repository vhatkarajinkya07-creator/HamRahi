// GlobeSection/NormalDestinationGrid.jsx

import { motion } from "framer-motion";
import { staggerContainer } from "../../animations/variants";
import NormalDestinationCard from "./NormalDestinationCard";

export default function NormalDestinationGrid({ destinations, activeId, onSelect }) {
  return (
    <motion.div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      variants={staggerContainer(0.08, 0.05)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      {destinations.map((dest) => (
        <NormalDestinationCard
          key={dest.id}
          destination={dest}
          isActive={dest.id === activeId}
          onSelect={() => onSelect(dest.id)}
        />
      ))}
    </motion.div>
  );
}
