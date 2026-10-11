/**
 * AboutSection.tsx — "02 — About Peoplix"
 * ────────────────────────────────────
 * Two-column on desktop: sticky heading left, scrolling points right.
 * Single column on mobile. Every point is its own row, sourced from data.
 */

import PhotoRise from "./PhotoRise";
import { aboutPoints } from "../data/aboutContent";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="border-t border-black/10 px-6 py-24 lg:px-10 lg:py-32"
      aria-label="About Peoplix"
    >
      <div className="mx-auto max-w-[90rem]">
        {/* Section header */}
        <PhotoRise direction="up" intensity="low" duration={0.6}>
          <div className="flex items-end justify-between border-b border-black/10 pb-8">
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] font-extrabold leading-[0.95] tracking-tight text-black">
              About Peoplix
            </h2>
            <span className="hidden text-[12px] font-semibold uppercase tracking-[0.16em] text-black/35 sm:block">
              02
            </span>
          </div>
        </PhotoRise>

        {/* Two-column layout */}
        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          {/* Left: sticky heading */}
          <PhotoRise direction="up" intensity="medium" duration={0.7} delay={0.1}>
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="font-display text-[clamp(1.5rem,3vw,2.5rem)] font-extrabold leading-tight tracking-tight text-black">
                Everything you need to know about Peoplix — one point at a time.
              </p>
              <p className="mt-4 text-base leading-relaxed text-black/55">
                AI voice agents for enterprise HR — resolving employee requests instantly.
              </p>
            </div>
          </PhotoRise>

          {/* Right: point rows */}
          <div className="space-y-0">
            {aboutPoints.map((point, i) => (
              <PhotoRise
                key={point.number}
                direction="up"
                intensity="low"
                duration={0.65}
                delay={i * 0.08}
              >
                <div className="border-b border-black/10 py-8 first:pt-0">
                  <div className="flex items-start gap-5 lg:gap-8">
                    {/* Number */}
                    <span className="mt-0.5 shrink-0 text-[13px] font-medium tracking-[0.1em] text-black/25">
                      {point.number}
                    </span>

                    <div>
                      {/* Title */}
                      <h3 className="font-display text-lg font-extrabold tracking-tight text-black lg:text-xl">
                        {point.title}
                      </h3>
                      {/* Description */}
                      <p className="mt-2 text-[15px] leading-relaxed text-black/65">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </div>
              </PhotoRise>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
