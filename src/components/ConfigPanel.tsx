import React, { useState } from 'react';
import { GeneratorConfig, CardImageData } from '../types';
import { calculateA4Layout, formatCode } from '../utils/pdfGenerator';
import { Settings, FileCheck, Layers, Play, Code2, Share2, HelpCircle, ChevronDown, ChevronUp, History, FoldHorizontal } from 'lucide-react';

interface ConfigPanelProps {
  config: GeneratorConfig;
  cardImages: CardImageData;
  onChangeConfig: (newConfig: GeneratorConfig) => void;
  onStartGeneration: () => void;
  onOpenPythonModal: () => void;
  onOpenShareModal: () => void;
  isGenerating: boolean;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  config,
  cardImages,
  onChangeConfig,
  onStartGeneration,
  onOpenPythonModal,
  onOpenShareModal,
  isGenerating,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const cleanPrefix = config.prefix.trim();
  const lastGeneratedForPrefix = config.historyByPrefix?.[cleanPrefix];
  const nextProposedForPrefix = lastGeneratedForPrefix !== undefined ? lastGeneratedForPrefix + 1 : 1;

  const handlePrefixChange = (newPrefix: string) => {
    const clean = newPrefix.trim();
    // Si el codi existeix a l'historial, proposa el següent; si canvia el codi a un de nou, torna a pensar que és l'1!
    const rememberedLast = config.historyByPrefix?.[clean];
    const nextStart = rememberedLast !== undefined ? rememberedLast + 1 : 1;

    onChangeConfig({
      ...config,
      prefix: clean,
      startNumber: nextStart,
    });
  };

  const startPad = formatCode(config.startNumber, config.prefix, config.digits);
  const endNum = config.startNumber + Math.max(1, config.count) - 1;
  const endPad = formatCode(endNum, config.prefix, config.digits);

  const layout = calculateA4Layout(
    cardImages.frontWidth || 1012,
    cardImages.frontHeight || 638,
    config
  );

