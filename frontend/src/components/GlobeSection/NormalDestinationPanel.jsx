// GlobeSection/NormalDestinationPanel.jsx
//
// The Normal Experience doesn't have Cesium's sticky split layout to dock a
// side panel against, so this reuses the existing DestinationDetailsPanel
// (same isolated Destination.jsx render, same styling) inside a centered,
// glassmorphic modal overlay instead.

import { AnimatePresence, motion } from "framer-motion";
import DestinationDetailsPanel from "../DestinationDetailsPanel/DestinationDetailsPanel";

export default function NormalDestinationPanel({ destination, open, onClose }) {
  return (
    <AnimatePresence>
      {open && destination && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <motion.div
            className="absolute inset-0 bg-black/72 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <div className="relative z-[1] max-h-[calc(100dvh-32px)]">
            <DestinationDetailsPanel
              destination={destination}
              open={open}
              onClose={onClose}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
