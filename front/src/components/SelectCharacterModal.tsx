import { useState, useMemo } from 'react';
import { X, Search, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';

export interface PcOption {
  id: string;
  name: string;
}

interface SelectCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (characterId: string) => void;
  pcs: PcOption[];
  itemName?: string;
}

export function SelectCharacterModal({
  isOpen,
  onClose,
  onSelect,
  pcs,
  itemName,
}: SelectCharacterModalProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredPcs = useMemo(() => {
    if (!searchTerm) return pcs;
    const lower = searchTerm.toLowerCase();
    return pcs.filter(pc => pc.name.toLowerCase().includes(lower));
  }, [pcs, searchTerm]);

  const handleClose = () => {
    setSelectedId(null);
    setSearchTerm('');
    onClose();
  };

  const handleConfirm = () => {
    if (!selectedId) return;
    onSelect(selectedId);
    setSelectedId(null);
    setSearchTerm('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-vault-gray border-2 border-vault-yellow rounded-lg w-full max-w-lg max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-vault-yellow-dark">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-vault-yellow">
              {t('common.selectPc')}
            </h2>
            {itemName && (
              <p className="text-sm text-gray-400 truncate">{itemName}</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer flex-shrink-0"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-vault-yellow-dark">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('sessions.participants.searchCharacter')}
              className="w-full pl-11 pr-4 py-3 bg-vault-blue border border-vault-yellow-dark rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-vault-yellow text-base"
            />
          </div>
        </div>

        {/* Characters list */}
        <div className="flex-1 overflow-y-auto p-4">
          {pcs.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              {t('common.noPcs')}
            </div>
          ) : filteredPcs.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              {t('common.noResults')}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredPcs.map((pc) => {
                const isSelected = selectedId === pc.id;
                return (
                  <button
                    key={pc.id}
                    type="button"
                    onClick={() => setSelectedId(isSelected ? null : pc.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors text-left cursor-pointer ${
                      isSelected
                        ? 'bg-vault-yellow/20 border-vault-yellow'
                        : 'bg-vault-blue border-vault-yellow-dark hover:border-vault-yellow'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? 'bg-vault-yellow border-vault-yellow'
                        : 'border-vault-yellow-dark'
                    }`}>
                      {isSelected && <Check size={16} className="text-vault-blue" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-vault-yellow font-medium truncate text-base">
                        {pc.name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-vault-yellow-dark">
          <Button
            onClick={handleConfirm}
            disabled={!selectedId}
            className="w-full py-3 text-base"
          >
            {t('common.addToInventory')}
          </Button>
        </div>
      </div>
    </div>
  );
}
