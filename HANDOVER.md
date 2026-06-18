# Busara Labs — busaralabs.com

## Engineering Handover & Technical Documentation

**Version:** RC‑1 (Release Candidate) · June 2026
**Owner:** Busara Infrastructure & Technology Labs Ltd · Nairobi, Kenya
**Classification:** Public site, internal handover doc

---

## 1. Executive summary

`busaralabs.com` is a **static, dependency‑free, multi‑page marketing/institutional website**. It is built with hand‑authored **HTML + CSS + one vanilla JavaScript file** (`main.js`) plus a set of small **data files**. There is **no framework, no build step, no bundler, no package manager, and no runtime dependency**. You can open any `.html` file directly in a browser and it works.

The guiding architectural principle is **institutional restraint**: lean code, progressive enhancement (everything readable with JS disabled), self‑hosted assets, and a single shared design‑token system so every page reads as one institution.

> If you remember one rule: **content and structure live in HTML, presentation lives in CSS tokens, behaviour lives in `main.js`, and page content for the interactive sections lives in `assets/js/data-*.js`. Never cross those streams.**

---

## 2. Technology stack

| Layer | Technology | Notes |
|---|---|---|
| Markup | HTML5, semantic | 11 standalone pages, each self‑contained |
| Styling | Plain CSS, custom properties (design tokens) | No preprocessor, no PostCSS, no utility framework |
| Behaviour | Vanilla ES5‑compatible JavaScript | Single IIFE in `main.js`, loaded `defer` on every page |
| Data | Plain JS files assigning to `window.BUSARA_*` globals | One per interactive section |
| Fonts | Self‑hosted WOFF2 (Latin subset) | No Google Fonts CDN — visitor IP never leaves to a third party |
| Canvas | 2D `<canvas>` + `requestAnimationFrame` | The ambient "node‑network" background |
| Hosting | Cloudflare Pages (static) | `_redirects`, `_headers` are Cloudflare Pages conventions |
| Analytics | Cloudflare Web Analytics (cookieless) | No cookies, no PII, declared in legal pages |

**Explicit non‑goals:** no React/Vue/Svelte, no jQuery, no Tailwind/Bootstrap, no npm, no TypeScript, no SSR, no CMS. Keep it that way — it is a deliberate architectural decision, not a limitation.

**Browser support:** evergreen browsers. Uses `IntersectionObserver`, `matchMedia`, `backdrop-filter`, CSS `clamp()`, CSS grid, `requestAnimationFrame` — all with graceful fallbacks (see §10).

---

## 3. Directory structure

```
busaralabs-website/
├── index.html              # Home
├── about.html              # About
├── work.html               # Our Work (infrastructure domains)
├── paamoja.html            # Paamoja (flagship initiative)
├── research-journal.html   # Research Journal
├── contact.html            # Contact
├── privacy-policy.html     # Legal
├── terms-of-service.html   # Legal
├── cookie-policy.html      # Legal
├── disclaimer.html         # Legal
├── 404.html                # Error page (noindex)
│
├── assets/
│   ├── css/
│   │   ├── styles.css       # ENTRY POINT — @import list only, linked by every page
│   │   ├── fonts.css        # @font-face declarations (self-hosted WOFF2)
│   │   ├── colors.css       # Color tokens
│   │   ├── typography.css   # Type tokens (families, scale, tracking)
│   │   ├── spacing.css      # Spacing, radii, motion tokens
│   │   ├── base.css         # Reset + element defaults + helper classes
│   │   └── components.css    # All component + section + layout styles (~1.8k lines)
│   │
│   ├── js/
│   │   ├── main.js          # THE engine — all behaviour for every page
│   │   ├── data-methodology.js   # Home  → window.BUSARA_METHODOLOGY
│   │   ├── data-convictions.js   # About → window.BUSARA_CONVICTIONS
│   │   ├── data-thinking.js      # About → window.BUSARA_THINKING (orbit)
│   │   ├── data-infrastructure.js# Work  → window.BUSARA_INFRASTRUCTURE
│   │   ├── journey-data.js       # Paamoja → window.BUSARA_JOURNEY
│   │   ├── data-journal.js       # Research Journal → window.BUSARA_JOURNAL
│   │   └── data-social.js        # Contact → window.BUSARA_SOCIAL
│   │
│   ├── fonts/               # Self-hosted WOFF2, subsetted to Latin
│   │   ├── dm-serif-display/        DMSerifDisplay-Regular.woff2 (400)
│   │   ├── plus-jakarta-sans/       Light/Regular/Medium/SemiBold/ExtraBold (300–800)
│   │   └── ibm-plex-mono/           Light/Regular/Medium (300–500)
│   │
│   └── images/
│       ├── logo/            busara-labs-mark.svg, busara-labs-mark-light.svg,
│       │                    favicon.svg, paamoja-mark.svg, paamoja-mark-32.svg
│       ├── icons/           icon-192.png, icon-512.png (PWA)
│       └── og-image.png     1200×630 social card
│
├── _redirects              # Cloudflare Pages routing (clean URLs + 404 fallback)
├── _headers                # Cloudflare Pages security + caching headers
├── robots.txt
├── sitemap.xml
├── site.webmanifest        # PWA manifest
└── HANDOVER.md             # This document
```

