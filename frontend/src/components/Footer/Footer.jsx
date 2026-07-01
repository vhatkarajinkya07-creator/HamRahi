import { Link } from "react-router-dom";


export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#07111f] px-[6vw] py-10 text-white">
      <div
        className="pointer-events-none absolute inset-x-[12vw] bottom-0 h-44 rounded-full bg-sky-200/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-8 rounded-lg border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <Link
              to="/"
              className="text-xl font-semibold text-white transition-colors duration-300 hover:text-white/82"
            >
              HUMRAHI
            </Link>
            <p className="mt-3 max-w-[360px] text-sm leading-6 text-white/54">
              Cinematic travel discovery for places, moods, and stories around
              the world.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 text-xs text-white/36 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} HUMRAHI</span>
          <span>Demo product. All data is illustrative.</span>
        </div>
      </div>
    </footer>
  );
}
