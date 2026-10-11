/**
 * Footer.tsx — Simple footer with Peoplix wordmark and links
 * ────────────────────────────────────
 * Accepts `visible` prop so the parent can swap in the real site footer later.
 */

import PhotoRise from "./PhotoRise";

interface FooterProps {
  /** Set to false to hide this footer (e.g. when using the main site footer) */
  visible?: boolean;
}

export default function Footer({ visible = true }: FooterProps) {
  if (!visible) return null;

  return (
    <footer className="border-t border-black/10 bg-white" role="contentinfo">
      <PhotoRise direction="up" intensity="low" duration={0.6}>
      <div className="mx-auto flex max-w-[90rem] flex-col gap-8 px-6 py-14 lg:flex-row lg:items-end lg:justify-between lg:px-10">
        <div>
          <p className="font-display text-3xl font-extrabold tracking-tight text-black lg:text-4xl">
            Peoplix
          </p>
          <p className="mt-2 max-w-sm text-sm text-black/50">
            The people platform built for modern teams.
          </p>
        </div>

        <ul className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[13px] font-medium uppercase tracking-[0.14em] text-black/60">
          <li>
            <a
              href="https://peoplix.ai"
              className="transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
              target="_blank"
              rel="noopener noreferrer"
            >
              Website
            </a>
          </li>
          <li>
            <a
              href="#hero"
              className="transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#hero")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Developers
            </a>
          </li>
          <li>
            <a
              href="#about"
              className="transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              About
            </a>
          </li>
        </ul>
      </div>
      </PhotoRise>

      <div className="mx-auto flex max-w-[90rem] items-center justify-between border-t border-black/10 px-6 py-5 lg:px-10">
        <p className="text-xs text-black/40">© 2026 Peoplix. All rights reserved.</p>
        <button
          type="button"
          className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-black/40 transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Back to top
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:-translate-y-1"
            aria-hidden="true"
          >
            <path d="m5 12 7-7 7 7" />
            <path d="M12 19V5" />
          </svg>
        </button>
      </div>
    </footer>
  );
}
