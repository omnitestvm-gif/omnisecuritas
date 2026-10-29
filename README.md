# OmniSecuritas Website

Enterprise cybersecurity website built with HTML, CSS, JavaScript, a COBE WebGL globe, and GSAP. Ready for GitHub and Vercel, with self-hosted fonts and animation libraries, plus a Nodemailer contact backend.

## Run in Antigravity IDE

Open **this project root**, `Omni_Website`, in Antigravity. Run these commands in its terminal:

```powershell
npm install
npm run dev
```

Open <http://127.0.0.1:4173>. Save your changes and refresh your browser to see them. Stop the server with **Ctrl+C**.

Use Node.js 20 or newer. If PowerShell blocks `npm.ps1`, use `npm.cmd` in place of `npm`. The build installs React, Motion, TypeScript, Tailwind, and esbuild for the homepage’s threat-hunting component. All browser assets are bundled or self-hosted; no package CDN is required at runtime.

## Pages

- `index.html` — company homepage and security overview
- `solutions.html` — managed security and cybersecurity solution portfolio
- `mdr-approach.html` — MDR capabilities, workflow, onboarding, and FAQs
- `professional-services.html` — assessments, testing, readiness, response, and investigations
- `contact.html` — direct contact and email inquiry form

## Project structure

```text
Omni_Website/
├── components/               # Reusable typed React components
│   ├── ui/how-it-works.tsx    # Supplied pinned-card component, adapted for the site
│   └── threat-hunting-process.tsx # Security stages and brand colors
├── lib/utils.ts              # Component class-name helper
├── src/                      # Maintained HTML source and shared templates
│   ├── layout.html           # Shared document layout
│   ├── pages.json            # Page metadata and active navigation
│   ├── pages/                # Homepage and four dedicated page bodies
│   ├── islands/              # React hydration entry
│   ├── styles/               # Tailwind source for component styles
│   └── partials/             # Shared navigation, footer, dialogs, and sections
├── public/                   # Static output and assets Vercel publishes
│   ├── *.html                # Five generated standalone pages
│   ├── css/
│   │   ├── styles.css        # Core design, homepage, shared components
│   │   ├── pages.css         # Dedicated pages and responsive layouts
│   │   ├── premium.css       # Shared polish and process layout
│   │   └── components.css    # Generated Tailwind utilities
│   ├── js/
│   │   ├── app.js            # GSAP, navigation, dialogs, workflow, inquiry form
│   │   ├── globe.js          # Legacy Three.js renderer (not loaded)
│   │   └── homepage-islands.js # Shared React/Motion/Lucide browser bundle
│   ├── assets/
│   │   ├── brand/            # Original company logo
│   │   ├── fonts/            # Self-hosted fonts and font stylesheet
│   │   └── favicon.svg
│   └── vendor/
│       ├── three/            # Three.js r170
│       ├── gsap/             # GSAP and ScrollTrigger 3.12.5
│       └── licenses/         # Third-party notices
├── api/contact.js            # Vercel Node.js email endpoint
├── server/                   # Shared SMTP, validation, and local HTTP server
├── tests/                    # Offline email backend tests
├── .env.example              # Safe SMTP settings template (no credentials)
├── scripts/
│   ├── build.mjs             # Type-check, compile React/Tailwind, and generate pages
│   ├── dev.mjs               # Local static + contact API server
│   └── validate.mjs          # Deployment checks
├── docs/
│   ├── DEPLOYMENT.md         # GitHub and Vercel instructions
│   ├── EMAIL_SETUP.md        # Gmail App Password and SMTP configuration
│   └── WEBSITE_REVIEW.md     # Research sources and content decisions
├── components.json          # shadcn-style component paths and aliases
├── tsconfig.json            # TypeScript and import aliases
├── package.json
├── package-lock.json
├── vercel.json               # Vercel configuration
├── .gitignore
└── README.md
```

The original `sites/` folder, if present on this workstation, is a retained copy of the earlier Sites project. It is excluded from Git and Vercel. Edit `src/` for page content and `public/css/` or `public/js/` for styling and behavior in this GitHub/Vercel version.

## Commands

