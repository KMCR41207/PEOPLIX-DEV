/**
 * ClosingCta.tsx — Beige full-width CTA block + trigger for open application
 * ────────────────────────────────────
 * "Don't see your role? Send an open application."
 * Black pill button opens the Apply modal with role = "general".
 */

import PhotoRise from "./PhotoRise";

interface ClosingCtaProps {
  onApply: () => void;
}

export default function ClosingCta({ onApply }: ClosingCtaProps) {
  return (
    <section
      id="apply-cta"
      className="bg-peoplix-beige px-6 py-24 lg:px-10 lg:py-32"
      aria-label="Open application"
    >
      <div className="mx-auto max-w-[90rem] text-center">
        <PhotoRise direction="up" intensity="medium" duration={0.7}>
          <h2 className="font-display text-[clamp(2rem,5vw,4rem)] font-extrabold leading-tight tracking-tight text-black">
            Don't see your role?
          </h2>
        </PhotoRise>
        <PhotoRise direction="up" intensity="low" duration={0.7} delay={0.1}>
          <p className="mx-auto mt-4 max-w-md text-base text-black/70 lg:text-lg">
            Send an open application and tell us what you're great at. We're always
            looking for exceptional people.
          </p>
        </PhotoRise>
        <PhotoRise direction="up" intensity="medium" duration={0.7} delay={0.2}>
          <button
            type="button"
            onClick={onApply}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-10 py-4 text-[13px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
          >
            Send an open application
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </PhotoRise>
      </div>
    </section>
  );
}
