# Website review and redesign decisions

Reviewed on 28 October 2026 (Philippines).

## Sources examined

1. Requested homepage snapshot: https://web.archive.org/web/20250307023546/https://omnisecuritas.com.ph/
   The archive’s original-content endpoint returned “Error establishing a database connection” during this review. Its original rendered appearance could not be verified.
2. User-supplied solutions snapshot: https://web.archive.org/web/20240221070714/https://omnisecuritas.com.ph/solutions-overview/
   Successfully retrieved and read. Documents MDR, awareness training, anti-malware, assessments, penetration testing, and forensic investigation services.
3. MDR snapshot: https://web.archive.org/web/20240221070714/https://omnisecuritas.com.ph/managed-detection-and-response/
   Successfully retrieved and read. Describes endpoint activity review, analyst investigation, coordinated response, dashboards, reporting, and a lightweight cloud-managed approach.
4. Company snapshot: https://web.archive.org/web/20240221070714/https://omnisecuritas.com.ph/company/
   Successfully retrieved and read. Provides company positioning, Philippine location, and the sales email address. Archived logo asset recovered from the original WordPress upload path.
5. Indexed current homepage: https://omnisecuritas.com.ph/
   Search-index content describes managed EDR, MDR, threat hunting, and analyst expertise. Direct retrieval returned a WordPress critical error during review. Current platform/vendor details were not independently confirmed.
6. Rogers Cybersecure Catalyst, 20 December 2022: https://cybersecurecatalyst.ca/why-this-cybersecurity-company-wants-to-help-the-small-businesses-defend-themselves/
   Confirms a 2022 partnership between CYDEF and OmniSecuritas to expand cybersecurity services in the Philippines. This informed the initial historical review. The public story no longer references this partnership, following the user’s requested update.
7. Professional services: https://omnisecuritas.com.ph/professional-services/
   Indexed company page describes risk assessments, security assessments, penetration testing, incident response preparation, incident response, and forensic investigations.

## Review findings

### Strong foundation

The original content has a useful differentiator: human investigation of unusual endpoint behavior, supported by transparent reporting and coordinated response. It also makes a credible case for supporting internal IT teams through managed services.

### Opportunities addressed

- **Message hierarchy:** Long descriptions and multiple service labels obscured the business outcome. The new hero focuses on confidence, then introduces a clear service portfolio.
- **MDR explanation:** The original MDR distinction was mainly prose. The new four-stage interactive workflow shows monitoring, investigation, response, and improvement.
- **Readability:** Broad all-caps headings and dense copy become shorter sections, consistent typography, and useful detail dialogs.
- **Outdated figures:** The 2024 snapshot quotes attack and breach-cost figures from 2018–2019. Those statistics are omitted, along with blanket claims that attacks are preventable.
- **Credibility:** The redesign avoids unsupported “best” claims, fabricated response times, current certifications, unverified technology logos, and invented 2023–2026 milestones.
- **Visitor action:** A consistent inquiry CTA leads to a contact form backed by a configurable Nodemailer email endpoint. Service details and guides help visitors make a useful inquiry.
- **Visual identity:** Retains gold brand cues and the archived logo, adds an enterprise navy palette, a Three.js globe, GSAP transitions, and a radar workflow illustration.
- **Accessibility and resilience:** Semantic sections, a skip link, keyboard-operated tabs, native dialog focus handling, responsive layouts, reduced-motion support, WebGL fallback, and useful content without JavaScript.

## Content to add when available

Verified 2023–2026 achievements, approved client case studies, current partnerships, certifications, exact coverage commitments, supported operating systems, team biographies, and current address details would deepen the site. No placeholders or invented results are presented as company achievements.

The website contains a minimal privacy notice matching its current behavior. If analytics, a CRM, server-side lead capture, or other data processing is introduced, update both the implementation and notice to reflect the actual operation.

## Dedicated pages and MDR reference

The website now includes separate Solutions, MDR Approach, Professional Services, and Contact Us pages. Shared templates generate consistent navigation, footer, metadata, and dialogs across all five pages.

The user supplied [SentinelOne’s MDR page](https://www.sentinelone.com/global-services/managed-detection-and-response/) as a structure and presentation reference. Its sequence of introduction, advantages, capabilities, operating process, and onboarding informed the MDR page’s depth. The OmniSecuritas implementation uses original copy, original CSS visuals, its own branding, and its documented services. It does not import SentinelOne’s proprietary product names, customer evidence, warranties, evaluation scores, certifications, response statistics, or platform integrations.

## Story copy update — 28 October 2026

At the user’s request, the public “Our Story” section removes the CYDEF partnership narrative and its coverage link. The replacement copy names ESET, Malwarebytes, Trend Micro, and Fortinet as endpoint protection and antivirus partners, based on the relationships supplied directly by the user. It connects these technologies with the team’s hands-on experience, security expertise, threat hunting, and coordinated response. It does not assign partnership start dates, claim exclusivity or certification, or describe any vendor as objectively the most effective. The 2022 tile now describes the company mission; current partner names appear in the undated introduction rather than being attributed to that year.
