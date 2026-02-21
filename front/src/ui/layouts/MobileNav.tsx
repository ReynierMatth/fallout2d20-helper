import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Package, Store, Dice6, Home, Book, Users, Calendar, X } from 'lucide-react';
import { cn } from '../../lib/cn';

const navItems = [
  { path: '/', labelKey: 'nav.home', icon: Home },
  { path: '/loot', labelKey: 'nav.loot', icon: Package },
  { path: '/merchant', labelKey: 'nav.merchant', icon: Store },
  { path: '/dice', labelKey: 'nav.dice', icon: Dice6 },
  { path: '/encyclopedia', labelKey: 'nav.encyclopedia', icon: Book },
  { path: '/characters', labelKey: 'nav.characters', icon: Users },
  { path: '/sessions', labelKey: 'nav.sessions', icon: Calendar },
] as const;

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className="lg:hidden">
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/60 transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-vault-blue border-r-2 border-vault-yellow-dark flex flex-col transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 h-14 border-b-2 border-vault-yellow-dark shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-vault-yellow rounded-full flex items-center justify-center">
              <span className="text-vault-blue font-bold text-base">F</span>
            </div>
            <span className="text-vault-yellow font-bold text-sm">FALLOUT 2D20</span>
          </div>
          <button
            onClick={onClose}
            className="text-vault-yellow-dark hover:text-vault-yellow transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 transition-colors',
                  isActive
                    ? 'bg-vault-yellow text-vault-blue font-semibold'
                    : 'text-vault-yellow hover:bg-vault-blue-light'
                )}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
