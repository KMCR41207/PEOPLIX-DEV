/**
 * DevelopersPage.tsx — Top-level page component
 * ────────────────────────────────────
 * Mount at /developers. Accepts optional showNav / showFooter props
 * so the real site header/footer can replace the built-in ones.
 */

import { lazy, Suspense, useCallback, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import CategoryList from "./components/CategoryList";
import AboutSection from "./components/AboutSection";
import ClosingCta from "./components/ClosingCta";
import Footer from "./components/Footer";

/** Lazy-load the modal — it's rarely needed on first paint */
const ApplyModal = lazy(() => import("./components/ApplyModal"));

interface DevelopersPageProps {
  /** Show the built-in Nav? Set to false to use your own site header. */
  showNav?: boolean;
  /** Show the built-in Footer? Set to false to use your own site footer. */
  showFooter?: boolean;
}

export default function DevelopersPage({
  showNav = true,
  showFooter = true,
}: DevelopersPageProps) {
  const [applyRole, setApplyRole] = useState<string | null>(null);
  const prefersReduced = useReducedMotion();

  const openApply = useCallback((slug: string) => {
    setApplyRole(slug);
  }, []);

  const closeApply = useCallback(() => {
    setApplyRole(null);
  }, []);

  /* Page reveal — clipPath wipe from bottom to top on initial load */
  const dur = prefersReduced ? 0 : 1;

  return (
    <motion.div
      className="min-h-screen bg-white text-black"
      initial={{
        clipPath: prefersReduced ? "inset(0 0 0 0)" : "inset(100% 0 0 0)",
        opacity: prefersReduced ? 1 : 0,
      }}
      animate={{
        clipPath: "inset(0 0 0 0)",
        opacity: 1,
      }}
      transition={{
        clipPath: {
          duration: dur * 0.9,
          ease: [0.22, 1, 0.36, 1],
        },
        opacity: {
          duration: dur * 0.5,
          ease: "easeOut",
        },
      }}
    >
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-peoplix-beige focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black"
      >
        Skip to content
      </a>

      <Nav visible={showNav} />

      <main id="main-content">
        <Hero />
        <CategoryList onApply={openApply} />
        <AboutSection />
        <ClosingCta onApply={() => openApply("general")} />
      </main>

      <Footer visible={showFooter} />

      {/* Apply modal (lazy) — AnimatePresence enables exit transitions */}
      <AnimatePresence>
        {applyRole !== null && (
          <Suspense fallback={null}>
            <ApplyModal key={applyRole} roleSlug={applyRole} onClose={closeApply} />
          </Suspense>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
