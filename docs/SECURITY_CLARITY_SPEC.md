# Security clarity · section build specification

Add one section directly between the homepage’s Threat Hunting Process and Our Story. Adapt the supplied scrolling-topic and four-feature design to Omnisecuritas rather than using its generic startup advice or counter example. Mood: composed, precise, professional. Preserve the existing pages, partner wording, services, and gold/navy identity.

## Structure and content

Section id: `security-clarity`. The outer section uses navy `#101b25`, with a faint horizontal hairline at the top and restrained contrast against the preceding off-white process board. The signature is three opposing rows of security questions, followed by four focused capability panels. No new imagery, client claims, metrics, awards, or platform promises are introduced.

Header: centered eyebrow “SECURITY, MADE UNDERSTANDABLE”, then “Clarity for your team.” in white and “Confidence for your business.” in muted gold. Use Manrope 500 at `clamp(30px,3.3vw,48px)`, line-height 1.2, tracking −0.035em, maximum width 780px. The description uses DM Sans 14px, line-height 1.85, color `#a9b8c4`, maximum width 610px: “Security decisions should come with context. We help your team understand the signals, focus on the risks, and move forward with a clear plan.”

The scrolling band contains twelve security questions, split into three groups of four. Topics cover endpoint visibility, expected behavior, risk prioritization, analyst investigation, response approval, incident lessons, and stronger defenses. Chips are text, not fake buttons. Each has a 1px muted border, translucent fill, rounded capsule, 12px copy, and a small gold dot. There are no unsupported incident counts or live-data indicators. Repeat decorative groups for continuity while exposing each original question only once to assistive technology.

The band is at most 1060px wide, with 12px gaps and a 70px fading edge mask. Rows run at 45, 50, and 42 seconds respectively; reverse the middle row. Pause while a visitor hovers over or focuses within the band. Provide a 44px minimum pause/resume control, with a clear pressed state. Stop the motion when the band is offscreen, the document is hidden, or reduced motion is enabled. Reduced-motion and no-JavaScript presentations retain all twelve questions in a static layout without clipped content.

The feature region contains four articles: “See what deserves attention”, “Understand the risk”, “Know what comes next”, and “Strengthen over time”. Each includes a small uppercase category, an original supporting paragraph, and a Lucide SVG icon chosen for visibility, analyst insight, coordinated response, or improvement. Use 20–22px Manrope headings and 13–14px body text at 1.8 line-height. Dividers use a 1px dashed white line at 14% opacity. Icons sit in 52px tiles with a 14px radius, a faint gold tint, and 24px strokes. Do not use emoji or unrelated stock photos.

At 1024px and above, display four equal columns with 28px inner padding. At 640–1023px, use two columns. Below 640px, use a single column with 24px padding and horizontal separators. The header and moving band retain 24px mobile gutters. Keep hover effects within a 3px rise and a 250ms transition on fine pointers; disable motion transforms for reduced motion. Finish with a quiet text link to the MDR Approach page.

## Implementation and resilience

Use the existing React, TypeScript, Tailwind, and static HTML build. The adapted component lives in `components/ui/vercep-feature-1.tsx`, with reusable `badge.tsx` and `marquee.tsx` siblings. Lucide supplies local SVG icons. Extend the existing Tailwind source with the supplied horizontal/vertical marquee keyframes and animation variables. Bundle both homepage islands together to avoid downloading React twice. Server-render both sections before hydration and preserve generated license notices.

The current shadcn-style paths and TypeScript aliases already support `components/ui`. No framework migration, extra global state provider, image service, or data backend is needed. The only persistent state is a visitor’s pause choice for the current page visit. Build outputs remain under `public/` for Vercel.

## Acceptance

Check exact section order, four capability articles, twelve accessible original questions, no generic business copy or counter controls, and no hydration errors. Verify continuous motion, manual pause/resume, offscreen pause, live reduced-motion changes, keyboard focus behavior, no-JavaScript readability, and 360/390/768/1024/1440px layouts. Recheck the existing process section and the partner names in Our Story. Inspect desktop and mobile screenshots, correct concrete weaknesses, and package the source only after the production build and relevant browser checks pass.
