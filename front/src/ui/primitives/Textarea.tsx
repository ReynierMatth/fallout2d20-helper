import * as React from 'react';

import { cn } from '../../lib/cn';

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'min-h-[80px] w-full rounded border-2 border-vault-yellow-dark bg-vault-gray-light px-3 py-2 text-sm text-vault-yellow placeholder:text-vault-yellow-dark/50 transition-colors focus:border-vault-yellow focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
export type { TextareaProps };
