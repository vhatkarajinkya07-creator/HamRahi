import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-ink text-white/85 px-[6vw] pt-20 pb-[30px]">
      <div className="max-w-[1400px] mx-auto flex justify-between flex-wrap gap-[60px] pb-[50px] border-b border-white/12">
        <div>
          <div className="font-display font-extrabold text-[1.35rem] flex items-center gap-2 text-white mb-3">
            <span className="text-teal text-[1.1rem]">◐</span>
            Wander<span className="text-coral">Go</span>
          </div>
          <p className="text-white/60 max-w-[280px]">Explore the world, one story at a time.</p>
        </div>

        <div className="flex gap-[60px] flex-wrap">
          <div className="flex flex-col gap-3">
            <h4 className="text-[0.8rem] uppercase tracking-[0.08em] text-white/45 mb-1">Explore</h4>
            <Link to="/#destinations" className="text-white/85 text-[0.92rem] hover:text-coral">
              Destinations
            </Link>
            <Link to="/about" className="text-white/85 text-[0.92rem] hover:text-coral">
              About
            </Link>
            <a href="#!" className="text-white/85 text-[0.92rem] hover:text-coral">
              Journal
            </a>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-[0.8rem] uppercase tracking-[0.08em] text-white/45 mb-1">Company</h4>
            <a href="#!" className="text-white/85 text-[0.92rem] hover:text-coral">
              Careers
            </a>
            <a href="#!" className="text-white/85 text-[0.92rem] hover:text-coral">
              Press
            </a>
            <a href="#!" className="text-white/85 text-[0.92rem] hover:text-coral">
              Contact
            </a>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-[0.8rem] uppercase tracking-[0.08em] text-white/45 mb-1">Follow</h4>
            <a href="#!" className="text-white/85 text-[0.92rem] hover:text-coral">
              Instagram
            </a>
            <a href="#!" className="text-white/85 text-[0.92rem] hover:text-coral">
              TikTok
            </a>
            <a href="#!" className="text-white/85 text-[0.92rem] hover:text-coral">
              Pinterest
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto mt-[26px] text-[0.8rem] text-white/40 font-mono">
        <span>© {new Date().getFullYear()} WanderGo. Demo product — all data is illustrative.</span>
      </div>
    </footer>
  );
}
