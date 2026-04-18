import { useTranslation } from 'react-i18next';
import { Hammer, Shield, FlaskConical, UtensilsCrossed, Cpu, Bot, Wrench } from 'lucide-react';
import { cn } from '../../../lib/cn';

export type WorkbenchTab = 'weapon' | 'armor' | 'chemistry' | 'cooking' | 'power_armor' | 'robot' | 'repair';

const TABS: { id: WorkbenchTab; icon: React.ElementType }[] = [
  { id: 'weapon', icon: Hammer },
  { id: 'armor', icon: Shield },
  { id: 'chemistry', icon: FlaskConical },
  { id: 'cooking', icon: UtensilsCrossed },
  { id: 'power_armor', icon: Cpu },
  { id: 'robot', icon: Bot },
  { id: 'repair', icon: Wrench },
];

interface WorkbenchNavProps {
  active: WorkbenchTab;
  onChange: (tab: WorkbenchTab) => void;
}

export function WorkbenchNav({ active, onChange }: WorkbenchNavProps) {
  const { t } = useTranslation();

  return (
    <nav className="flex flex-col gap-1">
      {TABS.map(({ id, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors text-left',
            active === id
              ? 'bg-vault-yellow text-vault-blue'
              : 'text-vault-yellow hover:bg-vault-blue-light'
          )}
        >
          <Icon size={16} className="shrink-0" />
          <span>{t(`craft.workbenches.${id}`)}</span>
        </button>
      ))}
    </nav>
  );
}
