const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  nav.classList.toggle('open', open);
});
nav.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
  }),
);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
  }
});

const steps = [
  [
    '01 / ENDPOINT VISIBILITY',
    'Understand your environment.',
    'Endpoint telemetry helps establish normal activity and brings unusual behavior into view for review.',
  ],
  [
    '02 / ANALYST INVESTIGATION',
    'Turn signals into understanding.',
    'Our analysts examine suspicious activity, connect the evidence, and distinguish relevant threats from routine behavior.',
  ],
  [
    '03 / COORDINATED RESPONSE',
    'Take an informed next step.',
    'We communicate findings and coordinate response actions with your team, within the agreed service scope and approval process.',
  ],
  [
    '04 / CONTINUOUS IMPROVEMENT',
    'Make every insight count.',
    'Clear reporting and practical recommendations help your team understand incidents and strengthen its security posture.',
  ],
];
const tabs = [...document.querySelectorAll('.process-tab')];
function selectStep(index) {
  tabs.forEach((t, i) => {
    t.classList.toggle('active', i === index);
    t.setAttribute('aria-selected', String(i === index));
    t.tabIndex = i === index ? 0 : -1;
  });
  const [code, title, copy] = steps[index];
  document.querySelector('#operation-code').textContent = code;
  document.querySelector('#operation-title').textContent = title;
  document.querySelector('#operation-text').textContent = copy;
  document.querySelector('#step-count').textContent = `0${index + 1} / 04`;
  document.querySelector('#process-panel').setAttribute('aria-labelledby', tabs[index].id);
  if (window.gsap && !reduceMotion.matches)
    gsap.fromTo('.operation-detail', { opacity: 0.25, y: 8 }, { opacity: 1, y: 0, duration: 0.35 });
}
tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => selectStep(i));
  tab.addEventListener('keydown', (e) => {
    let next = i;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % tabs.length;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft')
      next = (i + tabs.length - 1) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    else return;
    e.preventDefault();
    selectStep(next);
    tabs[next].focus();
  });
});

