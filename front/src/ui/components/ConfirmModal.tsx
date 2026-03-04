import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from '../primitives/Dialog';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: 'danger' | 'default';
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  variant = 'default',
}: ConfirmModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>{description}</DialogDescription>
        </DialogBody>
        <DialogFooter>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded border border-vault-yellow-dark text-vault-yellow-dark hover:text-vault-yellow hover:border-vault-yellow transition-colors text-sm"
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={() => { onConfirm(); onClose(); }}
            className={`px-4 py-2 rounded font-bold text-sm transition-colors ${
              variant === 'danger'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-vault-yellow text-vault-blue hover:bg-vault-yellow-light'
            }`}
          >
            {confirmLabel ?? t('common.confirm')}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
