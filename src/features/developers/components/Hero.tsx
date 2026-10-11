/**
 * Hero.tsx — Full-width "Developers" with scroll-triggered exit/enter
 * ────────────────────────────────────
 * On load: letters slide up with stagger.
 * On scroll down: letters fade upward one-by-one over ~1s, then scrolls to roles.
 * On scroll back up: letters fade back in (reverse), restoring the hero.
 */

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";

export default function Hero() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const animatingRef = useRef(false);

  const letters = "Developers".split("");
  const totalLetters = letters.length;

  const STAGGER = 0.055;
  const LETTER_DURATION = 0.35;
  const TOTAL_EXIT_MS =
    (STAGGER * (totalLetters - 1) + LETTER_DURATION) * 1000 + 150;

  // Mark entrance animation as complete
  useEffect(() => {
    const t = setTimeout(() => setHasEntered(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const scrollToRoles = useCallback(() => {
    const rolesSection = document.getElementById("roles");
    if (rolesSection) {
      rolesSection.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Scroll down → exit, Scroll up (when at top of roles) → re-enter
  useEffect(() => {
    if (!hasEntered) return;

    const handleWheel = (e: WheelEvent) => {
      if (animatingRef.current) {
        e.preventDefault();
        return;
      }

      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();

      // ── SCROLL DOWN: trigger exit ──
      if (e.deltaY > 2 && !isExiting && rect.top >= -50) {
        e.preventDefault();
        animatingRef.current = true;
        setIsExiting(true);

        setTimeout(() => {
          scrollToRoles();
          // Allow interaction again after scroll settles
          setTimeout(() => {
            animatingRef.current = false;
          }, 600);
        }, TOTAL_EXIT_MS);
        return;
      }

      // ── SCROLL UP: trigger re-enter ──
      if (e.deltaY < -2 && isExiting && window.scrollY < 800) {
        e.preventDefault();
        animatingRef.current = true;

        // Scroll to top first
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Then reverse the animation
        setTimeout(() => {
          setIsExiting(false);
          setTimeout(() => {
            animatingRef.current = false;
          }, 500);
        }, 200);
        return;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [hasEntered, isExiting, scrollToRoles, TOTAL_EXIT_MS]);

  // Touch support for mobile
  useEffect(() => {
    if (!hasEntered) return;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (animatingRef.current) return;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const deltaY = touchStartY - e.touches[0].clientY;

      // Swipe up → exit
      if (deltaY > 20 && !isExiting && rect.top >= -50) {
        animatingRef.current = true;
        setIsExiting(true);
        setTimeout(() => {
          scrollToRoles();
          setTimeout(() => { animatingRef.current = false; }, 600);
        }, TOTAL_EXIT_MS);
        return;
      }

      // Swipe down → re-enter
      if (deltaY < -20 && isExiting && window.scrollY < 800) {
        animatingRef.current = true;
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => {
          setIsExiting(false);
          setTimeout(() => { animatingRef.current = false; }, 500);
        }, 300);
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [hasEntered, isExiting, scrollToRoles, TOTAL_EXIT_MS]);

  /* ── Entrance variants ── */
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReduced ? 0 : 0.04,
        delayChildren: prefersReduced ? 0 : 0.2,
      },
    },
  };

  const letterEnter = {
    hidden: {
      y: prefersReduced ? 0 : "110%",
      opacity: prefersReduced ? 1 : 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: prefersReduced ? 0 : 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const fadeUp = {
    hidden: { y: prefersReduced ? 0 : 24, opacity: prefersReduced ? 1 : 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: prefersReduced ? 0 : 0.7,
        delay: prefersReduced ? 0 : 0.7,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-16 sm:px-6 lg:px-8"
      aria-labelledby="hero-heading"
    >
      {/* Headline */}
      <div className="relative w-full">
        {/* Beige underline */}
        <AnimatePresence>
          {!isExiting && (
            <motion.div
              className="absolute bottom-[0.05em] left-0 h-[0.14em] w-[55%] bg-peoplix-beige"
              initial={{ scaleX: prefersReduced ? 1 : 0 }}
              animate={{ scaleX: 1 }}
              exit={{
                opacity: 0,
                transition: { duration: 0.25, ease: "easeOut" },
              }}
              transition={{
                duration: prefersReduced ? 0 : 0.8,
                delay: prefersReduced ? 0 : 0.6,
                ease: [0.16, 1, 0.3, 1] as const,
              }}
              style={{ transformOrigin: "left" }}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>

        <h1 id="hero-heading" className="relative">
          <motion.span
            className="flex w-full justify-between overflow-hidden font-display font-extrabold uppercase leading-[0.85] tracking-[-0.04em] text-black"
            style={{ fontSize: "clamp(2.5rem, 14.5vw, 16vw)" }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            aria-label="Developers"
          >
            {letters.map((letter, i) => (
              <motion.span
                key={i}
                variants={letterEnter}
                className="inline-block"
                aria-hidden="true"
              >
                <motion.span
                  className="inline-block will-change-transform"
                  animate={
                    isExiting
                      ? {
                          y: "-100%",
                          opacity: 0,
                          transition: {
                            duration: LETTER_DURATION,
                            delay: i * STAGGER,
                            ease: [0.45, 0, 0.55, 1],
                          },
                        }
                      : {
                          y: "0%",
                          opacity: 1,
                          transition: {
                            duration: 0.25,
                            delay: i * 0.02,
                            ease: [0.16, 1, 0.3, 1],
                          },
                        }
                  }
                >
                  {letter}
                </motion.span>
              </motion.span>
            ))}
          </motion.span>
        </h1>
      </div>

      {/* Supporting line */}
      <motion.p
        className="mt-6 w-full max-w-[90rem] text-base font-normal tracking-wide text-black/65 lg:text-lg"
        variants={fadeUp}
        initial="hidden"
        animate={
          isExiting
            ? { opacity: 0, y: -20, transition: { duration: 0.25 } }
            : "visible"
        }
      >
        Join the people building Peoplix.
      </motion.p>

    </section>
  );
}
