import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Package, Store, Dice6, Home, Book, Users, Calendar } from 'lucide-react';
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

export function MobileNav() {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-vault-blue border-t-2 border-vault-yellow-dark">
      <div className="flex overflow-x-auto hide-scrollbar">
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
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 min-w-[64px] flex-1 py-2 px-1 transition-colors',
                isActive
                  ? 'text-vault-yellow bg-vault-blue-light'
                  : 'text-vault-yellow-dark'
              )}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium truncate max-w-full">
                {t(item.labelKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
