import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ca' | 'es' | 'en';

export interface Translations {
  // App Header
  appTitle: string;
  appSubtitle: string;
  lightMode: string;
  darkMode: string;
  guideButton: string;
  exportCoordsButton: string;
  pythonCodeButton: string;
  wordGuideButton: string;

  // Banner
  howItWorksTitle: string;
  howItWorksText: string;
  viewGuideBtn: string;
  exampleLabel: string;

  // Image Uploader
  uploaderTitle: string;
  uploaderSubtitle: string;
  restoreDefaultsBtn: string;
  frontSideTitle: string;
  backSideTitle: string;
  dragDropText: string;
  selectFileText: string;
  sizeLabel: string;
  validImageAlert: string;

  // Canvas Editor
  canvasTitle: string;
  canvasSubtitle: string;
  posX: string;
  posY: string;
  width: string;
  height: string;
  lockSquare: string;
  centerBox: string;
  qrTransparentNote: string;
  dragHelper: string;
  savedToBrowser: string;
  aspectRatioLocked: string;
  aspectRatioFree: string;
  resetPositionBtn: string;
  transparentBg: string;
  quickPositions: string;
  bottomRight: string;
  bottomLeft: string;
  topRight: string;
  center: string;

  // Config Panel
  configTitle: string;
  configSubtitle: string;
  codePrefix: string;
  digitCount: string;
  startNumber: string;
  cardCount: string;
  pageMargin: string;
  rowSpacing: string;
  pairSpacing: string;
  pairSpacingHelper: string;
  printCutGuides: string;
  sampleCodeLabel: string;
  sampleRangeLabel: string;
  cardsPerPageLabel: string;
  estimatedPagesLabel: string;
  generatePdfBtn: string;
  generatingPdfBtn: string;
  shareCoords: string;
  pythonCodeBtn: string;
  lastGeneratedPrefix: string;
  autoProposal: string;
  applyProposal: string;
  proposalApplied: string;
  noHistoryPrefix: (prefix: string, defaultCode: string) => string;
  prefixLabel: string;
  startNumLabel: string;
  digitsLabel: string;
  quantityLabel: string;
  foldableActivated: string;
  foldableDesc: (spacingMm: number) => string;
  fixTo0mm: string;
  rangeToGenerate: string;
  upTo: string;
  pairsPerPage: string;
  totalSheets: string;
  advancedSettingsBtn: string;
  pageMarginMm: string;
  rowSpacingMm: string;
  frontBackSpacingMm: string;
  touchingHint: string;
  cutFoldLines: string;
  transparentQrBg: string;
  rowDescriptionNotice: string;
  generatePdfButton: (count: number) => string;

  // Guide Modal
  guideTitle: string;
  guideSubtitle: string;
  downloadWordBtn: string;
  closeBtn: string;
  infographicTab: string;
  manualTab: string;
  openFullImage: string;
  infographicTitle: string;

  // Modals & Common
  close: string;
  cancel: string;
  downloadPdf: string;
  previewPdf: string;
  copyJson: string;
  copied: string;
  importJson: string;
  downloadPython: string;
  generatingTitle: string;
  generationSuccess: string;
  generationStatus: string;
  processedCards: string;
  terminalLogs: string;
  closeModal: string;
  cancelProcess: string;
  licenseModalTitle: string;
  licenseModalSubtitle: string;

  // Python & Config Share Modals
  pythonModalTitle: string;
  pythonModalSubtitle: string;
  pythonDepsText: string;
  pythonInstructionsText: string;
  pythonCurrentCoords: (x: string, y: string) => string;
  copyCode: string;
  downloadScript: string;
  configModalTitle: string;
  configModalSubtitle: string;
  exportTabTitle: string;
  importTabTitle: string;
  downloadConfigJson: string;
  pasteJsonPrompt: string;
  applyImportBtn: string;
  invalidJsonAlert: string;
  importSuccessAlert: string;

  // Footer
  createdWith: string;
  freeUseNote: string;
  licenseBtnText: string;
  guideFooterText: string;
}

