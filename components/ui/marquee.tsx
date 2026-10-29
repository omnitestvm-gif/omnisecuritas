import type { ComponentPropsWithoutRef, CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface MarqueeProps extends ComponentPropsWithoutRef<'div'> {
  reverse?: boolean;
  repeat?: number;
  paused?: boolean;
  enhanced?: boolean;
  vertical?: boolean;
  duration?: number;
  label: string;
}

export function Marquee({
  children,
  className,
  reverse = false,
  repeat = 4,
  paused = false,
  enhanced = false,
  vertical = false,
  duration = 45,
  label,
  ...props
}: MarqueeProps) {
  return (
    <div
      className={cn('security-marquee relative flex gap-3 overflow-hidden', className)}
      data-enhanced={enhanced}
      data-paused={paused}
      data-reverse={reverse}
      role="region"
      tabIndex={0}
      aria-label={label}
      style={{ '--duration': `${duration}s`, '--gap': '0.75rem' } as CSSProperties}
      {...props}
    >
      {Array.from({ length: Math.max(1, repeat) }, (_, index) => (
        <div
          className={cn(
            'security-marquee-group flex min-w-full shrink-0 items-center justify-around gap-3',
            vertical ? 'animate-marquee-vertical' : 'animate-marquee',
          )}
          role={index === 0 ? 'list' : undefined}
          aria-hidden={index > 0 ? true : undefined}
          key={index}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
