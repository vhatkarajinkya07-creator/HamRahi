// Navbar.jsx
import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import "primeicons/primeicons.css";
import { useScrollPosition } from "../../hooks/useScrollPosition";

const links = [
  { to: "/", label: "Home", icon: "pi-home" },
  { to: "/dashboard", label: "My Trips", icon: "pi-calendar", protected: true },
  { to: "/wishlist", label: "Wishlist", icon: "pi-heart", protected: true },
  { to: "/profile", label: "Profile", icon: "pi-user", protected: true },
];

export default function Navbar() {
  const scrollY = useScrollPosition();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isHomePage = location.pathname === "/";
  // On homepage, solidify once scrolled past the Hero section (500px). On other pages, solidify immediately.
  const solid = isHomePage ? scrollY > 500 : scrollY > 10;

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

  const isLight = theme === "light";
  const visibleLinks = links;

  const headerClass = solid
    ? "bg-[var(--bg-surface)]/90 border-[var(--border-subtle)] text-[var(--text-primary)] shadow-md"
    : isLight
    ? "bg-white/30 border-black/5 text-[var(--text-primary)] shadow-sm"
    : "bg-black/20 border-white/10 text-white";

  const btnTextClass = solid
    ? "text-[var(--text-primary)] hover:bg-[var(--border-subtle)]/30"
    : isLight
    ? "text-[var(--text-primary)] hover:bg-black/5"
    : "text-white hover:bg-white/10";

  const brandTextClass = solid
    ? "text-[var(--text-primary)]"
    : isLight
    ? "text-[var(--text-primary)]"
    : "text-white";

  const getNavLinkClass = (isActive) => {
    if (solid || isLight) {
      return `pb-1 text-sm font-semibold tracking-wide transition-all duration-300 border-b-2 ${
        isActive
          ? "border-[var(--theme-primary)] text-[var(--text-primary)] font-bold"
          : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      }`;
    }
    return `pb-1 text-sm font-semibold tracking-wide transition-all duration-300 border-b-2 ${
      isActive
        ? "border-white text-white font-bold"
        : "border-transparent text-white/60 hover:text-white"
    }`;
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 z-50 w-full border-b transition-all duration-500 ease-in-out backdrop-blur-md ${headerClass}`}
        initial={{ y: -84 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mx-auto flex h-[84px] max-w-[1280px] items-center justify-between px-6 py-4 md:px-16">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 active:scale-95 md:hidden ${btnTextClass}`}
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
              className={`text-[22px] font-extrabold tracking-tighter transition-colors duration-300 md:text-[28px] ${brandTextClass}`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              HUMRAHI
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-8 md:flex">
            {visibleLinks.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                className={({ isActive }) => getNavLinkClass(isActive)}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {/* Theme Toggle Switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 active:scale-95 ${btnTextClass}`}
              aria-label="Toggle light/dark theme"
            >
              <i className={`pi ${theme === "dark" ? "pi-sun" : "pi-moon"} text-lg`} />
            </button>

            {user ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  closeDrawer();
                }}
                className={`text-[14px] font-semibold transition-opacity duration-300 hover:opacity-75 active:scale-95 ${brandTextClass}`}
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={closeDrawer}
                className={`text-[14px] font-semibold transition-opacity duration-300 hover:opacity-75 active:scale-95 ${brandTextClass}`}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm md:hidden"
            onClick={closeDrawer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.aside
            id="mobile-navigation-drawer"
            className="fixed inset-y-0 left-0 z-[60] flex h-full w-[280px] flex-col border-r bg-[var(--bg-surface)] border-[var(--border-subtle)] p-6 shadow-2xl backdrop-blur-[20px] md:hidden text-[var(--text-primary)]"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="text-[22px] font-black tracking-tight">HUMRAHI</span>

              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 text-[var(--text-primary)]"
                onClick={closeDrawer}
                aria-label="Close menu"
              >
                <i className="pi pi-times text-[18px]" />
              </button>
            </div>

            <nav className="flex flex-col gap-1.5">
              {visibleLinks.map((l) => (
                <NavLink
                  key={l.label}
                  to={l.to}
                  onClick={closeDrawer}
                  className={({ isActive }) =>
                    `flex items-center gap-5 rounded-xl px-4 py-3 text-[14px] font-semibold transition-all duration-300 ${
                      isActive
                        ? "bg-[var(--bg-base)] text-[var(--text-primary)] shadow-sm border border-[var(--border-subtle)]"
                        : "text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--text-primary)]"
                    }`
                  }
                >
                  <i className={`pi ${l.icon} text-[15px]`} />
                  <span>{l.label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto border-t border-[var(--border-subtle)] pt-6">
              <div className="rounded-2xl bg-[var(--bg-base)] border border-[var(--border-subtle)] p-4">
                <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  {user ? user.name : "Member of HUMRAHI?"}
                </p>

                {user ? (
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      closeDrawer();
                    }}
                    className="block w-full rounded-full bg-[var(--text-primary)] py-3 text-center text-[13px] font-bold text-[var(--bg-base)] transition-all hover:opacity-90 active:scale-95"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={closeDrawer}
                    className="block w-full rounded-full bg-[var(--text-primary)] py-3 text-center text-[13px] font-bold text-[var(--bg-base)] transition-all hover:opacity-90 active:scale-95"
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