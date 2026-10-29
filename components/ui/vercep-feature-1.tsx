'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import { Eye, ScanSearch, Workflow, RefreshCw, Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Marquee } from '@/components/ui/marquee';

export const SECURITY_QUESTIONS = [
  'Which endpoints need attention?',
  'What does this activity mean?',
  'Is this behavior expected?',
  'Where are our security gaps?',
  'How should we prioritize risk?',
  'Who investigates suspicious activity?',
  'What needs our team’s approval?',
  'How do we coordinate a response?',
  'What can we learn from an incident?',
  'How do we strengthen our defenses?',
  'Are our people prepared?',
  'What should we improve next?',
];

const features = [
  {
    category: 'VISIBILITY',
    title: 'See what deserves attention.',
    description:
      'Bring relevant endpoint activity into view and focus on the signals that need a closer look.',
    icon: Eye,
  },
  {
    category: 'EXPERT INSIGHT',
    title: 'Understand the risk.',
    description:
      'Our analysts investigate suspicious behavior and translate their findings into context your team can use.',
    icon: ScanSearch,
  },
  {
    category: 'COORDINATED RESPONSE',
    title: 'Know what comes next.',
    description:
      'Work from clear findings, agreed responsibilities, and response permissions that support informed action.',
    icon: Workflow,
  },
  {
    category: 'CONTINUOUS IMPROVEMENT',
    title: 'Strengthen over time.',
    description:
      'Use investigation insights, practical recommendations, and incident readiness to improve your security posture.',
    icon: RefreshCw,
  },
];

/** Adapted from the supplied scrolling-topic and four-feature section. */
export function Component() {
  const band = useRef<HTMLDivElement>(null);
  const inView = useInView(band, { amount: 0.1 });
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [system, setSystem] = useState({ ready: false, reduced: false, visible: true });
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () =>
      setSystem({ ready: true, reduced: preference.matches, visible: !document.hidden });
    update();
    preference.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    return () => {
      preference.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  const enhanced = system.ready && !system.reduced;
  const paused = manuallyPaused || !inView || !system.visible;
  const rows = [
    SECURITY_QUESTIONS.slice(0, 4),
    SECURITY_QUESTIONS.slice(4, 8),
    SECURITY_QUESTIONS.slice(8),
  ];
  const ControlIcon = manuallyPaused ? Play : Pause;

  return (
    <div className={cn('security-clarity-content relative')}>
      <div className="security-clarity-header mx-auto flex flex-col items-center px-6 text-center">
        <div className="eyebrow light">SECURITY, MADE UNDERSTANDABLE</div>
        <h2 id="security-clarity-title">
          Clarity for your team.
          <br />
          <span>Confidence for your business.</span>
        </h2>
        <p>
          Security decisions should come with context. We help your team understand the signals,
          focus on the risks, and move forward with a clear plan.
        </p>
      </div>

      <div ref={band} className="security-topic-band mx-auto" data-reduced={system.reduced}>
        <div className="security-topic-toolbar">
          <span>THE QUESTIONS BEHIND STRONGER SECURITY</span>
          <button
            type="button"
            className="marquee-control"
            style={{ visibility: system.ready ? 'visible' : 'hidden' }}
            aria-pressed={manuallyPaused}
            aria-label={
              system.reduced
                ? 'Motion reduced by your device preference'
                : manuallyPaused
                  ? 'Resume moving security topics'
                  : 'Pause moving security topics'
            }
            disabled={system.reduced}
            onClick={() => setManuallyPaused((value) => !value)}
          >
            <ControlIcon size={12} strokeWidth={1.7} aria-hidden="true" />
            <span>
              {system.reduced
                ? 'Reduced motion'
                : manuallyPaused
                  ? 'Resume motion'
                  : 'Pause motion'}
            </span>
          </button>
        </div>
        <div className="security-marquee-mask">
          {rows.map((questions, index) => (
            <Marquee
              key={index}
              label={`Security questions, row ${index + 1}`}
              duration={[45, 50, 42][index]}
              reverse={index === 1}
              repeat={4}
              paused={paused}
              enhanced={enhanced}
            >
              {questions.map((question) => (
                <Badge
                  key={question}
                  className="security-topic-chip"
                  size="lg"
                  variant="outline"
                  role="listitem"
                >
                  <span className="security-chip-dot" aria-hidden="true" />
                  {question}
                </Badge>
              ))}
            </Marquee>
          ))}
        </div>
      </div>

      <div className="security-feature-grid mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ category, title, description, icon: Icon }, index) => (
          <article className="security-feature-panel" key={title}>
            <div className="security-feature-top">
              <span className="security-feature-icon">
                <Icon size={25} strokeWidth={1.45} aria-hidden="true" />
              </span>
              <span className="security-feature-index" aria-hidden="true">
                0{index + 1}
              </span>
            </div>
            <div className="security-feature-copy">
              <span className="security-feature-category">{category}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="security-clarity-footer">
        <a className="text-link light" href="mdr-approach.html">
          Put clarity into practice <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}

export default Component;
