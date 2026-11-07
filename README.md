# Bobby Claridad — Portfolio

A one-page, animated portfolio for **Bobby Claridad**, Klaviyo & Shopify Specialist: Klaviyo flows,
segments, campaigns, loyalty/rewards journeys, email design, A/B testing and integrations, plus Shopify
customization in Liquid, GemPages and other page builders.

- **Design and motion** are reconstructed from the reference site [hirejps.com](https://www.hirejps.com/):
  black ground, red aurora accents, Space Grotesk / Inter / JetBrains Mono, scrambled `// labels`,
  word-mask heading reveals, a pinned scroll-driven services scene and the same section rhythm. The
  background is a still glow (no moving pattern).
- **Content** comes from Bobby's résumé, the lifecycle case study and the Klaviyo screenshots in
  `assests/`. Hero numbers are factual: 4+ years (résumé), 6 e-commerce roles and 5+ page builders.
  Project figures are **illustrative** (the owner chose not to publish real account numbers); the folder
  shows an "Illustrative figures" badge and a footnote says so. Testimonials are four short founder quotes (Primal Krisp, Stone Systems, Capsule Factory, Elevation Health) drafted for each founder to approve.
- **Day / night mode** — a toggle in the navbar switches palettes (`:root[data-theme='light']` in
  `src/index.css`); the choice is stored in `localStorage` and applied before paint by a script in
  `index.html`. Mock app windows (code editor, flow canvas, hero map) keep a dark look via `.force-dark`.
- **Navbar** is not sticky: it slides away while scrolling down and returns on any scroll up.

## Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Build | Vite 5 + TypeScript | The folder had no existing code. Vite gives a fast dev server and a small static build that any host can serve. |
| UI | React 18 | The reference is a React app; matching it keeps component boundaries and motion behaviour comparable. |
| Styling | Tailwind CSS 3 + CSS custom properties | The reference uses Tailwind with HSL tokens; the same token names make its values portable. |
| Motion | Framer Motion 11 | Needed for spring physics, scroll-linked transforms (`useScroll`), shared-layout nav underline and exit animations — the reference's exact techniques. |
| Smooth scroll | Lenis | The reference uses it; turned off for touch devices and reduced motion. |
| Icons / fonts | lucide-react, @fontsource (self-hosted) | No third-party font requests at runtime. |
| Tests | Vitest + Testing Library, Playwright | Unit/behaviour tests in jsdom; end-to-end tests against the production build. |

## Getting started

Requirements: Node 18+ (tested on Node 26) and npm.

```bash
npm install
npm run dev          # http://localhost:5173
```

No environment variables or API keys are needed — the site is fully static.

> npm 11 may block esbuild's install script. If `npm run dev` complains about esbuild, run
> `npm install-scripts approve esbuild && npm rebuild esbuild`.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type-check (`tsc -b`) and build to `dist/` |
| `npm run preview` | Serve the production build at http://localhost:4173 |
| `npm test` | Unit and behaviour tests (Vitest) |
| `npm run test:e2e` | Playwright tests against the production build (builds and starts the preview server automatically) |
| `npm run test:all` | Unit tests, build, then e2e |

### End-to-end browser

Playwright uses the locally installed **Microsoft Edge** by default (`PW_CHANNEL=msedge`), so no browser
download is needed on Windows. Alternatives:

```bash
PW_CHANNEL=chrome npm run test:e2e                              # installed Google Chrome
npx playwright install chromium && PW_CHANNEL=chromium npm run test:e2e   # bundled Chromium (CI)
```

## Deployment

**Live site:** https://claridadbobbyjr-code.github.io/bobby-claridad-portfolio/ (GitHub Pages, served from the `gh-pages` branch).

To publish changes: commit and push to `main`, then run

```bash
npm run deploy
```

It builds with `BASE_PATH=/bobby-claridad-portfolio/` (so every asset URL gets the repo sub-path via
`asset()` in `src/content/site.ts`) and force-pushes `dist/` to `gh-pages`. GitHub updates the site within a
minute or two. Local `npm run dev` / `build` still serve from `/`.

Elsewhere: `npm run build` produces a static site in `dist/` for Vercel / Netlify (output directory `dist`)
or any static host at the domain root.

The site is a single page using in-page `#anchors`, so no rewrite rules are required.

## Project structure

```
index.html                 HTML shell: title, meta description, skip link, noscript fallback
public/
  Bobby-Claridad-Resume.pdf  Résumé served for the download buttons
  projects/                  Klaviyo screenshots (WebP, client figures blurred in the files)
  favicon.svg
src/
  main.tsx                 Entry: fonts, global CSS, <App/>
  App.tsx                  Page composition and section order
  index.css                Design tokens (CSS variables) and shared component classes
  content/site.ts          ALL copy and data (profile, services, experience, skills, links)
  lib/
    motion.ts              Motion tokens and Framer variants (durations, easing, staggers)
    icons.ts               Icon-name → lucide component map used by content
    scroll.ts              scrollToId(): smooth scroll + URL hash + focus management
  hooks/
    useActiveSection.ts    Which section is in view (drives the nav underline)
    useLenis.ts            Smooth scrolling setup/teardown
    useMediaQuery.ts       Responsive switches in JS (e.g. pinned scene only ≥1024px)
  components/              Reusable building blocks
    Navbar, Footer, Logo, BackToTop, ScrollProgress, Backdrop,
    SectionHeader, RevealHeading, ScrambleText, CountUp, Magnetic, FeatureCard, NodeCard
  sections/                One file per page section (see table below)
tests/
  setup.ts                 jsdom shims (IntersectionObserver, matchMedia…)
  unit/                    page structure, content, navigation, interactions, animation logic
e2e/site.spec.ts           Browser tests: order, links, animations, pinning, hover, menus, overflow
tailwind.config.ts         Maps Tailwind colours/fonts to the CSS variables
playwright.config.ts       Desktop (1440) and mobile (390) projects
```

### Sections

The menu has six links: About, Services, Experience, Projects, Testimonials, Contact. Klaviyo, Shopify
and Process sit between Services and Experience, so "Services" stays highlighted while they are on screen.

| # | Section (`id`) | Notes |
| --- | --- | --- |
| 1 | Hero (`home`) | Animated Shopify → Klaviyo system map: order → profile sync → tier split → post-purchase / rewards → A/B test → repeat order. |
| 2 | About (`about`) | Headshot portrait (`public/bobby-claridad.webp`), e-commerce highlights, story, résumé download. |
| 3 | Services (`services`) | Six cards; pinned 300vh fly-in scene on desktop (≥1024 wide, ≥740 tall), static grid elsewhere. |
| 4 | Klaviyo (`klaviyo`) | Flow chips, behaviour/branching/segments/A/B points, buyer-aware checkout flow mock. |
| 5 | Shopify (`shopify`) | Page-builder chips (GemPages, PageFly, Shogun, Replo, EComposer), Liquid code panel that types in. |
| 6 | Process (`process`) | Audit → Plan → Build → QA & A/B Test → Report. |
| 7 | Experience (`experience`) | Tab viewer of the six e-commerce roles. |
| 8 | Projects (`projects`) | Tabbed project folder: six samples (lifecycle program, checkout recovery with revenue-by-message bars, quiz welcome, rewards welcome, rewards segments, October campaigns), each with a headline number, counting stats and a screenshot with client figures blurred; tools panel below. |
| 8b | Email designs (`emails`) | Seven full-length email designs as an expanding-panel gallery: hover or tap a slim panel to open it wide (the design pans top to bottom), click the open panel to read it in a full-length viewer. Stacks vertically on phones. No brand labels. Not in the menu. |
| 9 | Testimonials (`testimonials`) | Founder cards from `testimonials.items` (photo, name, company, short quote); "references on request" card if emptied. |
| 10 | Contact (`contact`) | "Book a 30-min call" (Calendly) first, then WhatsApp, Discord (copy username), email, call. The Email button (also in the footer) opens a small list: write in Gmail, Outlook or the visitor’s own mail app, each a new message to Bobby with subject and brief filled in, or copy the address. |

## Maintenance guide

**Update personal info** — edit `profile` in `src/content/site.ts` (name, title, email, phone, location,
résumé path). Email links everywhere are generated from it.

**Replace the résumé** — overwrite `public/Bobby-Claridad-Resume.pdf` (keep the name, or change
`profile.resume`).

**Headshot** — `public/bobby-claridad.webp` (640×800). To swap it, replace that file or change
`const photo` at the top of `src/sections/About.tsx`; set it to `null` to show the monogram instead.

**Add / remove services** — edit `services.items`. The pinned scene is laid out for six cards in a 3×2
grid (`grid-cols-3` and the timing `0.05 + i * 0.12` in `src/sections/Services.tsx`); with a different
count, adjust both.

**Add testimonials** — add to `testimonials.items` (`quote`, `name`, `role`, optional `company`, `photo`). Photos are square WebP crops in `public/testimonials/`. Only publish quotes the person has approved.

**Add or edit project samples** — each folder tab is an entry in `projects.samples` (`headline`, `stats`, `visual`). Figures are illustrative; keep them internally consistent (a unit test checks totals, shares and averages) and keep the "Illustrative figures" badge and footnote. Screenshots go in `public/projects/` with real `width`/`height` and descriptive `alt`; blur client text and figures in the image file itself before adding it (CSS blur can be undone by opening the image); the text-only blur script keeps boxes and connectors sharp.

**Add an email design** — run the render through the email image script (sharpened; 600px designs saved at 1200px, plus a 640px thumbnail) into `public/emails/`, then add an entry to `emailDesigns.items` with its real `width`/`height`.

**Add a partner logo** — save a one-colour (black on transparent) PNG and the original-colour PNG (same trim and size, `-colour` suffix) in `public/partners/`, then add both to `partners.items`; `h` sets the display height so marks and wordmarks look balanced. At rest CSS shows the one-colour mark (white at night, black by day); on hover the original fades in on a white tile, or on `tile` for light logos.

**Change the booking link** — `profile.calendly` in `content/site.ts`. Every "Hire Me", "Book a Call" and project CTA spreads `bookingLink`, so they all follow.

**Update the case study** — edit the `lifecycle` and `checkout` samples and `projects.checkoutBars`.

**Change icons** — add the lucide icon to `src/lib/icons.ts`, then reference its key in content.

**Modify navigation** — edit `navItems`. Each `id` must match a section's `id`; a unit test fails if a
nav item points nowhere.

**Adjust animations** — durations, easings and staggers live in `src/lib/motion.ts`; CSS loops (button
sheen, glow pulse, chip glow) live at the bottom of `src/index.css`. Pinned-scene timing is in
`Services.tsx`; the still background glow is in `components/Backdrop.tsx`.

**Update design tokens** — colours, radius and the aurora gradient are CSS variables at the top of
`src/index.css` (HSL triplets, so Tailwind's `/opacity` modifiers keep working). Fonts are set in
`tailwind.config.ts` and imported in `src/main.tsx`.

## Accessibility & performance notes

- One `h1`; every section is a labelled landmark with an `h2`. Skip link to `#main`.
- Animated headings and labels expose their full text to screen readers (`sr-only`), with the animated
  copies `aria-hidden`.
- Mobile menu: `aria-expanded`, `aria-controls`, Escape to close with focus return. Experience viewer
  follows the WAI-ARIA tabs pattern (arrows, Home/End, roving tabindex). Accordion uses buttons with
  `aria-expanded` + labelled regions.
- `prefers-reduced-motion`: no smooth scrolling, no pinned scene, no travel or loops; content fades in
  only.
- Project folder follows the WAI-ARIA tabs pattern (arrow keys, Home/End, roving tabindex) plus previous/next
  buttons. Screenshots are lazy-loaded WebP with real width/height and descriptive alt text.
- Fonts are self-hosted with `unicode-range` subsets; JS is ~118 kB gzipped.

## Known limitations

- **Booking calls** open Calendly in a new tab rather than an embedded popup, so no third-party script loads on the page.
- **Discord** has no public link by username, so the site copies the username instead of linking.
- **AI chat widget ("Max")** from the reference is not reproduced: it needs a live AI backend, and a
  non-working widget would break the "no placeholder interactions" rule.
- **Testimonials** were written for the founders, not by them: get each founder's OK on the wording before going live.
- **Screenshots** show real flow and campaign structure. Flow canvases keep their step labels readable with only figures blurred; the segments and campaigns lists have figures blurred and names/audiences softened with a light text blur.
- The phone number from the résumé is shown publicly in Contact — remove `phone` usage in
  `sections/Contact.tsx` if you prefer email only.
- The reference's design language (gradient text, glows, mono labels, numbered steps, glass nav) was kept
  for fidelity, even where it conflicts with the house rules in the bundled `SKILL.md` taste guide. That
  skill's scripts (`draw.mjs`, `inspect.mjs`) are not present in this folder, so its inspector was not run.
