/**
 * applications.ts — Application submission service stub
 * ────────────────────────────────────
 * TODO: Replace the simulated delay with a real POST request.
 *       Endpoint: POST /api/applications (multipart/form-data)
 *       See README.md for integration instructions.
 */

export interface ApplicationPayload {
  /** The role slug the user is applying for, e.g. "frontend" or "general" */
  role: string;
  /** Full name (required) */
  fullName: string;
  /** Email address (required) */
  email: string;
  /** Phone number (optional) */
  phone?: string;
  /** Years of professional experience (required) */
  yearsOfExperience: number;
  /** Portfolio, GitHub, or LinkedIn URL (optional) */
  portfolioUrl?: string;
  /** Uploaded resume file — PDF or DOC, max 5 MB (required) */
  resume: File;
  /** "Why do you want to join Peoplix?" — max 500 chars */
  coverNote: string;
  /** Selected technical skills from Step 2 */
  skills?: string[];
  /** Primary programming language from Step 2 */
  primaryLanguage?: string;
  /** Frameworks and tools from Step 2 */
  frameworks?: string[];
  /** Experience level label from Step 2 */
  experienceLevel?: string;
  /** Portfolio / project highlight URLs from Step 2 */
  projectHighlights?: string;
  /** Optional project description from Step 2 */
  projectDescription?: string;
}

/**
 * Submit an application.
 *
 * Currently logs the payload and resolves after a short delay.
 *
 * TODO: Wire to POST /api/applications with multipart/form-data:
 * ```ts
 * const form = new FormData();
 * form.append("role", payload.role);
 * form.append("fullName", payload.fullName);
 * form.append("email", payload.email);
 * if (payload.phone) form.append("phone", payload.phone);
 * form.append("yearsOfExperience", String(payload.yearsOfExperience));
 * if (payload.portfolioUrl) form.append("portfolioUrl", payload.portfolioUrl);
 * form.append("resume", payload.resume);
 * form.append("coverNote", payload.coverNote);
 *
 * const res = await fetch("/api/applications", { method: "POST", body: form });
 * if (!res.ok) throw new Error(await res.text());
 * return res.json();
 * ```
 */
export async function submitApplication(
  payload: ApplicationPayload
): Promise<{ success: true; message: string }> {
  // eslint-disable-next-line no-console
  console.log("[submitApplication] Payload:", {
    ...payload,
    resume: `${payload.resume.name} (${(payload.resume.size / 1024).toFixed(1)} KB)`,
  });

  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    success: true,
    message: "Application received — we'll be in touch.",
  };
}
