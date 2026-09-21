import React, { useRef } from 'react';
import { Upload, Image as ImageIcon, RotateCcw, FileText } from 'lucide-react';
import { CardImageData } from '../types';
import { useI18n } from '../i18n';

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
  const { t } = useI18n();
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File, side: 'front' | 'back') => {
    if (!file.type.startsWith('image/')) {
      alert(t.validImageAlert);
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
    <div id="image-uploader-section" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 text-slate-800 dark:text-slate-100 shadow-sm dark:shadow-xl transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-sky-500 dark:text-sky-400" />
            {t.uploaderTitle}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.uploaderSubtitle}
          </p>
        </div>

        <button
          id="btn-reset-sample-cards"
          type="button"
          onClick={onResetToDefaults}
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {t.restoreDefaultsBtn}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Front Card Uploader */}
        <div
          id="front-image-dropzone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, 'front')}
          className="group relative flex flex-col bg-slate-50 dark:bg-slate-950/60 border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-sky-500 rounded-xl p-3 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500"></span>
              {t.frontSideTitle}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 shadow-xs">
              {cardImages.frontWidth} × {cardImages.frontHeight} px
            </span>
          </div>

          <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-800">
            <img
              src={cardImages.frontUrl}
              alt="Cara davant"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="truncate text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 flex-shrink-0 text-slate-400 dark:text-slate-500" />
              <span className="truncate">{cardImages.frontName}</span>
            </div>
            <button
              id="btn-upload-front"
              type="button"
              onClick={() => frontInputRef.current?.click()}
              className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-md bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-sky-600 dark:text-sky-300 border border-slate-300 dark:border-slate-700 transition-colors whitespace-nowrap shadow-xs"
            >
              <Upload className="w-3 h-3" />
              {t.selectFileText}
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
          className="group relative flex flex-col bg-slate-50 dark:bg-slate-950/60 border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-emerald-500 rounded-xl p-3 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {t.backSideTitle}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 shadow-xs">
              {cardImages.backWidth} × {cardImages.backHeight} px
            </span>
          </div>

          <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-800">
            <img
              src={cardImages.backUrl}
              alt="Cara darrere"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="truncate text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 flex-shrink-0 text-slate-400 dark:text-slate-500" />
              <span className="truncate">{cardImages.backName}</span>
            </div>
            <button
              id="btn-upload-back"
              type="button"
              onClick={() => backInputRef.current?.click()}
              className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-md bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-emerald-600 dark:text-emerald-300 border border-slate-300 dark:border-slate-700 transition-colors whitespace-nowrap shadow-xs"
            >
              <Upload className="w-3 h-3" />
              {t.selectFileText}
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
