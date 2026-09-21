import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { GeneratorConfig, LogEntry } from '../types';

export interface GeneratePdfOptions {
  frontDataUrl: string;
  backDataUrl: string;
  frontWidth: number;
  frontHeight: number;
  backWidth: number;
  backHeight: number;
  config: GeneratorConfig;
  onProgress: (progress: number, currentNum: string, currentIndex: number, etaSeconds: number) => void;
  onLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  shouldCancel?: () => boolean;
}

export interface PdfResult {
  blob: Blob;
  url: string;
  fileName: string;
  sizeMb: number;
  totalPages: number;
}

export function formatCode(num: number, prefix: string, digits: number): string {
  return `${prefix}${num.toString().padStart(digits, '0')}`;
}

export function calculateA4Layout(
  cardWidthPx: number,
  cardHeightPx: number,
  config: GeneratorConfig
) {
  const isLandscape = config.orientation === 'landscape';
  const a4WidthMm = isLandscape ? 297 : 210;
  const a4HeightMm = isLandscape ? 210 : 297;

  const usableWidthMm = a4WidthMm - (2 * config.marginMm);
  const usableHeightMm = a4HeightMm - (2 * config.marginMm);

  const aspectRatio = cardWidthPx / (cardHeightPx || 1);

  // Each row fits: [Davant] + [pairSpacingMm] + [Darrere]
  const targetCardWidthMm = (usableWidthMm - config.pairSpacingMm) / 2;
  let targetCardHeightMm = targetCardWidthMm / aspectRatio;

  let rowsPerPage = Math.floor((usableHeightMm + config.spacingMm) / (targetCardHeightMm + config.spacingMm));

  // In case cards are too tall vertically, calculate by height
  if (rowsPerPage < 1) {
    rowsPerPage = 1;
    targetCardHeightMm = usableHeightMm;
  }

  const pairsPerPage = rowsPerPage;
  const totalPages = Math.ceil(config.count / pairsPerPage);

  return {
    a4WidthMm,
    a4HeightMm,
    cardWidthMm: targetCardWidthMm,
    cardHeightMm: targetCardHeightMm,
    rowsPerPage,
    pairsPerPage,
    totalPages,
  };
}

export async function compositeBackWithQr(
  backImg: HTMLImageElement,
  qrDataUrl: string,
  box: GeneratorConfig['box']
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = backImg.naturalWidth || backImg.width;
  canvas.height = backImg.naturalHeight || backImg.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No es pot obtenir el context 2D del canvas');

  // Draw base back image
  ctx.drawImage(backImg, 0, 0, canvas.width, canvas.height);

  // Calculate pixel bounds for QR
  const boxX = (box.xPercent / 100) * canvas.width;
  const boxY = (box.yPercent / 100) * canvas.height;
  const boxW = (box.widthPercent / 100) * canvas.width;
  const boxH = (box.heightPercent / 100) * canvas.height;

  // Make QR fit square inside bounding box
  const qrSize = Math.min(boxW, boxH);
  const offsetX = boxX + (boxW - qrSize) / 2;
  const offsetY = boxY + (boxH - qrSize) / 2;

  // Load and draw QR
  const qrImg = new Image();
  qrImg.src = qrDataUrl;
  await new Promise((resolve, reject) => {
    qrImg.onload = resolve;
    qrImg.onerror = reject;
  });

  ctx.drawImage(qrImg, offsetX, offsetY, qrSize, qrSize);

  return canvas.toDataURL('image/png', 0.95);
}

