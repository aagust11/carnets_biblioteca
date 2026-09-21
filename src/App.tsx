import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BoundingBox, CardImageData, GeneratorConfig, GenerationState, LogEntry } from './types';
import { createDefaultFrontCard, createDefaultBackCard } from './utils/cardTemplates';
import { generateCardsPdf, formatCode } from './utils/pdfGenerator';
import { saveCardImagesToStorage, loadCardImagesFromStorage } from './utils/imageStorage';
import { CanvasEditor } from './components/CanvasEditor';
import { ImageUploader } from './components/ImageUploader';
import { ConfigPanel } from './components/ConfigPanel';
import { ProgressAndLogsModal } from './components/ProgressAndLogsModal';
import { PythonExportModal } from './components/PythonExportModal';
import { ConfigShareModal } from './components/ConfigShareModal';
import { QrCode, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'qr_card_generator_config_v3';

const DEFAULT_CONFIG: GeneratorConfig = {
  prefix: 'IMV2627',
  digits: 4,
  startNumber: 3, // Defaulting to 3 as requested in the user prompt example
  count: 20,
  marginMm: 10,
  spacingMm: 4,
  pairSpacingMm: 0, // 0 mm per defecte: tocant de costat per imprimir i doblegar
  orientation: 'portrait',
  drawCutGuides: true,
  qrColor: '#000000',
  qrBgColor: '#00000000', // Fons 100% transparent
  box: {
    xPercent: 68,
    yPercent: 48,
    widthPercent: 26,
    heightPercent: 44,
  },
  historyByPrefix: {},
};

export default function App() {
  // Load initial configuration from localStorage if available
  const [config, setConfig] = useState<GeneratorConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          box: { ...DEFAULT_CONFIG.box, ...(parsed.box || {}) },
        };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_CONFIG;
  });

  // Save to localStorage whenever config changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // Ignore quota errors
    }
  }, [config]);

  // Card images (Davant i Darrere)
  const [cardImages, setCardImages] = useState<CardImageData>(() => {
    const front = createDefaultFrontCard();
    const back = createDefaultBackCard();
    return {
      frontUrl: front,
      frontName: 'plantilla_davant_mostra.png',
      frontWidth: 1012,
      frontHeight: 638,
      backUrl: back,
      backName: 'plantilla_darrere_mostra.png',
      backWidth: 1012,
      backHeight: 638,
    };
  });

  // Carregar les imatges desades prèviament a la base de dades local (IndexedDB) del navegador
  useEffect(() => {
    let isMounted = true;
    loadCardImagesFromStorage().then((saved) => {
      if (isMounted && saved && saved.frontUrl && saved.backUrl) {
        setCardImages(saved);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Actualitzar imatges i desar-les de forma persistent
  const handleUpdateImages = (updated: Partial<CardImageData>) => {
    setCardImages((prev) => {
      const next = { ...prev, ...updated };
      saveCardImagesToStorage(next);
      return next;
    });
  };

  // Generation state and logs
  const [genState, setGenState] = useState<GenerationState>({
    isGenerating: false,
    progress: 0,
    currentNumber: formatCode(config.startNumber, config.prefix, config.digits),
    currentIndex: 0,
    totalCount: config.count,
    currentPage: 1,
    totalPages: 1,
    estimatedSecondsLeft: 0,
    logs: [],
    pdfUrl: null,
    fileName: null,
    fileSizeMb: null,
  });

  // Modals state
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showPythonModal, setShowPythonModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const cancellationRef = useRef(false);

  const sampleFormattedCode = useMemo(() => {
    return formatCode(config.startNumber, config.prefix, config.digits);
  }, [config.startNumber, config.prefix, config.digits]);

  const handleUpdateBox = (newBox: BoundingBox) => {
    setConfig((prev) => ({
      ...prev,
      box: newBox,
    }));
  };

  const handleResetToDefaults = () => {
    const front = createDefaultFrontCard();
    const back = createDefaultBackCard();
    const defaultImages: CardImageData = {
      frontUrl: front,
      frontName: 'plantilla_davant_mostra.png',
      frontWidth: 1012,
      frontHeight: 638,
      backUrl: back,
      backName: 'plantilla_darrere_mostra.png',
      backWidth: 1012,
      backHeight: 638,
    };
    setCardImages(defaultImages);
    saveCardImagesToStorage(defaultImages);
  };

  const addLogMessage = (log: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ca-ES', { hour12: false });
    setGenState((prev) => ({
      ...prev,
      logs: [
        ...prev.logs,
        {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: timeStr,
          ...log,
        },
      ],
    }));
  };

  const handleStartGeneration = async () => {
    cancellationRef.current = false;
    setShowProgressModal(true);

    setGenState({
      isGenerating: true,
      progress: 0,
      currentNumber: sampleFormattedCode,
      currentIndex: 0,
      totalCount: config.count,
      currentPage: 1,
      totalPages: 1,
      estimatedSecondsLeft: Math.ceil(config.count * 0.15),
      logs: [],
      pdfUrl: null,
      fileName: null,
      fileSizeMb: null,
    });

    try {
      const result = await generateCardsPdf({
        frontDataUrl: cardImages.frontUrl,
        backDataUrl: cardImages.backUrl,
        frontWidth: cardImages.frontWidth,
        frontHeight: cardImages.frontHeight,
        backWidth: cardImages.backWidth,
        backHeight: cardImages.backHeight,
        config,
        onProgress: (progress, currentNum, currentIndex, etaSeconds) => {
          setGenState((prev) => ({
            ...prev,
            progress,
            currentNumber: currentNum,
            currentIndex,
            estimatedSecondsLeft: etaSeconds,
          }));
        },
        onLog: (log) => {
          addLogMessage(log);
        },
        shouldCancel: () => cancellationRef.current,
      });

      // Calcular l'últim número generat (número inici + número de targetes fet - 1)
      const lastGeneratedNum = config.startNumber + config.count - 1;
      const nextProposedNum = lastGeneratedNum + 1;
      const cleanPrefix = config.prefix.trim();

      // Actualitzar l'historial i proposar automàticament continuar des del següent número
      setConfig((prev) => {
        const updatedHistory = {
          ...(prev.historyByPrefix || {}),
          [cleanPrefix]: lastGeneratedNum,
        };
        return {
          ...prev,
          startNumber: nextProposedNum,
          historyByPrefix: updatedHistory,
        };
      });

      addLogMessage({
        type: 'success',
        message: `Completat amb èxit! Últim número generat: ${formatCode(lastGeneratedNum, config.prefix, config.digits)}. S'ha preparat per continuar des del ${formatCode(nextProposedNum, config.prefix, config.digits)}.`,
      });

      setGenState((prev) => ({
        ...prev,
        isGenerating: false,
        progress: 100,
        pdfUrl: result.url,
        fileName: result.fileName,
        fileSizeMb: result.sizeMb,
        totalPages: result.totalPages,
      }));
    } catch (err) {
      const errorMsg = (err as Error).message;
      if (errorMsg !== 'Cancel·lat per l\'usuari') {
        addLogMessage({
          type: 'error',
          message: `Error durant la generació: ${errorMsg}`,
        });
      }
      setGenState((prev) => ({
        ...prev,
        isGenerating: false,
      }));
    }
  };

  const handleCancelGeneration = () => {
    cancellationRef.current = true;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/70 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                Generador de Targetes QR
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  A4 PDF
                </span>
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                Posicionament interactiu del QR • Sèrie {config.prefix}#### • Generador PDF i Python
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="header-btn-share-config"
              type="button"
              onClick={() => setShowShareModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              Exportar Coordenades
            </button>

            <button
              id="header-btn-python-code"
              type="button"
              onClick={() => setShowPythonModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors"
            >
              Codi Python
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* Quick Instructions Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950/20 to-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-white">Com funciona: </span>
              Dibuixeu el requadre a la imatge del darrere per definir la posició del QR (queda desat automàticament). Indiqueu el número d'inici i la quantitat, i descarregueu el document A4 amb el davant i darrere de costat.
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-400 whitespace-nowrap">
            Format: <span className="text-sky-300 font-semibold">{sampleFormattedCode}</span>
          </div>
        </div>

        {/* Section 1: Dual Image Uploader */}
        <ImageUploader
          cardImages={cardImages}
          onUpdateImages={handleUpdateImages}
          onResetToDefaults={handleResetToDefaults}
        />

        {/* Section 2: Interactive QR Canvas Editor */}
        <CanvasEditor
          backImageUrl={cardImages.backUrl}
          box={config.box}
          onChangeBox={handleUpdateBox}
          sampleCode={sampleFormattedCode}
        />

        {/* Section 3: Batch Numbering, Layout & Generation Panel */}
        <ConfigPanel
          config={config}
          cardImages={cardImages}
          onChangeConfig={setConfig}
          onStartGeneration={handleStartGeneration}
          onOpenPythonModal={() => setShowPythonModal(true)}
          onOpenShareModal={() => setShowShareModal(true)}
          isGenerating={genState.isGenerating}
        />
      </main>

      {/* Modals */}
      {showProgressModal && (
        <ProgressAndLogsModal
          state={genState}
          onClose={() => setShowProgressModal(false)}
          onCancel={handleCancelGeneration}
        />
      )}

      {showPythonModal && (
        <PythonExportModal
          config={config}
          onClose={() => setShowPythonModal(false)}
        />
      )}

      {showShareModal && (
        <ConfigShareModal
          config={config}
          onImportConfig={(newConfig) => setConfig(newConfig)}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>Generador de Targetes amb Codi QR • Maquetació A4 per a impressió • Exportable a Python amb Pillow, QRCode i ReportLab</p>
      </footer>
    </div>
  );
}
