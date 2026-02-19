import * as React from 'react';

import { cn } from '../../lib/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'min-h-11 w-full rounded border-2 border-vault-yellow-dark bg-vault-gray-light px-3 py-2 text-sm text-vault-yellow placeholder:text-vault-yellow-dark/50 transition-colors focus:border-vault-yellow focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
export type { InputProps };
