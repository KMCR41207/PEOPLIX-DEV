/**
 * ApplyModal.tsx — Premium split-screen developer application
 * ────────────────────────────────────
 * Three-step wizard:  About You → Your Craft → Review & Submit
 *
 * Left panel:  Black brand storytelling with progress indicator
 * Right panel: Clean white form with step-by-step navigation
 *
 * Focus trap, Esc to close, scroll lock, pre-filled role.
 * Client-side validation with inline errors.
 * Wires to submitApplication() stub.
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
} from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { roles } from "../data/roles";
import {
  submitApplication,
  type ApplicationPayload,
} from "../services/applications";

/* ─── Props ─── */
interface ApplyModalProps {
  roleSlug: string | null;
  onClose: () => void;
}

/* ─── Error shape per step ─── */
interface Step1Errors {
  fullName?: string;
  email?: string;
  phone?: string;
  yearsOfExperience?: string;
  portfolioUrl?: string;
  resume?: string;
  coverNote?: string;
}

interface Step2Errors {
  skills?: string;
  primaryLanguage?: string;
  experienceLevel?: string;
}

/* ─── Constants ─── */
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_COVER_NOTE = 500;
const MAX_PROJECT_DESC = 300;
const STEPS = ["About you", "Your craft", "Review"] as const;

/* ─── Skill / language / framework / level options ─── */
const ALL_SKILLS = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Go",
  "Rust",
  "Java",
  "C#",
  "Ruby",
  "PHP",
  "Swift",
  "Kotlin",
  "SQL",
  "HTML/CSS",
  "Shell/Bash",
  "C/C++",
  "Scala",
];

const ALL_LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Go",
  "Rust",
  "Java",
  "C#",
  "Ruby",
  "PHP",
  "Swift",
  "Kotlin",
  "C/C++",
  "Scala",
];

const ALL_FRAMEWORKS = [
  "React",
  "Next.js",
  "Vue",
  "Angular",
  "Svelte",
  "Node.js",
  "Express",
  "Django",
  "Flask",
  "FastAPI",
  "Spring Boot",
  "Rails",
  "Laravel",
  "Flutter",
  "React Native",
  "Docker",
  "Kubernetes",
  "Terraform",
  "AWS",
  "GCP",
  "Azure",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "GraphQL",
  "TailwindCSS",
];

const EXPERIENCE_LEVELS = [
  "Junior (0 – 2 years)",
  "Mid-level (2 – 5 years)",
  "Senior (5 – 8 years)",
  "Staff / Lead (8+ years)",
  "Principal / Architect",
];

