import React, { useEffect, useRef, useState } from 'react';
import { GenerationState } from '../types';
import { Download, CheckCircle, Clock, Terminal, AlertCircle, X, ExternalLink, RefreshCw } from 'lucide-react';

interface ProgressAndLogsModalProps {
  state: GenerationState;
  onClose: () => void;
  onCancel?: () => void;
}

export const ProgressAndLogsModal: React.FC<ProgressAndLogsModalProps> = ({
  state,
  onClose,
  onCancel,
}) => {
  const logContainerRef = useRef<HTMLDivElement>(null);
  const [showIframePreview, setShowIframePreview] = useState(false);

  // Auto-scroll logs to bottom as new messages arrive
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [state.logs]);

  const isFinished = !state.isGenerating && state.pdfUrl !== null;

  const handleDownload = () => {
    if (!state.pdfUrl || !state.fileName) return;
    const a = document.createElement('a');
    a.href = state.pdfUrl;
    a.download = state.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 dark:bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-800 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            {state.isGenerating ? (
              <RefreshCw className="w-5 h-5 text-sky-500 dark:text-sky-400 animate-spin" />
            ) : isFinished ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            )}
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              {state.isGenerating
                ? 'Generant Document PDF A4...'
                : isFinished
                ? 'Generació Finalitzada amb Èxit!'
                : 'Estat de la Generació'}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6">
          {/* Progress Bar Section */}
          <div className="flex flex-col gap-2 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {state.isGenerating ? `Processant: ${state.currentNumber}` : isFinished ? '100% Completat' : 'En pausa'}
              </span>
              <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">{state.progress}%</span>
            </div>

            {/* Progress track */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-slate-700/50">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-emerald-400 transition-all duration-200 shadow-sm"
                style={{ width: `${Math.max(2, state.progress)}%` }}
              />
            </div>

            {/* Meta stats below progress bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1 font-mono">
              <div className="flex items-center gap-1.5">
                <span>Targeta:</span>
                <strong className="text-slate-800 dark:text-slate-200">
                  {state.currentIndex} de {state.totalCount}
                </strong>
              </div>

              {state.isGenerating && (
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-300">
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                  <span>Temps restant estimat: ~{state.estimatedSecondsLeft}s</span>
                </div>
              )}
            </div>
          </div>

          {/* Success File Card if Finished */}
          {isFinished && state.fileName && (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Nom del fitxer generat:</h4>
                  <p className="text-xs font-mono text-emerald-700 dark:text-emerald-300 mt-0.5 break-all">{state.fileName}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Mida: {state.fileSizeMb} MB • Pàgines A4: {state.totalPages}
                  </p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-1 font-mono">
                    ✓ Últim codi generat: {state.currentNumber} • Proposta següent preparada al formulari
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  id="btn-download-pdf-finished"
                  type="button"
                  onClick={handleDownload}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-md transition-colors text-xs"
                >
                  <Download className="w-4 h-4" />
                  Descarregar PDF
                </button>

                <button
                  id="btn-preview-toggle"
                  type="button"
                  onClick={() => setShowIframePreview(!showIframePreview)}
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-300 dark:border-slate-700 transition-colors text-xs shadow-2xs"
                  title="Veure previsualització integrada"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {showIframePreview ? 'Amagar' : 'Previsualitzar'}
                </button>
              </div>
            </div>
          )}

          {/* Embedded PDF Preview if toggled */}
          {showIframePreview && state.pdfUrl && (
            <div className="w-full h-80 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-950">
              <iframe
                src={state.pdfUrl}
                title="Previsualització PDF"
                className="w-full h-full"
              />
            </div>
          )}

          {/* Live Log Terminal */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                <Terminal className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                Registre d'execució en directe (Log):
              </span>
              <span>{state.logs.length} missatges</span>
            </div>

            <div
              ref={logContainerRef}
              className="bg-slate-900 dark:bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-slate-300 h-44 overflow-y-auto space-y-1.5 scrollbar-thin select-text"
            >
              {state.logs.length === 0 ? (
                <div className="text-slate-500 italic">Esperant inici del procés...</div>
              ) : (
                state.logs.map((log) => (
                  <div
                    key={log.id}
                    className={`flex items-start gap-2 leading-relaxed ${
                      log.type === 'success'
                        ? 'text-emerald-400 font-semibold'
                        : log.type === 'warn'
                        ? 'text-amber-400'
                        : log.type === 'error'
                        ? 'text-rose-400 font-semibold'
                        : 'text-slate-300'
                    }`}
                  >
                    <span className="text-slate-500 text-[11px] flex-shrink-0">[{log.timestamp}]</span>
                    <span>{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          {state.isGenerating && onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="text-xs px-3 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-rose-300 dark:border-rose-500/30 transition-colors"
            >
              Cancel·lar generació
            </button>
          ) : (
            <span className="text-xs text-slate-500">
              {isFinished ? 'Totes les dades temporals han estat alliberades.' : ''}
            </span>
          )}

          <div className="flex items-center gap-2">
            {isFinished && (
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 text-xs px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-2xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Descarregar Ara
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="text-xs px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors shadow-2xs"
            >
              Tancar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
