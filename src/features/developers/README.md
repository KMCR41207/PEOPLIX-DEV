# Developers Page — Integration Guide

## Overview

Self-contained **Developers** page for [Peoplix](https://peoplix.ai).  
Lives entirely inside `src/features/developers/` and exports one component: `<DevelopersPage />`.

---

## Folder structure

```
src/features/developers/
├── DevelopersPage.tsx          ← top-level component (mount at /developers)
├── components/
│   ├── Nav.tsx                 ← swappable via showNav prop
│   ├── Hero.tsx                ← giant "Developers" headline
│   ├── CategoryList.tsx        ← role accordion (reads ?role= query param)
│   ├── RoleDetail.tsx          ← expanded role panel
│   ├── ApplyModal.tsx          ← application form modal (lazy-loaded)
│   ├── AboutSection.tsx        ← about Peoplix points
│   ├── ClosingCta.tsx          ← open application CTA
│   └── Footer.tsx              ← swappable via showFooter prop
├── data/
│   ├── roles.ts                ← all role content
│   └── aboutContent.ts         ← all about-section points ([FILL] placeholders)
├── services/
│   └── applications.ts         ← submitApplication() stub
└── README.md                   ← this file
```

---

## How to merge into the main site

### 1. Copy the folder

Copy `src/features/developers/` into your main project's `src/features/` directory.

### 2. Add the route

In your router config (e.g. `App.tsx` or `routes.tsx`):

```tsx
import DevelopersPage from "./features/developers/DevelopersPage";

// React Router example:
<Route path="/developers" element={<DevelopersPage />} />

// To use your site's own nav and footer:
<Route
  path="/developers"
  element={<DevelopersPage showNav={false} showFooter={false} />}
/>
```

### 3. Add Tailwind design tokens

In your `tailwind.config.ts` (or CSS `@theme` block), add:

```css
@theme {
  --color-peoplix-beige: #D9B77A;
  --font-display: "Inter Tight", "Inter", system-ui, sans-serif;
}
```

Or in `tailwind.config.ts`:

```ts
export default {
  theme: {
    extend: {
      colors: {
        "peoplix-beige": "#D9B77A",
      },
      fontFamily: {
        display: ['"Inter Tight"', "Inter", "system-ui", "sans-serif"],
      },
    },
  },
};
```

### 4. Dependencies

Ensure these are installed in the main project:

```bash
npm install framer-motion react-router-dom
```

The page also uses **Inter Tight** and **Inter** from Google Fonts — loaded via `<link>` in `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@700;800;900&family=Inter:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

### 5. Wire the Apply API

Open `src/features/developers/services/applications.ts`.  
The `submitApplication()` function currently logs + resolves after a delay.  
Replace the body with a real `POST /api/applications` (multipart/form-data).  
See the TODO in that file for the exact `FormData` construction.

### 6. Fill in placeholders

- **About points:** Edit `data/aboutContent.ts` — replace every `[FILL]` with your real content.
- **Role meta:** In `data/roles.ts`, replace `[FILL]` values for experience, work type, and location.

---

## Design tokens

| Token              | Value      | Usage                                             |
|--------------------|------------|---------------------------------------------------|
| `--color-peoplix-beige` | `#D9B77A`  | Accent: buttons, hover fills, chips, underlines   |
| `--font-display`   | Inter Tight | Headlines (700–900, tight tracking)              |
| Body font          | Inter       | All body text                                     |

Only three colors are used: `#FFFFFF` (white), `#000000` (black), `#D9B77A` (beige).

---

## Accessibility

- Semantic landmarks (`<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`)
- Single `<h1>` ("Developers")
- Visible focus rings: black outline with beige offset
- Full keyboard support: Enter/Space to toggle roles, Esc to close
- `aria-expanded`, `aria-controls`, `aria-modal`, `role="dialog"`
- Focus trap in modal
- `prefers-reduced-motion` respected — animations disabled
- WCAG AA contrast ratios (black text on white, black text on beige)
