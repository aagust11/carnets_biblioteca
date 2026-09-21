import React from 'react';
import { Globe } from 'lucide-react';
import { useI18n, Language } from '../i18n';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useI18n();

  const languages: { code: Language; label: string; full: string }[] = [
    { code: 'ca', label: 'CA', full: 'Català' },
    { code: 'es', label: 'ES', full: 'Castellano' },
    { code: 'en', label: 'EN', full: 'English' },
  ];

  return (
    <div
      id="header-language-selector"
      className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-2xs"
      role="group"
      aria-label="Selecció d'idioma / Language selection"
    >
      <div className="pl-1.5 pr-1 text-slate-400 dark:text-slate-500 flex items-center">
        <Globe className="w-3.5 h-3.5" />
      </div>
      <div className="flex items-center gap-0.5">
        {languages.map((lang) => {
          const isActive = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`px-2 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                isActive
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
              }`}
              title={lang.full}
              aria-pressed={isActive}
            >
              {lang.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
