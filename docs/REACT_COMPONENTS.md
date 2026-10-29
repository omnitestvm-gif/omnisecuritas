# React components in the static website

The site now supports TypeScript, Tailwind CSS, React, and Motion while retaining its five standalone HTML pages and Vercel `public/` deployment.

## Already configured

- `components/ui/` is the default reusable UI component directory, following the folder and alias convention requested with the supplied component.
- `components/ui/how-it-works.tsx` adapts the supplied pinned-card component. It retains typed `features`, `stepPositions`, and color props and adds configurable connection geometry. It also uses semantic list markup, stops the line animation outside the viewport, and respects reduced motion.
- `components/threat-hunting-process.tsx` supplies the five Omnisecuritas stages and brand colors.
- `src/islands/homepage.tsx` hydrates the server-rendered homepage component.
- `src/styles/components.css` is the Tailwind source. It includes theme and utility layers without applying a global reset to the existing pages.
- `components.json` configures shadcn-style component paths, CSS location, TypeScript support, and the `@/` aliases. `tsconfig.json` provides the matching path mapping. `lib/utils.ts` provides `cn()` for combining classes.

The website has a custom static build, so no `shadcn init` or new framework project is needed for this component. Additional registry components may require their own dependencies and theme variables; follow their current installation instructions before using them.

## Install and build

```powershell
npm install
npm run build
npm run dev
```

Use `npm ci` for a clean installation from the committed lockfile. `npm run typecheck` checks the React/TypeScript source independently. The build runs type checking, server-renders the process to HTML, bundles its browser JavaScript with esbuild, compiles Tailwind CSS, generates all five pages, and validates the output.

The resulting `public/js/homepage-islands.js` and `public/css/components.css` are generated assets. Edit their source files instead. The browser bundle includes the React/Motion code; no package CDN is required at runtime. Generated license notices are preserved alongside the bundle.

## Data and state

Edit `THREAT_HUNTING_STEPS` in `components/threat-hunting-process.tsx` to update the Identify, Protect, Detect, Respond, and Recover cards. The component does not use accounts, storage, a database, or global application state. Local visibility and reduced-motion hooks control the decorative SVG path. There are no image requirements; pins are inline SVG.

Desktop cards alternate across two columns with small rotations and a connecting line. At widths below 1024px they become a vertical list to prevent tablet overlap. Server-rendered headings and descriptions remain available if JavaScript is disabled.

The supplied `demo.tsx` is retained under `components/ui/` as a minimal usage example; the live site uses the configured `ThreatHuntingProcess` wrapper.

## References

- [Tailwind CLI installation](https://tailwindcss.com/docs/installation/tailwind-cli)
- [shadcn manual setup and aliases](https://ui.shadcn.com/docs/installation/manual)
- [esbuild build API](https://esbuild.github.io/api/)

The Motionsites skill requested for the design refinement is installed in the local Codex skills directory. Design decisions and visual review criteria are recorded in `PREMIUM_DESIGN_SPEC.md`.

## Security clarity feature section

`components/ui/vercep-feature-1.tsx` adapts the second supplied section into security-focused copy, three scrolling topic rows, and four feature panels. The unrelated counter example and startup-business text are not displayed. `badge.tsx` and `marquee.tsx` supply the referenced UI pieces, and Lucide provides bundled SVG icons. The accompanying usage example is `components/ui/security-clarity-demo.tsx`.

Both the process and clarity components are exported by `components/homepage-islands.tsx`, rendered to HTML during the build, and hydrated by `src/islands/homepage.tsx`. The shared `public/js/homepage-islands.js` avoids shipping a second React runtime. The Tailwind input includes the supplied horizontal/vertical marquee definitions and `tw-animate-css`.

The moving rows expose each question once to assistive technology; repeated visual groups are hidden from screen readers. Visitors can pause or resume using the visible control, pause by hovering or focusing a row, or use their system reduced-motion preference. Offscreen and hidden-page animation pauses automatically. No-JavaScript content uses a static wrapping layout.

## Globe-only replacement

`components/ui/globe-feature-section.tsx` exports the supplied COBE globe, adapted without the surrounding sample section, text, button, or layout. `GLOBE_CONFIG` retains its white base, orange markers, map sampling, tilt, and ten marker locations. These locations are illustrative design content, not a statement of operational coverage. The existing hero shield and information overlays remain separate and unchanged.

The installed COBE 2 API exposes `update()`, so a visibility-aware animation loop provides the supplied rotation rather than the older `onRender` callback. Pointer capture supports drag-to-rotate, including release outside the canvas. ResizeObserver keeps the surface square, device pixel ratio is capped at two, automatic rendering stops offscreen or under reduced motion, and the existing fallback remains when WebGL is unavailable. DOM wrappers and event listeners are cleaned up on unmount. No additional demo Button or Radix dependency is needed for this globe-only integration.
