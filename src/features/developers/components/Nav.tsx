/**
 * Nav.tsx — Minimal sticky navigation bar
 * ────────────────────────────────────
 * Accepts `visible` prop so the parent can swap in the real site header later.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NavProps {
  /** Set to false to hide this nav (e.g. when using the main site header) */
  visible?: boolean;
}

const NAV_LINKS = [
  { label: "Developers", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Apply", href: "#apply-cta" },
] as const;

export default function Nav({ visible = true }: NavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!visible) return null;

  const handleClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur-md"
      role="banner"
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-[90rem] items-center justify-between px-6 py-4 lg:px-10 lg:py-5"
      >
        {/* Wordmark */}
        <a
          href="/"
          className="font-display text-xl font-extrabold tracking-tight text-black lg:text-2xl"
          aria-label="Peoplix — home"
        />

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <button
                type="button"
                onClick={() => handleClick(link.href)}
                className="relative text-[13px] font-medium uppercase tracking-[0.14em] text-black/70 transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
              >
                {link.label}
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => handleClick("#apply-cta")}
              className="rounded-full bg-peoplix-beige px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-black transition-colors hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
            >
              Apply Now
            </button>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center text-black md:hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-black/10 bg-white md:hidden"
          >
            <ul className="flex flex-col gap-1 px-6 py-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <button
                    type="button"
                    onClick={() => handleClick(link.href)}
                    className="w-full py-3 text-left text-[14px] font-medium uppercase tracking-[0.12em] text-black/80 transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => handleClick("#apply-cta")}
                  className="mt-2 w-full rounded-full bg-peoplix-beige py-3 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-black transition-colors hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                >
                  Apply Now
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
