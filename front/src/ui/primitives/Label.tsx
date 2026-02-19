import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';

import { cn } from '../../lib/cn';

const Label = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'text-sm font-medium uppercase tracking-wide text-vault-yellow peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
      className
    )}
    {...props}
  />
));
Label.displayName = 'Label';

export { Label };
