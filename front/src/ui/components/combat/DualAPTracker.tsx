import { Minus, Plus, Users, Crown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DualAPTrackerProps {
  // Player AP
  playerAP: number;
  maxPlayerAP: number;
  onPlayerSpend?: (amount: number) => void;
  onPlayerGain?: (amount: number) => void;
  // GM AP
  gmAP: number;
  onGmSpend?: (amount: number) => void;
  onGmGain?: (amount: number) => void;
}

export function DualAPTracker({
  playerAP,
  maxPlayerAP,
  onPlayerSpend,
  onPlayerGain,
  gmAP,
  onGmSpend,
  onGmGain,
}: DualAPTrackerProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-4">
      {/* Player AP Pool */}
      <div className="flex items-center gap-2 bg-vault-blue/50 border border-vault-yellow-dark rounded-lg px-3 py-2">
        <Users size={18} className="text-vault-yellow-dark" />
        <span className="text-vault-yellow font-bold text-lg">
          {playerAP}/{maxPlayerAP}
        </span>
        <div className="flex gap-1">
          {onPlayerSpend && (
            <button
              type="button"
              onClick={() => onPlayerSpend(1)}
              disabled={playerAP <= 0}
              className="p-1.5 text-red-400 hover:bg-red-900/30 active:bg-red-900/50 rounded disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
              title={t('sessions.combat.spendAP')}
            >
              <Minus size={18} />
            </button>
          )}
          {onPlayerGain && (
            <button
              type="button"
              onClick={() => onPlayerGain(1)}
              disabled={playerAP >= maxPlayerAP}
              className="p-1.5 text-green-400 hover:bg-green-900/30 active:bg-green-900/50 rounded disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
              title={t('sessions.combat.gainAP')}
            >
              <Plus size={18} />
            </button>
          )}
        </div>
      </div>

      {/* GM AP Pool */}
      <div className="flex items-center gap-2 bg-red-900/30 border border-red-800 rounded-lg px-3 py-2">
        <Crown size={18} className="text-red-400" />
        <span className="text-red-400 font-bold text-lg">
          {gmAP}
        </span>
        <div className="flex gap-1">
          {onGmSpend && (
            <button
              type="button"
              onClick={() => onGmSpend(1)}
              disabled={gmAP <= 0}
              className="p-1.5 text-red-400 hover:bg-red-900/30 active:bg-red-900/50 rounded disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
              title={t('sessions.combat.spendAP')}
            >
              <Minus size={18} />
            </button>
          )}
          {onGmGain && (
            <button
              type="button"
              onClick={() => onGmGain(1)}
              className="p-1.5 text-green-400 hover:bg-green-900/30 active:bg-green-900/50 rounded cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
              title={t('sessions.combat.gainAP')}
            >
              <Plus size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