---

## 4. CSS architecture

### 4.1 Load order (critical)

Every page links exactly one stylesheet: `assets/css/styles.css`. That file is an **import manifest only** — keep it that way:

```css
@import url('fonts.css');       /* @font-face */
@import url('colors.css');      /* color tokens   (:root) */
@import url('typography.css');  /* type tokens    (:root) */
@import url('spacing.css');     /* spacing/motion (:root) */
@import url('base.css');        /* reset + element defaults + helpers */
@import url('components.css');  /* everything else */
```

Order matters: tokens must be declared before `base.css`/`components.css` consume them.

### 4.2 Token layers

All visual decisions resolve to CSS custom properties on `:root`. **Do not hard‑code colors, font families, or section spacing in component rules** — reference a token.

**Colors** (`colors.css`) — base brand palette + derived tints + *semantic aliases*:
- `--color-deep-navy #001A33` (primary, dominates), `--color-warm-gold #C9A84C` (structural accent), `--color-warm-white #F8F6F1` (page ground), `--color-paamoja-gold #FFBF00` (Paamoja only), `--color-charcoal #1C1B1B` (Paamoja "portal" dark).
- Semantic aliases are what components actually use: `--text-on-light`, `--text-on-light-muted`, `--text-on-dark`, `--text-on-dark-muted`, `--text-accent`, `--surface-page`, `--border-subtle`, `--border-subtle-dark`, `--focus-ring`, etc.

**Typography** (`typography.css`) — three families, fluid scale:
- `--font-display` = DM Serif Display (headings, heroes, pull quotes)
- `--font-body` = Plus Jakarta Sans (body, nav, labels; weights 300/400/500/600/800)
- `--font-mono` = IBM Plex Mono (emails, domains, category labels, taglines; weights 300/400/500)
- Fluid sizes via `clamp()`: `--type-hero` (44→72px), `--type-page` (36→56px), `--type-section` (30→40px), `--type-display-xl` (112→200px for the 404). Body never below 16px.

**Spacing / layout / motion** (`spacing.css`):
- 8px base scale `--space-1…--space-10`.
- `--section-pad-y: clamp(4rem, 2rem + 8vw, 8rem)` — the section rhythm (64→128px).
- `--content-max: 1200px`, `--gutter: clamp(1.25rem, 0.5rem + 3vw, 3rem)`, `--measure: 68ch`.
- Radii: `--radius-sm 2px`, `--radius-md 4px` (largest UI radius), `--radius-pill 999px`. Marks have no rounding.
- Motion: `--ease-out: cubic-bezier(0.22,1,0.36,1)`, `--dur-fast 180ms`, `--dur-base 280ms`, `--dur-reveal 420ms`. **All transitions/animations use these tokens** — keep new motion on the same language.

