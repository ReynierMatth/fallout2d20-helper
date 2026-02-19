import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const currentLang = i18n.language?.substring(0, 2) || 'fr';

  const handleChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <div className="flex items-center gap-1">
      <Globe className="w-4 h-4 text-vault-yellow-dark" />
      {languages.map(lang => (
        <button
          key={lang.code}
          onClick={() => handleChange(lang.code)}
          className={`px-2 py-1 text-sm font-medium rounded transition-all ${
            currentLang === lang.code
              ? 'bg-vault-yellow text-vault-blue'
              : 'text-vault-yellow-dark hover:text-vault-yellow'
          }`}
          title={lang.label}
        >
          {lang.flag}
        </button>
      ))}
    </div>
  );
}
