interface APTrackerProps {
  current: number;
  max: number;
  onSpend?: (amount: number) => void;
  onReset?: () => void;
  interactive?: boolean;
  className?: string;
}

export function APTracker({
  current,
  max,
  onSpend,
  onReset,
  interactive = false,
  className = '',
}: APTrackerProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-vault-yellow font-bold text-sm uppercase">AP:</span>
      <div className="flex gap-1">
        {Array.from({ length: max }).map((_, i) => {
          const isFilled = i < current;
          return (
            <button
              key={i}
              type="button"
              disabled={!interactive || !isFilled}
              onClick={() => interactive && onSpend && onSpend(1)}
              className={`w-6 h-6 rounded border-2 transition-all ${
                isFilled
                  ? 'bg-vault-yellow border-vault-yellow-dark'
                  : 'bg-gray-700 border-gray-600'
              } ${
                interactive && isFilled
                  ? 'hover:bg-vault-yellow-light cursor-pointer'
                  : 'cursor-default'
              }`}
            />
          );
        })}
      </div>
      {interactive && onReset && current < max && (
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-vault-yellow hover:text-vault-yellow-light underline"
        >
          Reset
        </button>
      )}
    </div>
  );
}
