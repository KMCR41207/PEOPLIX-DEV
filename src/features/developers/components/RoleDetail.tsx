/**
 * RoleDetail.tsx — Expanded detail panel for a single role
 * ────────────────────────────────────
 * Shows summary, day-to-day bullets, skills chips, what you'll build,
 * nice-to-haves, meta row, and the "Apply for this role" button.
 */

import PhotoRise from "./PhotoRise";
import type { Role } from "../data/roles";

interface RoleDetailProps {
  role: Role;
  onApply: (roleSlug: string) => void;
}

export default function RoleDetail({ role, onApply }: RoleDetailProps) {
  return (
    <div className="border-t border-black/10 bg-white px-6 py-10 lg:px-10 lg:py-14">
      <div className="mx-auto max-w-4xl">
        {/* Title + Summary */}
        <PhotoRise direction="up" intensity="low" duration={0.7} delay={0.3} once={false}>
          <h3 className="font-display text-2xl font-extrabold tracking-tight text-black lg:text-3xl">
            {role.title}
          </h3>
          <p className="mt-4 text-base leading-relaxed text-black/70 lg:text-lg">
            {role.summary}
          </p>
        </PhotoRise>

        {/* Day-to-day work */}
        <PhotoRise direction="up" intensity="low" duration={0.7} delay={0.42} once={false} className="mt-10">
          <h4 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/40">
            Day-to-day work
          </h4>
          <ul className="mt-4 space-y-3">
            {role.dayToDay.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-[15px] leading-relaxed text-black/75"
              >
                <span
                  className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-peoplix-beige"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </PhotoRise>

        {/* Skills & tools */}
        <PhotoRise direction="up" intensity="low" duration={0.7} delay={0.54} once={false} className="mt-10">
          <h4 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/40">
            Skills & tools
          </h4>
          <div className="mt-4 flex flex-wrap gap-2">
            {role.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-peoplix-beige px-4 py-1.5 text-[13px] font-medium text-black"
              >
                {skill}
              </span>
            ))}
          </div>
        </PhotoRise>

        {/* What you'll build */}
        <PhotoRise direction="up" intensity="low" duration={0.7} delay={0.66} once={false} className="mt-10">
          <h4 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/40">
            What you'll build at Peoplix
          </h4>
          <p className="mt-4 text-[15px] leading-relaxed text-black/70">
            {role.whatYoullBuild}
          </p>
        </PhotoRise>

        {/* Nice to have */}
        <PhotoRise direction="up" intensity="low" duration={0.7} delay={0.78} once={false} className="mt-10">
          <h4 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/40">
            Nice to have
          </h4>
          <ul className="mt-4 space-y-2">
            {role.niceToHave.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-[15px] leading-relaxed text-black/70"
              >
                <span
                  className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-black/20"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </PhotoRise>

        {/* Meta row */}
        <PhotoRise direction="up" intensity="low" duration={0.7} delay={0.9} once={false} className="mt-10">
          <div className="flex flex-wrap gap-x-8 gap-y-3 border-t border-black/10 pt-6">
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-black/40">
                Experience
              </span>
              <span className="mt-1 block text-sm font-medium text-black">
                {role.meta.experience}
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-black/40">
                Work type
              </span>
              <span className="mt-1 block text-sm font-medium text-black">
                {role.meta.workType}
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-black">
                Location
              </span>
              <span className="mt-1 block text-sm font-medium text-black">
                {role.meta.location}
              </span>
            </div>
          </div>
        </PhotoRise>

        {/* Apply button */}
        <PhotoRise direction="up" intensity="medium" duration={0.7} delay={1.0} once={false} className="mt-10">
          <button
            type="button"
            onClick={() => onApply(role.slug)}
            className="inline-flex items-center gap-2 rounded-full bg-peoplix-beige px-8 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-black transition-colors hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
          >
            Apply for this role
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
    </div>
  );
}