export async function generateCardsPdf(options: GeneratePdfOptions): Promise<PdfResult> {
  const {
    frontDataUrl,
    backDataUrl,
    frontWidth,
    frontHeight,
    config,
    onProgress,
    onLog,
    shouldCancel,
  } = options;

  const startTime = Date.now();

  onLog({
    type: 'info',
    message: `Iniciant procés de generació de ${config.count} targetes (Prefix: ${config.prefix}, Inici: ${config.startNumber.toString().padStart(config.digits, '0')})...`,
  });

  // Pre-load base images
  const backImg = new Image();
  backImg.src = backDataUrl;
  await new Promise((res, rej) => {
    backImg.onload = res;
    backImg.onerror = rej;
  });

  const layout = calculateA4Layout(frontWidth, frontHeight, config);

  onLog({
    type: 'info',
    message: `Distribució A4 calculada: ${layout.pairsPerPage} parelles per full. Total de pàgines previstes: ${layout.totalPages}.`,
  });

  const doc = new jsPDF({
    orientation: config.orientation,
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const startPad = config.startNumber.toString().padStart(config.digits, '0');
  const endNum = config.startNumber + config.count - 1;
  const endPad = endNum.toString().padStart(config.digits, '0');
  const fileName = `targetes_${config.prefix}_${startPad}_a_${endPad}.pdf`;

  let itemInCurrentPage = 0;
  let currentPageNumber = 1;

  for (let i = 0; i < config.count; i++) {
    if (shouldCancel && shouldCancel()) {
      onLog({ type: 'warn', message: 'Generació cancel·lada per l\'usuari.' });
      throw new Error('Cancel·lat per l\'usuari');
    }

    const currentNum = config.startNumber + i;
    const code = formatCode(currentNum, config.prefix, config.digits);

    // Generate QR code with transparent background
    const qrDataUrl = await QRCode.toDataURL(code, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 512,
      color: {
        dark: config.qrColor || '#000000',
        light: config.qrBgColor === '#ffffff' ? '#ffffff' : '#00000000', // Fons 100% transparent per defecte
      },
    });

    // Composite back image with QR placed in bounding box
    const composedBackUrl = await compositeBackWithQr(backImg, qrDataUrl, config.box);

    // Calculate position on A4 page
    const row = itemInCurrentPage;
    const xFront = config.marginMm;
    const xBack = config.marginMm + layout.cardWidthMm + config.pairSpacingMm;
    const yTop = config.marginMm + row * (layout.cardHeightMm + config.spacingMm);

    // Draw Davant and Darrere (amb QR) side by side
    doc.addImage(frontDataUrl, 'PNG', xFront, yTop, layout.cardWidthMm, layout.cardHeightMm, undefined, 'FAST');
    doc.addImage(composedBackUrl, 'PNG', xBack, yTop, layout.cardWidthMm, layout.cardHeightMm, undefined, 'FAST');

    // Optional cut guides and folding line
    if (config.drawCutGuides) {
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.15);

      if (config.pairSpacingMm === 0) {
        // Marc exterior continu per tallar la targeta doble (Davant + Darrere plegable)
        doc.rect(xFront, yTop, layout.cardWidthMm * 2, layout.cardHeightMm);

        // Línia central discontínua per indicar exactament on doblegar
        doc.setDrawColor(160, 160, 160);
        doc.setLineDashPattern([1.5, 1], 0);
        doc.line(xBack, yTop, xBack, yTop + layout.cardHeightMm);
        doc.setLineDashPattern([], 0);
      } else {
        doc.rect(xFront, yTop, layout.cardWidthMm, layout.cardHeightMm);
        doc.rect(xBack, yTop, layout.cardWidthMm, layout.cardHeightMm);
      }
    }

    itemInCurrentPage++;

    // Progress and ETA calculation
    const itemsDone = i + 1;
    const progressPercent = Math.round((itemsDone / config.count) * 100);
    const elapsedSeconds = (Date.now() - startTime) / 1000;
    const avgSecondsPerItem = elapsedSeconds / itemsDone;
    const remainingItems = config.count - itemsDone;
    const etaSeconds = Math.max(0, Math.ceil(remainingItems * avgSecondsPerItem));

    onProgress(progressPercent, code, itemsDone, etaSeconds);

    if (itemsDone === 1 || itemsDone % 5 === 0 || itemsDone === config.count) {
      onLog({
        type: 'info',
        message: `[${itemsDone}/${config.count}] Processat codi ${code} a la pàgina ${currentPageNumber} (ETA: ~${etaSeconds}s)`,
      });
    }

    // Check if new page is needed
    if (itemInCurrentPage >= layout.pairsPerPage && itemsDone < config.count) {
      doc.addPage('a4', config.orientation);
      currentPageNumber++;
      itemInCurrentPage = 0;
      onLog({
        type: 'info',
        message: `Començant nou full A4 (Pàgina ${currentPageNumber} de ${layout.totalPages})...`,
      });
    }

    // Yield small breathing tick for smooth UI rendering
    if (i % 3 === 0) {
      await new Promise((res) => setTimeout(res, 12));
    }
  }

  onLog({
    type: 'info',
    message: `Finalitzant document PDF i comprimint estructura...`,
  });

  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  const sizeMb = parseFloat((blob.size / (1024 * 1024)).toFixed(2));

  onLog({
    type: 'success',
    message: `PDF generat amb èxit! Fitxer: "${fileName}" (${sizeMb} MB, ${currentPageNumber} fulls).`,
  });

  return {
    blob,
    url,
    fileName,
    sizeMb,
    totalPages: currentPageNumber,
  };
}
