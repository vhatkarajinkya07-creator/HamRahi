// Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-[var(--bg-surface)] text-[var(--text-primary)] border-t border-[var(--border-subtle)] px-[6vw] py-12 transition-colors duration-300">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              to="/"
              className="text-2xl font-black tracking-tighter hover:opacity-85 transition-opacity text-[var(--text-primary)]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              HUMRAHI
            </Link>
            <p className="mt-3 max-w-[360px] text-sm leading-relaxed text-[var(--text-secondary)]">
              Cinematic travel discovery for places, moods, and stories around the world.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--border-subtle)]/40 flex flex-col gap-3 text-xs text-[var(--text-secondary)]/70 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} HUMRAHI. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
