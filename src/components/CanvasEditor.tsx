import React, { useState, useRef, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';
import { BoundingBox } from '../types';
import { Maximize2, Move, RotateCcw, Check, Sparkles, SlidersHorizontal, Lock, Unlock } from 'lucide-react';

interface CanvasEditorProps {
  backImageUrl: string;
  box: BoundingBox;
  onChangeBox: (box: BoundingBox) => void;
  sampleCode: string;
}

type HandleType = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'move' | null;

export const CanvasEditor: React.FC<CanvasEditorProps> = ({
  backImageUrl,
  box,
  onChangeBox,
  sampleCode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [activeHandle, setActiveHandle] = useState<HandleType>(null);
  const [isDrawingNew, setIsDrawingNew] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; box: BoundingBox } | null>(null);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [sampleQrUrl, setSampleQrUrl] = useState<string>('');
  const [savedBadgeVisible, setSavedBadgeVisible] = useState(false);

  // Generate sample QR code data URL for preview inside the box (transparent background)
  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(sampleCode, {
      margin: 1,
      width: 256,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#000000',
        light: '#00000000', // Transparent background
      },
    }).then((url) => {
      if (isMounted) setSampleQrUrl(url);
    });
    return () => {
      isMounted = false;
    };
  }, [sampleCode]);

  // Flash saved notification when box changes
  useEffect(() => {
    setSavedBadgeVisible(true);
    const t = setTimeout(() => setSavedBadgeVisible(false), 1800);
    return () => clearTimeout(t);
  }, [box]);

  const getImageBounds = useCallback(() => {
    if (!imgRef.current) return null;
    const rect = imgRef.current.getBoundingClientRect();
    return {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent, handle: HandleType) => {
    e.preventDefault();
    e.stopPropagation();
    const bounds = getImageBounds();
    if (!bounds) return;

    setActiveHandle(handle);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      box: { ...box },
    });
  };

  const handleStartDraw = (e: React.MouseEvent) => {
    // Only if clicking on the image background outside existing box
    if ((e.target as HTMLElement).closest('.qr-bounding-box')) return;
    const bounds = getImageBounds();
    if (!bounds) return;

    const xPct = Math.max(0, Math.min(100, ((e.clientX - bounds.left) / bounds.width) * 100));
    const yPct = Math.max(0, Math.min(100, ((e.clientY - bounds.top) / bounds.height) * 100));

    setIsDrawingNew(true);
    setDrawStart({ x: xPct, y: yPct });
    onChangeBox({
      xPercent: xPct,
      yPercent: yPct,
      widthPercent: 2,
      heightPercent: 2,
    });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const bounds = getImageBounds();
      if (!bounds) return;

      if (isDrawingNew && drawStart) {
        const currentXPct = Math.max(0, Math.min(100, ((e.clientX - bounds.left) / bounds.width) * 100));
        const currentYPct = Math.max(0, Math.min(100, ((e.clientY - bounds.top) / bounds.height) * 100));

        let left = Math.min(drawStart.x, currentXPct);
        let top = Math.min(drawStart.y, currentYPct);
        let width = Math.abs(currentXPct - drawStart.x);
        let height = Math.abs(currentYPct - drawStart.y);

        if (lockAspectRatio) {
          // Adjust for pixel aspect ratio of the image
          const pixelRatio = bounds.width / bounds.height;
          const targetHeight = (width / pixelRatio);
          height = targetHeight;
        }

        // Clamp inside 0-100%
        width = Math.min(width, 100 - left);
        height = Math.min(height, 100 - top);

        onChangeBox({
          xPercent: Math.max(0, left),
          yPercent: Math.max(0, top),
          widthPercent: Math.max(4, width),
          heightPercent: Math.max(4, height),
        });
        return;
      }

      if (!activeHandle || !dragStart) return;

      const deltaXPct = ((e.clientX - dragStart.x) / bounds.width) * 100;
      const deltaYPct = ((e.clientY - dragStart.y) / bounds.height) * 100;

      const orig = dragStart.box;
      let newBox = { ...orig };

      if (activeHandle === 'move') {
        newBox.xPercent = Math.max(0, Math.min(100 - orig.widthPercent, orig.xPercent + deltaXPct));
        newBox.yPercent = Math.max(0, Math.min(100 - orig.heightPercent, orig.yPercent + deltaYPct));
      } else {
        const imgAspect = bounds.width / bounds.height;

        if (activeHandle.includes('e')) {
          newBox.widthPercent = Math.max(4, Math.min(100 - orig.xPercent, orig.widthPercent + deltaXPct));
          if (lockAspectRatio) {
            newBox.heightPercent = (newBox.widthPercent / imgAspect);
          }
        }
        if (activeHandle.includes('w')) {
          const proposedWidth = Math.max(4, orig.widthPercent - deltaXPct);
          const proposedX = orig.xPercent + (orig.widthPercent - proposedWidth);
          if (proposedX >= 0) {
            newBox.xPercent = proposedX;
            newBox.widthPercent = proposedWidth;
            if (lockAspectRatio) {
              newBox.heightPercent = (newBox.widthPercent / imgAspect);
            }
          }
        }
        if (activeHandle.includes('s') && !lockAspectRatio) {
          newBox.heightPercent = Math.max(4, Math.min(100 - orig.yPercent, orig.heightPercent + deltaYPct));
        }
        if (activeHandle.includes('n') && !lockAspectRatio) {
          const proposedHeight = Math.max(4, orig.heightPercent - deltaYPct);
          const proposedY = orig.yPercent + (orig.heightPercent - proposedHeight);
          if (proposedY >= 0) {
            newBox.yPercent = proposedY;
            newBox.heightPercent = proposedHeight;
          }
        }
      }

      // Final boundary checks
      newBox.xPercent = Math.max(0, Math.min(100 - newBox.widthPercent, newBox.xPercent));
      newBox.yPercent = Math.max(0, Math.min(100 - newBox.heightPercent, newBox.yPercent));

      onChangeBox(newBox);
    },
    [activeHandle, dragStart, isDrawingNew, drawStart, getImageBounds, lockAspectRatio, onChangeBox]
  );

  const handleMouseUp = useCallback(() => {
    setActiveHandle(null);
    setDragStart(null);
    setIsDrawingNew(false);
    setDrawStart(null);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Preset positioning shortcuts
  const applyPreset = (preset: 'bottom-right' | 'bottom-left' | 'top-right' | 'center') => {
    const sizeW = 26;
    const sizeH = 41; // balanced for typical CR80 card aspect ratio
    switch (preset) {
      case 'bottom-right':
        onChangeBox({ xPercent: 68, yPercent: 48, widthPercent: 26, heightPercent: 44 });
        break;
      case 'bottom-left':
        onChangeBox({ xPercent: 6, yPercent: 48, widthPercent: 26, heightPercent: 44 });
        break;
      case 'top-right':
        onChangeBox({ xPercent: 68, yPercent: 8, widthPercent: 26, heightPercent: 44 });
        break;
      case 'center':
        onChangeBox({ xPercent: 37, yPercent: 28, widthPercent: 26, heightPercent: 44 });
        break;
    }
  };

  return (
    <div id="canvas-editor-container" className="flex flex-col gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 text-slate-100 shadow-xl">
      {/* Editor Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
              <Maximize2 className="w-5 h-5 text-sky-400" />
              Editor de Posicionament del QR (Cara Darrere)
            </h3>
            {savedBadgeVisible && (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
                <Check className="w-3 h-3" /> Desat al navegador
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Dibuixa o arrossega el requadre on vols que aparegui el codi QR a cada targeta.
          </p>
        </div>

        {/* Action buttons toolbar */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            id="btn-lock-aspect-ratio"
            type="button"
            onClick={() => setLockAspectRatio(!lockAspectRatio)}
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
              lockAspectRatio
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Mantenir el requadre quadrat per al codi QR"
          >
            {lockAspectRatio ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            Proporció 1:1 {lockAspectRatio ? 'Activada' : 'Lliure'}
          </button>

          <button
            id="btn-reset-box"
            type="button"
            onClick={() => applyPreset('bottom-right')}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restablir Posició
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div
        ref={containerRef}
        id="interactive-canvas-wrapper"
        onMouseDown={handleStartDraw}
        className="relative mx-auto w-full max-w-3xl select-none flex items-center justify-center p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 overflow-hidden cursor-crosshair min-h-[300px]"
      >
        <div className="relative inline-block shadow-2xl rounded-xl overflow-hidden border border-slate-700/50">
          <img
            ref={imgRef}
            src={backImageUrl}
            alt="Cara posterior de la targeta"
            className="block max-w-full h-auto max-h-[500px] object-contain pointer-events-none select-none"
            draggable={false}
          />

          {/* Interactive Bounding Box Overlay */}
          <div
            id="qr-interactive-bounding-box"
            className="qr-bounding-box absolute border-2 border-dashed border-sky-400 bg-transparent hover:bg-sky-500/5 shadow-md cursor-move flex items-center justify-center transition-shadow group hover:border-sky-300"
            style={{
              left: `${box.xPercent}%`,
              top: `${box.yPercent}%`,
              width: `${box.widthPercent}%`,
              height: `${box.heightPercent}%`,
            }}
            onMouseDown={(e) => handleMouseDown(e, 'move')}
          >
            {/* Live QR Preview rendered inside with transparent background */}
            {sampleQrUrl ? (
              <img
                src={sampleQrUrl}
                alt="Mostra Codi QR"
                className="w-full h-full object-contain p-0.5 pointer-events-none opacity-95 filter drop-shadow-sm"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-sky-200 text-xs font-mono">
                <span>QR CODE</span>
                <span className="text-[10px] opacity-75">{sampleCode}</span>
              </div>
            )}

            {/* Corner & Edge Resize Handles */}
            <div
              onMouseDown={(e) => handleMouseDown(e, 'nw')}
              className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-sky-500 rounded-sm cursor-nwse-resize shadow hover:scale-125 transition-transform"
            />
            <div
              onMouseDown={(e) => handleMouseDown(e, 'ne')}
              className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-sky-500 rounded-sm cursor-nesw-resize shadow hover:scale-125 transition-transform"
            />
            <div
              onMouseDown={(e) => handleMouseDown(e, 'se')}
              className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-sky-500 rounded-sm cursor-nwse-resize shadow hover:scale-125 transition-transform"
            />
            <div
              onMouseDown={(e) => handleMouseDown(e, 'sw')}
              className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-sky-500 rounded-sm cursor-nesw-resize shadow hover:scale-125 transition-transform"
            />

            {/* Badge indicating code and transparent background on hover/active */}
            <div className="absolute -top-6 left-0 bg-sky-600 text-white text-[10px] font-mono px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap flex items-center gap-1">
              <Move className="w-2.5 h-2.5" />
              {sampleCode} • Fons Transparent
            </div>
          </div>
        </div>
      </div>

      {/* Quick Presets & Manual Adjustments footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
            Posicions ràpides:
          </span>
          <button
            id="preset-bottom-right"
            type="button"
            onClick={() => applyPreset('bottom-right')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700 transition-colors"
          >
            Inferior Dreta
          </button>
          <button
            id="preset-bottom-left"
            type="button"
            onClick={() => applyPreset('bottom-left')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700 transition-colors"
          >
            Inferior Esquerra
          </button>
          <button
            id="preset-top-right"
            type="button"
            onClick={() => applyPreset('top-right')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700 transition-colors"
          >
            Superior Dreta
          </button>
          <button
            id="preset-center"
            type="button"
            onClick={() => applyPreset('center')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700 transition-colors"
          >
            Centrat
          </button>
        </div>

        {/* Fine-grain coordinate inputs */}
        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
          <span>X: <strong className="text-slate-200">{box.xPercent.toFixed(1)}%</strong></span>
          <span>Y: <strong className="text-slate-200">{box.yPercent.toFixed(1)}%</strong></span>
          <span>W: <strong className="text-slate-200">{box.widthPercent.toFixed(1)}%</strong></span>
          <span>H: <strong className="text-slate-200">{box.heightPercent.toFixed(1)}%</strong></span>
        </div>
      </div>
    </div>
  );
};
