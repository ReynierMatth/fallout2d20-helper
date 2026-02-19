interface HPBarProps {
  current: number;
  max: number;
  radiation?: number; // Radiation damage that reduces effective max HP
  showNumbers?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function HPBar({
  current,
  max,
  radiation = 0,
  showNumbers = true,
  size = 'md',
  className = '',
}: HPBarProps) {
  // Effective max HP = max - radiation
  const effectiveMax = Math.max(0, max - radiation);

  // Current HP should never exceed effective max
  const effectiveCurrent = Math.min(current, effectiveMax);

  // Calculate percentages based on total max HP
  const healthPercentage = max > 0 ? Math.max(0, (effectiveCurrent / max) * 100) : 0;
  const radiationPercentage = max > 0 ? Math.max(0, (radiation / max) * 100) : 0;

  // Color based on health percentage relative to EFFECTIVE max
  const getBarColor = () => {
    if (effectiveMax === 0) return 'bg-gray-600';
    const effectivePercentage = (effectiveCurrent / effectiveMax) * 100;
    if (effectivePercentage > 66) return 'bg-green-500';
    if (effectivePercentage > 33) return 'bg-yellow-500';
    if (effectivePercentage > 0) return 'bg-red-500';
    return 'bg-gray-600';
  };

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`flex-1 bg-gray-700 rounded-full overflow-hidden border border-gray-600 ${sizeClasses[size]} flex`}
      >
        {/* Health portion */}
        <div
          className={`h-full transition-all duration-300 ${getBarColor()}`}
          style={{ width: `${healthPercentage}%` }}
        />
        {/* Empty (recoverable) portion - implicit via gray background */}
        {/* Radiation portion (on the right, showing lost max HP) */}
        {radiation > 0 && (
          <div
            className="h-full bg-red-600 ml-auto"
            style={{ width: `${radiationPercentage}%` }}
            title={`Radiation: -${radiation} HP max`}
          />
        )}
      </div>
      {showNumbers && (
        <span className={`text-vault-yellow font-mono font-bold ${textSizeClasses[size]}`}>
          {effectiveCurrent}/{effectiveMax}
        </span>
      )}
    </div>
  );
}
