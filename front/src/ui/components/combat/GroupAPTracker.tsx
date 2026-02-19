import { Minus, Plus, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface GroupAPTrackerProps {
  current: number;
  max: number;
  onSpend?: (amount: number) => void;
  onGain?: (amount: number) => void;
  onReset?: () => void;
  onMaxChange?: (max: number) => void;
  interactive?: boolean;
  compact?: boolean;
}

export function GroupAPTracker({
  current,
  max,
  onSpend,
  onGain,
  onReset,
  onMaxChange,
  interactive = true,
  compact = false,
}: GroupAPTrackerProps) {
  const { t } = useTranslation();

  // Render AP dots
  const renderDots = () => {
    const dots = [];
    for (let i = 0; i < max; i++) {
      const isFilled = i < current;
      dots.push(
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onClick={() => {
            if (!interactive) return;
            if (isFilled && onSpend) {
              onSpend(1);
            } else if (!isFilled && onGain) {
              onGain(1);
            }
          }}
          className={`w-6 h-6 rounded-full border-2 transition-all ${
            isFilled
              ? 'bg-vault-yellow border-vault-yellow'
              : 'bg-transparent border-vault-yellow-dark'
          } ${interactive ? 'hover:border-vault-yellow cursor-pointer' : 'cursor-default'}`}
          title={isFilled ? t('sessions.combat.spendAP') : t('sessions.combat.gainAP')}
        />
      );
    }
    return dots;
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-vault-yellow font-bold">
          {current}/{max} AP
        </span>
        {interactive && (
          <div className="flex gap-1">
            {onSpend && (
              <button
                type="button"
                onClick={() => onSpend(1)}
                disabled={current <= 0}
                className="p-1 text-red-400 hover:bg-red-900/30 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                title={t('sessions.combat.spendAP')}
              >
                <Minus size={16} />
              </button>
            )}
            {onGain && (
              <button
                type="button"
                onClick={() => onGain(1)}
                disabled={current >= max}
                className="p-1 text-green-400 hover:bg-green-900/30 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                title={t('sessions.combat.gainAP')}
              >
                <Plus size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-vault-blue border-2 border-vault-yellow-dark rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-vault-yellow font-bold">{t('sessions.combat.groupAP')}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Max:</span>
          {onMaxChange ? (
            <input
              type="number"
              value={max}
              onChange={(e) => onMaxChange(Math.max(1, parseInt(e.target.value) || 6))}
              min={1}
              max={20}
              className="w-12 px-1 py-0.5 bg-vault-gray border border-vault-yellow-dark rounded text-center text-vault-yellow text-sm"
            />
          ) : (
            <span className="text-vault-yellow font-bold">{max}</span>
          )}
        </div>
      </div>

      {/* AP Dots */}
      <div className="flex flex-wrap gap-2 mb-3">
        {renderDots()}
      </div>

      {/* Numeric display */}
      <div className="text-center text-2xl font-bold text-vault-yellow mb-3">
        {current} / {max}
      </div>

      {/* Action buttons */}
      {interactive && (
        <div className="flex gap-2">
          {onSpend && (
            <button
              type="button"
              onClick={() => onSpend(1)}
              disabled={current <= 0}
              className="flex-1 flex items-center justify-center gap-1 py-2 text-sm font-medium text-red-400 bg-red-900/20 hover:bg-red-900/40 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus size={16} />
              {t('sessions.combat.spendAP')}
            </button>
          )}
          {onGain && (
            <button
              type="button"
              onClick={() => onGain(1)}
              disabled={current >= max}
              className="flex-1 flex items-center justify-center gap-1 py-2 text-sm font-medium text-green-400 bg-green-900/20 hover:bg-green-900/40 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={16} />
              {t('sessions.combat.gainAP')}
            </button>
          )}
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-vault-yellow-dark hover:text-vault-yellow hover:bg-vault-gray rounded transition-colors"
              title={t('sessions.combat.resetAP')}
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