### 4.3 Naming convention

BEM‑ish, all prefixed `bl-` (Busara Labs):
`bl-block`, `bl-block__element`, `bl-block--modifier`. State classes are unprefixed and toggled by JS: `is-open`, `is-active`, `is-selected`, `is-revealed`, `is-current`, `is-flow`, `is-dim`, `is-paused`, `is-exploring`. The JS‑enabled flag is `bl-js` on `<html>` (set immediately by `main.js`); progressive‑enhancement styles are gated on it.

### 4.4 Layout primitives (the spine)

- `.bl-wrap` — the **one shared content container** (max‑width 1200px, auto‑centered, `--gutter` side padding). Optional `.bl-wrap--narrow` caps at 760px for long‑form.
- `.bl-section-pad` — full section padding (top **and** bottom).
- `.bl-section-pad-b` — **bottom padding only**. ⚠️ See the rule below.
- `.bl-page-hero` — hero/title block with extra top room beneath the sticky nav.
- `.bl-bg-navy` / `.bl-bg-white` / `.bl-bg-charcoal` — the three background surfaces. **Two backgrounds per page maximum.**
- `.bl-two-col` — the standard two‑column section grid (section header left, content right). Collapses to one column at 860px.

> ### ⚠️ The section‑padding rule (read before adding/reordering sections)
> A section that **follows a different background color** MUST use `.bl-section-pad` (it needs top padding, otherwise its content sits flush against the color seam — this was a real RC‑1 bug). `.bl-section-pad-b` (bottom‑only) is **only** safe when the section directly follows a **same‑color** section, whose bottom padding already provides the gap. This avoids both *clipped* seams (no top padding at a color change) and *doubled* gaps (two same‑color sections each padding the join). The **About page is the reference implementation** — match its rhythm.

---

## 5. JavaScript architecture

### 5.1 `main.js` — one file, one IIFE, runs on every page

Loaded `<script src="assets/js/main.js" defer>`. It is feature‑detecting and idempotent: each `init*` function no‑ops if its target elements aren't on the current page, so the **same script ships to all 11 pages**. Entry point at the bottom runs all initializers on `DOMContentLoaded`.

| Function | Responsibility |
|---|---|
| `initErrorTracking()` | Console‑only error/rejection logging. Never logs user input or emails. |
| `initNavScroll()` | Adds `.bl-nav--scrolled` past 50px scroll (solid nav + backdrop blur). rAF‑throttled. |
| `initMobileMenu()` | Hamburger ↔ full‑screen overlay. Scroll‑lock + backdrop‑filter handling (see §7). |
| `initAmbientNetwork()` → `initNodeNetwork()` | Injects a `<canvas>` into every `.ambient-network` host and animates the node field. |
| `initVerticalExplorers()` → `VerticalExplorer()` | ONE reusable component powering 4 sections from data (see §6). |
| `initOrbit()` | The About "How We Think" circular orbital model. |
| `initSocial()` | Renders Contact social links from `BUSARA_SOCIAL` (only `enabled` ones). |
| `initJournal()` | Renders Research Journal entries from `BUSARA_JOURNAL`. |
| `initEcosystem()` | Paamoja four‑element pipeline (HuruMarket → Duka → Tuma → e‑pay). |
| `initAutoReveal()` | Tags content with `.reveal-up` in JS (keeps HTML lean) + assigns stagger indices. |
| `initScrollReveal()` | `IntersectionObserver` adds `.is-revealed` to reveal targets. |
| `initEntrance()` | Hero entrance sequence (`data-enter` items rise in, staggered, on first paint). |

`var prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches` gates **all** non‑essential motion.

### 5.2 Data files — content for interactive sections

Each interactive section is **data‑driven**. The page loads only the one or two data files it needs, *before* `main.js`:

| Page | Data file(s) | Global | Powers |
|---|---|---|---|
| Home | `data-methodology.js` | `BUSARA_METHODOLOGY` | "From Observation to Action" explorer |
| About | `data-convictions.js`, `data-thinking.js` | `BUSARA_CONVICTIONS`, `BUSARA_THINKING` | Convictions explorer + orbital model |
| Our Work | `data-infrastructure.js` | `BUSARA_INFRASTRUCTURE` | Infrastructure‑domains explorer |
| Paamoja | `journey-data.js` | `BUSARA_JOURNEY` | Institutional development journey |
| Research Journal | `data-journal.js` | `BUSARA_JOURNAL` | Journal entries |
| Contact | `data-social.js` | `BUSARA_SOCIAL` | Outbound social links |

Each is a plain array of objects assigned to a `window.BUSARA_*` global with a documented shape (see the header comment in each file). **To change copy in an interactive section, edit ONLY its data file** — no HTML or `main.js` change required.

> Note: em dashes and middots inside data files use JS string escapes (`\u2014`, `\u00B7`) — that is correct, they render as real glyphs. **Never** paste a literal `\u2014` into an HTML file (it would render as the text `\u2014`).

---

## 6. The reusable interactive components

Three of the site's "explorer" sections are the **same component** (`VerticalExplorer`) driven by different data + a small render config — a deliberate consolidation so behaviour is identical everywhere:

- A vertical stack of rows on a shared spine + a sticky live detail panel.
- Hover/focus previews a row; click pins it; Arrow keys + Enter move focus; panel re‑renders for the active row.
- `variant: 'light' | 'dark'` switches surface + accent entirely through `--vx-*` custom properties.
- No‑JS: a static `.bl-vx-fallback` paragraph inside each host is shown; JS clears it and builds the interactive structure.

The **orbital model** (About) and the **ecosystem pipeline** (Paamoja) are bespoke but follow the same patterns (status classes toggled by JS, reduced‑motion respected, keyboard accessible, no‑JS fallback present).

**Accessibility of explorers:** rows are `role="tab"` in a `role="tablist"`, the panel is `role="tabpanel" aria-live="polite"`, roving `tabindex`, full arrow‑key navigation.

---

## 7. Header & mobile navigation (recently hardened)

### Desktop nav
Sticky (`position: sticky; top: 0; z-index: 50`). Transparent over hero; gains `.bl-nav--scrolled` (solid `rgba(0,26,51,0.92)` + `backdrop-filter: blur`) past 50px. Active page marked with `.bl-nav-link--active` (warm‑gold underline). Link hover slides a 1px gold underline in.

### Mobile menu (full‑screen overlay)
Collapses at **860px** (`.bl-nav-links`/`.bl-nav-email` hidden, `.bl-nav-burger` shown). Burger opens `.bl-mobile-overlay` (full‑viewport, solid navy). Close via × button, Escape, or any link click.

**Two production fixes applied in RC‑1 — keep them:**
1. **Backdrop‑filter containing‑block bug.** A `backdrop-filter` ancestor becomes the containing block for `position: fixed` descendants, which clipped the overlay to the header strip once the nav was scrolled. Fix: `open()` adds `.bl-nav--menu-open` to the nav, and CSS removes the backdrop‑filter while open so the overlay re‑anchors to the viewport. **If you ever move the overlay or change the nav, re‑test opening the menu *after scrolling*.**
2. **iOS‑safe scroll lock.** `body { overflow: hidden }` alone is ignored by iOS Safari. `open()` now pins the body (`position: fixed; top: -scrollY`), and `close()` restores the exact scroll position with `window.scrollTo`. The overlay has `overscroll-behavior: contain` so its own scroll never chains to the page.

---

## 8. The ambient "node‑network" background

The single signature motion element. Any element with class `ambient-network` gets a `<canvas>` injected behind its content and animated:

- Warm‑gold nodes (~0.55 alpha) drifting on Deep Navy, edges drawn ≤0.16 alpha between nearby nodes, occasional "signal pulses" travelling along real edges.
- Density scales with viewport; **fewer nodes + no mouse parallax on mobile** (<760px).
- `IntersectionObserver` pauses the rAF loop when the canvas is off‑screen (battery).
- `prefers-reduced-motion`: a single static first paint, no animation loop.
- Canvas is `aria-hidden="true"`. Content is kept above it via `z-index` in `.ambient-network > *`.

Used on every navy surface so the background reads as **one continuous system** across the whole site, not a home‑page effect.

---

## 9. Page inventory & visitor journey

Intended narrative flow (each page answers a different question and points to the next):

`Home → About → Our Work → Paamoja → Research Journal → Contact`

| Page | Purpose | Interactive section(s) |
|---|---|---|
| **Home** | Why we exist, the method, the current initiative | Methodology explorer |
| **About** | How the institution thinks | Convictions explorer, orbital "How We Think" |
| **Our Work** | The enduring infrastructure domains | Domains explorer (relationship highlighting) |
| **Paamoja** | The flagship initiative as a public case study | Journey explorer, ecosystem pipeline |
| **Research Journal** | Public record of institutional learning | Journal entries (long‑form) |
| **Contact** | Ways to take part | Routed mailto categories, social links |
| **Legal ×4** | Privacy / Terms / Cookie / Disclaimer | Static, shared structured layout |
| **404** | Error | Static, `noindex` |

The footer is **identical on every page** (Company / Contact / Legal columns + fine print) and concludes every page consistently.

---

## 10. Accessibility & progressive enhancement

- **Works with JavaScript disabled.** Every interactive section has a static fallback (`.bl-vx-fallback`, `.bl-orbit-fallback`, journal fallback). All descriptions are present in the no‑JS DOM.
- **Keyboard:** visible high‑contrast focus rings (`:focus-visible`, `--focus-ring`); explorers and orbit fully arrow‑key navigable; menu closes on Escape.
- **Reduced motion:** `prefers-reduced-motion` disables the node animation loop, scroll reveals, entrance sequence, orbit auto‑cycle, and pulse — content shows in its final state immediately.
- **Semantics & ARIA:** semantic landmarks (`nav`/`main`/`footer`), `role="img"` + `<title>` on SVG marks, `aria-live` panels, `aria-expanded` on the burger, logical heading hierarchy (one `h1` per page).
- **Color contrast:** body/heading colors meet AA on their intended surfaces; warm‑gold is reserved for structural accents and large/mono labels.
- **Screen labels:** `data-screen-label` attributes mark each major section/screen (used for review tooling; harmless in production).

---

## 11. Responsive breakpoints

| Breakpoint | What changes |
|---|---|
| **≤ 860px** | Desktop nav → hamburger; `.bl-two-col` / Paamoja grids / explorers / orbit → single column |
| **≤ 760px** | Node network: fewer nodes, no mouse parallax |
| **≤ 720px** | Infrastructure dimension rows and Contact "ways" → single column |

Everything else is fluid via `clamp()` on type, gutters, and section padding — there are deliberately few hard breakpoints.

---

## 12. SEO, routing & metadata

- **Per‑page** `<title>`, `meta description`, canonical, and Open Graph tags (shared `og-image.png`).
- **URL scheme (documented & intentional):** primary nav pages use clean URLs (`/about`, `/work`, `/paamoja`) via `_redirects`; the home page is `/`; **legal pages, contact, and research‑journal use `.html`**. `sitemap.xml` reflects this exactly. Nav/footer links all use `.html` (which resolve/redirect fine) — don't "fix" this without updating `_redirects` and `sitemap.xml` together.
- `_redirects` also maps `/services → /work.html (301)` and sends unknown paths to `/404.html (404)`.
- `robots.txt`, `sitemap.xml`, `site.webmanifest` are served directly (passthrough rules in `_redirects`).

---

## 13. Performance, security & deployment

**Deployment:** static upload to **Cloudflare Pages**. No build command. `_redirects` and `_headers` are Cloudflare Pages files (would need translating for Netlify/other hosts).