const services = {
  mdr: [
    'MANAGED DETECTION & RESPONSE',
    'Expertise behind every investigation.',
    '<p>Managed Detection and Response combines endpoint visibility with human investigation. OmniSecuritas helps your team understand suspicious activity and coordinate an appropriate response.</p><h3>What we focus on</h3><ul><li>Monitoring activity across enrolled laptops, desktops, and servers</li><li>Investigating unexpected behavior and suspicious signals</li><li>Communicating findings with relevant incident context</li><li>Coordinating response with your designated team</li><li>Sharing reporting and recommendations for improvement</li></ul><p>Platform support, monitoring arrangements, response permissions, and service commitments are confirmed during scoping.</p>',
  ],
  endpoint: [
    'ENDPOINT SECURITY',
    'Protect where work happens.',
    '<p>Endpoints connect your people to the business. Managed EDR and anti-malware help bring visibility and protection to the devices your organization depends on.</p><h3>Build the right foundation</h3><ul><li>Review endpoint inventory and deployment requirements</li><li>Establish protection for supported devices</li><li>Investigate relevant endpoint activity</li><li>Provide visibility through dashboards and reports</li></ul><p>We discuss supported operating systems, your existing tools, and the right deployment approach before agreeing on a solution.</p>',
  ],
  hunting: [
    'THREAT HUNTING',
    'Look beyond the obvious.',
    '<p>Not every threat arrives as a familiar malicious file. Unusual scripts, unexpected application behavior, and suspicious patterns may require closer human investigation.</p><h3>From activity to context</h3><ul><li>Examine behavior that falls outside expected activity</li><li>Connect endpoint signals to potential threats</li><li>Investigate suspicious tools and unwanted applications</li><li>Provide actionable findings to support response</li></ul><p>Threat hunting supports an ongoing security program. Coverage and deliverables depend on the agreed engagement.</p>',
  ],
  assessment: [
    'PROFESSIONAL SERVICES',
    'Understand your exposure.',
    '<p>A useful assessment translates technical observations into business priorities. Our professional services help identify weaknesses and clarify opportunities to strengthen controls.</p><h3>Services to discuss</h3><ul><li>Threat and risk assessments</li><li>Security assessments and system reviews</li><li>Penetration testing within a defined, authorized scope</li><li>Prioritized recommendations for remediation</li></ul><p>Each engagement starts with clear objectives, authorized systems, methods, and deliverables.</p>',
  ],
  incident: [
    'INCIDENT READINESS & RESPONSE',
    'Prepare for the moments that matter.',
    '<p>Clear responsibilities and a rehearsed plan make incident response more effective. We help organizations prepare and provide professional services for investigation and response.</p><h3>Strengthen your readiness</h3><ul><li>Review incident response plans and escalation paths</li><li>Define contacts, responsibilities, and approvals</li><li>Support incident investigation and response</li><li>Discuss forensic investigation requirements and evidence handling</li></ul><p>For an active incident, contact your designated security support channel. This sales inquiry form is not an emergency response channel.</p>',
  ],
  awareness: [
    'CYBERSECURITY AWARENESS',
    'Make security an everyday habit.',
    '<p>Technology is one part of resilience. Awareness training helps people recognize risks and make informed decisions when working with email, business applications, and sensitive information.</p><h3>Build a stronger security culture</h3><ul><li>Help staff recognize suspicious messages and risky behavior</li><li>Encourage early reporting through your internal process</li><li>Reinforce safe device and account practices</li><li>Align training with your organization’s priorities</li></ul><p>Talk to us about available training options and how they can support your wider security program.</p>',
  ],
};
const guides = {
  mdr: [
    'MDR / EXPLAINED',
    'What does MDR actually do for your business?',
    '<p>Security tools can produce signals. Understanding what those signals mean takes context, investigation, and people who know how to respond.</p><h3>A service around your technology</h3><p>MDR combines detection technology with managed investigation and response support. Analysts review relevant activity, examine suspicious behavior, and help your team decide what to do next.</p><h3>What your business gains</h3><p>The practical value is access to security expertise, clearer findings, and a defined response process. It can help an internal IT team extend its capabilities without taking on every security task alone.</p><h3>Questions to ask a provider</h3><ul><li>Which devices and data sources are covered?</li><li>Who investigates an alert and how are findings communicated?</li><li>Which response actions need our approval?</li><li>What coverage, reporting, and service commitments are agreed?</li></ul><p>Start with your business priorities, then agree on the technology, responsibilities, and scope that support them.</p>',
  ],
  edr: [
    'LAYERS / CONNECTED',
    'Antivirus, EDR, and MDR.',
    '<p>These terms describe different layers of a security program. Understanding their roles makes it easier to ask useful questions about your protection.</p><h3>Antivirus and anti-malware</h3><p>These tools help prevent, detect, or remove malicious software using signatures and other detection methods. They form a useful protective layer.</p><h3>Endpoint Detection and Response</h3><p>EDR provides visibility into endpoint activity and tools for investigation and response. Operating it effectively requires people, processes, and clear decisions.</p><h3>Managed Detection and Response</h3><p>MDR is a service that brings analyst expertise to detection and response. Your service scope determines the covered technology, investigation process, and actions a provider can take.</p><h3>A connected approach</h3><p>Prevention, visibility, and human response work together. Discuss your existing tools with a provider to identify gaps and avoid unnecessary overlap.</p>',
  ],
  response: [
    'RESPONSE / READY',
    'The best time to plan your response is now.',
    '<p>An incident creates pressure. A clear plan helps your people know who to contact, what to preserve, and which decisions need approval.</p><h3>1. Name the decision makers</h3><p>Identify your technical lead, business owner, and relevant internal advisers. Keep contact details accessible through an agreed backup channel.</p><h3>2. Define the first steps</h3><p>Document how staff report suspicious activity and how your team escalates it. Agree on response permissions before an urgent situation arises.</p><h3>3. Preserve the context</h3><p>Record observations and timing. Follow your incident process and specialist guidance when handling affected systems and potential evidence.</p><h3>4. Rehearse and improve</h3><p>Walk through a realistic scenario with your team. Use the gaps you find to improve responsibilities, communication, and recovery planning.</p><p>For support tailored to your environment, discuss an incident readiness engagement with OmniSecuritas.</p>',
  ],
};
const dialog = document.querySelector('#detail-dialog');
let dialogOrigin;
function openDetail(content, showCta = true) {
  dialogOrigin = document.activeElement;
  document.querySelector('#dialog-eyebrow').textContent = content[0];
  document.querySelector('#dialog-title').textContent = content[1];
  document.querySelector('#dialog-body').innerHTML = content[2];
  document.querySelector('#dialog-cta').hidden = !showCta;
  dialog.showModal();
  document.body.style.overflow = 'hidden';
  dialog.scrollTop = 0;
}
document
  .querySelectorAll('.solution-open')
  .forEach((b) => b.addEventListener('click', () => openDetail(services[b.dataset.solution])));
