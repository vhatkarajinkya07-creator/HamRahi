import { AnimatePresence, motion } from "framer-motion";
import Destination from "../../pages/Destination/Destination";

const panelVariants = {
  hidden: { opacity: 0, scale: 0.98, x: 48 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: { type: "spring", stiffness: 240, damping: 28 },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    x: 36,
    transition: { duration: 0.24, ease: "easeIn" },
  },
};

export default function DestinationDetailsPanel({ destination, open, onClose }) {
  return (
    <AnimatePresence mode="wait">
      {open && destination && (
        <motion.div
          key={destination.id}
          className="relative flex h-[calc(100dvh-112px)] w-[min(1040px,calc(100vw-32px))] max-w-none flex-col overflow-hidden rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xl"
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="relative z-[10] flex h-[64px] shrink-0 items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 px-5 backdrop-blur-md">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                Destination
              </p>
              <h2 className="text-[18px] font-bold leading-tight text-[var(--text-primary)]">
                {destination.name}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] text-[var(--text-primary)] shadow-sm transition-all duration-300 hover:bg-[var(--bg-base)] active:scale-95"
            >
              <i className="pi pi-times text-sm" aria-hidden="true" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[var(--bg-surface)] destination-panel-shell">
            <Destination destinationId={destination.id} />
          </div>


          <style>{`
            .destination-panel-shell > div {
              padding-top: 0 !important;
              background: var(--bg-surface);
              min-height: 100%;
            }

            .destination-panel-shell > div > section:first-child {
              height: 340px !important;
              min-height: 340px !important;
            }

            .destination-panel-shell > div > section:first-child h1 {
              font-size: clamp(2.4rem, 5vw, 4.2rem) !important;
              line-height: 0.95 !important;
            }

            .destination-panel-shell > div > section:nth-child(2) {
              max-width: none !important;
              width: 100% !important;
              padding: 42px 44px 64px !important;
              grid-template-columns: minmax(0, 1fr) 300px !important;
              gap: 36px !important;
            }

            .destination-panel-shell > div > section:nth-child(2) aside {
              top: 20px !important;
              background: var(--bg-surface-raised) !important;
              border: 1px solid var(--border-subtle) !important;
              backdrop-filter: none !important;
              box-shadow: 0 20px 50px -34px rgba(0, 0, 0, 0.25);
            }

            .destination-panel-shell img {
              max-width: 100%;
            }

            .destination-panel-shell > div > section:nth-child(2) img {
              border-radius: 18px !important;
            }

            @media (max-width: 900px) {
              .destination-panel-shell > div > section:first-child {
                height: 300px !important;
                min-height: 300px !important;
              }

              .destination-panel-shell > div > section:nth-child(2) {
                grid-template-columns: 1fr !important;
                padding: 32px 22px 52px !important;
                gap: 28px !important;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}