**`_headers` (security + caching):**
- Security: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (geolocation/mic/camera off), and a strict **Content‑Security‑Policy**: `default-src 'self'` with `script-src 'self'`, `style-src 'self'`, `font-src 'self'`, `img-src 'self' data:`, `frame-ancestors 'none'`. ⚠️ **The CSP forbids inline scripts and third‑party origins** — all JS must stay in external `'self'` files, and no external CDN may be added without amending the CSP.
- Caching: fonts immutable 1yr; images 30d; CSS/JS 1d.

**Performance posture:** no render‑blocking third‑party requests; fonts self‑hosted with `font-display: swap`; JS is `defer`; animation loops pause off‑screen and under reduced motion; CSS is plain (no unused framework weight). Total payload is small and fully cacheable.

---

## 14. How to make common changes

| Task | Where | How |
|---|---|---|
| Edit copy in an explorer/journal/social section | `assets/js/data-*.js` | Edit the relevant object array only |
| Edit static page copy | the page's `.html` | Edit the markup directly |
| Change a brand color / spacing / font | `assets/css/colors.css` / `spacing.css` / `typography.css` | Change the token; it propagates everywhere |
| Restyle a component | `assets/css/components.css` | Find the `bl-` block; use tokens, not literals |
| Add a section | the page's `.html` | Reuse `.bl-wrap` + `.bl-section-header`; **apply the §4.4 padding rule** |
| Add a nav item | **every** `.html` (nav + mobile overlay) + `sitemap.xml` | Nav markup is duplicated per page — update all, or factor out before scaling |
| Add a behaviour | `assets/js/main.js` | New `init*()` that no‑ops when its target is absent; call it in `init()` |
| Change menu/scroll behaviour | `main.js initMobileMenu` + `components.css` nav rules | Re‑test mobile menu **after scrolling** (§7) |

---

## 15. Known caveats & pre‑production checklist

- **The nav/footer are duplicated in every HTML file** (no templating, by design). Any header/footer/nav change must be applied to all 11 pages. This is the single biggest maintenance cost; if the page count grows, consider a tiny build‑time include step — but only if it doesn't reintroduce a toolchain you have to maintain.
- **Cloudflare‑specific** `_redirects` / `_headers` — translate if you move hosts.
- **Fonts are subsetted to Latin.** If you add non‑Latin copy (e.g. extended Swahili glyphs beyond Latin), re‑subset and re‑export the WOFF2s.
- **Analytics** (Cloudflare Web Analytics) must be enabled in the Cloudflare dashboard; it's cookieless and already disclosed in the cookie/privacy pages.
- **Before go‑live:** confirm real social URLs in `data-social.js` (only `enabled: true` entries render), verify `og-image.png` and PWA icons, run a Lighthouse + axe pass, and test the mobile menu on a real iOS Safari device.

---

## 16. RC‑1 change log (this handover cycle)

1. **Editorial/integration pass:** fixed a literal `\u2014` rendering as text on Paamoja; standardized British terminology ("enquiries" for contact contexts, "inquiry" reserved for investigation); brought `terms-of-service.html` into the shared structured legal‑page layout; pruned dead CSS left over from an earlier JSX→HTML migration (`.bl-badge`, `.bl-mission`, `.bl-inquiry-label`, unused two‑col/email/header variants, `.bl-legal-pad-lg`, `.bl-section-pad-bt`, etc.) and the orphaned `.bl-mission` JS selector.
2. **Section‑spacing system fix:** corrected `.bl-section-pad-b` misuse on Research Journal, Contact, and Paamoja where sections following a different background had no top padding (content clipped at the color seam); reframed the Research Journal entries to match the About page (added "The Record" header, gutter‑aligned the reading column). Codified the rule in §4.4.
3. **Mobile header hardening:** fixed the backdrop‑filter containing‑block bug that clipped the open menu after scrolling; upgraded the scroll lock to the iOS‑safe pin‑and‑restore technique with `overscroll-behavior: contain`.

---

*End of handover. Keep it lean.*
