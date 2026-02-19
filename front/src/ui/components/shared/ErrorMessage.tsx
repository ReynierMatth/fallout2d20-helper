import { AlertCircle } from 'lucide-react';
import { cn } from '../../../lib/cn';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  return (
    <div className={cn('flex items-center gap-2 p-4 rounded bg-red-900/20 border border-red-800 text-red-400', className)}>
      <AlertCircle size={20} className="flex-shrink-0" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
