import React, { useRef } from 'react';
import { Upload, Image as ImageIcon, RotateCcw, FileText } from 'lucide-react';
import { CardImageData } from '../types';

interface ImageUploaderProps {
  cardImages: CardImageData;
  onUpdateImages: (updated: Partial<CardImageData>) => void;
  onResetToDefaults: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  cardImages,
  onUpdateImages,
  onResetToDefaults,
}) => {
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File, side: 'front' | 'back') => {
    if (!file.type.startsWith('image/')) {
      alert('Si us plau, seleccioneu un fitxer d\'imatge vàlid (PNG, JPG, etc.).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        if (side === 'front') {
          onUpdateImages({
            frontUrl: dataUrl,
            frontName: file.name,
            frontWidth: img.naturalWidth,
            frontHeight: img.naturalHeight,
          });
        } else {
          onUpdateImages({
            backUrl: dataUrl,
            backName: file.name,
            backWidth: img.naturalWidth,
            backHeight: img.naturalHeight,
          });
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, side: 'front' | 'back') => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0], side);
    }
  };

  return (
    <div id="image-uploader-section" className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 text-slate-100 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-sky-400" />
            Imatges de la Targeta (Davant i Darrere)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Carregueu els vostres fitxers PNG o utilitzeu la plantilla de prova incorporada.
          </p>
        </div>

        <button
          id="btn-reset-sample-cards"
          type="button"
          onClick={onResetToDefaults}
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restablir a Plantilles de Mostra
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Front Card Uploader */}
        <div
          id="front-image-dropzone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, 'front')}
          className="group relative flex flex-col bg-slate-950/60 border-2 border-dashed border-slate-800 hover:border-sky-500/50 rounded-xl p-3 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              Cara Davant (Fixa)
            </span>
            <span className="text-[11px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {cardImages.frontWidth} × {cardImages.frontHeight} px
            </span>
          </div>

          <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center border border-slate-800">
            <img
              src={cardImages.frontUrl}
              alt="Cara davant"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="truncate text-xs text-slate-400 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 flex-shrink-0 text-slate-500" />
              <span className="truncate">{cardImages.frontName}</span>
            </div>
            <button
              id="btn-upload-front"
              type="button"
              onClick={() => frontInputRef.current?.click()}
              className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 transition-colors whitespace-nowrap"
            >
              <Upload className="w-3 h-3" />
              Canviar Davant
            </button>
            <input
              ref={frontInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0], 'front')}
            />
          </div>
        </div>

        {/* Back Card Uploader */}
        <div
          id="back-image-dropzone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, 'back')}
          className="group relative flex flex-col bg-slate-950/60 border-2 border-dashed border-slate-800 hover:border-sky-500/50 rounded-xl p-3 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Cara Darrere (Amb QR Variable)
            </span>
            <span className="text-[11px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {cardImages.backWidth} × {cardImages.backHeight} px
            </span>
          </div>

          <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center border border-slate-800">
            <img
              src={cardImages.backUrl}
              alt="Cara darrere"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="truncate text-xs text-slate-400 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 flex-shrink-0 text-slate-500" />
              <span className="truncate">{cardImages.backName}</span>
            </div>
            <button
              id="btn-upload-back"
              type="button"
              onClick={() => backInputRef.current?.click()}
              className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 transition-colors whitespace-nowrap"
            >
              <Upload className="w-3 h-3" />
              Canviar Darrere
            </button>
            <input
              ref={backInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0], 'back')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
