import React, { useState } from 'react';
import { GeneratorConfig } from '../types';
import { Share2, Copy, Check, X, Download, Upload, AlertCircle } from 'lucide-react';
import { useI18n } from '../i18n';

interface ConfigShareModalProps {
  config: GeneratorConfig;
  onImportConfig: (imported: GeneratorConfig) => void;
  onClose: () => void;
}

export const ConfigShareModal: React.FC<ConfigShareModalProps> = ({
  config,
  onImportConfig,
  onClose,
}) => {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  const exportPayload = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    prefix: config.prefix,
    digits: config.digits,
    startNumber: config.startNumber,
    count: config.count,
    box: {
      xPercent: config.box.xPercent,
      yPercent: config.box.yPercent,
      widthPercent: config.box.widthPercent,
      heightPercent: config.box.heightPercent,
    },
    layout: {
      marginMm: config.marginMm,
      spacingMm: config.spacingMm,
      pairSpacingMm: config.pairSpacingMm,
      drawCutGuides: config.drawCutGuides,
    },
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `config_targetes_qr_${config.prefix}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleApplyImport = () => {
    setImportError(null);
    try {
      if (!jsonInput.trim()) {
        setImportError(t.invalidJsonAlert);
        return;
      }
      const parsed = JSON.parse(jsonInput);
      if (!parsed.box || typeof parsed.box.xPercent !== 'number') {
        throw new Error(t.invalidJsonAlert);
      }

      const merged: GeneratorConfig = {
        ...config,
        prefix: parsed.prefix ?? config.prefix,
        digits: parsed.digits ?? config.digits,
        startNumber: parsed.startNumber ?? config.startNumber,
        count: parsed.count ?? config.count,
        box: {
          xPercent: parsed.box.xPercent,
          yPercent: parsed.box.yPercent,
          widthPercent: parsed.box.widthPercent,
          heightPercent: parsed.box.heightPercent,
        },
        marginMm: parsed.layout?.marginMm ?? config.marginMm,
        spacingMm: parsed.layout?.spacingMm ?? config.spacingMm,
        pairSpacingMm: parsed.layout?.pairSpacingMm ?? config.pairSpacingMm,
        drawCutGuides: parsed.layout?.drawCutGuides ?? config.drawCutGuides,
      };

      onImportConfig(merged);
      setImportSuccess(true);
      setTimeout(() => {
        setImportSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      setImportError((err as Error).message || t.invalidJsonAlert);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 dark:bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-800 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <Share2 className="w-5 h-5 text-sky-500 dark:text-sky-400" />
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {t.configModalTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.configModalSubtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5">
          {/* Current Config JSON */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {t.exportTabTitle}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded text-xs border border-slate-300 dark:border-slate-700 transition-colors shadow-2xs"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? t.copied : t.copyJson}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadJson}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded text-xs border border-slate-300 dark:border-slate-700 transition-colors shadow-2xs"
                >
                  <Download className="w-3 h-3" />
                  {t.downloadConfigJson}
                </button>
              </div>
            </div>

            <pre className="bg-slate-900 dark:bg-slate-950 border border-slate-700 dark:border-slate-800 rounded-xl p-3 text-xs font-mono text-sky-300 max-h-48 overflow-y-auto select-all">
              {jsonString}
            </pre>
          </div>

          {/* Import JSON Section */}
          <div className="flex flex-col gap-2 border-t border-slate-200 dark:border-slate-800 pt-4">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
              {t.importTabTitle}
            </span>
            <textarea
              rows={3}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder={t.pasteJsonPrompt}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-900 dark:text-slate-200 focus:outline-none focus:border-sky-500 placeholder:text-slate-400 dark:placeholder:text-slate-600"
            />

            {importError && (
              <div className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5 mt-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{importError}</span>
              </div>
            )}

            {importSuccess && (
              <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-1 font-semibold">
                <Check className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{t.importSuccessAlert}</span>
              </div>
            )}

            <div className="flex justify-end mt-1">
              <button
                type="button"
                onClick={handleApplyImport}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-medium transition-colors shadow-2xs"
              >
                {t.applyImportBtn}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <button
            type="button"
            onClick={onClose}
            className="text-xs px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors shadow-2xs"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
