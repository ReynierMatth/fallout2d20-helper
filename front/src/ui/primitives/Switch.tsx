import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

import { cn } from '../../lib/cn';

const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full',
      'border-2 border-vault-yellow-dark bg-vault-gray-light',
      'transition-colors',
      'data-[state=checked]:bg-vault-yellow data-[state=checked]:border-vault-yellow',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-vault-blue-dark',
      'disabled:pointer-events-none disabled:opacity-50',
      className
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        'pointer-events-none block h-4 w-4 rounded-full',
        'bg-vault-yellow-dark shadow-sm',
        'transition-transform',
        'data-[state=checked]:translate-x-5 data-[state=checked]:bg-vault-blue',
        'data-[state=unchecked]:translate-x-0.5'
      )}
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };
