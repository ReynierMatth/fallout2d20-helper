import { cn } from '../../lib/cn';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn('max-w-7xl w-full mx-auto px-4 py-6', className)}>
      {children}
    </div>
  );
}
