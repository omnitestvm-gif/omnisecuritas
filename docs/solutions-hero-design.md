# Solutions hero — connected cybersecurity layers

## Brief and scope

Adapt the supplied Strata reference to the existing OmniSecuritas Solutions hero. Audience: business and IT leaders selecting complementary cybersecurity capabilities. Mood: calm, dimensional, assured. The signature is a luminous stack of glass defense layers with floating cards identifying real cybersecurity services. Preserve the exact headline, descriptive paragraph, primary and secondary CTA labels and destinations, navigation, original layer labels, and every section below the hero. No AI branding, invented statistics, client logos, or capability claims from the reference.

## Stack and identity

Use the existing static HTML template, native CSS, and vanilla JavaScript. Add page-specific solutions-hero.css and solutions-hero.js through the existing build metadata; do not load these on the homepage or professional-services page. Retain the self-hosted Manrope display family and DM Sans UI family. The stage uses navy #0c161f, primary text #f5f7f8, body #adbac4, and existing gold #f3d19a/#e8b469. Keep the shared white header, OmniSecuritas logo, and existing menu behavior. A faint square grid uses 72px cells and is masked around the artwork.

## Layout and copy

At desktop landscape sizes, use a two-column grid, 1fr / 1.08fr, with 24px gap, 6% horizontal gutters, and 88px top padding. Minimum hero height is calc(100svh - 158px), leaving room for the 96px header and 62px section navigation. Position breadcrumbs at top 30px and left 6%. Align the message and artwork vertically. Keep “CONNECTED CYBERSECURITY” at 9px with 2px tracking. The exact H1 remains “The right layers.” followed by “A stronger business.” at clamp(46px, 4.4vw, 70px), weight 500, 1.13 leading, and -.05em tracking. First line is white; second is brand gold. Each line has a separate overflow mask for its entrance.

Retain: “Protect your technology. Empower your people. Connect the security capabilities your organization needs to move forward with confidence.” Set this at 14px/1.95, max-width 450px, margin-top 25px. Keep “Find your security approach” linking to contact.html and “Explore the portfolio” linking to #portfolio. Buttons are at least 52px tall, with the existing gold primary and text-link secondary. Below them, a restrained 10px line reads “Technology. People. Expertise.” with a 26px gold hairline.

## Media and glass cards

Use the supplied 435a4fe7-e43b-4e7c-af78-0be083e73569.mp4 and 782a4a52-4c1e-4471-bb0c-aa232927f4a6.webp, stored in public/assets/media as solutions-layers.mp4 and solutions-layers.webp. The clip contains the floating slabs, particle streams, waves, and pixel flicker; its matched endpoints support native forward looping. Put both assets in one square media container at 121% of the artwork column width, centered vertically and horizontally. Use screen blending and a radial mask fading outside 53–72% of the artwork to remove the rectangular edge. Apply grayscale(1), sepia(1), saturate(1.35), brightness(1.15) to integrate the supplied teal/violet artwork into the established gold theme. Keep the still under the video and fade video opacity over .65 seconds once playing.

Overlay two real links: “Managed Detection & Response” with “DETECT & RESPOND,” and “Managed Endpoint Security” with “PROTECT YOUR DEVICES.” They link to the MDR page and solution portfolio. Each glass card is 267px wide, at least 126px tall, radius 12px, 20px/16px padding, a #f3d19a2c border, a dark translucent gradient, 12px backdrop blur, and subtle inner highlight. Use custom shield/check and monitor/check SVGs. Service titles are 13px/1.55, with smaller gold kickers and muted supporting labels. Place MDR upper-left and endpoint lower-right of the artwork. Hover increases border contrast; focus is a 2px gold outline offset 5px.

## Foundation and responsive design

Below the composition, preserve PEOPLE, ENDPOINTS, and EXPERTISE as three labeled pillars plus “A stronger whole.” linking to #security-layers. Use a four-column row, 1px top border, and 24px vertical padding; these are qualitative categories, not numeric product statistics. At 900px and below or in portrait orientation, center the original message and place artwork underneath. At 600px and below, use 22px gutters, 40–58px headline, 12px body, centered stacked actions, a 440px artwork region, 205px cards, and a two-column foundation. All links and motion controls retain at least 44px targets.

## Motion and verification

Run one entrance on the native document timeline. Header items rise 16px and fade over 520ms with 35ms stagger. Headline lines rise 110% through individual masks at 140ms and 260ms, lasting 820ms. Body settles at 340ms, actions at 420–480ms, cards at 580ms and 700ms, and foundation items from 650ms with 70ms stagger. Use cubic-bezier(.22,1,.36,1). Primary CTA settles from scale .985 to 1. No perpetual text animation. The supplied video alone supplies continuous artwork motion. Provide a visible pause/play control, pause offscreen and in hidden tabs, and show the still with no entrance or video request for reduced motion. Check desktop, phone, tablet, short viewports, multiple video loops, pause/resume, reduced-motion transitions, existing service anchors, and unchanged content below the hero.