const translations: Record<Language, Translations> = {
  ca: {
    appTitle: 'Generador de Targetes QR',
    appSubtitle: 'Prepara documents A4 per imprimir carnets amb davant i darrere de costat i codi QR',
    lightMode: 'Mode Clar',
    darkMode: 'Mode Fosc',
    guideButton: 'Guia i Infografia',
    exportCoordsButton: 'Exportar Coordenades',
    pythonCodeButton: 'Codi Python',
    wordGuideButton: 'Guia Word (.docx)',

    howItWorksTitle: 'Com funciona:',
    howItWorksText: "Dibuixeu el requadre a la imatge del darrere per definir la posició del QR (queda desat automàticament). Indiqueu número d'inici i quantitat, i genereu el PDF A4 amb davant i darrere de costat per doblegar.",
    viewGuideBtn: 'Veure Guia Visual Pas a Pas',
    exampleLabel: 'Exemple:',

    uploaderTitle: '1. Plantilles de la Targeta',
    uploaderSubtitle: 'Pugeu les imatges PNG/JPG del davant i del darrere. Quedaran desades automàticament al vostre navegador.',
    restoreDefaultsBtn: "Restaurar plantilles d'exemple",
    frontSideTitle: 'Cara del Davant (Anvers)',
    backSideTitle: 'Cara del Darrere (Revers - amb QR)',
    dragDropText: 'Arrossegueu una imatge aquí o',
    selectFileText: 'seleccioneu un fitxer',
    sizeLabel: 'Mida:',
    validImageAlert: "Si us plau, seleccioneu un fitxer d'imatge vàlid (PNG, JPG, etc.).",

    canvasTitle: '2. Posició Interactiva del Codi QR',
    canvasSubtitle: 'Feu clic i arrossegueu sobre la imatge del darrere per dibuixar el requadre on anirà el QR.',
    posX: 'Posició X (%):',
    posY: 'Posició Y (%):',
    width: 'Amplada (%):',
    height: 'Alçada (%):',
    lockSquare: 'Requadre quadrat (1:1)',
    centerBox: 'Centrar requadre',
    qrTransparentNote: 'El codi QR es generarà amb fons transparent respectant la teva plantilla.',
    dragHelper: 'Dibuixeu o arrossegueu amb el ratolí per ajustar el requadre.',
    savedToBrowser: 'Desat al navegador',
    aspectRatioLocked: 'Proporció 1:1 bloquejada',
    aspectRatioFree: 'Proporció lliure',
    resetPositionBtn: 'Restablir posició',
    transparentBg: 'Fons transparent',
    quickPositions: 'Posicions ràpides:',
    bottomRight: 'A baix a la dreta',
    bottomLeft: 'A baix a l\'esquerra',
    topRight: 'A dalt a la dreta',
    center: 'Centrat',

    configTitle: '3. Paràmetres de Numeració i Distribució A4',
    configSubtitle: 'Configureu la seqüència numèrica per als codis QR i la maquetació del PDF imprimible.',
    codePrefix: 'Prefix del codi:',
    digitCount: 'Dígits numèrics:',
    startNumber: "Número d'inici:",
    cardCount: 'Quantitat de targetes:',
    pageMargin: 'Marge del full (mm):',
    rowSpacing: 'Espai entre files (mm):',
    pairSpacing: 'Espai entre davant i darrere (mm):',
    pairSpacingHelper: '(0 mm = tocant de costat per doblegar)',
    printCutGuides: 'Imprimir guies de tall (línies fines)',
    sampleCodeLabel: 'Codi de mostra:',
    sampleRangeLabel: 'Rang de la sèrie:',
    cardsPerPageLabel: 'Targetes per full A4:',
    estimatedPagesLabel: 'Fulls A4 necessaris:',
    generatePdfBtn: 'Generar Document PDF A4',
    generatingPdfBtn: 'Processant document...',
    shareCoords: 'Compartir Coordenades',
    pythonCodeBtn: 'Codi Python',
    lastGeneratedPrefix: 'Últim número generat per a',
    autoProposal: 'Proposta automàtica: seguir a partir del',
    applyProposal: 'Aplicar proposta',
    proposalApplied: 'Proposta aplicada',
    noHistoryPrefix: (prefix: string, defaultCode: string) =>
      `Codi ${prefix}: no té generacions prèvies registrades. S'inicia automàticament des del número ${defaultCode}.`,
    prefixLabel: 'Prefix del Codi',
    startNumLabel: "Número d'inici",
    digitsLabel: 'Dígits de farciment',
    quantityLabel: 'Quantitat de targetes',
    foldableActivated: 'Format Plegable Activat',
    foldableDesc: (spacingMm: number) =>
      `Les cares davant i darrere estan tocant de costat (${spacingMm} mm) amb línia discontínua central per imprimir i doblegar directament pel mig.`,
    fixTo0mm: 'Fixar a 0 mm (tocant)',
    rangeToGenerate: 'Rang a generar',
    upTo: 'fins a',
    pairsPerPage: 'parelles / full A4',
    totalSheets: 'fulls A4 en total',
    advancedSettingsBtn: "Ajustaments d'impressió i marges A4",
    pageMarginMm: 'Marge de pàgina (mm)',
    rowSpacingMm: 'Separació entre files (mm)',
    frontBackSpacingMm: 'Separació davant-darrere (mm)',
    touchingHint: '0 mm = tocant de costat per doblegar',
    cutFoldLines: 'Línies de tall i plegat subtils',
    transparentQrBg: 'Fons del codi QR 100% transparent (sense requadre blanc)',
    rowDescriptionNotice: "Cada fila de l'A4 conté [Davant] tocant de costat amb [Darrere + QR], llest per doblegar.",
    generatePdfButton: (count: number) => `Generar Document PDF A4 (${count} targetes)`,

    guideTitle: 'Guia Pas a Pas',
    guideSubtitle: 'Aprendeix com dissenyar, numerar i muntar les teves targetes QR preparades per imprimir en A4',
    downloadWordBtn: 'Descarregar Word (.docx)',
    closeBtn: 'Tancar finestra',
    infographicTab: 'Infografia Visual (Còmic Pas a Pas)',
    manualTab: 'Manual i Consells de Muntatge',
    openFullImage: 'Obrir Imatge Gran',
    infographicTitle: 'Infografia Visual Creada per Àngel Agustí',

    close: 'Tancar',
    cancel: 'Cancel·lar',
    downloadPdf: 'Descarregar PDF Imprimible',
    previewPdf: 'Vista prèvia',
    copyJson: 'Copiar JSON',
    copied: 'Copiat!',
    importJson: 'Importar Configuració',
    downloadPython: 'Descarregar script (.py)',
    generatingTitle: 'Generant Document PDF A4...',
    generationSuccess: 'Generació Finalitzada amb Èxit!',
    generationStatus: 'Estat de la Generació',
    processedCards: 'Targetes processades:',
    terminalLogs: 'Terminal de Registres (Logs de Procés)',
    closeModal: 'Tancar',
    cancelProcess: 'Cancel·lar procés',
    licenseModalTitle: "Llicència de l'Aplicació",
    licenseModalSubtitle: 'Creative Commons Reconeixement-NoComercial-CompartirIgual (CC BY-NC-SA 4.0)',

    pythonModalTitle: 'Codi Python Generat',
    pythonModalSubtitle: 'Script autònom amb les coordenades actuals i neteja de temporals.',
    pythonDepsText: 'Instal·lació de dependències a la vostra màquina:',
    pythonInstructionsText: 'Desa el fitxer com a generar_targetes.py juntament amb davant.png i darrere.png i executa python generar_targetes.py.',
    pythonCurrentCoords: (x: string, y: string) => `Coordenades actuals del QR: X: ${x}%, Y: ${y}%`,
    copyCode: 'Copiar Codi',
    downloadScript: 'Descarregar .py',
    configModalTitle: 'Compartir / Importar Coordenades i Configuració',
    configModalSubtitle: 'Podeu desar o compartir aquest fitxer JSON amb un altre dispositiu o company.',
    exportTabTitle: 'Exportar Configuració Actual',
    importTabTitle: 'Importar / Carregar Configuració JSON',
    downloadConfigJson: 'Descarregar .json',
    pasteJsonPrompt: 'Enganxeu el codi JSON aquí per carregar-lo:',
    applyImportBtn: 'Carregar i Aplicar Paràmetres',
    invalidJsonAlert: 'Si us plau, enganxeu un contingut JSON vàlid.',
    importSuccessAlert: 'Configuració importada i aplicada amb èxit!',

    createdWith: 'Creat amb VibeCoding per Àngel Agustí',
    freeUseNote: 'Es pot utilitzar i crear lliurement, però mai cobrar',
    licenseBtnText: 'Llicència CC BY-NC-SA 4.0',
    guideFooterText: 'Guia i Infografia',
  },

  es: {
    appTitle: 'Generador de Tarjetas QR',
    appSubtitle: 'Prepara documentos A4 para imprimir carnets con anverso y reverso contiguos y código QR',
    lightMode: 'Modo Claro',
    darkMode: 'Modo Oscuro',
    guideButton: 'Guía e Infografía',
    exportCoordsButton: 'Exportar Coordenadas',
    pythonCodeButton: 'Código Python',
    wordGuideButton: 'Guía Word (.docx)',

    howItWorksTitle: 'Cómo funciona:',
    howItWorksText: 'Dibuja el recuadro en la imagen trasera para ubicar el QR (se guarda automáticamente). Indica número inicial y cantidad, y genera el PDF A4 con anverso y reverso contiguos para doblar.',
    viewGuideBtn: 'Ver Guía Visual Paso a Paso',
    exampleLabel: 'Ejemplo:',

    uploaderTitle: '1. Plantillas de la Tarjeta',
    uploaderSubtitle: 'Sube las imágenes PNG/JPG del anverso y reverso. Se guardarán automáticamente en tu navegador.',
    restoreDefaultsBtn: 'Restaurar plantillas de ejemplo',
    frontSideTitle: 'Cara del Anverso (Frente)',
    backSideTitle: 'Cara del Reverso (con QR)',
    dragDropText: 'Arrastra una imagen aquí o',
    selectFileText: 'selecciona un archivo',
    sizeLabel: 'Tamaño:',
    validImageAlert: 'Por favor, selecciona un archivo de imagen válido (PNG, JPG, etc.).',

    canvasTitle: '2. Posición Interactiva del Código QR',
    canvasSubtitle: 'Haz clic y arrastra sobre la imagen trasera para dibujar el recuadro del QR.',
    posX: 'Posición X (%):',
    posY: 'Posición Y (%):',
    width: 'Anchura (%):',
    height: 'Altura (%):',
    lockSquare: 'Recuadro cuadrado (1:1)',
    centerBox: 'Centrar recuadro',
    qrTransparentNote: 'El código QR se generará con fondo transparente respetando tu diseño.',
    dragHelper: 'Dibuja o arrastra con el ratón para ajustar el recuadro.',
    savedToBrowser: 'Guardado en el navegador',
    aspectRatioLocked: 'Proporción 1:1 bloqueada',
    aspectRatioFree: 'Proporción libre',
    resetPositionBtn: 'Restablecer posición',
    transparentBg: 'Fondo transparente',
    quickPositions: 'Posiciones rápidas:',
    bottomRight: 'Abajo a la derecha',
    bottomLeft: 'Abajo a la izquierda',
    topRight: 'Arriba a la derecha',
    center: 'Centrado',

    configTitle: '3. Parámetros de Numeración y Distribución A4',
    configSubtitle: 'Configura la secuencia numérica para los códigos QR y la maquetación del PDF imprimible.',
    codePrefix: 'Prefijo del código:',
    digitCount: 'Dígitos numéricos:',
    startNumber: 'Número de inicio:',
    cardCount: 'Cantidad de tarjetas:',
    pageMargin: 'Margen de la hoja (mm):',
    rowSpacing: 'Espacio entre filas (mm):',
    pairSpacing: 'Espacio entre anverso y reverso (mm):',
    pairSpacingHelper: '(0 mm = contiguas para doblar)',
    printCutGuides: 'Imprimir guías de corte (líneas finas)',
    sampleCodeLabel: 'Código de muestra:',
    sampleRangeLabel: 'Rango de la serie:',
    cardsPerPageLabel: 'Tarjetas por hoja A4:',
    estimatedPagesLabel: 'Hojas A4 necesarias:',
    generatePdfBtn: 'Generar Documento PDF A4',
    generatingPdfBtn: 'Procesando documento...',
    shareCoords: 'Compartir Coordenadas',
    pythonCodeBtn: 'Código Python',
    lastGeneratedPrefix: 'Último número generado para',
    autoProposal: 'Propuesta automática: continuar desde el',
    applyProposal: 'Aplicar propuesta',
    proposalApplied: 'Propuesta aplicada',
    noHistoryPrefix: (prefix: string, defaultCode: string) =>
      `Código ${prefix}: no tiene generaciones previas registradas. Comienza automáticamente desde el número ${defaultCode}.`,
    prefixLabel: 'Prefijo del Código',
    startNumLabel: 'Número de inicio',
    digitsLabel: 'Dígitos de relleno',
    quantityLabel: 'Cantidad de tarjetas',
    foldableActivated: 'Formato Plegable Activado',
    foldableDesc: (spacingMm: number) =>
      `Las caras anverso y reverso están contiguas (${spacingMm} mm) con línea discontinua central para imprimir y doblar directamente por la mitad.`,
    fixTo0mm: 'Fijar a 0 mm (contiguas)',
    rangeToGenerate: 'Rango a generar',
    upTo: 'hasta',
    pairsPerPage: 'parejas / hoja A4',
    totalSheets: 'hojas A4 en total',
    advancedSettingsBtn: 'Ajustes de impresión y márgenes A4',
    pageMarginMm: 'Margen de página (mm)',
    rowSpacingMm: 'Separación entre filas (mm)',
    frontBackSpacingMm: 'Separación anverso-reverso (mm)',
    touchingHint: '0 mm = contiguas para doblar',
    cutFoldLines: 'Líneas de corte y plegado sutiles',
    transparentQrBg: 'Fondo del código QR 100% transparente (sin recuadro blanco)',
    rowDescriptionNotice: 'Cada fila del A4 contiene [Anverso] contiguo con [Reverso + QR], listo para doblar.',
    generatePdfButton: (count: number) => `Generar Documento PDF A4 (${count} tarjetas)`,

    guideTitle: 'Guía Paso a Paso',
    guideSubtitle: 'Aprende cómo diseñar, numerar y montar tus tarjetas QR listas para imprimir en A4',
    downloadWordBtn: 'Descargar Word (.docx)',
    closeBtn: 'Cerrar ventana',
    infographicTab: 'Infografía Visual (Cómic Paso a Paso)',
    manualTab: 'Manual y Consejos de Montaje',
    openFullImage: 'Abrir Imagen Grande',
    infographicTitle: 'Infografía Visual Creada por Àngel Agustí',

    close: 'Cerrar',
    cancel: 'Cancelar',
    downloadPdf: 'Descargar PDF Imprimible',
    previewPdf: 'Vista previa',
    copyJson: 'Copiar JSON',
    copied: '¡Copiado!',
    importJson: 'Importar Configuración',
    downloadPython: 'Descargar script (.py)',
    generatingTitle: 'Generando Documento PDF A4...',
    generationSuccess: '¡Generación Finalizada con Éxito!',
    generationStatus: 'Estado de la Generación',
    processedCards: 'Tarjetas procesadas:',
    terminalLogs: 'Terminal de Registros (Logs de Proceso)',
    closeModal: 'Cerrar',
    cancelProcess: 'Cancelar proceso',
    licenseModalTitle: 'Licencia de la Aplicación',
    licenseModalSubtitle: 'Creative Commons Reconocimiento-NoComercial-CompartirIgual (CC BY-NC-SA 4.0)',

    pythonModalTitle: 'Código Python Generado',
    pythonModalSubtitle: 'Script autónomo con las coordenadas actuales y limpieza de temporales.',
    pythonDepsText: 'Instalación de dependencias en su máquina:',
    pythonInstructionsText: 'Guarda el archivo como generar_targetes.py junto con davant.png y darrere.png y ejecuta python generar_targetes.py.',
    pythonCurrentCoords: (x: string, y: string) => `Coordenadas actuales del QR: X: ${x}%, Y: ${y}%`,
    copyCode: 'Copiar Código',
    downloadScript: 'Descargar .py',
    configModalTitle: 'Compartir / Importar Coordenadas y Configuración',
    configModalSubtitle: 'Puede guardar o compartir este archivo JSON con otro dispositivo o compañero.',
    exportTabTitle: 'Exportar Configuración Actual',
    importTabTitle: 'Importar / Cargar Configuración JSON',
    downloadConfigJson: 'Descargar .json',
    pasteJsonPrompt: 'Pegue el código JSON aquí para cargarlo:',
    applyImportBtn: 'Cargar y Aplicar Parámetros',
    invalidJsonAlert: 'Por favor, pegue un contenido JSON válido.',
    importSuccessAlert: '¡Configuración importada y aplicada con éxito!',

    createdWith: 'Creado con VibeCoding por Àngel Agustí',
    freeUseNote: 'Se puede usar y crear libremente, pero nunca cobrar',
    licenseBtnText: 'Licencia CC BY-NC-SA 4.0',
    guideFooterText: 'Guía e Infografía',
  },

  en: {
    appTitle: 'QR Card Generator',
    appSubtitle: 'Prepare A4 printable documents for double-sided cards with contiguous QR placement',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    guideButton: 'Guide & Infographic',
    exportCoordsButton: 'Export Coordinates',
    pythonCodeButton: 'Python Code',
    wordGuideButton: 'Word Guide (.docx)',

    howItWorksTitle: 'How it works:',
    howItWorksText: 'Draw the bounding box on the back image to position the QR (saved automatically). Enter start number and count, and generate the A4 PDF with front and back side-by-side for easy folding.',
    viewGuideBtn: 'View Step-by-Step Visual Guide',
    exampleLabel: 'Example:',

    uploaderTitle: '1. Card Templates',
    uploaderSubtitle: 'Upload front and back PNG/JPG images. They will be saved automatically in your browser.',
    restoreDefaultsBtn: 'Restore sample templates',
    frontSideTitle: 'Front Side (Cover)',
    backSideTitle: 'Back Side (with QR)',
    dragDropText: 'Drag an image here or',
    selectFileText: 'choose a file',
    sizeLabel: 'Size:',
    validImageAlert: 'Please select a valid image file (PNG, JPG, etc.).',

    canvasTitle: '2. Interactive QR Code Position',
    canvasSubtitle: 'Click and drag on the back image to define the QR bounding box.',
    posX: 'Position X (%):',
    posY: 'Position Y (%):',
    width: 'Width (%):',
    height: 'Height (%):',
    lockSquare: 'Lock square (1:1)',
    centerBox: 'Center box',
    qrTransparentNote: 'The QR code will be generated with transparent background over your artwork.',
    dragHelper: 'Draw or drag with mouse to adjust the bounding box.',
    savedToBrowser: 'Saved in browser',
    aspectRatioLocked: '1:1 square ratio locked',
    aspectRatioFree: 'Free aspect ratio',
    resetPositionBtn: 'Reset position',
    transparentBg: 'Transparent background',
    quickPositions: 'Quick positions:',
    bottomRight: 'Bottom right',
    bottomLeft: 'Bottom left',
    topRight: 'Top right',
    center: 'Centered',

    configTitle: '3. Numbering & A4 Layout Settings',
    configSubtitle: 'Set the QR numeric sequence and layout on the printable DIN A4 sheet.',
    codePrefix: 'Code prefix:',
    digitCount: 'Numeric digits:',
    startNumber: 'Start number:',
    cardCount: 'Card quantity:',
    pageMargin: 'Page margin (mm):',
    rowSpacing: 'Row spacing (mm):',
    pairSpacing: 'Front-to-back spacing (mm):',
    pairSpacingHelper: '(0 mm = touching side-by-side for folding)',
    printCutGuides: 'Print cut guide lines (thin strokes)',
    sampleCodeLabel: 'Sample code:',
    sampleRangeLabel: 'Batch range:',
    cardsPerPageLabel: 'Cards per A4 sheet:',
    estimatedPagesLabel: 'Required A4 sheets:',
    generatePdfBtn: 'Generate A4 PDF Document',
    generatingPdfBtn: 'Processing document...',
    shareCoords: 'Share Coordinates',
    pythonCodeBtn: 'Python Code',
    lastGeneratedPrefix: 'Last generated number for',
    autoProposal: 'Smart suggestion: continue from',
    applyProposal: 'Apply suggestion',
    proposalApplied: 'Suggestion applied',
    noHistoryPrefix: (prefix: string, defaultCode: string) =>
      `Code ${prefix}: has no previous generation history. Automatically starting from number ${defaultCode}.`,
    prefixLabel: 'Code Prefix',
    startNumLabel: 'Start Number',
    digitsLabel: 'Zero padding digits',
    quantityLabel: 'Quantity of cards',
    foldableActivated: 'Foldable Format Active',
    foldableDesc: (spacingMm: number) =>
      `Front and back sides are placed touching side-by-side (${spacingMm} mm) with a central dashed fold line to fold directly in half.`,
    fixTo0mm: 'Set to 0 mm (touching)',
    rangeToGenerate: 'Range to generate',
    upTo: 'up to',
    pairsPerPage: 'pairs / A4 sheet',
    totalSheets: 'total A4 sheets',
    advancedSettingsBtn: 'A4 margins and print layout adjustments',
    pageMarginMm: 'Page margin (mm)',
    rowSpacingMm: 'Row spacing (mm)',
    frontBackSpacingMm: 'Front-to-back spacing (mm)',
    touchingHint: '0 mm = touching side-by-side for folding',
    cutFoldLines: 'Subtle cut and fold dashed guides',
    transparentQrBg: '100% transparent QR background (no white box)',
    rowDescriptionNotice: 'Each A4 row contains [Front] side-by-side with [Back + QR], ready to fold.',
    generatePdfButton: (count: number) => `Generate A4 PDF Document (${count} cards)`,

    guideTitle: 'Step-by-Step Guide',
    guideSubtitle: 'Learn how to design, number, and assemble your QR cards ready to print on A4',
    downloadWordBtn: 'Download Word (.docx)',
    closeBtn: 'Close window',
    infographicTab: 'Visual Infographic (Comic Guide)',
    manualTab: 'Manual & Assembly Advice',
    openFullImage: 'Open Full Image',
    infographicTitle: 'Visual Infographic Created by Àngel Agustí',

    close: 'Close',
    cancel: 'Cancel',
    downloadPdf: 'Download Printable PDF',
    previewPdf: 'Preview',
    copyJson: 'Copy JSON',
    copied: 'Copied!',
    importJson: 'Import Config',
    downloadPython: 'Download script (.py)',
    generatingTitle: 'Generating A4 PDF Document...',
    generationSuccess: 'Generation Successfully Completed!',
    generationStatus: 'Generation Status',
    processedCards: 'Processed cards:',
    terminalLogs: 'Process Logs Terminal',
    closeModal: 'Close',
    cancelProcess: 'Cancel process',
    licenseModalTitle: 'Application License',
    licenseModalSubtitle: 'Creative Commons Attribution-NonCommercial-ShareAlike (CC BY-NC-SA 4.0)',

    pythonModalTitle: 'Generated Python Code',
    pythonModalSubtitle: 'Standalone script with current coordinates and temporary file cleanup.',
    pythonDepsText: 'Install dependencies on your machine:',
    pythonInstructionsText: 'Save the file as generar_targetes.py together with davant.png and darrere.png, then run python generar_targetes.py.',
    pythonCurrentCoords: (x: string, y: string) => `Current QR Coordinates: X: ${x}%, Y: ${y}%`,
    copyCode: 'Copy Code',
    downloadScript: 'Download .py',
    configModalTitle: 'Share / Import Coordinates & Config',
    configModalSubtitle: 'You can save or share this JSON config file with another device or colleague.',
    exportTabTitle: 'Export Current Configuration',
    importTabTitle: 'Import / Load JSON Configuration',
    downloadConfigJson: 'Download .json',
    pasteJsonPrompt: 'Paste JSON code here to load:',
    applyImportBtn: 'Load & Apply Settings',
    invalidJsonAlert: 'Please paste valid JSON content.',
    importSuccessAlert: 'Configuration imported and applied successfully!',

    createdWith: 'Created with VibeCoding by Àngel Agustí',
    freeUseNote: 'Free to use and create, strictly non-commercial',
    licenseBtnText: 'CC BY-NC-SA 4.0 License',
    guideFooterText: 'Guide & Infographic',
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType>({
  language: 'ca',
  setLanguage: () => {},
  t: translations.ca,
});

const STORAGE_LANG_KEY = 'qr_app_language';

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_LANG_KEY) as Language;
      if (saved && (saved === 'ca' || saved === 'es' || saved === 'en')) {
        return saved;
      }
      // Browser language check
      const navLang = navigator.language.toLowerCase();
      if (navLang.startsWith('es')) return 'es';
      if (navLang.startsWith('en')) return 'en';
    }
    return 'ca';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_LANG_KEY, lang);
    }
  };

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => useContext(I18nContext);
