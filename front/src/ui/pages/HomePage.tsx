import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Package, Book, Users, Calendar } from 'lucide-react';

const features = [
  {
    path: '/characters',
    icon: Users,
    labelKey: 'home.features.characters.title',
    descriptionKey: 'home.features.characters.description',
    accent: 'from-vault-blue-light to-vault-blue',
  },
  {
    path: '/encyclopedia',
    icon: Book,
    labelKey: 'home.features.encyclopedia.title',
    descriptionKey: 'home.features.encyclopedia.description',
    accent: 'from-vault-blue-light to-vault-blue',
  },
  {
    path: '/sessions',
    icon: Calendar,
    labelKey: 'home.features.sessions.title',
    descriptionKey: 'home.features.sessions.description',
    accent: 'from-vault-blue-light to-vault-blue',
  },
  {
    path: '/loot',
    icon: Package,
    labelKey: 'home.features.loot.title',
    descriptionKey: 'home.features.loot.description',
    accent: 'from-vault-blue-light to-vault-blue',
  },
] as const;

export function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero */}
      <div className="text-center px-4 pt-12 pb-10">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-vault-yellow rounded-full flex items-center justify-center border-4 border-vault-yellow-dark shadow-lg shadow-vault-yellow/20">
            <span className="text-vault-blue font-bold text-4xl">F</span>
          </div>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-vault-yellow mb-3 tracking-wide">
          {t('home.title')}
        </h1>
        <p className="text-vault-yellow-dark text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          {t('home.subtitle')}
        </p>
      </div>

      {/* Feature cards */}
      <div className="flex-1 px-4 pb-10 max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(feature => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.path}
                to={feature.path}
                className="group flex flex-col items-center text-center gap-3 p-6 rounded-lg border-2 border-vault-yellow-dark bg-vault-blue hover:border-vault-yellow hover:bg-vault-blue-light transition-all hover:shadow-lg hover:shadow-vault-yellow/10"
              >
                <div className="w-14 h-14 rounded-full bg-vault-yellow/10 border-2 border-vault-yellow-dark group-hover:bg-vault-yellow group-hover:border-vault-yellow flex items-center justify-center transition-all">
                  <Icon className="w-7 h-7 text-vault-yellow group-hover:text-vault-blue transition-colors" />
                </div>
                <div>
                  <h2 className="text-vault-yellow font-bold text-sm md:text-base mb-1">
                    {t(feature.labelKey)}
                  </h2>
                  <p className="text-vault-yellow-dark text-xs leading-relaxed hidden sm:block">
                    {t(feature.descriptionKey)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
