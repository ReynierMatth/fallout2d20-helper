import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { SessionApi, CreateSessionData, UpdateSessionData, SessionStatus } from '../services/api';
import { Modal } from './Modal';
import { Button } from './Button';

interface SessionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSessionData | UpdateSessionData) => Promise<void>;
  session?: SessionApi | null;
}

export function SessionForm({ isOpen, onClose, onSubmit, session }: SessionFormProps) {
  const { t } = useTranslation();
  const isEditing = !!session;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<SessionStatus>('active');
  const [maxGroupAP, setMaxGroupAP] = useState(6);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when session changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (session) {
        setName(session.name);
        setDescription(session.description || '');
        setStatus(session.status);
        setMaxGroupAP(session.maxGroupAP);
      } else {
        setName('');
        setDescription('');
        setStatus('active');
        setMaxGroupAP(6);
      }
    }
  }, [isOpen, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await onSubmit({
          name: name.trim(),
          description: description.trim() || undefined,
          status,
          maxGroupAP,
        } as UpdateSessionData);
      } else {
        await onSubmit({
          name: name.trim(),
          description: description.trim() || undefined,
          maxGroupAP,
        } as CreateSessionData);
      }
      onClose();
    } catch (err) {
      console.error('Failed to save session:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? t('sessions.editSession') : t('sessions.createSession')}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Session Name */}
        <div>
          <label htmlFor="session-name" className="block text-sm font-medium text-vault-yellow mb-1">
            {t('sessions.sessionName')} *
          </label>
          <input
            id="session-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('sessions.sessionNamePlaceholder')}
            className="w-full px-3 py-2 bg-vault-blue border border-vault-yellow-dark rounded text-white placeholder-gray-500 focus:outline-none focus:border-vault-yellow"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="session-desc" className="block text-sm font-medium text-vault-yellow mb-1">
            {t('sessions.description')}
          </label>
          <textarea
            id="session-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('sessions.descriptionPlaceholder')}
            rows={3}
            className="w-full px-3 py-2 bg-vault-blue border border-vault-yellow-dark rounded text-white placeholder-gray-500 focus:outline-none focus:border-vault-yellow resize-none"
          />
        </div>

        {/* Max Group AP */}
        <div>
          <label htmlFor="max-ap" className="block text-sm font-medium text-vault-yellow mb-1">
            {t('sessions.combat.maxGroupAP')}
          </label>
          <input
            id="max-ap"
            type="number"
            value={maxGroupAP}
            onChange={(e) => setMaxGroupAP(Math.max(1, parseInt(e.target.value) || 6))}
            min={1}
            max={20}
            className="w-24 px-3 py-2 bg-vault-blue border border-vault-yellow-dark rounded text-white focus:outline-none focus:border-vault-yellow"
          />
        </div>

        {/* Status (only when editing) */}
        {isEditing && (
          <div>
            <label className="block text-sm font-medium text-vault-yellow mb-1">
              {t('sessions.status')}
            </label>
            <div className="flex gap-2">
              {(['active', 'paused', 'completed'] as SessionStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    status === s
                      ? 'bg-vault-yellow text-vault-blue'
                      : 'bg-vault-blue border border-vault-yellow-dark text-vault-yellow-dark hover:border-vault-yellow hover:text-vault-yellow'
                  }`}
                >
                  {t(`sessions.statuses.${s}`)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t border-vault-yellow-dark">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" disabled={isSubmitting || !name.trim()}>
            {isSubmitting ? t('common.loading') : isEditing ? t('common.save') : t('common.create')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
