import React from 'react';
import { X, ShieldCheck, CheckCircle, AlertOctagon, HeartHandshake, ExternalLink } from 'lucide-react';

interface LicenseModalProps {
  onClose: () => void;
}

export const LicenseModal: React.FC<LicenseModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Llicència de l'Aplicació
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Creative Commons Reconeixement-NoComercial-CompartirIgual (CC BY-NC-SA 4.0)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5 text-sm text-slate-700 dark:text-slate-300">
          {/* Main summary card */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col gap-2">
            <span className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4" />
              Llicència seleccionada: CC BY-NC-SA 4.0
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              La llicència que permet a tothom <strong>utilitzar, estudiar, modificar i crear lliurement a partir del codi, però prohibeix expressament cobrar per ell o comercialitzar-lo</strong> és la llicència internacional <strong>Creative Commons Reconeixement-NoComercial-CompartirIgual 4.0 (CC BY-NC-SA 4.0)</strong>.
            </p>
          </div>

          {/* Permitted */}
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-4 h-4" />
              Què està permès fer (Lliurement i gratuït):
            </h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-300 pl-1">
              <li><strong>Compartir i utilitzar:</strong> Copiar, descarregar i redistribuir l'aplicació en qualsevol medi o format.</li>
              <li><strong>Adaptar i crear:</strong> Remesclar, transformar i construir nou material o millores a partir d'aquesta eina.</li>
              <li><strong>Ús educatiu, domèstic i associatiu:</strong> Ús per a escoles, entitats, esdeveniments, tallers o qualsevol activitat sense ànim de lucre.</li>
            </ul>
          </div>

          {/* Restrictions */}
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
              <AlertOctagon className="w-4 h-4" />
              Què està expressament prohibit:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-300 pl-1">
              <li><strong>MAI cobrar per l'eina:</strong> Està terminantment prohibit vendre aquesta aplicació, demanar pagament per ella o incloure-la en paquets comercials de pagament.</li>
              <li><strong>Ús comercial restringit:</strong> No es pot fer servir el programari directament per a activitats mercantils lucratives directes.</li>
            </ul>
          </div>

          {/* Conditions */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs flex flex-col gap-1.5">
            <div className="font-semibold text-slate-800 dark:text-slate-200">Condicions obligatòries:</div>
            <p className="text-slate-500 dark:text-slate-400">
              1. <strong>Reconeixement d'autoria:</strong> Cal citar sempre la creació original d'Àngel Agustí (<a href="mailto:aagust11@xtec.cat" className="text-sky-600 dark:text-sky-400 hover:underline">aagust11@xtec.cat</a>) i el concepte VibeCoding.
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              2. <strong>Compartir Igual (ShareAlike):</strong> Si modifiqueu o creeu una nova eina derivada, heu de compartir-la sota aquesta mateixa llicència gratuïta no comercial.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-xs">
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 hover:underline"
          >
            Llegir la llicència completa a Creative Commons
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
          >
            Entès i Tancar
          </button>
        </div>
      </div>
    </div>
  );
};
