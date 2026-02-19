import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Package, Store, Dice6, Zap, Book } from 'lucide-react';
import { Card } from '../../components';

export function HomePage() {
  const { t } = useTranslation();

  const features = [
    {
      path: '/loot',
      icon: Package,
      title: t('home.features.loot.title'),
      description: t('home.features.loot.description'),
    },
    {
      path: '/merchant',
      icon: Store,
      title: t('home.features.merchant.title'),
      description: t('home.features.merchant.description'),
    },
    {
      path: '/dice',
      icon: Dice6,
      title: t('home.features.dice.title'),
      description: t('home.features.dice.description'),
    },
    {
      path: '/encyclopedia',
      icon: Book,
      title: t('home.features.encyclopedia.title'),
      description: t('home.features.encyclopedia.description'),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 bg-vault-yellow rounded-full flex items-center justify-center border-4 border-vault-yellow-dark shadow-lg">
            <Zap className="w-12 h-12 text-vault-blue" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-vault-yellow mb-4">
          {t('home.title')}
        </h1>
        <p className="text-vault-yellow-dark text-lg max-w-2xl mx-auto">
          {t('home.subtitle')}
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map(feature => {
          const Icon = feature.icon;
          return (
            <Link key={feature.path} to={feature.path} className="block group">
              <Card className="h-full transition-all group-hover:border-vault-yellow group-hover:shadow-lg group-hover:shadow-vault-yellow/20">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-vault-blue rounded-full flex items-center justify-center mb-4 group-hover:bg-vault-yellow transition-colors">
                    <Icon className="w-8 h-8 text-vault-yellow group-hover:text-vault-blue transition-colors" />
                  </div>
                  <h2 className="text-vault-yellow font-bold text-lg mb-2">
                    {feature.title}
                  </h2>
                  <p className="text-vault-yellow-dark text-sm">
                    {feature.description}
                  </p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats */}
      <Card title={t('home.stats.title')} icon={<Zap size={20} />}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-vault-yellow">70+</div>
            <div className="text-vault-yellow-dark text-sm">{t('home.stats.weapons')}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-vault-yellow">80+</div>
            <div className="text-vault-yellow-dark text-sm">{t('home.stats.armor')}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-vault-yellow">35+</div>
            <div className="text-vault-yellow-dark text-sm">{t('home.stats.chems')}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-vault-yellow">9</div>
            <div className="text-vault-yellow-dark text-sm">{t('home.stats.zones')}</div>
          </div>
        </div>
      </Card>

      {/* How to use */}
      <Card title={t('home.howTo.title')} icon={<Package size={20} />}>
        <div className="space-y-4 text-vault-yellow-dark">
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-vault-yellow text-vault-blue rounded-full flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="text-vault-yellow font-bold">{t('home.howTo.loot.title')}</h3>
              <p className="text-sm">{t('home.howTo.loot.description')}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-vault-yellow text-vault-blue rounded-full flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="text-vault-yellow font-bold">{t('home.howTo.merchant.title')}</h3>
              <p className="text-sm">{t('home.howTo.merchant.description')}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-vault-yellow text-vault-blue rounded-full flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="text-vault-yellow font-bold">{t('home.howTo.dice.title')}</h3>
              <p className="text-sm">{t('home.howTo.dice.description')}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
