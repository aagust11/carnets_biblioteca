import React, { useState } from 'react';
import { GeneratorConfig } from '../types';
import { generatePythonScript } from '../utils/pythonScriptGenerator';
import { Code2, Copy, Download, Check, X, Terminal } from 'lucide-react';

interface PythonExportModalProps {
  config: GeneratorConfig;
  onClose: () => void;
}

export const PythonExportModal: React.FC<PythonExportModalProps> = ({ config, onClose }) => {
  const [copied, setCopied] = useState(false);
  const scriptContent = generatePythonScript(config);

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPy = () => {
    const blob = new Blob([scriptContent], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generar_targetes.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <Code2 className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-semibold text-white">Codi Python Generat</h3>
              <p className="text-xs text-slate-400">
                Script autònom amb les coordenades actuals i neteja de temporals.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex flex-col gap-4">
          {/* Quick instructions */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <Terminal className="w-4 h-4" />
              <span>Instal·lació de dependències a la vostra màquina:</span>
            </div>
            <div className="bg-slate-900 px-3 py-2 rounded-lg font-mono text-sky-300 border border-slate-800 select-all">
              pip install pillow qrcode reportlab tqdm
            </div>
            <p className="text-[11px] text-slate-400">
              Desa el fitxer com a <code className="text-slate-200">generar_targetes.py</code> juntament amb <code className="text-slate-200">davant.png</code> i <code className="text-slate-200">darrere.png</code> i executa <code className="text-slate-200">python generar_targetes.py</code>.
            </p>
          </div>

          {/* Script code box */}
          <div className="relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400 font-mono">
              <span>generar_targetes.py</span>
              <span>Python 3</span>
            </div>

            <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-96 leading-relaxed select-text">
              <code>{scriptContent}</code>
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/50">
          <span className="text-xs text-slate-400">
            Coordenades actuals del QR: X: {config.box.xPercent.toFixed(1)}%, Y: {config.box.yPercent.toFixed(1)}%
          </span>

          <div className="flex items-center gap-2">
            <button
              id="btn-copy-python-code"
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 text-xs px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copiat al porta-retalls!' : 'Copiar Codi'}
            </button>

            <button
              id="btn-download-python-file"
              type="button"
              onClick={handleDownloadPy}
              className="inline-flex items-center gap-1.5 text-xs px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg shadow transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Descarregar .py
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