document
  .querySelectorAll('[data-guide]')
  .forEach((b) => b.addEventListener('click', () => openDetail(guides[b.dataset.guide])));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (e) => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
      dialog.close();
  }
});
dialog.addEventListener('close', () => {
  document.body.style.overflow = '';
  dialogOrigin?.focus();
});
document.querySelector('#dialog-cta').addEventListener('click', () => dialog.close());
document
  .querySelector('#privacy-open')
  .addEventListener('click', () =>
    openDetail(
      [
        'PRIVACY NOTICE',
        'How we handle your inquiry.',
        '<p>When you submit this form, your name, email, company, service interest, and message are sent to our server and email provider for delivery to sales@omnisecuritas.com.ph. We use these details to respond to your inquiry and discuss relevant services.</p><p>The website does not maintain a separate lead database. Our email systems and hosting provider may retain correspondence or operational records under their own policies. Basic abuse controls process request metadata, including an expiring hashed network identifier. Avoid sharing passwords or sensitive incident evidence through this form.</p><p>No analytics or advertising trackers are included. For questions about your information, contact <a href="mailto:sales@omnisecuritas.com.ph">sales@omnisecuritas.com.ph</a>.</p>',
      ],
      false,
    ),
  );

document.querySelector('#contact-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (form.getAttribute('aria-busy') === 'true' || !form.reportValidity()) return;
  const button = form.querySelector('[type="submit"]');
  const originalLabel = button.innerHTML;
  const result = form.querySelector('#form-result');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
  button.disabled = true;
  button.textContent = 'Sending…';
  form.setAttribute('aria-busy', 'true');
  result.hidden = false;
  result.textContent = 'Submitting your inquiry…';
  result.dataset.state = 'pending';
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
      signal: controller.signal,
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || payload?.ok !== true) {
      const message = payload?.message;
      throw new Error(
        typeof message === 'string' && message.length < 300
          ? message
          : 'Online inquiries are unavailable. Please email our sales team directly.',
      );
    }
    result.textContent = 'Your inquiry was submitted. Thank you for contacting OmniSecuritas.';
    result.dataset.state = 'success';
    form.reset();
  } catch (error) {
    result.dataset.state = 'error';
    const text = document.createElement('p');
    text.textContent =
      error.name === 'AbortError'
        ? 'Submission timed out. If you have not received a reply, please contact our sales team directly.'
        : error instanceof TypeError
          ? 'We could not connect. Please check your internet connection and try again.'
          : error.message;
    const link = document.createElement('a');
    link.href = 'mailto:sales@omnisecuritas.com.ph';
    link.textContent = 'Email sales@omnisecuritas.com.ph ↗';
    result.replaceChildren(text, link);
  } finally {
    clearTimeout(timer);
    button.disabled = false;
    button.innerHTML = originalLabel;
    form.removeAttribute('aria-busy');
  }
});

