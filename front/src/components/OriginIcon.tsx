import { User, Bot } from 'lucide-react';

// Origin to emoji/icon mapping
const originIcons: Record<string, string> = {
  brotherhood: '⚔️',
  ghoul: '☢️',
  superMutant: '💪',
  misterHandy: '🤖',
  survivor: '🏜️',
  vaultDweller: '🔵',
};

interface OriginIconProps {
  originId?: string | null;
  type?: 'pc' | 'npc' | 'PC' | 'NPC';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function OriginIcon({ originId, type, size = 'md', className = '' }: OriginIconProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 24,
  };

  // If we have an origin, show the emoji
  if (originId && originIcons[originId]) {
    return (
      <span className={`${sizeClasses[size]} ${className}`} title={originId}>
        {originIcons[originId]}
      </span>
    );
  }

  // Fallback to User/Bot icon based on type
  const normalizedType = type?.toLowerCase();
  if (normalizedType === 'pc') {
    return <User size={iconSizes[size]} className={`text-vault-yellow ${className}`} />;
  }

  return <Bot size={iconSizes[size]} className={`text-vault-yellow-dark ${className}`} />;
}

// Helper to get just the emoji string
export function getOriginEmoji(originId?: string | null): string | null {
  if (originId && originIcons[originId]) {
    return originIcons[originId];
  }
  return null;
}
