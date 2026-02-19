import { useTranslation } from 'react-i18next';
import type { CombatAction } from '../../../domain/rules/combatRules';

interface ActionButtonProps {
  action: CombatAction;
  currentAP: number;
  onAction: (action: CombatAction) => void;
  className?: string;
}

export function ActionButton({
  action,
  currentAP,
  onAction,
  className = '',
}: ActionButtonProps) {
  const { t } = useTranslation();

  const canPerform = currentAP >= action.apCost;

  const typeColors = {
    major: 'border-red-600 bg-red-900/30 hover:bg-red-900/50',
    minor: 'border-yellow-600 bg-yellow-900/30 hover:bg-yellow-900/50',
    free: 'border-green-600 bg-green-900/30 hover:bg-green-900/50',
  };

  const typeBadgeColors = {
    major: 'bg-red-600',
    minor: 'bg-yellow-600',
    free: 'bg-green-600',
  };

  return (
    <button
      type="button"
      onClick={() => onAction(action)}
      disabled={!canPerform}
      className={`relative flex flex-col items-start p-3 rounded border-2 transition-all text-left ${
        typeColors[action.type]
      } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {/* AP cost badge */}
      <span
        className={`absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-bold text-white ${
          typeBadgeColors[action.type]
        }`}
      >
        {action.apCost} AP
      </span>

      {/* Action name */}
      <span className="text-vault-yellow font-bold text-sm pr-12">
        {t(action.nameKey)}
      </span>

      {/* Description */}
      <span className="text-xs text-gray-400 mt-1">
        {t(action.descriptionKey)}
      </span>
    </button>
  );
}

interface ActionButtonGroupProps {
  actions: CombatAction[];
  currentAP: number;
  onAction: (action: CombatAction) => void;
  title?: string;
  className?: string;
}

export function ActionButtonGroup({
  actions,
  currentAP,
  onAction,
  title,
  className = '',
}: ActionButtonGroupProps) {
  const { t } = useTranslation();

  if (actions.length === 0) return null;

  return (
    <div className={className}>
      {title && (
        <h4 className="text-sm text-gray-400 uppercase tracking-wide mb-2">
          {t(title)}
        </h4>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {actions.map((action) => (
          <ActionButton
            key={action.id}
            action={action}
            currentAP={currentAP}
            onAction={onAction}
          />
        ))}
      </div>
    </div>
  );
}
