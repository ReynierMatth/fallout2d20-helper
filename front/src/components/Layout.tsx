import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Package, Store, Dice6, Home, Menu, X, Book, Users, Calendar } from 'lucide-react';
import { useState } from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: t('nav.home'), icon: Home },
    { path: '/loot', label: t('nav.loot'), icon: Package },
    { path: '/merchant', label: t('nav.merchant'), icon: Store },
    { path: '/dice', label: t('nav.dice'), icon: Dice6 },
    { path: '/encyclopedia', label: t('nav.encyclopedia'), icon: Book },
    { path: '/characters', label: t('nav.characters'), icon: Users },
    { path: '/sessions', label: t('nav.sessions'), icon: Calendar },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-vault-blue border-b-4 border-vault-yellow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-vault-yellow rounded-full flex items-center justify-center">
                <span className="text-vault-blue font-bold text-xl">F</span>
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
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded transition-all text-sm ${
                      isActive
                        ? 'bg-vault-yellow text-vault-blue'
                        : 'text-vault-yellow hover:bg-vault-blue-light'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right side: Language + Mobile menu */}
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <button
                className="lg:hidden text-vault-yellow p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden border-t border-vault-yellow-dark">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 border-b border-vault-blue-light ${
                    isActive
                      ? 'bg-vault-yellow text-vault-blue'
                      : 'text-vault-yellow'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-vault-blue border-t-2 border-vault-yellow-dark py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-vault-yellow-dark text-sm">
            {t('common.footer.tagline')}
          </p>
          <p className="text-vault-gray-light text-xs mt-1">
            {t('common.footer.disclaimer')}
          </p>
        </div>
      </footer>
    </div>
  );
}