// Vela-inspired motion preserves the existing three-line headline and layout.
// Every line reads a single, seekable Web Animation clock.
const heroTitle = document.querySelector('#hero-title');
const heroLines = [...document.querySelectorAll('#hero-title .hero-line')];
if (heroTitle && heroLines.length) {
  const slot = 1750;
  const cycle = slot * heroLines.length;
  const protection = heroLines.find((line) => line.classList.contains('hero-line-accent'));
  const protectionText = protection?.textContent ?? '';
  let typedText;
  let cursor;
  if (protection) {
    // Keep a full, accessible copy in flow to reserve the original line's size.
    const measure = document.createElement('span');
    measure.className = 'protection-typewriter-measure';
    measure.textContent = protectionText;
    const visual = document.createElement('span');
    visual.className = 'protection-typewriter-visual';
    visual.setAttribute('aria-hidden', 'true');
    typedText = document.createTextNode(protectionText);
    cursor = document.createElement('span');
    cursor.className = 'protection-typewriter-cursor';
    visual.append(typedText, cursor);
    protection.classList.add('protection-typewriter');
    protection.replaceChildren(measure, visual);
  }
  let clock;
  let frame;

  function renderHeadline() {
    const time = Number(clock.currentTime ?? 0);
    heroLines.forEach((line, index) => {
      const phase = (((time - index * slot) % cycle) + cycle) % cycle;
      if (line === protection) {
        // Type, hold, then erase on the same clock as the other headline lines.
        const hasStarted = time >= index * slot;
        let count = protectionText.length;
        if (hasStarted && phase < 1200) {
          count = Math.floor((phase / 1200) * protectionText.length);
        } else if (hasStarted && phase > cycle - 700) {
          count = Math.ceil(((cycle - phase) / 700) * protectionText.length);
        }
        const text = protectionText.slice(0, count);
        if (typedText.data !== text) typedText.data = text;
        const typing = hasStarted && (phase < 1200 || phase > cycle - 700);
        cursor.style.opacity = typing || Math.floor(time / 530) % 2 === 0 ? '1' : '0';
        return;
      }
      let opacity = 1;
      let y = 0;
      let blur = 0;
      let scale = 1;
      if (phase < 500) {
        // Enter over 0.5s with an ease-out cubic.
        const remaining = (1 - phase / 500) ** 3;
        opacity = 1 - remaining;
        y = 0.32 * remaining;
        blur = 10 * remaining;
        scale = 1 - 0.04 * remaining;
      } else if (phase > cycle - 420) {
        // Leave in the 0.42s before this line's next turn.
        const progress = ((phase - (cycle - 420)) / 420) ** 3;
        opacity = 1 - progress;
        y = -0.16 * progress;
        blur = 8 * progress;
      }
      line.style.opacity = String(opacity);
      line.style.transform = 'translateY(' + y + 'em) scale(' + scale + ')';
      line.style.filter = 'blur(' + blur + 'px)';
    });
    frame = requestAnimationFrame(renderHeadline);
  }

  function syncHeadlineVisibility() {
    cancelAnimationFrame(frame);
    if (!clock) return;
    if (document.hidden) {
      clock.pause();
    } else {
      clock.play();
      renderHeadline();
    }
  }

  function configureHeadlineMotion() {
    cancelAnimationFrame(frame);
    clock?.cancel();
    clock = null;
    heroLines.forEach((line) => {
      ['opacity', 'transform', 'filter', 'transform-origin'].forEach((property) =>
        line.style.removeProperty(property),
      );
    });
    if (protection) {
      typedText.data = protectionText;
      cursor.style.opacity = '1';
    }
    if (reduceMotion.matches) return;
    heroLines.forEach((line) => {
      line.style.transformOrigin = 'left center';
    });
    clock = heroTitle.animate([{}, {}], { duration: cycle, iterations: Infinity });
    syncHeadlineVisibility();
  }

  reduceMotion.addEventListener('change', configureHeadlineMotion);
  document.addEventListener('visibilitychange', syncHeadlineVisibility);
  configureHeadlineMotion();
}

if (window.gsap && window.ScrollTrigger && !reduceMotion.matches) {
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    if (document.querySelector('.hero-copy')) {
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro
        .from('.hero-copy .eyebrow', { y: 12, opacity: 0, duration: 0.65 }, 0.1)
        .from('.hero-copy > p', { y: 14, opacity: 0, duration: 0.65 }, 0.4)
        .from('.hero-actions', { y: 12, opacity: 0, duration: 0.65 }, 0.55)
        .from('.hero-proof', { opacity: 0, duration: 0.6 }, 0.75);
      gsap.from('.signal-card', { y: 14, opacity: 0, duration: 0.8, stagger: 0.12, delay: 0.45 });
    }
    if (document.querySelector('.page-hero:not(.services-cinematic):not(.solutions-strata)')) {
      gsap.from('.page-hero .page-title > *', {
        y: 24,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
      });
    }
    document.querySelectorAll('.reveal').forEach((el) => {
      gsap.from(el, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 93%', once: true },
      });
    });
    if (document.querySelector('.hero-visual'))
      gsap.to('.hero-visual', {
        y: 45,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
      });
  });
}

// Keep inquiry topics consistent when a visitor arrives from a service page.
const topicSelect = document.querySelector('[name="interest"]');
const requestedTopic = new URLSearchParams(window.location.search).get('interest');
if (
  topicSelect &&
  requestedTopic &&
  [...topicSelect.options].some((option) => option.value === requestedTopic)
)
  topicSelect.value = requestedTopic;
