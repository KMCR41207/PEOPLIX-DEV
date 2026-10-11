/**
 * PhotoRise.tsx — Canva-style Photo Rise animation component
 * ────────────────────────────────────
 * A reusable wrapper that animates children into view with a smooth
 * upward glide + fade, triggered by viewport visibility.
 *
 * Supports configurable direction, intensity, duration, delay,
 * and trigger mode (onEnter / onExit / both).
 *
 * Uses Framer Motion's viewport detection — no extra dependencies.
 * Respects `prefers-reduced-motion`.
 */

import { type ReactNode, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* ─── Public API ─── */
export type PhotoRiseDirection = "up" | "down" | "left" | "right";
export type PhotoRiseIntensity = "low" | "medium" | "high";
export type PhotoRiseTrigger = "onEnter" | "onExit" | "both";

export interface PhotoRiseProps {
  children: ReactNode;
  /** Direction the element travels FROM. Default `"up"` (rises upward). */
  direction?: PhotoRiseDirection;
  /** Movement distance preset. Default `"medium"`. */
  intensity?: PhotoRiseIntensity;
  /** Animation duration in seconds. Default `0.7`. */
  duration?: number;
  /** Delay before animation starts, in seconds. Default `0`. */
  delay?: number;
  /** When to animate. Default `"onEnter"`. */
  trigger?: PhotoRiseTrigger;
  /** Whether to animate only the first time. Default `true`. */
  once?: boolean;
  /** Extra className on the wrapper. */
  className?: string;
  /** IntersectionObserver margin (e.g. "-60px"). Default `"-40px"`. */
  viewportMargin?: string;
  /** Include subtle scale transition. Default `true`. */
  scale?: boolean;
}

/* ─── Intensity → pixel offset mapping ─── */
const INTENSITY_MAP: Record<PhotoRiseIntensity, number> = {
  low: 20,
  medium: 40,
  high: 70,
};

/* ─── Direction → axis / sign mapping ─── */
function getOffset(
  direction: PhotoRiseDirection,
  px: number
): { x: number; y: number } {
  switch (direction) {
    case "up":
      return { x: 0, y: px };      // starts below, rises up
    case "down":
      return { x: 0, y: -px };     // starts above, drops down
    case "left":
      return { x: px, y: 0 };      // starts right, slides left
    case "right":
      return { x: -px, y: 0 };     // starts left, slides right
  }
}

/* ─── Ease curve — Canva-style expo-out ─── */
const EASE_PHOTO_RISE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ═══════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function PhotoRise({
  children,
  direction = "up",
  intensity = "medium",
  duration = 0.7,
  delay = 0,
  trigger = "onEnter",
  once = true,
  className,
  viewportMargin = "-40px",
  scale: useScale = true,
}: PhotoRiseProps) {
  const prefersReduced = useReducedMotion();

  const offset = useMemo(
    () => getOffset(direction, INTENSITY_MAP[intensity]),
    [direction, intensity]
  );

  const dur = prefersReduced ? 0 : duration;
  const del = prefersReduced ? 0 : delay;
  const scaleFactor = useScale && !prefersReduced ? 0.98 : 1;

  /* ── Variants ── */
  const variants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        x: prefersReduced ? 0 : offset.x,
        y: prefersReduced ? 0 : offset.y,
        scale: scaleFactor,
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: {
          duration: dur,
          delay: del,
          ease: EASE_PHOTO_RISE,
        },
      },
      exit: {
        opacity: 0,
        x: prefersReduced ? 0 : offset.x,
        y: prefersReduced ? 0 : offset.y,
        scale: scaleFactor,
        transition: {
          duration: dur * 0.6,
          ease: "easeIn" as const,
        },
      },
    }),
    [dur, del, offset, scaleFactor, prefersReduced]
  );

  /* ── Determine whileInView vs animate ── */
  const triggerOnEnter = trigger === "onEnter" || trigger === "both";
  const triggerOnExit = trigger === "onExit" || trigger === "both";

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      {...(triggerOnEnter
        ? {
            whileInView: "visible",
            viewport: {
              once: once && !triggerOnExit,
              margin: viewportMargin,
            },
          }
        : { animate: "visible" })}
      {...(triggerOnExit && !once ? { exit: "exit" } : {})}
      className={className}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