  return (
    <div id="config-panel" className="flex flex-col gap-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 text-slate-800 dark:text-slate-100 shadow-sm dark:shadow-xl transition-colors">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-sky-500 dark:text-sky-400" />
            Paràmetres de Numeració i Distribució A4
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configureu la seqüència numèrica per als codis QR i la maquetació del PDF imprimible.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-open-share-modal"
            type="button"
            onClick={onOpenShareModal}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors shadow-2xs"
            title="Exportar coordenades o compartir configuració"
          >
            <Share2 className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
            Compartir Coordenades
          </button>

          <button
            id="btn-open-python-modal"
            type="button"
            onClick={onOpenPythonModal}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 transition-colors shadow-2xs"
            title="Veure el codi Python equivalent amb aquestes coordenades"
          >
            <Code2 className="w-3.5 h-3.5" />
            Codi Python
          </button>
        </div>
      </div>

      {/* Historial & Proposta intel·ligent del següent número */}
      {lastGeneratedForPrefix !== undefined ? (
        <div className="bg-sky-50/70 dark:bg-gradient-to-r dark:from-sky-950/50 dark:via-slate-900 dark:to-sky-950/30 border border-sky-200 dark:border-sky-500/30 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-500/40 flex items-center justify-center text-sky-700 dark:text-sky-300 flex-shrink-0">
              <History className="w-4 h-4" />
            </div>
            <div>
              <div className="text-slate-800 dark:text-slate-200 font-medium flex items-center gap-1.5">
                Últim número generat per a <strong className="font-mono text-sky-700 dark:text-sky-300">{cleanPrefix}</strong>:
                <span className="font-mono bg-white dark:bg-slate-800 px-2 py-0.5 rounded text-slate-900 dark:text-white font-bold border border-slate-300 dark:border-slate-700 shadow-2xs">
                  {formatCode(lastGeneratedForPrefix, config.prefix, config.digits)}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                Proposta automàtica: seguir a partir del <strong className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">{formatCode(nextProposedForPrefix, config.prefix, config.digits)}</strong>
              </p>
            </div>
          </div>

          {config.startNumber !== nextProposedForPrefix ? (
            <button
              type="button"
              onClick={() => onChangeConfig({ ...config, startNumber: nextProposedForPrefix })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              Aplicar proposta: {formatCode(nextProposedForPrefix, config.prefix, config.digits)}
            </button>
          ) : (
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/20">
              ✓ Proposta aplicada ({formatCode(nextProposedForPrefix, config.prefix, config.digits)})
            </span>
          )}
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
          <History className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
          <span>
            Codi <strong className="text-slate-900 dark:text-slate-200 font-mono">{cleanPrefix || 'sense prefix'}</strong>: no té generacions prèvies registrades. S'inicia automàticament des del número <strong className="text-slate-900 dark:text-white font-mono">{formatCode(1, config.prefix, config.digits)}</strong>.
          </span>
        </div>
      )}

      {/* Main input controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Prefix */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="input-prefix" className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Prefix del Codi:
          </label>
          <input
            id="input-prefix"
            type="text"
            value={config.prefix}
            onChange={(e) => handlePrefixChange(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
            placeholder="IMV2627"
          />
          <span className="text-[11px] text-slate-500">Exemple: IMV2627</span>
        </div>

        {/* Start Number */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="input-start-number" className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Número d'inici:
          </label>
          <input
            id="input-start-number"
            type="number"
            min="0"
            max="999999"
            value={config.startNumber}
            onChange={(e) => onChangeConfig({ ...config, startNumber: Math.max(0, parseInt(e.target.value) || 0) })}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
          />
          <span className="text-[11px] text-slate-500">Generarà {formatCode(config.startNumber, config.prefix, config.digits)}</span>
        </div>

        {/* Digits padding */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="input-digits" className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Dígits de farciment:
          </label>
          <input
            id="input-digits"
            type="number"
            min="1"
            max="8"
            value={config.digits}
            onChange={(e) => onChangeConfig({ ...config, digits: Math.max(1, Math.min(8, parseInt(e.target.value) || 4)) })}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
          />
          <span className="text-[11px] text-slate-500">4 dígits: 0001, 0002, 0003...</span>
        </div>

        {/* Quantity */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="input-count" className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Quantitat de targetes:
          </label>
          <input
            id="input-count"
            type="number"
            min="1"
            max="500"
            value={config.count}
            onChange={(e) => onChangeConfig({ ...config, count: Math.max(1, parseInt(e.target.value) || 1) })}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
          />
          <span className="text-[11px] text-slate-500">Total de parelles a generar</span>
        </div>
      </div>

      {/* Plegable Side-by-Side Status Pill */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 text-xs">
        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
          <FoldHorizontal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-semibold">Format Plegable Activat:</span>
          <span className="text-slate-600 dark:text-slate-300">
            Les cares davant i darrere estan <strong>tocant de costat ({config.pairSpacingMm} mm)</strong> amb línia discontínua central per imprimir i doblegar directament pel mig.
          </span>
        </div>

        {config.pairSpacingMm !== 0 && (
          <button
            type="button"
            onClick={() => onChangeConfig({ ...config, pairSpacingMm: 0 })}
            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded text-xs transition-colors shadow-2xs"
          >
            Fixar a 0 mm (tocant)
          </button>
        )}
      </div>

      {/* Sequence Preview Box */}
      <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Rang a generar:</span>
          <span className="font-mono bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800/80 px-2 py-0.5 rounded font-semibold">
            {startPad}
          </span>
          <span className="text-slate-400 dark:text-slate-500">fins a</span>
          <span className="font-mono bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800/80 px-2 py-0.5 rounded font-semibold">
            {endPad}
          </span>
          <span className="text-slate-500 dark:text-slate-400 ml-1">({config.count} targetes)</span>
        </div>

        {/* Layout stats */}
        <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <strong className="text-slate-900 dark:text-white">{layout.pairsPerPage}</strong> parelles / full A4
          </span>
          <span className="flex items-center gap-1">
            <FileCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <strong className="text-slate-900 dark:text-white">{layout.totalPages}</strong> fulls A4 en total
          </span>
        </div>
      </div>

      {/* Collapsible Advanced Settings (Margins, Spacing, Cut Marks) */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          Ajustaments d'impressió i marges A4
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 text-xs">
            <div className="flex flex-col gap-1">
              <label htmlFor="input-margin" className="text-slate-600 dark:text-slate-400">Marge de pàgina (mm):</label>
              <input
                id="input-margin"
                type="number"
                min="0"
                max="30"
                value={config.marginMm}
                onChange={(e) => onChangeConfig({ ...config, marginMm: Math.max(0, parseInt(e.target.value) || 0) })}
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-slate-900 dark:text-slate-100 font-mono"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="input-spacing" className="text-slate-600 dark:text-slate-400">Separació entre files (mm):</label>
              <input
                id="input-spacing"
                type="number"
                min="0"
                max="30"
                value={config.spacingMm}
                onChange={(e) => onChangeConfig({ ...config, spacingMm: Math.max(0, parseInt(e.target.value) || 0) })}
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-slate-900 dark:text-slate-100 font-mono"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="input-pair-spacing" className="text-slate-600 dark:text-slate-400">Separació davant-darrere (mm):</label>
              <input
                id="input-pair-spacing"
                type="number"
                min="0"
                max="30"
                value={config.pairSpacingMm}
                onChange={(e) => onChangeConfig({ ...config, pairSpacingMm: Math.max(0, parseInt(e.target.value) || 0) })}
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-slate-900 dark:text-slate-100 font-mono"
              />
              <span className="text-[10px] text-slate-500">0 mm = tocant de costat per doblegar</span>
            </div>

            <div className="flex flex-col justify-end pb-1">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={config.drawCutGuides}
                  onChange={(e) => onChangeConfig({ ...config, drawCutGuides: e.target.checked })}
                  className="rounded bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-sky-500 focus:ring-0 w-4 h-4"
                />
                <span>Línies de tall i plegat subtils</span>
              </label>
            </div>

            <div className="flex flex-col justify-end pb-1 col-span-1 sm:col-span-2">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={config.qrBgColor === '#00000000' || !config.qrBgColor}
                  onChange={(e) =>
                    onChangeConfig({
                      ...config,
                      qrBgColor: e.target.checked ? '#00000000' : '#ffffff',
                    })
                  }
                  className="rounded bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-sky-500 focus:ring-0 w-4 h-4"
                />
                <span>Fons del codi QR 100% transparent (sense requadre blanc)</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Primary Action Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-sky-500 dark:text-sky-400 flex-shrink-0" />
          <span>
            Cada fila de l'A4 conté <strong>[Davant]</strong> tocant de costat amb <strong>[Darrere + QR]</strong>, llest per doblegar.
          </span>
        </div>

        <button
          id="btn-generate-pdf"
          type="button"
          disabled={isGenerating}
          onClick={onStartGeneration}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold shadow-md hover:shadow-lg shadow-sky-900/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Generar Document PDF A4 ({config.count} targetes)</span>
        </button>
      </div>
    </div>
  );
};

