'use client';

import React, { useEffect, useRef, useState } from 'react';
import { LazyMotion, domAnimation, m, useInView } from 'motion/react';
import { cn } from '@/lib/utils';

export interface Step {
  title: string;
  description: string;
  colorTheme?: 'orange' | 'blue' | 'purple';
  colors?: { bg: string; text: string; border: string };
}

export interface StepPosition {
  className?: string;
  rotate?: string;
}

export interface HowItWorksProps {
  features?: Step[];
  className?: string;
  stepPositions?: StepPosition[];
  desktopHeight?: number;
  connectionPath?: string;
}

interface CardProps extends Step {
  number: string;
  className?: string;
  rotate?: string;
}

const Pin = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M16 3a1 1 0 0 1 .117 1.993l-.117 .007v4.764l1.894 3.789a1 1 0 0 1 .1 .331l.006 .116v2a1 1 0 0 1 -.883 .993l-.117 .007h-4v4a1 1 0 0 1 -1.993 .117l-.007 -.117v-4h-4a1 1 0 0 1 -.993 -.883l-.007 -.117v-2a1 1 0 0 1 .06 -.34l.046 -.107l1.894 -3.791v-4.762a1 1 0 0 1 -.117 -1.993l.117 -.007h8z" />
  </svg>
);

function Card({
  number,
  title,
  description,
  colorTheme = 'blue',
  className,
  rotate,
  colors,
}: CardProps) {
  const defaultColors = {
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-500/10',
      text: 'text-orange-700 dark:text-orange-400',
      border: 'border-orange-100 dark:border-orange-500/20',
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-500/10',
      text: 'text-blue-700 dark:text-blue-400',
      border: 'border-blue-100 dark:border-blue-500/20',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-500/10',
      text: 'text-purple-700 dark:text-purple-400',
      border: 'border-purple-100 dark:border-purple-500/20',
    },
  };
  const theme = colors || defaultColors[colorTheme];

  return (
    <li className={cn('threat-step relative w-full lg:w-[280px]', rotate, className)}>
      <div className="threat-card bg-white dark:bg-neutral-900 p-2 rounded-[22px] border border-neutral-200 dark:border-neutral-800">
        <Pin className={cn('threat-pin mx-auto mb-4 h-6 w-6', theme.text)} />
        <div
          className={cn(
            'threat-card-inner relative flex h-full flex-col overflow-hidden rounded-[15px] border p-5',
            theme.bg,
            theme.border,
          )}
        >
          <span className={cn('threat-step-number mb-4 text-4xl', theme.text)} aria-hidden="true">
            {number}
          </span>
          <h3 className="mb-3 text-2xl font-semibold tracking-tight text-neutral-800 dark:text-neutral-100">
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
            {description}
          </p>
        </div>
      </div>
    </li>
  );
}

const DEFAULT_CARD_POSITIONS: StepPosition[] = [
  { className: 'lg:absolute lg:top-0 lg:left-[11%]', rotate: 'lg:rotate-4' },
  { className: 'lg:absolute lg:top-[175px] lg:right-[11%]', rotate: 'lg:-rotate-4' },
  { className: 'lg:absolute lg:top-[350px] lg:left-[11%]', rotate: 'lg:rotate-4' },
  { className: 'lg:absolute lg:top-[525px] lg:right-[11%]', rotate: 'lg:-rotate-4' },
  { className: 'lg:absolute lg:top-[700px] lg:left-[11%]', rotate: 'lg:rotate-4' },
];

const DEFAULT_FEATURES: Step[] = [
  {
    title: 'Identify',
    description:
      'Understand the assets, activity, and priorities that shape your security approach.',
    colorTheme: 'orange',
  },
  {
    title: 'Protect',
    description: 'Strengthen endpoint defenses and everyday security practices.',
    colorTheme: 'blue',
  },
  {
    title: 'Detect',
    description: 'Investigate suspicious endpoint behavior with analyst context.',
    colorTheme: 'orange',
  },
  {
    title: 'Respond',
    description: 'Coordinate an informed response within agreed responsibilities.',
    colorTheme: 'blue',
  },
  {
    title: 'Recover',
    description: 'Review findings, support recovery planning, and strengthen resilience.',
    colorTheme: 'orange',
  },
];

export default function HowItWorks({
  features,
  className,
  stepPositions,
  desktopHeight,
  connectionPath,
}: HowItWorksProps) {
  const board = useRef<HTMLDivElement>(null);
  const inView = useInView(board, { amount: 0.1 });
  const [motionAllowed, setMotionAllowed] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setMotionAllowed(!preference.matches && !document.hidden);
    update();
    preference.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    return () => {
      preference.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, []);
  const data = features?.length ? features : DEFAULT_FEATURES;
  const positions = stepPositions?.length ? stepPositions : DEFAULT_CARD_POSITIONS;
  const height = desktopHeight ?? Math.max(360, (data.length - 1) * 175 + 300);
  const shouldAnimate = inView && motionAllowed;

  return (
    <LazyMotion features={domAnimation}>
      <div
        ref={board}
        className={cn('how-it-works-board relative px-6 py-8 lg:px-8 lg:py-12', className)}
      >
        <div
          className="threat-board-grid pointer-events-none absolute inset-0"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="relative mx-auto w-full max-w-[1000px]">
            {data.length > 1 && (
              <svg
                className="threat-connections pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
                viewBox={`0 0 1000 ${height}`}
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <m.path
                  d={
                    connectionPath ||
                    'M 250 135 C 460 135, 540 310, 750 310 C 880 310, 500 400, 250 485 C 120 485, 500 660, 750 660 C 880 660, 500 750, 250 835'
                  }
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="8 6"
                  fill="none"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  initial={false}
                  animate={{ strokeDashoffset: shouldAnimate ? -140 : 0 }}
                  transition={
                    shouldAnimate
                      ? { duration: 6, repeat: Infinity, ease: 'linear' }
                      : { duration: 0 }
                  }
                />
              </svg>
            )}
            <ol
              className="threat-step-list relative m-0 flex list-none flex-col gap-7 p-0 lg:block lg:h-[var(--md-height)]"
              style={{ '--md-height': `${height}px` } as React.CSSProperties}
              aria-label="Threat hunting and resilience process"
            >
              {data.map((step, index) => {
                const position = positions[index % positions.length];
                return (
                  <Card
                    key={step.title}
                    {...step}
                    number={String(index + 1).padStart(2, '0')}
                    rotate={position.rotate}
                    className={position.className}
                  />
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
