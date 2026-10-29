# OmniSecuritas · expertise made visible

## Brief and boundaries

Refine the existing five-page company website for business leaders and IT decision makers exploring managed cybersecurity. Mood: composed, precise, assured. Preserve the gold company identity, the sourced company story, the existing navigation, and the substantive service pages. The signature remains the original Three.js defense globe. The new secondary story is a five-stage threat-hunting and resilience process, using the supplied pinned-card React component immediately after the homepage’s “03 / Built for Your Reality” section and before the company story.

The skill’s security and operations examples inform restrained composition, strong reading order, controlled surfaces, and motion timing. The implementation uses the company’s existing assets and original code-native visuals. No cinematic stock video, additional font family, customer metric, certification, or vendor relationship is introduced. Identify, Protect, Detect, Respond, and Recover are presented as the company’s requested process, without claiming certification against a named framework.

## Stack and files

Keep the five-page static output and Vercel `public/` configuration. Add a small React island built with esbuild, TypeScript, Tailwind utilities, and Motion. Place the reusable component in `components/ui/how-it-works.tsx`; security content and configuration in `components/threat-hunting-process.tsx`; hydration entry in `src/islands/homepage.tsx`; and Tailwind input in `src/styles/components.css`. Add `tsconfig.json`, a `components.json` alias configuration, and `lib/utils.ts`. Render the component to HTML during the build, then hydrate it on the homepage. Content must remain available without JavaScript.

## Typography and tokens

Retain the self-hosted Manrope display and DM Sans body fonts. Use display weight 500, body weight 400, and labels weight 600. Desktop hero remains approximately 79px at 1440px with tracking −0.045em and three deliberate lines. Homepage hero lines become individually addressable for a restrained reveal. Section headings use the existing 30–48px scale. New process heading is `clamp(30px, 3.2vw, 46px)`, line-height 1.2, tracking −0.035em, max-width 700px. Card titles are 24px desktop and 23px mobile; descriptions are 14px with line-height 1.65. Shared service body copy increases to at least 13px where the previous small sizes weakened readability.

Retain navy `#101b25`, ink `#14212b`, warm gold `#f3d19a`, muted copy `#657078`, and off-white `#f7f7f2`. The process board uses off-white, gold accents, white paper shells, and pale gold/slate interiors. Numbers and pins carry the accent; all substantive card text uses dark ink. Selection uses warm gold with navy text. Do not introduce purple gradients or new decorative glow layers.

## Process section

Section id: `threat-hunting`. Heading: “A connected approach. A more resilient business.” Eyebrow: “OUR THREAT HUNTING PROCESS”. Introduction: “From understanding your environment to learning from an incident, we connect expert investigation with the steps that strengthen your security posture.”

The ordered stages are:

1. **Identify:** understand business-critical assets, endpoint activity, and priority risks to focus investigation.
2. **Protect:** strengthen endpoint defenses and security practices that help reduce exposure.
3. **Detect:** hunt for suspicious behavior and investigate relevant endpoint signals with analyst context.
4. **Respond:** coordinate investigation, escalation, and appropriate response within agreed permissions.
5. **Recover:** review incident findings, support recovery planning, and recommend improvements for resilience.

The board has a 1000px maximum width. At widths from 1024px, alternate 280px cards between left and right columns, at vertical offsets 0/175/350/525/700px. Reserve approximately 1000px height for five cards. Rotate alternating cards by ±4 degrees on desktop only; card shells have a 22px radius, 8px outer padding, a restrained `0 8px 24px #14212b0d` shadow, and a 1px neutral border. Inner panels have a 15px radius and 20px padding. Pins are inline SVG, 25px, centered. The connecting SVG is behind the cards and uses a dashed stroke in muted gold/slate, width 1.5px. Background horizontal lines are 32px apart at approximately 4% ink opacity, with fading side edges.

On mobile, use a vertical ordered list with 24px gaps, no rotation, no absolute positioning, and no fixed board height. Preserve a quiet dashed vertical connection. Card width is 100%, capped at 390px. Section gutters are 24px; desktop gutters follow the existing 6% rhythm. Finish with a short connection to the managed service and a real link to the MDR Approach page.

## Shared visual and interaction refinements

Use a translucent white header with 14px backdrop blur and the existing border. Keep the original logo, navigation labels, and height. Buttons become a consistent capsule with a minimum 48px target, 250ms color/transform transitions, and a 2px arrow movement on pointer hover. Established content panels receive a consistent 14px radius and restrained border hover. Avoid adding excessive shadows. Improve inactive process-tab text contrast while preserving the active gold rule. Keep the hero globe in its current right-hand composition; reduce its wireframe opacity slightly so the protected core and copy carry the focus.

## Motion and resilience

Use easing `cubic-bezier(0.22,1,0.36,1)`. Header remains stable for orientation. Hero eyebrow begins after 100ms; headline lines rise 24px and resolve a 6px blur over 750ms, staggered 100ms; body begins at 400ms, actions at 550ms, proof at 750ms. All settle within 1.5 seconds. Remove independent perpetual floating of the hero signal cards so they do not compete with the WebGL signature. Existing section reveals remain in-view, once, 800ms.

The dashed process connection advances linearly by a repeatable dash multiple over six seconds only while the board is visible. Stop it for reduced motion. Card hover scale is capped at 1.025 and applies only to fine pointers. No scroll hijacking or pinned viewport is introduced. Native links and content stay usable without React hydration. With reduced motion, show all final states and keep the globe’s static frame.

## Acceptance and review

Verify the exact section order, all five stages, semantic list order, successful hydration without warnings, desktop line/card geometry, 360/390/768/1024/1440px layouts, no horizontal overflow, reduced motion, and no-JavaScript content. Confirm that all five existing routes, service dialogs, mobile navigation, and inquiry preparation continue to work. Check font loading, browser errors, failed assets, and the packaged source build. Capture before/after desktop and mobile views plus a dedicated process-section screenshot. Review first glance, signature, type, composition, color, media integration, motion, mobile behavior, copy, and polish; repair concrete weaknesses before publication.
