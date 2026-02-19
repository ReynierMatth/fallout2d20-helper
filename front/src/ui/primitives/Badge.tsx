import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded font-medium uppercase tracking-wide transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-vault-yellow text-vault-blue',
        outline: 'border border-vault-yellow text-vault-yellow bg-transparent',
        success: 'bg-vault-success text-white',
        danger: 'bg-vault-danger text-white',
        muted: 'bg-vault-gray-light text-vault-yellow-dark',
      },
      size: {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
export type { BadgeProps };
