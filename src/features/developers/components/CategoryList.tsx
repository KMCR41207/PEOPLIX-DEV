/**
 * CategoryList.tsx — Numbered editorial list of role categories
 * ────────────────────────────────────
 * Section "01 — Pick a role". Each category is a large row with
 * number, name, one-line description, and arrow. Hover = beige fill sweep.
 * Clicking expands the RoleDetail panel (one at a time, accordion).
 * Keeps ?role=<slug> in the URL for deep linking.
 */

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { roles } from "../data/roles";
import RoleDetail from "./RoleDetail";
import PhotoRise from "./PhotoRise";

interface CategoryListProps {
  onApply: (roleSlug: string) => void;
}

export default function CategoryList({ onApply }: CategoryListProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSlug, setActiveSlug] = useState<string | null>(
    searchParams.get("role")
  );
  const prefersReduced = useReducedMotion();

  // Sync URL → state on initial load (for deep links)
  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam && roles.some((r) => r.slug === roleParam)) {
      setActiveSlug(roleParam);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = useCallback(
    (slug: string) => {
      const next = activeSlug === slug ? null : slug;
      setActiveSlug(next);
      if (next) {
        setSearchParams({ role: next }, { replace: true });
      } else {
        setSearchParams({}, { replace: true });
      }
    },
    [activeSlug, setSearchParams]
  );

  // Keyboard handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, slug: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle(slug);
      } else if (e.key === "Escape" && activeSlug === slug) {
        setActiveSlug(null);
        setSearchParams({}, { replace: true });
      }
    },
    [activeSlug, toggle, setSearchParams]
  );

  const EASE_PANEL: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

  const panelVariants = {
    hidden: {
      height: 0,
      opacity: 0,
    },
    visible: {
      height: "auto",
      opacity: 1,
      transition: {
        height: {
          duration: prefersReduced ? 0 : 1,
          ease: EASE_PANEL,
        },
        opacity: {
          duration: prefersReduced ? 0 : 0.8,
          delay: prefersReduced ? 0 : 0.25,
          ease: "easeOut" as const,
        },
      },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: {
        opacity: {
          duration: prefersReduced ? 0 : 0.3,
          ease: "easeIn" as const,
        },
        height: {
          duration: prefersReduced ? 0 : 0.6,
          delay: 0.1,
          ease: EASE_PANEL,
        },
      },
    },
  };

  return (
    <section
      id="roles"
      className="border-t border-black/10 px-6 py-24 lg:px-10 lg:py-32"
      aria-label="Open roles"
    >
      <div className="mx-auto max-w-[90rem]">
        {/* Section header */}
        <PhotoRise direction="up" intensity="low" duration={0.6}>
          <div className="flex items-end justify-between border-b border-black/10 pb-8">
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] font-extrabold leading-[0.95] tracking-tight text-black">
              Pick a role
            </h2>
            <span className="hidden text-[12px] font-semibold uppercase tracking-[0.16em] text-black/35 sm:block">
              01
            </span>
          </div>
        </PhotoRise>

        {/* Role rows */}
        <div className="mt-2" role="list">
          {roles.map((role, index) => {
            const isOpen = activeSlug === role.slug;
            const num = String(index + 1).padStart(2, "0");

            return (
              <PhotoRise
                key={role.slug}
                direction="up"
                intensity="low"
                duration={0.6}
                delay={index * 0.06}
                scale={false}
              >
              <div role="listitem" id={`role-row-${role.slug}`}>
                <button
                  type="button"
                  className={`group relative flex w-full cursor-pointer items-center gap-4 border-b border-black/10 px-2 py-6 text-left transition-colors duration-300 lg:gap-8 lg:px-4 lg:py-8 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black ${
                    isOpen ? "bg-peoplix-beige" : "hover:bg-peoplix-beige/40"
                  }`}
                  onClick={() => toggle(role.slug)}
                  onKeyDown={(e) => handleKeyDown(e, role.slug)}
                  aria-expanded={isOpen}
                  aria-controls={`role-detail-${role.slug}`}
                >
                  {/* Number */}
                  <span className="shrink-0 text-[13px] font-medium tracking-[0.1em] text-black/30">
                    {num}
                  </span>

                  {/* Category name */}
                  <span className="flex-1 font-display text-xl font-extrabold tracking-tight text-black lg:text-3xl">
                    {role.title}
                  </span>

                  {/* One-line description (hidden on small screens) */}
                  <span className="hidden max-w-xs text-sm text-black/50 lg:block">
                    {role.shortDescription}
                  </span>

                  {/* Arrow */}
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/15 text-black transition-transform duration-300 ${
                      isOpen ? "rotate-45" : "group-hover:rotate-0"
                    }`}
                    aria-hidden="true"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {isOpen ? (
                        <>
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </>
                      ) : (
                        <>
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </>
                      )}
                    </svg>
                  </span>
                </button>

                {/* Expanded detail panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`role-detail-${role.slug}`}
                      role="region"
                      aria-label={`${role.title} details`}
                      variants={panelVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="overflow-hidden"
                    >
                      <RoleDetail role={role} onApply={onApply} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              </PhotoRise>
            );
          })}

          {/* "More roles coming" — non-clickable */}
          <div
            className="flex items-center gap-4 border-b border-black/10 px-2 py-6 lg:gap-8 lg:px-4 lg:py-8"
            role="listitem"
            aria-disabled="true"
          >
            <span className="shrink-0 text-[13px] font-medium tracking-[0.1em] text-black/20">
              …
            </span>
            <span className="flex-1 font-display text-xl font-extrabold tracking-tight text-black/30 lg:text-3xl">
              More roles coming
            </span>
            <span className="hidden max-w-xs text-sm text-black/30 lg:block">
              We're growing — check back soon.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
