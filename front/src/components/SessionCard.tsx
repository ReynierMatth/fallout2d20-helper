import { Calendar, Users, Play, Pause, CheckCircle, Edit2, Trash2, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { SessionApi, SessionStatus } from '../services/api';

interface SessionCardProps {
  session: SessionApi;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const statusIcons: Record<SessionStatus, React.ElementType> = {
  active: Play,
  paused: Pause,
  completed: CheckCircle,
};

const statusColors: Record<SessionStatus, string> = {
  active: 'bg-green-600 text-green-100',
  paused: 'bg-yellow-600 text-yellow-100',
  completed: 'bg-blue-600 text-blue-100',
};

export function SessionCard({ session, onClick, onEdit, onDelete }: SessionCardProps) {
  const { t } = useTranslation();

  const StatusIcon = statusIcons[session.status];
  // Count only PCs, not NPCs
  const pcCount = session.participants?.filter(p => p.character?.type === 'pc').length ?? 0;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-vault-gray border-2 border-vault-yellow-dark rounded-lg overflow-hidden hover:border-vault-yellow transition-colors">
      {/* Header - clickable */}
      <div
        onClick={onClick}
        className={`px-4 py-3 flex items-center gap-3 bg-vault-blue ${onClick ? 'cursor-pointer hover:bg-vault-blue-light' : ''}`}
      >
        <Calendar className="text-vault-yellow flex-shrink-0" size={24} />
        <div className="flex-1 min-w-0">
          <h3 className="text-vault-yellow font-bold text-lg truncate">{session.name}</h3>
          {session.description && (
            <p className="text-sm text-gray-300 truncate">{session.description}</p>
          )}
        </div>
        <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${statusColors[session.status]}`}>
          <StatusIcon size={12} />
          {t(`sessions.statuses.${session.status}`)}
        </span>
        {onClick && <ChevronRight className="text-vault-yellow" size={20} />}
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Stats row */}
        <div className="flex items-center gap-4 text-sm text-gray-300">
          <div className="flex items-center gap-1">
            <Users size={16} className="text-vault-yellow-dark" />
            <span>
              {t('sessions.participantCount', { count: pcCount })}
            </span>
          </div>
          {session.combatActive && (
            <span className="px-2 py-0.5 bg-red-600 text-red-100 rounded text-xs font-bold">
              {t('sessions.combat.combatInProgress')}
            </span>
          )}
        </div>

        {/* Last updated */}
        <div className="text-xs text-gray-400">
          {t('sessions.lastUpdated')}: {formatDate(session.updatedAt)}
        </div>

        {/* Actions */}
        {(onEdit || onDelete) && (
          <div className="flex gap-2 pt-2 border-t border-gray-600">
            {onEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 text-sm text-vault-yellow hover:bg-vault-blue rounded transition-colors"
              >
                <Edit2 size={14} />
                {t('common.edit')}
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 text-sm text-red-400 hover:bg-red-900/30 rounded transition-colors"
              >
                <Trash2 size={14} />
                {t('common.delete')}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
