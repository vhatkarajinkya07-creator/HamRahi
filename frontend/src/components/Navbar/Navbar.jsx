

//       don't change any thing in this until asked to AJINKYA  



import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "primeicons/primeicons.css";
import { useScrollPosition } from "../../hooks/useScrollPosition";

const links = [
  { to: "/", label: "Home" },
  { to: "/#destinations", label: "Explore" },
];

export default function Navbar() {
  const scrollY = useScrollPosition();
  const [menuOpen, setMenuOpen] = useState(false);
  const solid = scrollY > 50;

  // Lock body scroll while the drawer is open
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", menuOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [menuOpen]);

  const closeDrawer = () => setMenuOpen(false);

  return (
    <>
      <motion.header
        className={`fixed top-0 w-full z-50 backdrop-blur-[14px] border-b border-white/10 transition-all duration-500 ease-in-out ${
          solid ? "bg-[rgba(10,10,10,0.85)] shadow-xl" : "bg-[rgba(10,10,10,0.4)]"
        }`}
        initial={{ y: -84 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex justify-between items-center px-6 md:px-16 py-4 max-w-[1280px] mx-auto">
          {/* Leading: Menu + Brand */}
          <div className="flex items-center gap-4">
            <button
              className="flex items-center justify-center text-white hover:opacity-70 transition-opacity cursor-pointer active:scale-95 duration-500"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <i className="pi pi-bars text-[22px]" />
            </button>
            <Link
              to="/"
              className="font-bold tracking-tighter text-white text-[24px] md:text-[32px]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              HUMRAHI
            </Link>
          </div>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center space-x-20">
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                className={({ isActive }) =>
                  `font-medium transition-colors duration-300 pb-1 ${
                    isActive
                      ? "text-white font-bold border-b-2 border-white"
                      : "text-white/60 hover:text-white"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Trailing Action */}
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="font-medium text-[14px] text-white hover:opacity-70 transition-opacity duration-300 active:scale-95"
            >
              Login
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55]"
            onClick={closeDrawer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Navigation Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.aside
            className="fixed inset-y-0 left-0 z-[60] h-full w-[280px] bg-[#0A0A0A] backdrop-blur-[20px] shadow-xl border-r border-white/10 flex flex-col p-6"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between mb-10">
              <span className="font-bold text-[24px] text-white">HUMRAHI</span>
              <button
                className="hover:opacity-70 transition-opacity text-white"
                onClick={closeDrawer}
                aria-label="Close menu"
              >
                <i className="pi pi-times text-[20px]" />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {links.map((l) => (
                <NavLink
                  key={l.label}
                  to={l.to}
                  onClick={closeDrawer}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-full flex items-center gap-6 text-[14px] font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  <i
                    className={`pi ${
                      l.label === "Home" ? "pi-home" : "pi-compass"
                    } text-[16px]`}
                  />
                  <span>{l.label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/10">
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-[12px] font-semibold text-white/50 mb-2">
                  Member of HUMRAHI?
                </p>
                <Link
                  to="/login"
                  onClick={closeDrawer}
                  className="w-full block text-center bg-white text-[#0A0A0A] py-3 rounded-full text-[14px] font-medium hover:bg-white/90 active:scale-95 transition-all"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}