/* ─── Helpers ─── */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ═══════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function ApplyModal({ roleSlug, onClose }: ApplyModalProps) {
  const prefersReduced = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ─── Wizard step (0, 1, 2) ─── */
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");

  /* ─── Step 1 state ─── */
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [coverNote, setCoverNote] = useState("");
  const [step1Errors, setStep1Errors] = useState<Step1Errors>({});
  const [isDragging, setIsDragging] = useState(false);

  /* ─── Step 2 state ─── */
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [primaryLanguage, setPrimaryLanguage] = useState("");
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState("");
  const [projectHighlights, setProjectHighlights] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [step2Errors, setStep2Errors] = useState<Step2Errors>({});

  /* ─── Derived ─── */
  const role = useMemo(
    () => roles.find((r) => r.slug === roleSlug),
    [roleSlug]
  );
  const roleName =
    roleSlug === "general"
      ? "General application"
      : role?.title ?? roleSlug ?? "";

  // Pre-fill skills from role data
  useEffect(() => {
    if (role && selectedSkills.length === 0) {
      const matching = role.skills.filter((s) => ALL_SKILLS.includes(s));
      if (matching.length > 0) setSelectedSkills(matching);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  /* ─── Scroll lock ─── */
  useEffect(() => {
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = orig;
    };
  }, []);

  /* ─── Focus trap ─── */
  useEffect(() => {
    firstFocusRef.current?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  /* ────────────────────────────────────
     VALIDATION
     ──────────────────────────────────── */
  const validateStep1 = useCallback((): Step1Errors => {
    const errs: Step1Errors = {};
    if (!fullName.trim()) errs.fullName = "Full name is required.";
    if (!email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Enter a valid email address.";
    }
    if (!yearsOfExperience.trim()) {
      errs.yearsOfExperience = "Years of experience is required.";
    } else if (
      isNaN(Number(yearsOfExperience)) ||
      Number(yearsOfExperience) < 0
    ) {
      errs.yearsOfExperience = "Enter a valid number.";
    }
    if (!resume) {
      errs.resume = "Resume is required.";
    } else {
      if (resume.size > MAX_FILE_SIZE) errs.resume = "File must be under 5 MB.";
      if (!ACCEPTED_FILE_TYPES.includes(resume.type))
        errs.resume = "Only PDF and DOC files are accepted.";
    }
    if (coverNote.length > MAX_COVER_NOTE)
      errs.coverNote = `Maximum ${MAX_COVER_NOTE} characters.`;
    return errs;
  }, [fullName, email, yearsOfExperience, resume, coverNote]);

  const validateStep2 = useCallback((): Step2Errors => {
    const errs: Step2Errors = {};
    if (selectedSkills.length === 0) errs.skills = "Select at least one skill.";
    if (!primaryLanguage) errs.primaryLanguage = "Select a primary language.";
    if (!experienceLevel) errs.experienceLevel = "Select your experience level.";
    return errs;
  }, [selectedSkills, primaryLanguage, experienceLevel]);



  /* ────────────────────────────────────
     FILE HANDLING (drag & drop + click)
     ──────────────────────────────────── */
  const handleFileSelect = (file: File | undefined | null) => {
    if (!file) return;
    setResume(file);
    // Clear resume error if one existed
    if (step1Errors.resume) {
      setStep1Errors((prev) => ({ ...prev, resume: undefined }));
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFileSelect(file);
  };

  const removeResume = () => {
    setResume(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ────────────────────────────────────
     SKILL CHIPS
     ──────────────────────────────────── */
  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    const trimmed = customSkill.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills((prev) => [...prev, trimmed]);
      setCustomSkill("");
    }
  };

  /* ────────────────────────────────────
     FRAMEWORK CHIPS
     ──────────────────────────────────── */
  const toggleFramework = (fw: string) => {
    setSelectedFrameworks((prev) =>
      prev.includes(fw) ? prev.filter((f) => f !== fw) : [...prev, fw]
    );
  };

  /* ────────────────────────────────────
     SUBMIT
     ──────────────────────────────────── */
  const handleSubmit = async () => {
    setStatus("sending");
    try {
      await submitApplication({
        role: roleSlug ?? "general",
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        yearsOfExperience: Number(yearsOfExperience),
        portfolioUrl: portfolioUrl.trim() || undefined,
        resume: resume!,
        coverNote: coverNote.trim(),
        skills: selectedSkills,
        primaryLanguage: primaryLanguage || undefined,
        frameworks:
          selectedFrameworks.length > 0 ? selectedFrameworks : undefined,
        experienceLevel: experienceLevel || undefined,
        projectHighlights: projectHighlights.trim() || undefined,
        projectDescription: projectDescription.trim() || undefined,
      } as ApplicationPayload);
      setStatus("success");
    } catch {
      setStatus("idle");
      setStep1Errors({ fullName: "Something went wrong. Please try again." });
      setStep(0);
    }
  };

  /* ────────────────────────────────────
     MOTION VARIANTS — Cinematic reveal
     ──────────────────────────────────── */
  const dur = prefersReduced ? 0 : 1;

  /* Ease curves */
  const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const EASE_OUT_QUART: [number, number, number, number] = [0.25, 1, 0.5, 1];



  /* ── Left brand panel stagger ── */
  const leftPanelVariants = {
    hidden: { opacity: 0, x: prefersReduced ? 0 : -12 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: dur * 0.5,
        ease: EASE_OUT_EXPO,
        delay: dur * 0.28,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: dur * 0.15 },
    },
  };

  /* ── Right panel (header + content) ── */
  const rightPanelVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: dur * 0.45,
        ease: EASE_OUT_QUART,
        delay: dur * 0.36,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: dur * 0.12 },
    },
  };

  /* ── Right panel header stagger ── */
  const headerVariants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: dur * 0.5,
        ease: EASE_OUT_EXPO,
        delay: dur * 0.4,
      },
    },
    exit: {
      opacity: 0,
      y: prefersReduced ? 0 : 6,
      transition: { duration: dur * 0.15 },
    },
  };

  /* ── Form content fade-rise ── */
  const formContentVariants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: dur * 0.55,
        ease: EASE_OUT_EXPO,
        delay: dur * 0.52,
      },
    },
    exit: {
      opacity: 0,
      y: prefersReduced ? 0 : 8,
      transition: { duration: dur * 0.12 },
    },
  };

  /* ── Step transition (between form steps) ── */
  const stepVariants = {
    enter: (direction: number) => ({
      x: prefersReduced ? 0 : direction > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: dur * 0.4,
        ease: EASE_OUT_QUART,
      },
    },
    exit: (direction: number) => ({
      x: prefersReduced ? 0 : direction > 0 ? -60 : 60,
      opacity: 0,
      transition: { duration: dur * 0.3 },
    }),
  };

  const [direction, setDirection] = useState(0);

  // Override goNext/goBack to track direction
  const goNextAnimated = () => {
    if (step === 0) {
      const errs = validateStep1();
      setStep1Errors(errs);
      if (Object.keys(errs).length > 0) return;
      setDirection(1);
      setStep(1);
    } else if (step === 1) {
      const errs = validateStep2();
      setStep2Errors(errs);
      if (Object.keys(errs).length > 0) return;
      setDirection(1);
      setStep(2);
    }
  };

  const goBackAnimated = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const goToStepAnimated = (target: number) => {
    if (target < step) {
      setDirection(-1);
      setStep(target);
    }
  };

  /* ═══════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════ */
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-stretch justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{
        opacity: 1,
        backdropFilter: "blur(3px)",
        transition: {
          opacity: { duration: dur * 0.4, ease: EASE_OUT_QUART },
          backdropFilter: { duration: dur * 0.6 },
        },
      }}
      exit={{
        opacity: 0,
        backdropFilter: "blur(0px)",
        transition: {
          opacity: { duration: dur * 0.3, delay: dur * 0.05, ease: "easeIn" },
          backdropFilter: { duration: dur * 0.25 },
        },
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Apply for ${roleName}`}
        initial={{
          y: prefersReduced ? 0 : 28,
          scale: prefersReduced ? 1 : 0.94,
          opacity: prefersReduced ? 1 : 0,
        }}
        animate={{
          y: 0,
          scale: 1,
          opacity: 1,
          transition: {
            duration: dur * 0.65,
            ease: EASE_OUT_EXPO,
            delay: dur * 0.12,
          },
        }}
        exit={{
          y: prefersReduced ? 0 : 12,
          scale: prefersReduced ? 1 : 0.97,
          opacity: 0,
          transition: {
            duration: dur * 0.3,
            ease: "easeIn",
          },
        }}
        className="apply-modal-container relative flex w-full max-w-[1200px] flex-col overflow-hidden bg-white shadow-2xl lg:my-6 lg:flex-row lg:rounded-md"
        >
          {/* ─── LEFT PANEL — Brand storytelling ─── */}
          <motion.div
            variants={leftPanelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="apply-left-panel relative flex flex-col justify-between overflow-hidden bg-black px-5 py-5 text-white lg:w-[420px] lg:shrink-0 lg:px-10 lg:py-12"
          >
            {/* Background decorative line */}
            <div
              className="pointer-events-none absolute right-0 top-0 hidden h-full w-px opacity-10 lg:block"
              style={{ background: "#D9B77A" }}
              aria-hidden="true"
            />

            {/* ── Mobile compact header ── */}
            <div className="flex items-center justify-between gap-4 lg:hidden">
              <div className="flex items-center gap-3">
                <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-white">
                  PEOPLIX
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: "#D9B77A" }}>
                  Build what matters
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.15em]"
                  style={{ color: "#D9B77A" }}
                >
                  {String(step + 1).padStart(2, "0")}
                </span>
                <span className="text-[10px] text-white/30">/ {String(STEPS.length).padStart(2, "0")}</span>
                <div className="ml-2 h-[2px] w-16 rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "#D9B77A" }}
                    initial={false}
                    animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                    transition={{ duration: dur * 0.5, ease: "easeInOut" }}
                  />
                </div>
              </div>
            </div>

            {/* ── Desktop full storytelling ── */}
            <div className="hidden lg:block">
              {/* Wordmark */}
              <div className="text-[13px] font-bold uppercase tracking-[0.25em] text-white">
                PEOPLIX
              </div>

              {/* Eyebrow */}
              <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#D9B77A" }}>
                Build what matters
              </p>

              {/* Headline */}
              <h2 className="mt-4 font-display text-[clamp(1.5rem,3.5vw,2.5rem)] font-extrabold leading-[1.1] tracking-tight text-white">
                Let's build
                <br />
                something{" "}
                <span style={{ color: "#D9B77A" }}>that</span>
                <br />
                <span style={{ color: "#D9B77A" }}>matters.</span>
              </h2>

              {/* Supporting copy */}
              <p className="mt-5 text-[14px] leading-relaxed text-white/50">
                Tell us what you do best.
                <br />
                We'll take it from here.
              </p>

              {/* Feature points */}
              <div className="mt-8 space-y-3">
                {[
                  { icon: "◆", text: "Real product challenges" },
                  { icon: "◆", text: "Room to grow" },
                  { icon: "◆", text: "People-first team" },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-3 text-[13px] text-white/60"
                  >
                    <span
                      className="text-[8px]"
                      style={{ color: "#D9B77A" }}
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Progress indicator — desktop only */}
            <div className="mt-8 hidden lg:block">
              <div className="flex items-center gap-2">
                <span
                  className="text-[11px] font-semibold uppercase tracking-[0.2em]"
                  style={{ color: "#D9B77A" }}
                >
                  Application
                </span>
                <span className="text-[11px] font-medium tracking-[0.15em] text-white/30">
                  {String(step + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-[2px] w-full rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "#D9B77A" }}
                  initial={false}
                  animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                  transition={{ duration: dur * 0.5, ease: "easeInOut" }}
                />
              </div>

              {/* Step labels */}
              <div className="mt-3 flex gap-4">
                {STEPS.map((label, i) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => goToStepAnimated(i)}
                    disabled={i >= step}
                    className={`text-[11px] font-medium tracking-wide transition-colors ${
                      i === step
                        ? "text-white"
                        : i < step
                          ? "cursor-pointer text-white/40 hover:text-white/70"
                          : "cursor-default text-white/20"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ─── RIGHT PANEL — Form area ─── */}
          <motion.div
            variants={rightPanelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative flex min-h-0 flex-1 flex-col overflow-y-auto"
          >
            {/* Close button */}
            <button
              ref={firstFocusRef}
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-black/50 transition-colors hover:border-black/30 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              aria-label="Close dialog"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Header */}
            <motion.div
              variants={headerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="shrink-0 border-b border-black/[0.06] px-6 pb-6 pt-8 lg:px-10 lg:pt-10"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/35">
                Developer application
              </p>
              <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-black lg:text-3xl">
                Make your move.
              </h3>

              {/* Step indicator (right panel) */}
              <div className="mt-5 flex items-center gap-1">
                {STEPS.map((label, i) => (
                  <div key={label} className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => goToStepAnimated(i)}
                      disabled={i > step}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-all ${
                        i === step
                          ? "bg-black text-white"
                          : i < step
                            ? "cursor-pointer bg-black/[0.04] text-black/60 hover:bg-black/[0.08]"
                            : "cursor-default bg-transparent text-black/25"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                          i === step
                            ? "bg-white/20 text-white"
                            : i < step
                              ? "bg-black/10 text-black/50"
                              : "bg-black/[0.06] text-black/25"
                        }`}
                      >
                        {i < step ? (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          i + 1
                        )}
                      </span>
                      <span className="hidden sm:inline">{label}</span>
                    </button>
                    {i < STEPS.length - 1 && (
                      <div className={`mx-1 h-px w-4 ${i < step ? "bg-black/20" : "bg-black/[0.06]"}`} />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Step content area */}
            <motion.div
              variants={formContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="min-h-0 flex-1 overflow-y-auto"
            >
              <AnimatePresence mode="wait" custom={direction}>
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: dur * 0.4 }}
                    className="flex flex-col items-center justify-center px-6 py-16 text-center lg:px-10 lg:py-24"
                  >
                    {/* Success icon */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: dur * 0.15,
                      }}
                      className="flex h-20 w-20 items-center justify-center rounded-full"
                      style={{ background: "#D9B77A" }}
                    >
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="black"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.div>

                    <h3 className="mt-8 font-display text-2xl font-extrabold tracking-tight text-black lg:text-3xl">
                      Application received
                    </h3>
                    <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-black/50">
                      This is a demo submission — no data was sent to a server.
                      In production, your application would be reviewed by our team.
                    </p>
                    <p className="mt-2 text-[13px] text-black/35">
                      Thank you for your interest in Peoplix.
                    </p>
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-10 rounded-sm bg-black px-10 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                    >
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`step-${step}`}
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="px-6 py-6 lg:px-10 lg:py-8"
                  >
                    {step === 0 && (
                      <Step1AboutYou
                        fullName={fullName}
                        setFullName={setFullName}
                        email={email}
                        setEmail={setEmail}
                        phone={phone}
                        setPhone={setPhone}
                        yearsOfExperience={yearsOfExperience}
                        setYearsOfExperience={setYearsOfExperience}
                        portfolioUrl={portfolioUrl}
                        setPortfolioUrl={setPortfolioUrl}
                        resume={resume}
                        coverNote={coverNote}
                        setCoverNote={setCoverNote}
                        errors={step1Errors}
                        setErrors={setStep1Errors}
                        isDragging={isDragging}
                        fileInputRef={fileInputRef}
                        handleFileSelect={handleFileSelect}
                        handleDragOver={handleDragOver}
                        handleDragLeave={handleDragLeave}
                        handleDrop={handleDrop}
                        removeResume={removeResume}
                        roleName={roleName}
                        onNext={goNextAnimated}
                      />
                    )}
                    {step === 1 && (
                      <Step2YourCraft
                        roleName={roleName}
                        selectedSkills={selectedSkills}
                        toggleSkill={toggleSkill}
                        customSkill={customSkill}
                        setCustomSkill={setCustomSkill}
                        addCustomSkill={addCustomSkill}
                        primaryLanguage={primaryLanguage}
                        setPrimaryLanguage={setPrimaryLanguage}
                        selectedFrameworks={selectedFrameworks}
                        toggleFramework={toggleFramework}
                        experienceLevel={experienceLevel}
                        setExperienceLevel={setExperienceLevel}
                        projectHighlights={projectHighlights}
                        setProjectHighlights={setProjectHighlights}
                        projectDescription={projectDescription}
                        setProjectDescription={setProjectDescription}
                        errors={step2Errors}
                        onBack={goBackAnimated}
                        onNext={goNextAnimated}
                      />
                    )}
                    {step === 2 && (
                      <Step3Review
                        fullName={fullName}
                        email={email}
                        phone={phone}
                        yearsOfExperience={yearsOfExperience}
                        portfolioUrl={portfolioUrl}
                        resume={resume}
                        coverNote={coverNote}
                        roleName={roleName}
                        selectedSkills={selectedSkills}
                        primaryLanguage={primaryLanguage}
                        selectedFrameworks={selectedFrameworks}
                        experienceLevel={experienceLevel}
                        projectHighlights={projectHighlights}
                        projectDescription={projectDescription}
                        status={status}
                        onBack={goBackAnimated}
                        onEdit={goToStepAnimated}
                        onSubmit={handleSubmit}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STEP 1 — About You
   ═══════════════════════════════════════════════════════════ */
function Step1AboutYou({
  fullName,
  setFullName,
  email,
  setEmail,
  phone,
  setPhone,
  yearsOfExperience,
  setYearsOfExperience,
  portfolioUrl,
  setPortfolioUrl,
  resume,
  coverNote,
  setCoverNote,
  errors,
  isDragging,
  fileInputRef,
  handleFileSelect,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  removeResume,
  roleName,
  onNext,
}: {
  fullName: string;
  setFullName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  yearsOfExperience: string;
  setYearsOfExperience: (v: string) => void;
  portfolioUrl: string;
  setPortfolioUrl: (v: string) => void;
  resume: File | null;
  coverNote: string;
  setCoverNote: (v: string) => void;
  errors: Step1Errors;
  setErrors: (v: Step1Errors) => void;
  isDragging: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileSelect: (f: File | null | undefined) => void;
  handleDragOver: (e: DragEvent<Element>) => void;
  handleDragLeave: (e: DragEvent<Element>) => void;
  handleDrop: (e: DragEvent<Element>) => void;
  removeResume: () => void;
  roleName: string;
  onNext: () => void;
}) {
  return (
    <div>
      {/* Pre-filled role badge */}
      <div className="mb-6 flex items-center gap-2 rounded-sm border border-black/[0.08] bg-black/[0.02] px-4 py-3">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-black/30"
        >
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
        <div>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-black/35">
            Role
          </span>
          <span className="block text-[13px] font-semibold text-black">
            {roleName}
          </span>
        </div>
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
        {/* Full name */}
        <FormField label="Full name" required error={errors.fullName}>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-black/25">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <input
              id="apply-name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputClasses(!!errors.fullName)}
              style={{ paddingLeft: "2.25rem" }}
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? "err-name" : undefined}
            />
          </div>
        </FormField>

        {/* Email */}
        <FormField label="Email" required error={errors.email}>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-black/25">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </span>
            <input
              id="apply-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClasses(!!errors.email)}
              style={{ paddingLeft: "2.25rem" }}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "err-email" : undefined}
            />
          </div>
        </FormField>

        {/* Phone */}
        <FormField label="Phone" error={errors.phone}>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-black/25">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </span>
            <input
              id="apply-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClasses(false)}
              style={{ paddingLeft: "2.25rem" }}
            />
          </div>
        </FormField>

        {/* Years of experience */}
        <FormField label="Years of experience" required error={errors.yearsOfExperience}>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-black/25">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </span>
            <input
              id="apply-experience"
              type="number"
              min="0"
              required
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
              className={inputClasses(!!errors.yearsOfExperience)}
              style={{ paddingLeft: "2.25rem" }}
              aria-invalid={!!errors.yearsOfExperience}
              aria-describedby={errors.yearsOfExperience ? "err-exp" : undefined}
            />
          </div>
        </FormField>
      </div>

      {/* Portfolio URL — full width */}
      <div className="mt-5">
        <FormField label="Portfolio / GitHub / LinkedIn URL" error={errors.portfolioUrl}>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-black/25">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </span>
            <input
              id="apply-portfolio"
              type="url"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              className={inputClasses(false)}
              style={{ paddingLeft: "2.25rem" }}
            />
          </div>
        </FormField>
      </div>

      {/* Resume upload — drag & drop area */}
      <div className="mt-5">
        <label className="mb-1.5 block text-[12px] font-semibold text-black">
          Resume <span aria-hidden="true" className="text-black/40">*</span>
          <span className="ml-1.5 font-normal text-black/35">(PDF or DOC, max 5 MB)</span>
        </label>

        {resume ? (
          /* ── File selected state ── */
          <div className="flex items-center gap-3 rounded-sm border border-black/10 bg-black/[0.02] px-4 py-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm" style={{ background: "#D9B77A" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-black">
                {resume.name}
              </p>
              <p className="text-[12px] text-black/40">
                {formatFileSize(resume.size)}
              </p>
            </div>
            <button
              type="button"
              onClick={removeResume}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 text-black/40 transition-colors hover:border-black/25 hover:text-black"
              aria-label="Remove file"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ) : (
          /* ── Drop zone ── */
          <div
            role="button"
            tabIndex={0}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-dashed px-4 py-8 text-center transition-colors ${
              isDragging
                ? "border-black/30 bg-black/[0.03]"
                : errors.resume
                  ? "border-black/40 bg-black/[0.02]"
                  : "border-black/[0.12] hover:border-black/25 hover:bg-black/[0.01]"
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/[0.05]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black/40">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="mt-3 text-[13px] text-black/50">
              Drag & drop your resume here, or{" "}
              <span className="font-semibold text-black underline underline-offset-2">
                browse files
              </span>
            </p>
            <p className="mt-1 text-[11px] text-black/30">PDF or DOC, max 5 MB</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          id="apply-resume"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => handleFileSelect(e.target.files?.[0])}
          className="sr-only"
          tabIndex={-1}
          aria-invalid={!!errors.resume}
          aria-describedby={errors.resume ? "err-resume" : undefined}
        />
        {errors.resume && <ErrorMessage id="err-resume" msg={errors.resume} />}
      </div>

      {/* Cover note / motivation */}
      <div className="mt-5">
        <FormField label="Why do you want to join Peoplix?" error={errors.coverNote}>
          <textarea
            id="apply-note"
            value={coverNote}
            onChange={(e) => setCoverNote(e.target.value)}
            maxLength={MAX_COVER_NOTE + 50}
            rows={4}
            className={`${inputClasses(!!errors.coverNote)} resize-y`}
            placeholder="Tell us what excites you about Peoplix…"
            aria-invalid={!!errors.coverNote}
            aria-describedby="note-counter"
          />
          <div
            id="note-counter"
            className={`mt-1 text-right text-[11px] ${
              coverNote.length > MAX_COVER_NOTE
                ? "font-bold text-black"
                : "text-black/35"
            }`}
          >
            {coverNote.length}/{MAX_COVER_NOTE}
          </div>
        </FormField>
      </div>

      {/* CTA */}
      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="apply-btn-primary group flex items-center gap-2 rounded-sm px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-all hover:gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
          style={{ background: "#000" }}
        >
          Continue to your craft
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STEP 2 — Your Craft
   ═══════════════════════════════════════════════════════════ */
function Step2YourCraft({
  roleName,
  selectedSkills,
  toggleSkill,
  customSkill,
  setCustomSkill,
  addCustomSkill,
  primaryLanguage,
  setPrimaryLanguage,
  selectedFrameworks,
  toggleFramework,
  experienceLevel,
  setExperienceLevel,
  projectHighlights,
  setProjectHighlights,
  projectDescription,
  setProjectDescription,
  errors,
  onBack,
  onNext,
}: {
  roleName: string;
  selectedSkills: string[];
  toggleSkill: (s: string) => void;
  customSkill: string;
  setCustomSkill: (v: string) => void;
  addCustomSkill: () => void;
  primaryLanguage: string;
  setPrimaryLanguage: (v: string) => void;
  selectedFrameworks: string[];
  toggleFramework: (f: string) => void;
  experienceLevel: string;
  setExperienceLevel: (v: string) => void;
  projectHighlights: string;
  setProjectHighlights: (v: string) => void;
  projectDescription: string;
  setProjectDescription: (v: string) => void;
  errors: Step2Errors;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div>
      {/* Role badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-sm border border-black/[0.08] px-3 py-2 text-[12px] font-semibold text-black/70">
        <span className="h-2 w-2 rounded-full" style={{ background: "#D9B77A" }} />
        {roleName}
      </div>

      {/* Technical Skills */}
      <div>
        <label className="mb-2 block text-[12px] font-semibold text-black">
          Technical skills <span className="text-black/40">*</span>
        </label>
        <p className="mb-3 text-[12px] text-black/40">
          Select all that apply. You can also add custom skills.
        </p>
        <div className="flex flex-wrap gap-2">
          {ALL_SKILLS.map((skill) => {
            const selected = selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`rounded-sm border px-3 py-1.5 text-[12px] font-medium transition-all ${
                  selected
                    ? "border-black bg-black text-white"
                    : "border-black/10 bg-white text-black/60 hover:border-black/25 hover:text-black"
                }`}
              >
                {selected && (
                  <span className="mr-1 inline-block" aria-hidden="true">✓</span>
                )}
                {skill}
              </button>
            );
          })}
          {/* Show any custom skills that aren't in ALL_SKILLS */}
          {selectedSkills
            .filter((s) => !ALL_SKILLS.includes(s))
            .map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className="rounded-sm border border-black bg-black px-3 py-1.5 text-[12px] font-medium text-white transition-all"
              >
                <span className="mr-1 inline-block" aria-hidden="true">✓</span>
                {skill}
              </button>
            ))}
        </div>
        {/* Custom skill input */}
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomSkill();
              }
            }}
            className="w-full max-w-[200px] rounded-sm border border-black/10 bg-white px-3 py-2 text-[12px] text-black placeholder:text-black/25 focus:border-black/30 focus:outline-none"
            placeholder="Add custom skill…"
          />
          <button
            type="button"
            onClick={addCustomSkill}
            disabled={!customSkill.trim()}
            className="rounded-sm border border-black/10 px-3 py-2 text-[12px] font-medium text-black/50 transition-colors hover:border-black/25 hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
          >
            Add
          </button>
        </div>
        {errors.skills && <ErrorMessage id="err-skills" msg={errors.skills} />}
      </div>

      {/* Primary Language */}
      <div className="mt-7">
        <label className="mb-2 block text-[12px] font-semibold text-black">
          Primary programming language <span className="text-black/40">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {ALL_LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setPrimaryLanguage(lang)}
              className={`rounded-sm border px-3 py-1.5 text-[12px] font-medium transition-all ${
                primaryLanguage === lang
                  ? "border-transparent text-black"
                  : "border-black/10 bg-white text-black/50 hover:border-black/25 hover:text-black"
              }`}
              style={primaryLanguage === lang ? { background: "#D9B77A" } : {}}
            >
              {lang}
            </button>
          ))}
        </div>
        {errors.primaryLanguage && (
          <ErrorMessage id="err-lang" msg={errors.primaryLanguage} />
        )}
      </div>

      {/* Frameworks & Tools */}
      <div className="mt-7">
        <label className="mb-2 block text-[12px] font-semibold text-black">
          Relevant frameworks & tools
        </label>
        <p className="mb-3 text-[12px] text-black/40">Optional — select all that apply.</p>
        <div className="flex flex-wrap gap-2">
          {ALL_FRAMEWORKS.map((fw) => {
            const selected = selectedFrameworks.includes(fw);
            return (
              <button
                key={fw}
                type="button"
                onClick={() => toggleFramework(fw)}
                className={`rounded-sm border px-3 py-1.5 text-[12px] font-medium transition-all ${
                  selected
                    ? "border-black bg-black text-white"
                    : "border-black/10 bg-white text-black/50 hover:border-black/25 hover:text-black"
                }`}
              >
                {selected && (
                  <span className="mr-1 inline-block" aria-hidden="true">✓</span>
                )}
                {fw}
              </button>
            );
          })}
        </div>
      </div>

      {/* Experience Level */}
      <div className="mt-7">
        <label className="mb-2 block text-[12px] font-semibold text-black">
          Experience level <span className="text-black/40">*</span>
        </label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {EXPERIENCE_LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setExperienceLevel(level)}
              className={`flex items-center gap-3 rounded-sm border px-4 py-3 text-left text-[13px] font-medium transition-all ${
                experienceLevel === level
                  ? "border-black bg-black text-white"
                  : "border-black/10 text-black/60 hover:border-black/25 hover:text-black"
              }`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                  experienceLevel === level
                    ? "border-white"
                    : "border-black/20"
                }`}
              >
                {experienceLevel === level && (
                  <span className="block h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </span>
              {level}
            </button>
          ))}
        </div>
        {errors.experienceLevel && (
          <ErrorMessage id="err-level" msg={errors.experienceLevel} />
        )}
      </div>

      {/* Project highlights */}
      <div className="mt-7">
        <FormField label="Portfolio / project highlights">
          <input
            type="text"
            value={projectHighlights}
            onChange={(e) => setProjectHighlights(e.target.value)}
            className={inputClasses(false)}
          />
          <p className="mt-1 text-[11px] text-black/30">
            Comma-separated URLs or project names.
          </p>
        </FormField>
      </div>

      {/* Project description */}
      <div className="mt-5">
        <FormField label="Project description (optional)">
          <textarea
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            maxLength={MAX_PROJECT_DESC + 50}
            rows={3}
            className={`${inputClasses(false)} resize-y`}
          />
          <div className="mt-1 text-right text-[11px] text-black/35">
            {projectDescription.length}/{MAX_PROJECT_DESC}
          </div>
        </FormField>
      </div>

      {/* CTAs */}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="group flex items-center gap-2 rounded-sm border border-black/10 px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-black/60 transition-all hover:border-black/25 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="apply-btn-primary group flex items-center gap-2 rounded-sm bg-black px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-all hover:gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
        >
          Continue to review
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STEP 3 — Review & Submit
   ═══════════════════════════════════════════════════════════ */
function Step3Review({
  fullName,
  email,
  phone,
  yearsOfExperience,
  portfolioUrl,
  resume,
  coverNote,
  roleName,
  selectedSkills,
  primaryLanguage,
  selectedFrameworks,
  experienceLevel,
  projectHighlights,
  projectDescription,
  status,
  onBack,
  onEdit,
  onSubmit,
}: {
  fullName: string;
  email: string;
  phone: string;
  yearsOfExperience: string;
  portfolioUrl: string;
  resume: File | null;
  coverNote: string;
  roleName: string;
  selectedSkills: string[];
  primaryLanguage: string;
  selectedFrameworks: string[];
  experienceLevel: string;
  projectHighlights: string;
  projectDescription: string;
  status: "idle" | "sending" | "success";
  onBack: () => void;
  onEdit: (step: number) => void;
  onSubmit: () => void;
}) {
  return (
    <div>
      <p className="mb-6 text-[13px] leading-relaxed text-black/50">
        Review your information below before submitting. Click a section header
        to go back and edit.
      </p>

      {/* Personal Information */}
      <ReviewSection title="Personal information" onEdit={() => onEdit(0)}>
        <ReviewRow label="Full name" value={fullName} />
        <ReviewRow label="Email" value={email} />
        {phone && <ReviewRow label="Phone" value={phone} />}
        <ReviewRow label="Years of experience" value={yearsOfExperience} />
        {portfolioUrl && <ReviewRow label="Portfolio URL" value={portfolioUrl} />}
      </ReviewSection>

      {/* Role */}
      <ReviewSection title="Selected role" onEdit={() => onEdit(0)}>
        <ReviewRow label="Role" value={roleName} />
      </ReviewSection>

      {/* Skills & Experience */}
      <ReviewSection title="Skills & experience" onEdit={() => onEdit(1)}>
        <div className="py-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/35">
            Skills
          </span>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {selectedSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-sm border border-black/10 bg-black/[0.03] px-2.5 py-1 text-[11px] font-medium text-black/70"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        <ReviewRow label="Primary language" value={primaryLanguage} />
        {selectedFrameworks.length > 0 && (
          <div className="py-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/35">
              Frameworks & tools
            </span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {selectedFrameworks.map((fw) => (
                <span
                  key={fw}
                  className="rounded-sm border border-black/10 bg-black/[0.03] px-2.5 py-1 text-[11px] font-medium text-black/70"
                >
                  {fw}
                </span>
              ))}
            </div>
          </div>
        )}
        <ReviewRow label="Experience level" value={experienceLevel} />
      </ReviewSection>

      {/* Portfolio & Projects */}
      {(projectHighlights || projectDescription) && (
        <ReviewSection title="Projects" onEdit={() => onEdit(1)}>
          {projectHighlights && (
            <ReviewRow label="Project links" value={projectHighlights} />
          )}
          {projectDescription && (
            <ReviewRow label="Description" value={projectDescription} />
          )}
        </ReviewSection>
      )}

      {/* Resume */}
      <ReviewSection title="Resume" onEdit={() => onEdit(0)}>
        {resume && (
          <div className="flex items-center gap-3 py-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-sm"
              style={{ background: "#D9B77A" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-medium text-black">{resume.name}</p>
              <p className="text-[11px] text-black/40">{formatFileSize(resume.size)}</p>
            </div>
          </div>
        )}
      </ReviewSection>

      {/* Motivation */}
      {coverNote && (
        <ReviewSection title="Motivation" onEdit={() => onEdit(0)}>
          <p className="py-2 text-[13px] leading-relaxed text-black/70">
            "{coverNote}"
          </p>
        </ReviewSection>
      )}

      {/* CTAs */}
      <div className="mt-8 flex items-center justify-between border-t border-black/[0.06] pt-6">
        <button
          type="button"
          onClick={onBack}
          className="group flex items-center gap-2 rounded-sm border border-black/10 px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-black/60 transition-all hover:border-black/25 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={status === "sending"}
          className="apply-btn-submit group flex items-center gap-2 rounded-sm px-8 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-black transition-all disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
          style={{ background: "#D9B77A" }}
        >
          {status === "sending" ? (
            <span className="inline-flex items-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="opacity-25"
                />
                <path
                  d="M4 12a8 8 0 018-8"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              Submitting…
            </span>
          ) : (
            <>
              Submit application
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SHARED UI COMPONENTS
   ═══════════════════════════════════════════════════════════ */

/** Standard input classes */
function inputClasses(hasError: boolean): string {
  return `w-full rounded-sm border bg-white px-3.5 py-3 text-[13px] text-black placeholder:text-black/25 transition-colors focus:outline-none ${
    hasError
      ? "border-2 border-black"
      : "border-black/10 focus:border-black/30"
  }`;
}

/** Reusable field wrapper */
function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-1.5">
      <label className="block text-[12px] font-semibold text-black">
        {label}{" "}
        {required && (
          <span aria-hidden="true" className="text-black/40">
            *
          </span>
        )}
      </label>
      {children}
      {error && <ErrorMessage id={`err-${label.toLowerCase().replace(/\s+/g, "-")}`} msg={error} />}
    </fieldset>
  );
}

/** Review section with edit button */
function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-black/[0.06] py-4">
      <div className="flex items-center justify-between">
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/40">
          {title}
        </h4>
        <button
          type="button"
          onClick={onEdit}
          className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/30 transition-colors hover:text-black"
        >
          Edit
        </button>
      </div>
      <div className="mt-1">{children}</div>
    </div>
  );
}

/** Single review row */
function ReviewRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-black/35">
        {label}
      </span>
      <span className="text-right text-[13px] font-medium text-black/80">
        {value}
      </span>
    </div>
  );
}

/** Error message — black icon + bold text */
function ErrorMessage({ id, msg }: { id: string; msg: string }) {
  return (
    <p
      id={id}
      className="mt-1.5 flex items-center gap-1.5 text-[12px] font-bold text-black"
      role="alert"
    >
      <span
        className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-black text-[9px] font-bold leading-none text-white"
        aria-hidden="true"
      >
        !
      </span>
      {msg}
    </p>
  );
}
