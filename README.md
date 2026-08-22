# Andrew Garcia Mosquera - Portfolio

Professional portfolio website showcasing my experience, skills, and certifications as a software engineer specializing in backend development and software architecture.

## Features

- 📱 Fully responsive design
- 🎨 Modern and clean UI
- 📄 Downloadable CV in **four formats** (PDF · Word · plain text · JSON Resume), all
  **auto-generated from the site data** and audited against ATS parsing rules (see
  "CV Generator" below)
- 🎓 Interactive certifications showcase
- 🖼️ Profile photo display
- 🔗 Social media links (LinkedIn, GitHub)
- ⚡ Fast loading with Vite

## CV Generator (`npm run cv`)

The downloadable CV is **generated from `src/data/cvData.ts`** — the same single source of
truth the website renders. Whenever you update your experience, projects or skills,
regenerate it so it never drifts from the site:

```bash
npm run cv                            # regenerate every format (EN + ES)
npm run cv:lint                       # audit the result the way an ATS reads it
npm run cv:match -- job-posting.txt   # cross-check against a specific opening
```

`npm run cv` writes **four formats per language**, all from the same data:

| File | What it's for |
|---|---|
| `Andrew_..._CV.pdf` | The default upload. Reads well for people and parsers. |
| `Andrew_..._CV.docx` | Forms that ask for Word — Workday, Taleo. |
| `Andrew_..._CV.txt` | "Paste your resume here" boxes. Extracted *from the PDF*, so it doubles as proof of what a parser sees. |
| `resume.json` | [JSON Resume](https://jsonresume.org) v1 — autofill extensions and agents. |

How it works (`scripts/generate-cv.ts`):

1. Imports `cvData.ts` and builds a print-optimized, single-column HTML resume.
2. Renders it to PDF with headless Chrome/Edge (auto-detected on Windows/Linux, no extra deps).
3. Reads the PDF's own text layer back out to write the `.txt`.
4. Builds the `.docx` with a hand-rolled OOXML + ZIP writer (`scripts/lib/docx.ts`, `zip.ts`) —
   again, no new dependencies.
5. Writes everything to `public/`, so the site's download menu serves fresh copies.

The layout follows current resume conventions. The full research — including **why not LaTeX**
and why embedded XMP/JSON-LD metadata is useless to an ATS — is in
**[`docs/CV-ATS.md`](docs/CV-ATS.md)**:

- **One page** (right for <10 years of experience — every line must earn its place).
- **Strict single column** — multi-column layouts, tables and text-in-headers break older ATS parsers.
- **Standard section headings** (Summary / Experience / Projects / Skills / Education / Certifications).
- **XYZ-style bullets**: what you built + how + measurable outcome.
- **ATS-safe typography** — Arial/Helvetica, `|` as the only field separator, a plain hyphen in
  date ranges (not an en dash), and typographic punctuation normalized to ASCII.
- Real selectable text only (no images for content), machine-readable dates, ≥9pt type.

To adapt it for your own fork: edit `src/data/cvData.ts` (data) and the constants at the top of
`scripts/generate-cv.ts` (accent color, output filename).

The three projects that make the CV are the ones flagged `inCv: true` in `cvData.ts` (the
one-page rule caps it at 3) — not simply the first three in the list. `npm run cv:match` will
tell you which three fit a given job posting best.

### Auditing the output (`npm run cv:lint`)

An ATS never looks at the PDF — it runs the equivalent of `pdftotext` and applies regex and NER
to the plain text that comes out. So the lint opens each generated PDF and DOCX, extracts the
text layer (`scripts/lib/pdf-text.ts`, no dependencies) and asserts on *that*: contact details
present and in the body, standard headings, every job title and employer intact, one parseable
date range per role, no invalid separators, plus file size and page count. It exits non-zero, so
it can hang off CI.

### Tailoring to a job posting (`npm run cv:match`)

Format is necessary but not sufficient — with a clean PDF, the thing that moves the needle is
vocabulary overlap with the specific opening (the usual reference is 70–80%, not 100%, which
reads as stuffing). `cv:match` detects the posting's language, cross-references the matching
CV, and sorts the terms into three buckets: already covered, **already yours but missing from
the CV** (it lives in `cvData` — one of the projects that doesn't fit on one page, a highlight,
a certification), and genuinely absent. It also ranks all projects by fit and suggests which
three should carry `inCv: true`.

It deliberately **does not rewrite the CV**. Auto-injecting a posting's keywords is the fastest
route to claiming something untrue; it separates what's recoverable from what's missing and
leaves the decision to you.

### Automatic page fitting

The PDF targets one page, but never by making itself unreadable. The generator renders,
counts the pages in the output, and retries through `FIT_STEPS` until it fits:

1. **Whitespace first** — margins, padding and leading compress down to 60%. Cheap, and
   barely noticeable.
2. **Type last, barely** — the font floor is 97% (≈9.02pt), because below 9pt older ATS
   parsers and human readers both start to struggle.
3. **Otherwise, multi-page** — if it still doesn't fit, it re-renders at full spacing and
   flows onto as many pages as it needs.

Multi-page output is properly formed: margins live in `@page` (not `body` padding, which
only applies once and would leave page 2 flush against the paper edge), section headings
carry `break-after: avoid` so none is orphaned at a page foot, and `.item` blocks carry
`break-inside: avoid` so a job or project never splits across a page boundary.

The run reports what it chose: `(1 pág. · espaciado 60%, letra 98%)`.

### Dates are derived from the current date

`endDate: "present"` renders as Present/Actual, and a role whose `startDate` month **hasn't
arrived yet** renders as `Aug 2026 - Present (incoming)` rather than claiming to be current.
The parenthetical is for the human reader; the range around it stays machine-parseable, which
the earlier "Starting Aug 2026" wording was not — a parser found no date range there and
dropped the role from the work history altogether. Once that month arrives, the same data
renders as an ordinary ongoing role with no edit.

Experience is also **sorted by date** and **grouped by company**, so adding a role to
`cvData.ts` puts it in the right place automatically — you never hand-order the array.

On the site a promotion shows as one company card with its roles stacked (the current one
leading). In the CV each role puts the job title alone on its line and the employer on the
next, as `Company | Location | Dates` — the split a parser can segment without guessing.

## Projects section

Projects live in `cvData.ts` (EN) and `cvData.es.ts` (ES), which must stay structurally
identical — same `slug`s, same order. The section renders in three tiers:

- **Ventures** (`ventures[]`) — a startup rendered as one block with its product line nested
  underneath, listed by slug in `products[]`. This is what keeps LyrooPOS reading as *a product
  of* Lyroo rather than a competing sibling card. Products listed here never also appear in the
  grid below.
- **Featured** (`featured: true`) — large hero cards with a screenshot gallery.
- **Grid** — every other project, as a standardized compact card, filterable by `category`
  (`startup` · `product` · `academic` · `game`).

Two rules when adding a project:

- **Only add a `repo` link if the repository is actually public.** A private repo renders as a
  404 for visitors. Set `privateRepo: true` instead and the card shows a "private source" marker.
- Give every project a `slug`, a `tagline` (the compact cards show it instead of the full
  `description`), a `role` and a `year`, so the grid stays visually consistent.
- **Keep `description` under ~450 characters.** Past that a featured card turns into a wall of
  text nobody reads. Technical depth belongs in `highlights[]` — up to three short bullets
  rendered under the description, which is what a recruiter actually scans.
- **Screenshots go in `public/projects/` as `.webp`.** Convert before committing:
  `magick shot.png -resize '1200x1600>' -quality 82 -define webp:method=6 shot.webp`.
  1200x1600 already covers a 2x display; the PNGs this replaced were ~8 MB for the set.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS3** - Styling with CSS variables
- **Netlify** - Deployment platform

## Project Structure

```
src/
├── components/         # Hero, About, Experience, Education, Skills, Projects,
│   │                   # Certifications, Contact, Navbar, Footer + effects
│   └── CvDownload.tsx  # Download button + the other-formats menu
├── data/
│   ├── cvData.ts       # Single source of truth (EN)
│   └── cvData.es.ts    # Same shape, same slugs, same order (ES)
├── i18n/               # Language context + UI dictionary
├── types/
│   └── index.ts        # TypeScript interfaces
├── App.tsx             # Main app component
├── index.css           # Global styles
└── main.tsx            # App entry point

scripts/                # No runtime deps — all of this is build-time only
├── generate-cv.ts      # pdf + docx + txt + json, from cvData
├── cv-lint.ts          # ATS audit of the generated files
├── cv-match.ts         # Cross-check against a job posting
└── lib/
    ├── cv-labels.ts    # Section titles + date format, shared by PDF and DOCX
    ├── pdf-text.ts     # PDF text-layer extractor (what a parser sees)
    ├── docx.ts         # OOXML writer
    ├── zip.ts          # Minimal ZIP writer/reader (a .docx is a ZIP)
    ├── json-resume.ts  # JSON Resume v1 export
    └── keywords.ts     # Term extraction for cv-match

docs/
└── CV-ATS.md           # The research and the reasoning behind every rule

public/                 # Generated CV files live here — do not hand-edit
├── Andrew_Garcia_Mosquera_CV.{pdf,docx,txt}      # EN
├── Andrew_Garcia_Mosquera_CV_ES.{pdf,docx,txt}   # ES
├── resume.json / resume.es.json
├── profile.jpg
└── certificates/       # Certification PDFs
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/DrewGGM/personal-website-react.git
cd personal-website-react
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

The site will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment

This project is configured for deployment on Netlify. The `netlify.toml` file contains all necessary build settings.

### Deploy to Netlify

1. Connect your Git repository to Netlify
2. Netlify will automatically detect the build settings from `netlify.toml`
3. Push your changes to trigger automatic deployment

### Build Settings

- **Build command:** `npm run build`
- **Publish directory:** `dist`

## SEO & response headers

- **`index.html`** carries the canonical URL, hreflang, Open Graph / Twitter cards and a
  JSON-LD `@graph` (`Person` + `Organization` + `WebSite`). `LanguageProvider` rewrites the
  title, description and OG tags on language switch so a shared link matches what the visitor
  is reading.
- **`public/og-image.jpg`** (1200x630) is the social preview. Regenerate it from
  `scripts/og-card.html` — that file documents the two commands at the top.
- **`public/sitemap.xml`** is generated by `npm run sitemap`, wired as a `prebuild` hook so
  every build refreshes it. It is gitignored: it is a build artifact, not source.
- **`public/_headers`** holds the CSP, HSTS, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy` and cache rules. That format is read as-is by both Netlify and
  Cloudflare Pages, so the site keeps its security posture if the hosting changes.
  `netlify.toml` deliberately defines no headers — Netlify would give it priority over
  `_headers`, and having them in two places only guarantees they drift apart.

  The CSP allows `'unsafe-inline'` for **styles only**: framer-motion and tsparticles write
  `style=""` into the DOM every frame. `script-src` stays at `'self'`, which the Vite build
  satisfies because it emits no inline scripts.

## Sections

- **Header** - Profile photo, name, title, location, and contact information
- **About** - Professional summary
- **Experience** - Work history with dates and descriptions
- **Education** - Academic background and bootcamps
- **Skills** - Technical skills organized by category
- **Certifications** - Certificates with downloadable PDFs
- **Languages** - Language proficiency levels

## Certifications

Current certifications with view/download capability:
- Spring Boot: Backend Enterprise Professional Certificate - Dev Senior Code
- QA Engineer Bootcamp - TripleTen LatAm
- Scrum Fundamentals Certified (SFC) - VMEdu inc
- Desarrollo Web y UX/UI - Next U

## Contact

- **Email:** contact@andrewgarcia.dev
- **LinkedIn:** [andrewgarciam](https://linkedin.com/in/andrewgarciam)
- **GitHub:** [DrewGGM](https://github.com/DrewGGM)
- **Website:** [andrewgarcia.dev](https://andrewgarcia.dev)

## License

This project is personal portfolio website. Feel free to use it as inspiration for your own portfolio.
