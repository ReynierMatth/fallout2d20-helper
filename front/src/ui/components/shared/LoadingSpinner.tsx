import { Loader2 } from 'lucide-react';
import { cn } from '../../../lib/cn';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export function LoadingSpinner({ size = 24, className }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex items-center justify-center py-8', className)}>
      <Loader2 size={size} className="animate-spin text-vault-yellow" />
    </div>
  );
}
