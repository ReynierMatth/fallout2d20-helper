import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Package, Store, Dice6, Home, Book, Users, Calendar } from 'lucide-react';
import { cn } from '../../lib/cn';
import { MobileNav } from './MobileNav';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';

interface AppShellProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/', label: 'nav.home', icon: Home },
  { path: '/loot', label: 'nav.loot', icon: Package },
  { path: '/merchant', label: 'nav.merchant', icon: Store },
  { path: '/dice', label: 'nav.dice', icon: Dice6 },
  { path: '/encyclopedia', label: 'nav.encyclopedia', icon: Book },
  { path: '/characters', label: 'nav.characters', icon: Users },
  { path: '/sessions', label: 'nav.sessions', icon: Calendar },
] as const;

export function AppShell({ children }: AppShellProps) {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-vault-blue border-b-4 border-vault-yellow sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14 lg:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 lg:w-10 lg:h-10 bg-vault-yellow rounded-full flex items-center justify-center">
                <span className="text-vault-blue font-bold text-lg lg:text-xl">F</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-vault-yellow font-bold text-lg leading-tight">
                  FALLOUT 2D20
                </h1>
                <p className="text-vault-yellow-dark text-xs">{t('common.appSubtitle')}</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
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
                      'flex items-center gap-2 px-3 py-2 rounded transition-all text-sm',
                      isActive
                        ? 'bg-vault-yellow text-vault-blue'
                        : 'text-vault-yellow hover:bg-vault-blue-light'
                    )}
                  >
                    <Icon size={16} />
                    <span className="font-medium">{t(item.label)}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Language switcher */}
            <div className="flex items-center">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - add bottom padding on mobile for bottom nav */}
      <main className="flex-1 pb-16 lg:pb-0">
        {children}
      </main>

      {/* Footer - hidden on mobile (bottom nav takes the space) */}
      <footer className="hidden lg:block bg-vault-blue border-t-2 border-vault-yellow-dark py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-vault-yellow-dark text-sm">
            {t('common.footer.tagline')}
          </p>
          <p className="text-vault-gray-light text-xs mt-1">
            {t('common.footer.disclaimer')}
          </p>
        </div>
      </footer>

      {/* Mobile bottom navigation */}
      <MobileNav />
    </div>
  );
}
