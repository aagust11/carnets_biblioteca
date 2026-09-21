import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  Image as ImageIcon,
  FileText,
  Download,
  ExternalLink,
  Sparkles,
  Layers,
  Settings,
  Printer,
  CheckCircle2,
  HardDrive,
  Scissors,
  ShieldCheck,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { useI18n } from '../i18n';

interface GuideModalProps {
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ onClose }) => {
  const { t, language } = useI18n();
  const [activeTab, setActiveTab] = useState<'infographic' | 'written'>('infographic');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-modal-title"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 transition-colors">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 flex-shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 id="guide-modal-title" className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                {t.guideTitle}
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-500/30">
                  Infografia & Manual
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.guideSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Download Word Doc */}
            <a
              id="guide-modal-download-word"
              href="./guia_us_generador_targetes_qr.docx"
              download="guia_us_generador_targetes_qr.docx"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-500/30 text-xs font-semibold transition-colors shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5" />
              {t.downloadWordBtn}
            </a>

            {/* Close Button */}
            <button
              id="guide-modal-btn-close"
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label={t.closeBtn}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('infographic')}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'infographic'
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              {t.infographicTab}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('written')}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'written'
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              {t.manualTab}
            </button>
          </div>

          {activeTab === 'infographic' && (
            <div className="hidden sm:flex items-center gap-2">
              <a
                href="./Crea_els_teus_carnets_QR_.png"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-500/30 text-xs font-semibold transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {t.openFullImage}
              </a>
            </div>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-950/50 space-y-6">
          {activeTab === 'infographic' ? (
            <div className="space-y-6">
              {/* Infographic Main Banner */}
              <div className="bg-[#FFF9E6] border-2 border-slate-900 rounded-3xl p-5 sm:p-7 shadow-[4px_4px_0px_#0F172A] text-slate-900">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950">
                    Crea els Teus Carnets amb QR: Guia Pas a Pas
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                    Aquesta guia visual explica com utilitzar el Generador de Targetes QR creat per <strong>Àngel Agustí</strong>. Mostra el procés complet per dissenyar, generar i muntar targetes en format A4 llestes per a impressió massiva per a escoles o associacions.
                  </p>
                </div>
              </div>

              {/* FASE 1: El Procés de Creació */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black tracking-wider uppercase px-2.5 py-1 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
                    FASE 1
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                    El Procés de Creació
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Panel 1 */}
                  <div className="bg-[#BFDBFE] border-2 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_#0F172A] flex flex-col justify-between text-slate-900">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-extrabold text-base text-slate-950">1. Carrega i Dissenya</h5>
                        <Layers className="w-5 h-5 text-blue-800" />
                      </div>

                      {/* Mock Canvas Card */}
                      <div className="bg-white border-2 border-slate-900 rounded-xl p-2.5 flex items-center justify-center gap-2 shadow-inner">
                        <div className="flex flex-col gap-1 items-center">
                          <div className="w-12 h-8 bg-sky-200 border border-slate-800 rounded flex items-center justify-center text-[9px] font-bold text-slate-800">
                            Davant
                          </div>
                          <div className="w-12 h-8 bg-sky-200 border border-slate-800 rounded flex items-center justify-center text-[9px] font-bold text-slate-800">
                            Darrere
                          </div>
                        </div>
                        <div className="w-24 h-16 bg-amber-100 border-2 border-slate-800 rounded relative flex items-center justify-center">
                          <div className="w-8 h-8 border-2 border-dashed border-sky-600 bg-white/80 rounded flex items-center justify-center">
                            <span className="text-[8px] font-mono text-sky-800 font-bold">QR</span>
                          </div>
                        </div>
                      </div>

                      {/* Speech Bubble */}
                      <div className="bg-white border-2 border-slate-900 rounded-xl p-3 relative text-xs font-semibold leading-snug">
                        Puja les imatges del davant i del darrere, i dibuixa directament el requadre on anirà el QR (amb fons transparent).
                      </div>
                    </div>
                  </div>

                  {/* Panel 2 */}
                  <div className="bg-[#DDD6FE] border-2 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_#0F172A] flex flex-col justify-between text-slate-900">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-extrabold text-base text-slate-950">2. Configura la Sèrie</h5>
                        <Settings className="w-5 h-5 text-purple-800" />
                      </div>

                      {/* Mock Form */}
                      <div className="bg-white border-2 border-slate-900 rounded-xl p-2.5 space-y-2">
                        <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold">
                          <div className="bg-slate-100 border border-slate-800 rounded p-1">
                            Prefix: <span className="text-sky-600">IMV2627</span>
                          </div>
                          <div className="bg-amber-100 border border-slate-800 rounded p-1">
                            Quantitat: <span>50</span>
                          </div>
                        </div>
                        <div className="bg-purple-100 border border-slate-800 rounded-full py-1 text-center font-mono font-bold text-xs text-purple-900">
                          IMV26270001
                        </div>
                      </div>

                      {/* Speech Bubble */}
                      <div className="bg-white border-2 border-slate-900 rounded-xl p-3 relative text-xs font-semibold leading-snug">
                        Defineix el prefix i la quantitat de targetes. L'aplicació recordarà automàticament l'últim número generat.
                      </div>
                    </div>
                  </div>

                  {/* Panel 3 */}
                  <div className="bg-[#FED7AA] border-2 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_#0F172A] flex flex-col justify-between text-slate-900">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-extrabold text-base text-slate-950">3. Genera el PDF A4</h5>
                        <Printer className="w-5 h-5 text-orange-800" />
                      </div>

                      {/* Mock A4 with progress */}
                      <div className="bg-white border-2 border-slate-900 rounded-xl p-2.5 flex items-center justify-between gap-2">
                        <div className="flex-1 space-y-1">
                          <div className="w-full bg-slate-200 border border-slate-800 rounded-full h-3 overflow-hidden">
                            <div className="bg-rose-500 h-full w-2/3"></div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-600">Progrés en viu</span>
                        </div>
                        <div className="w-10 h-14 bg-white border border-slate-800 rounded p-0.5 flex flex-col gap-0.5 shadow-xs">
                          <div className="bg-sky-200 h-2.5 rounded-2xs"></div>
                          <div className="bg-sky-200 h-2.5 rounded-2xs"></div>
                          <div className="bg-sky-200 h-2.5 rounded-2xs"></div>
                        </div>
                      </div>

                      {/* Speech Bubble */}
                      <div className="bg-white border-2 border-slate-900 rounded-xl p-3 relative text-xs font-semibold leading-snug">
                        Crea un document A4 a punt per imprimir, amb una barra de progrés en temps real per fer-ne el seguiment.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FASE 2: Consells Clau i Funcionalitats Útils */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black tracking-wider uppercase px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    FASE 2
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Consells Clau i Funcionalitats Útils
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Panel 4 */}
                  <div className="bg-[#FEF08A] border-2 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_#0F172A] flex flex-col justify-between text-slate-900">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-extrabold text-base text-slate-950">Memòria i Exportació</h5>
                        <HardDrive className="w-5 h-5 text-amber-800" />
                      </div>

                      <div className="bg-white border-2 border-slate-900 rounded-xl p-2.5 flex items-center justify-center gap-3">
                        <div className="px-2 py-1 bg-amber-100 border border-slate-800 rounded text-xs font-bold font-mono">
                          JSON
                        </div>
                        <div className="text-[11px] font-bold text-slate-700">
                          IndexedDB local
                        </div>
                      </div>

                      {/* Speech Bubble */}
                      <div className="bg-white border-2 border-slate-900 rounded-xl p-3 relative text-xs font-semibold leading-snug">
                        El navegador guarda les imatges automàticament i permet exportar les coordenades en format JSON per compartir-les.
                      </div>
                    </div>
                  </div>

                  {/* Panel 5 */}
                  <div className="bg-[#BAE6FD] border-2 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_#0F172A] flex flex-col justify-between text-slate-900">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-extrabold text-base text-slate-950">Muntatge Fàcil i Ràpid</h5>
                        <Scissors className="w-5 h-5 text-sky-800" />
                      </div>

                      <div className="bg-white border-2 border-slate-900 rounded-xl p-2.5 flex items-center justify-center gap-2">
                        <div className="border border-dashed border-rose-500 bg-rose-50 px-2 py-1 rounded text-[10px] font-bold text-rose-700">
                          Plegar pel mig
                        </div>
                        <div className="border border-slate-800 bg-slate-100 px-2 py-1 rounded text-[10px] font-bold">
                          180g - 250g
                        </div>
                      </div>

                      {/* Speech Bubble */}
                      <div className="bg-white border-2 border-slate-900 rounded-xl p-3 relative text-xs font-semibold leading-snug">
                        Les cares es toquen. Imprimeix en cartolina gruixuda (180g-250g) a escala 100%, plega pel mig i plastifica.
                      </div>
                    </div>
                  </div>

                  {/* Panel 6 */}
                  <div className="bg-[#BBF7D0] border-2 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_#0F172A] flex flex-col justify-between text-slate-900">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-extrabold text-base text-slate-950">Eina Lliure i Gratuïta</h5>
                        <ShieldCheck className="w-5 h-5 text-emerald-800" />
                      </div>

                      <div className="bg-white border-2 border-slate-900 rounded-xl p-2.5 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-mono font-bold text-[10px]">
                          CC BY-NC-SA 4.0
                        </span>
                      </div>

                      {/* Speech Bubble */}
                      <div className="bg-white border-2 border-slate-900 rounded-xl p-3 relative text-xs font-semibold leading-snug">
                        Ús educatiu o associatiu 100% gratuït, sense finalitat comercial (Llicència CC BY-NC-SA 4.0 - Autor: Àngel Agustí).
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Embedded Graphic Infographic Preview (User Uploaded PNG) */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-sky-500" />
                      {t.infographicTitle}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Còmic d'instruccions visuals per a la creació de carnets plegables
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href="./Crea_els_teus_carnets_QR_.png"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-500/30 text-xs font-semibold transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      {t.openFullImage}
                    </a>
                    <a
                      href="./Crea_els_teus_carnets_QR_.png"
                      download="Crea_els_teus_carnets_QR.png"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Descarregar PNG
                    </a>
                  </div>
                </div>

                <div className="border border-slate-300 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-900/5 dark:bg-slate-950 p-2 sm:p-4 flex items-center justify-center">
                  <img
                    id="guide-modal-main-image"
                    src="./Crea_els_teus_carnets_QR_.png"
                    alt="Guia Pas a Pas per crear carnets de biblioteca amb codi QR"
                    className="w-full h-auto rounded-xl shadow-md max-h-[85vh] object-contain hover:scale-[1.01] transition-transform"
                  />
                </div>
              </div>

              {/* Vector Infographic Preview (SVG) */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    Versió Vectorial Escalable (SVG)
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href="./infografia_guia_carnets.svg"
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      {t.openFullImage}
                    </a>
                    <a
                      href="./infografia_guia_carnets.svg"
                      download="infografia_guia_carnets.svg"
                      className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Descarregar SVG
                    </a>
                  </div>
                </div>
                <div className="border border-slate-300 dark:border-slate-800 rounded-xl overflow-hidden bg-[#FFF9E6] p-2">
                  <img
                    src="./infografia_guia_carnets.svg"
                    alt="Guia Pas a Pas - Infografia Vectorial Creada per Àngel Agustí"
                    className="w-full h-auto rounded-lg shadow-sm"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Tab 2: Manual i Consells Escrita */
            <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-500" />
                  Instruccions Detallades de Funcionament
                </h3>

                <ol className="list-decimal pl-5 space-y-3 leading-relaxed">
                  <li>
                    <strong className="text-slate-900 dark:text-white">Càrrega de Plantilles:</strong> A la secció superior, arrossegueu o seleccioneu les imatges PNG/JPG del Davant i del Darrere. L'aplicació les desa a la memòria local (IndexedDB) del vostre navegador perquè no les perdeu mai.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Dibuix del Requadre QR:</strong> Feu clic i arrossegueu sobre la imatge del darrere per definir el marc on es generarà el codi QR. Podeu ajustar la posició i mida amb precisió utilitzant els controls de percentatge.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Sèrie i Numeració Intel·ligent:</strong> Indiqueu el prefix (ex: <code>IMV2627</code>), el número d'inici i la quantitat. L'aplicació recorda automàticament per quin número anàveu i us proposa continuar des del següent valor.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Generació de PDF A4 en Temps Real:</strong> Premeu el botó «Generar Document PDF A4». Una barra de progrés i un registre en viu us informaran en tot moment de quantes targetes s'han processat i el temps restant estimat.
                  </li>
                </ol>
              </div>

              {/* Printing Tips */}
              <div className="bg-sky-50/70 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800/40 rounded-2xl p-5 space-y-3">
                <h3 className="text-base font-bold text-sky-950 dark:text-sky-200 flex items-center gap-2">
                  <Printer className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  Consells d'Impressió i Doblegat
                </h3>
                <ul className="space-y-2 text-xs leading-relaxed text-sky-900 dark:text-sky-300">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-sky-700 dark:text-sky-400">• Tipus de Paper:</span>
                    <span>Recomanem utilitzar cartolina blanca d'entre <strong>180g i 250g</strong> per donar cos i resistència al carnet.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-sky-700 dark:text-sky-400">• Escala d'impressió:</span>
                    <span>Trieu sempre <strong>«Escala 100%» o «Mida Real»</strong> a la configuració d'impressió (eviteu «Ajustar a la pàgina»).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-sky-700 dark:text-sky-400">• Plegat Central:</span>
                    <span>Com que el davant i el darrere estan units de costat (0 mm de separació), marqueu la línia central amb una regla i plegueu abans de retallar el perímetre exterior.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-sky-700 dark:text-sky-400">• Plastificat:</span>
                    <span>Introduïu la targeta doblegada en una funda de plastificar de mida carnet estàndard (aprox. 85 x 54 mm) i passeu-la per la plastificadora tèrmica.</span>
                  </li>
                </ul>
              </div>

              {/* License Notice */}
              <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl p-5 flex items-start gap-3 text-xs text-emerald-900 dark:text-emerald-300">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-emerald-950 dark:text-emerald-200">
                    Llicència Oberta Gratuïta (CC BY-NC-SA 4.0)
                  </h4>
                  <p className="mt-1">
                    Aquesta aplicació ha estat creada per <strong>Àngel Agustí</strong> (<a href="mailto:aagust11@xtec.cat" className="underline font-semibold">aagust11@xtec.cat</a>) amb <strong>VibeCoding</strong>. Es pot utilitzar, modificar i distribuir lliurement amb finalitats educatives i associatives, <strong>però està terminantment prohibit cobrar per ella</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
            Creat amb <strong className="text-sky-600 dark:text-sky-400">VibeCoding</strong> per <strong>Àngel Agustí</strong>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <a
              href="./guia_us_generador_targetes_qr.docx"
              download="guia_us_generador_targetes_qr.docx"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Guia Word (.docx)
            </a>

            <button
              id="guide-modal-btn-bottom-close"
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold transition-colors cursor-pointer shadow-sm"
            >
              Tancar Guia
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
