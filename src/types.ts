export interface BoundingBox {
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  widthPercent: number; // 0 to 100
  heightPercent: number; // 0 to 100
}

export interface CardImageData {
  frontUrl: string;
  frontName: string;
  frontWidth: number;
  frontHeight: number;
  backUrl: string;
  backName: string;
  backWidth: number;
  backHeight: number;
}

export interface GeneratorConfig {
  prefix: string; // e.g. "IMV2627"
  digits: number; // e.g. 4
  startNumber: number; // e.g. 3 -> 0003
  count: number; // e.g. 20
  marginMm: number; // e.g. 10
  spacingMm: number; // e.g. 4
  pairSpacingMm: number; // spacing between front and back in the same pair e.g. 2
  orientation: 'portrait' | 'landscape';
  drawCutGuides: boolean;
  qrColor: string;
  qrBgColor: string;
  box: BoundingBox;
  historyByPrefix?: Record<string, number>; // Maps prefix -> last generated number
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warn' | 'error';
}

export interface GenerationState {
  isGenerating: boolean;
  progress: number; // 0 to 100
  currentNumber: string;
  currentIndex: number;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  estimatedSecondsLeft: number;
  logs: LogEntry[];
  pdfUrl: string | null;
  fileName: string | null;
  fileSizeMb: number | null;
  pdfBlob?: Blob;
}
