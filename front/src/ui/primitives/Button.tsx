import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded font-medium uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-vault-blue-dark disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-vault-yellow text-vault-blue hover:bg-vault-yellow-dark active:bg-vault-yellow-dark',
        outline:
          'border-2 border-vault-yellow text-vault-yellow bg-transparent hover:bg-vault-yellow/10 active:bg-vault-yellow/20',
        ghost:
          'text-vault-yellow-dark bg-transparent hover:bg-vault-yellow-dark/10 hover:text-vault-yellow active:bg-vault-yellow-dark/20',
        danger:
          'bg-vault-danger text-white hover:bg-vault-danger/80 active:bg-vault-danger/70',
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        md: 'h-11 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
export type { ButtonProps };
