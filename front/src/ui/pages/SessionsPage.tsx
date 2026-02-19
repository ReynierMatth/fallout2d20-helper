import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, Button, SessionCard, SessionForm } from '../../components';
import { useSessionsApi } from '../../hooks/useSessionsApi';
import type { SessionStatus, CreateSessionData, UpdateSessionData, SessionApi } from '../../services/api';

type FilterStatus = 'all' | SessionStatus;

export function SessionsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { sessions, loading, error, createSession, updateSession, deleteSession } = useSessionsApi();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<SessionApi | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<SessionApi | null>(null);

  // Filter sessions
  const filteredSessions = filterStatus === 'all'
    ? sessions
    : sessions.filter((s) => s.status === filterStatus);

  // Sort by last updated (most recent first)
  const sortedSessions = [...filteredSessions].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const handleCreate = () => {
    setEditingSession(null);
    setIsFormOpen(true);
  };

  const handleEdit = (session: SessionApi) => {
    setEditingSession(session);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: CreateSessionData | UpdateSessionData) => {
    if (editingSession) {
      await updateSession(editingSession.id, data as UpdateSessionData);
    } else {
      await createSession(data as CreateSessionData);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteSession(deleteConfirm.id);
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  const handleSessionClick = (session: SessionApi) => {
    navigate(`/sessions/${session.id}`);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="text-vault-yellow" size={32} />
              <h1 className="text-2xl font-bold text-vault-yellow">
                {t('sessions.title')}
              </h1>
            </div>
            <Button onClick={handleCreate}>
              <Plus size={18} />
              {t('sessions.createSession')}
            </Button>
          </div>
        </Card>

        {/* Filters */}
        <Card>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-vault-yellow">
              <Filter size={18} />
              <span className="font-medium">{t('sessions.status')}:</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {(['all', 'active', 'paused', 'completed'] as FilterStatus[]).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    filterStatus === status
                      ? 'bg-vault-yellow text-vault-blue'
                      : 'bg-vault-blue border border-vault-yellow-dark text-vault-yellow-dark hover:border-vault-yellow hover:text-vault-yellow'
                  }`}
                >
                  {t(`sessions.filters.${status}`)}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Content */}
        {loading ? (
          <Card>
            <div className="text-center text-gray-400 py-12">
              {t('common.loading')}
            </div>
          </Card>
        ) : error ? (
          <Card>
            <div className="text-center text-red-400 py-12">
              {t('common.error')}: {error}
            </div>
          </Card>
        ) : sortedSessions.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto text-vault-yellow-dark mb-4" />
              <p className="text-gray-400">
                {filterStatus === 'all'
                  ? t('sessions.noSessions')
                  : t('common.noResults')}
              </p>
              {filterStatus === 'all' && (
                <Button className="mt-4" onClick={handleCreate}>
                  <Plus size={18} />
                  {t('sessions.createSession')}
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onClick={() => handleSessionClick(session)}
                onEdit={() => handleEdit(session)}
                onDelete={() => setDeleteConfirm(session)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Form Modal */}
      <SessionForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingSession(null);
        }}
        onSubmit={handleFormSubmit}
        session={editingSession}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="relative bg-vault-gray border-2 border-vault-yellow rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-vault-yellow mb-4">
              {t('sessions.deleteSession')}
            </h3>
            <p className="text-gray-300 mb-6">
              {t('sessions.confirmDelete', { name: deleteConfirm.name })}
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                {t('common.cancel')}
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                {t('common.delete')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
