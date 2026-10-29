# Visual review · premium refinement

Reviewed on 28 October 2026 (Philippines). The supplied five-stage component is directly after “03 / Built for Your Reality” and before “Our Story”.

## Method

Captured before and after desktop and mobile screenshots using the available bundled Playwright runtime and Microsoft Edge. The skill’s Python screenshot helper was attempted, but its environment did not include Python Playwright or a discoverable Chrome executable; the documented browser fallback was used instead. Screenshots and the local review script live in the ignored `qa/` folder.

Reviewed the hero and the process section as images at 1440px and 390px, and tested page layouts at 1440, 1024, 768, 390, and 360px. Reviewed the line animation while visible, a live reduced-motion preference change, and the server-rendered page with JavaScript disabled.

## Corrections made during review

1. **Tablet composition:** Alternating 280px cards overlapped at 768px. Moved the two-column breakpoint to 1024px and used the vertical list below it. Bounding-box checks confirm no card overlap at the tested widths.
2. **Reading rhythm:** Added an explicit 12px gap between card titles and descriptions. Kept body copy at 14px with 1.65 line-height and dark ink against pale surfaces.
3. **Interaction polish:** Increased shared text-link, menu, and dialog-close targets to at least 44px. Added consistent capsule buttons, restrained surface radii, and arrow movement for fine pointers.
4. **Motion preference changes:** Added native media-query and document-visibility listeners so the SVG connector stops when reduced motion is enabled or the page is hidden. Removed independent perpetual movement from the hero signal cards.

## Design review

These are qualitative internal design judgments, rather than independent certification or measured business outcomes.

| Area              | Score / 10 | Evidence                                                                          |
| ----------------- | ---------- | --------------------------------------------------------------------------------- |
| First glance      | 8          | Clear company message, restrained CTA, and protected-core globe                   |
| Signature         | 8          | Existing interactive globe plus the connected five-stage process                  |
| Typography        | 8          | Consistent self-hosted font pairing, readable card copy, controlled heading scale |
| Composition       | 8          | Deliberate desktop alternation and a clean tablet/mobile sequence                 |
| Color             | 9          | Original gold identity, navy structure, and pale gold/slate cards                 |
| Media integration | 8          | Original code-native globe; no unrelated stock assets                             |
| Motion            | 8          | Staged hero entrance and a connector that respects visibility and preferences     |
| Mobile            | 9          | No overlapping process cards or horizontal page overflow at tested widths         |
| Copy              | 8          | Specific security stages without invented metrics or guarantees                   |
| Polish            | 8          | Shared surfaces, focus states, usable targets, and no hydration errors            |

Average: 8.2 / 10; no category below 7.

## Functional verification

81 browser checks passed with no JavaScript/hydration errors or failed resources. Coverage includes all five pages, five viewport widths, section placement and stage order, card geometry, SVG animation and reduced motion, server-rendered content without JavaScript, mobile navigation, service dialogs, MDR tabs, and inquiry preparation. No email was sent.

The production build also runs TypeScript checks, bundles the React component, compiles Tailwind utilities, and validates local assets, cross-page links, page headings, and Vercel configuration.

## Security clarity addition

The supplied scrolling-topic and four-feature design was adapted to a navy-and-gold section directly below the threat-hunting process. Desktop and mobile screenshots were inspected. The final pass enlarged small secondary labels, moved hover/focus pausing to the topic area so the Resume control works while focused, and constrained static topic groups so all twelve questions wrap without overflow under reduced motion or without JavaScript.

55 targeted browser checks passed with no JavaScript/hydration errors or missing assets. Checks cover placement, four panels, twelve accessible topics, a single shared React bundle, motion, pause/resume, hover/focus pause, offscreen pause, reduced motion, no-JavaScript readability, five viewport widths, retained process stages and partner copy, and successful loading of the other four routes. Screenshot and QA artifacts are retained in the ignored `qa/security-clarity/` folder.

## Hero globe replacement

The user requested a globe-only swap using the supplied COBE design. Desktop and mobile screenshots were inspected. 53 targeted browser checks passed with no JavaScript/hydration errors or failed assets. The checks confirm the unchanged hero copy and CTA markup, unchanged shield/labels/cards/caption, unchanged section order and text layout, and unchanged original hero CSS. Coverage also includes rotation, dragging with pointer capture, resizing at five widths, reduced motion, offscreen pause/resume, missing-WebGL fallback, no-JavaScript readability, and retained page content and partner names. The old Three.js renderer is not requested by the browser. Artifacts are in `qa/globe-replacement/`.
