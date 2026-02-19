import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  badge?: string | number;
  badgeColor?: 'default' | 'success' | 'warning' | 'error';
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function CollapsibleSection({
  title,
  badge,
  badgeColor = 'default',
  defaultOpen = true,
  children,
  className = '',
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const badgeColors = {
    default: 'text-vault-yellow',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400',
  };

  return (
    <section className={className}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between border-b border-vault-yellow-dark pb-2 mb-4 hover:opacity-80 transition-opacity"
      >
        <div className="flex items-center gap-2">
          {isOpen ? (
            <ChevronDown size={18} className="text-vault-yellow" />
          ) : (
            <ChevronRight size={18} className="text-vault-yellow" />
          )}
          <h3 className="text-vault-yellow font-bold uppercase tracking-wide">
            {title}
          </h3>
        </div>
        {badge !== undefined && (
          <span className={`text-sm font-mono ${badgeColors[badgeColor]}`}>
            {badge}
          </span>
        )}
      </button>
      {isOpen && <div className="space-y-4">{children}</div>}
    </section>
  );
}
