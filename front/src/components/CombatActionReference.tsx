import { useTranslation } from 'react-i18next';
import { Swords, Target, Shield, Heart, Users, Bot, Package, Crosshair, Move, RefreshCw, Sword, Hand, ArrowUp, ChevronDown as Crouch, PackageOpen, MessageCircle, ArrowDown } from 'lucide-react';

interface ActionInfo {
  key: string;
  icon: React.ElementType;
}

const majorActions: ActionInfo[] = [
  { key: 'attack', icon: Swords },
  { key: 'sprint', icon: Move },
  { key: 'defend', icon: Shield },
  { key: 'firstAid', icon: Heart },
  { key: 'rally', icon: Users },
  { key: 'commandRobot', icon: Bot },
  { key: 'passItem', icon: Package },
];

const minorActions: ActionInfo[] = [
  { key: 'aim', icon: Crosshair },
  { key: 'move', icon: Move },
  { key: 'reload', icon: RefreshCw },
  { key: 'drawWeapon', icon: Sword },
  { key: 'interact', icon: Hand },
  { key: 'standUp', icon: ArrowUp },
  { key: 'crouch', icon: Crouch },
];

const freeActions: ActionInfo[] = [
  { key: 'dropItem', icon: PackageOpen },
  { key: 'speak', icon: MessageCircle },
  { key: 'dropProne', icon: ArrowDown },
];

interface CombatActionReferenceProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function CombatActionReference({ collapsed = false, onToggle }: CombatActionReferenceProps) {
  const { t } = useTranslation();

  const renderActionGroup = (
    title: string,
    actions: ActionInfo[],
    bgColor: string,
    textColor: string
  ) => (
    <div className="space-y-2">
      <h4 className={`text-sm font-bold ${textColor}`}>{title}</h4>
      <div className="space-y-1">
        {actions.map(({ key, icon: Icon }) => (
          <div
            key={key}
            className={`flex items-start gap-2 p-2 rounded ${bgColor}`}
          >
            <Icon size={16} className={`flex-shrink-0 mt-0.5 ${textColor}`} />
            <div className="flex-1 min-w-0">
              <div className={`font-medium text-sm ${textColor}`}>
                {t(`sessions.actions.${key}`)}
              </div>
              <div className="text-xs text-gray-400">
                {t(`sessions.actions.${key}Desc`)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left bg-vault-blue border-2 border-vault-yellow-dark rounded-lg p-3 hover:border-vault-yellow transition-colors"
      >
        <div className="flex items-center gap-2 text-vault-yellow">
          <Swords size={18} />
          <span className="font-bold">{t('sessions.combat.actionsReference')}</span>
          <span className="text-xs text-gray-400 ml-auto">
            {t('common.clickToExpand')}
          </span>
        </div>
      </button>
    );
  }

  return (
    <div className="bg-vault-blue border-2 border-vault-yellow-dark rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-vault-yellow font-bold flex items-center gap-2">
          <Swords size={18} />
          {t('sessions.combat.actionsReference')}
        </h3>
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="text-xs text-gray-400 hover:text-vault-yellow"
          >
            {t('common.collapse')}
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Major Actions (2 AP) */}
        {renderActionGroup(
          t('sessions.combat.majorActions'),
          majorActions,
          'bg-red-900/20',
          'text-red-400'
        )}

        {/* Minor Actions (1 AP) */}
        {renderActionGroup(
          t('sessions.combat.minorActions'),
          minorActions,
          'bg-yellow-900/20',
          'text-yellow-400'
        )}

        {/* Free Actions (0 AP) */}
        {renderActionGroup(
          t('sessions.combat.freeActions'),
          freeActions,
          'bg-green-900/20',
          'text-green-400'
        )}
      </div>
    </div>
  );
}