| Command                | Purpose                                                                                  |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| `npm run dev`          | Build and serve the site at `http://127.0.0.1:4173`                                      |
| `npm test`             | Run offline backend and mail composition tests (no real emails)                          |
| `npm run smtp:verify`  | Verify private SMTP configuration without sending an email                               |
| `npm start`            | Same local server                                                                        |
| `npm run build`        | Generate five static pages, then validate JavaScript, local assets, and cross-page links |
| `npm run check`        | Run the same validation directly                                                         |
| `npm run format`       | Format maintained HTML, CSS, JavaScript, scripts, and documentation                      |
| `npm run format:check` | Check formatting without changing files                                                  |

The pages are static; contact submission uses a Node.js email endpoint. The build command type-checks and compiles the React components, compiles Tailwind utilities, and combines the page source in `src/pages/` with shared templates and writes standalone HTML to `public/`, then validates the output. Vercel serves `public/` directly and builds `api/contact.js` as a Node.js Function. No `dist/` folder is generated. Third-party libraries and generated HTML are excluded from formatting.

## Deploy

1. Upload this project root to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import that repository.
3. Use these settings, already declared by `vercel.json`:

| Setting               | Value                                                         |
| --------------------- | ------------------------------------------------------------- |
| Root Directory        | Repository root (`./`)                                        |
| Framework Preset      | Other                                                         |
| Build Command         | `npm run build`                                               |
| Output Directory      | `public`                                                      |
| Install Command       | `npm ci` (or leave Vercel’s detected npm command)             |
| Environment Variables | `SMTP_USER`, `SMTP_PASS`, production origins; see email setup |

4. Configure email using [Gmail setup instructions](docs/EMAIL_SETUP.md), then select **Deploy**. Vercel provides your project’s deployment URL.

See [Deployment instructions](docs/DEPLOYMENT.md) for Git commands and troubleshooting. These settings follow the [Vercel static configuration](https://vercel.com/docs/project-configuration/vercel-json) and [GitHub import workflow](https://vercel.com/docs/git/vercel-for-github).

## Editing and behavior

- Change page content in `src/pages/`, shared navigation/footer in `src/partials/`, and titles/descriptions in `src/pages.json`. Styles live in `public/css/`; interactions and service/guide details live in `public/js/app.js`. Run `npm run build` after editing page templates, then refresh your preview. Generated `public/*.html` files are overwritten by the build.
- The contact form posts to `/api/contact`. Nodemailer sends through your configured Gmail account to `sales@omnisecuritas.com.ph`, with the visitor as Reply-To. The website does not maintain a lead database. Delivery requires private SMTP settings; see [Email setup](docs/EMAIL_SETUP.md).
- No analytics, tracking cookies, or database are included. SMTP credentials are server-only environment variables; `.env.local` stays out of Git and Vercel uploads.
- The COBE globe is illustrative. It pauses offscreen, respects reduced motion, and has a static fallback.
- The timeline uses documented 2022 and 2024 information and the current service focus. Add later achievements only after verification.
- Review third-party notices in `public/vendor/licenses/` before redistributing vendor files.

Read [Website review](docs/WEBSITE_REVIEW.md) for the original research and source limitations.

## Threat-hunting component

The homepage includes Identify, Protect, Detect, Respond, and Recover immediately after “03 / Built for Your Reality”. Its pinned-card design is adapted from the supplied React component. The build renders readable HTML before hydration, with a responsive vertical list below 1024px and reduced-motion support. See [React component setup](docs/REACT_COMPONENTS.md) and [Design specification](docs/PREMIUM_DESIGN_SPEC.md).

## Security clarity section

Directly below the threat-hunting process, the homepage includes a security question marquee and four capability panels. Edit `components/ui/vercep-feature-1.tsx` for its content, `components/ui/marquee.tsx` for the reusable ticker, and `public/css/premium.css` for its design. Both homepage sections share one React browser bundle. Motion supports manual pause/resume, hover and keyboard focus pause, offscreen pause, and reduced-motion preferences. All twelve original questions and four panels remain readable without JavaScript.

## Homepage globe

The current hero uses only the globe visual and interaction from the supplied COBE component. Edit `components/ui/globe-feature-section.tsx` for the map, markers, rotation, and dragging. It is server-rendered in the existing hero slot and hydrated through the shared homepage bundle. The original hero copy, buttons, shield, labels, cards, and layout are unchanged. The previous `public/js/globe.js` renderer and Three.js asset are retained for reference but are no longer loaded by the homepage.
