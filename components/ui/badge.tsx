import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

type BadgeProps = ComponentPropsWithoutRef<'span'> & {
  variant?: 'outline' | 'default';
  size?: 'default' | 'lg';
};

export function Badge({ className, variant = 'outline', size = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border',
        size === 'lg' ? 'px-4 py-2' : 'px-3 py-1',
        variant === 'outline' ? 'bg-transparent' : 'bg-background',
        className,
      )}
      {...props}
    />
  );
}
