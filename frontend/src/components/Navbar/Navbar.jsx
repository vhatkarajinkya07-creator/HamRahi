// don't change any thing in this until asked to AJINKYA

import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import "primeicons/primeicons.css";
import { useScrollPosition } from "../../hooks/useScrollPosition";

const links = [
  { to: "/", label: "Home", icon: "pi-home" },
  { to: "/#destinations", label: "Explore", icon: "pi-compass" },
  { to: "/wishlist", label: "Wishlist", icon: "pi-heart" },
  { to: "/itinerary", label: "Itinerary", icon: "pi-sparkles" },
];

export default function Navbar() {
  const scrollY = useScrollPosition();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const solid = scrollY > 50;

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", menuOpen);

    return () => document.body.classList.remove("overflow-hidden");
  }, [menuOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const closeDrawer = () => setMenuOpen(false);
  const toggleDrawer = () => setMenuOpen((open) => !open);

  return (
    <>
      <motion.header
        className={`fixed top-0 z-50 w-full border-b border-white/10 backdrop-blur-[14px] transition-all duration-500 ease-in-out ${
          solid
            ? "bg-[rgba(10,10,10,0.85)] shadow-xl"
            : "bg-[rgba(10,10,10,0.4)]"
        }`}
        initial={{ y: -84 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4 md:px-16">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-all duration-300 hover:bg-white/10 active:scale-95 md:hidden"
              onClick={toggleDrawer}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation-drawer"
            >
              <i className={`pi ${menuOpen ? "pi-times" : "pi-bars"} text-[22px]`} />
            </button>

            <Link
              to="/"
              onClick={closeDrawer}
              className="text-[24px] font-bold tracking-tighter text-white md:text-[32px]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              HUMRAHI
            </Link>
          </div>

          <nav className="hidden items-center gap-10 md:flex">
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                className={({ isActive }) =>
                  `pb-1 font-medium transition-colors duration-300 ${
                    isActive
                      ? "border-b-2 border-white font-bold text-white"
                      : "text-white/60 hover:text-white"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <button
                type="button"
                onClick={() => { logout(); closeDrawer(); }}
                className="text-[14px] font-medium text-white transition-opacity duration-300 hover:opacity-70 active:scale-95"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={closeDrawer}
                className="text-[14px] font-medium text-white transition-opacity duration-300 hover:opacity-70 active:scale-95"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm md:hidden"
            onClick={closeDrawer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
          <motion.aside
            id="mobile-navigation-drawer"
            className="fixed inset-y-0 left-0 z-[60] flex h-full w-[280px] flex-col border-r border-white/10 bg-[#0A0A0A] p-6 shadow-xl backdrop-blur-[20px] md:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-10 flex items-center justify-between">
              <span className="text-[24px] font-bold text-white">HUMRAHI</span>

              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-all duration-300 hover:bg-white/10 active:scale-95"
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
                    `flex items-center gap-6 rounded-full px-4 py-3 text-[14px] font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  <i className={`pi ${l.icon} text-[16px]`} />
                  <span>{l.label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto border-t border-white/10 pt-6">
              <div className="rounded-xl bg-white/5 p-4">
                <p className="mb-2 text-[12px] font-semibold text-white/50">
                  {user ? user.name : "Member of HUMRAHI?"}
                </p>

                {user ? (
                  <button
                    type="button"
                    onClick={() => { logout(); closeDrawer(); }}
                    className="block w-full rounded-full bg-white py-3 text-center text-[14px] font-medium text-[#0A0A0A] transition-all hover:bg-white/90 active:scale-95"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={closeDrawer}
                    className="block w-full rounded-full bg-white py-3 text-center text-[14px] font-medium text-[#0A0A0A] transition-all hover:bg-white/90 active:scale-95"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}