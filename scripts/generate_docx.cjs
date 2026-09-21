const fs = require('fs');
const path = require('path');
const docx = require('docx');

const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
} = docx;

async function generateGuideDocx() {
  const doc = new Document({
    title: "Guia d'ús - Generador de Targetes QR",
    description: "Manual complet de funcionament i característiques de l'aplicació",
    creator: "Àngel Agustí (VibeCoding)",
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        children: [
          // Title
          new Paragraph({
            text: "Generador de Targetes QR i Documents A4",
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "Guia d'Ús i Manual d'Usuari",
                bold: true,
                size: 28,
                color: "0284C7",
              }),
            ],
            spacing: { after: 300 },
          }),

          // Metadata box
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: "F1F5F9" },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: "Autor: ", bold: true }),
                          new TextRun("Àngel Agustí (aagust11@xtec.cat)\n"),
                          new TextRun({ text: "Projecte: ", bold: true }),
                          new TextRun("Creat amb VibeCoding\n"),
                          new TextRun({ text: "Llicència: ", bold: true }),
                          new TextRun("Creative Commons Reconeixement-NoComercial-CompartirIgual 4.0 (CC BY-NC-SA 4.0)\n"),
                          new TextRun({ text: "Drets d'ús: ", bold: true }),
                          new TextRun("Permet utilitzar, estudiar i crear lliurement, però MAI cobrar ni comercialitzar."),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: "", spacing: { after: 300 } }),

          // Section 1
          new Paragraph({
            text: "1. Introducció i Propòsit",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Aquesta aplicació està pensada per generar documents PDF A4 preparats per a impressió massiva de targetes o carnets (per a biblioteques, escoles, associacions, esdeveniments, etc.). A cada fila del document A4 es col·loquen de costat la imatge del davant i la imatge del darrere amb un codi QR generat sobreposat exactament a la posició definida per l'usuari.",
              }),
            ],
            spacing: { after: 180 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Les targetes estan dissenyades tocant-se de costat (0 mm d'espaiat) de manera que es puguin imprimir, doblegar fàcilment i plastificar o enquadernar amb un sol procés.",
              }),
            ],
            spacing: { after: 240 },
          }),

          // Section 2
          new Paragraph({
            text: "2. Principals Funcionalitats",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "• Càrrega i Memòria d'Imatges: ", bold: true }),
              new TextRun("Permet pujar imatges PNG/JPG per al davant i el darrere. El navegador recorda les imatges automàticament mitjançant IndexedDB perquè no es perdin en tancar la pestanya."),
            ],
            spacing: { after: 120 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "• Editor Interactiu de Canvas: ", bold: true }),
              new TextRun("Permet dibuixar un requadre amb el ratolí directament sobre la imatge del darrere per indicar la ubicació del codi QR. Es pot reajustar visualment o amb controls percentuals precisos."),
            ],
            spacing: { after: 120 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "• Fons Transparent del QR: ", bold: true }),
              new TextRun("El codi QR es genera amb fons 100% transparent per respectar el fons i disseny original de la targeta."),
            ],
            spacing: { after: 120 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "• Nomenclatura i Numeració Intel·ligent: ", bold: true }),
              new TextRun("Segueix el format configurable (ex: IMV2627####). El sistema recorda l'últim número generat i proposa automàticament continuar pel número següent. Si es canvia el prefix, es reinicia a l'1."),
            ],
            spacing: { after: 120 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "• Exportació de Coordenades (JSON): ", bold: true }),
              new TextRun("Permet descarregar o copiar la configuració exacta del requadre i la sèrie en un fitxer .json per compartir-lo amb altres companys o ordinadors."),
            ],
            spacing: { after: 120 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "• Codi Python Autònom: ", bold: true }),
              new TextRun("Permet descarregar un script .py llest per executar en local amb les biblioteques Pillow, QRCode i ReportLab, amb neteja automàtica de temporals i barres de progrés."),
            ],
            spacing: { after: 120 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "• Mode Clar i Mode Fosc: ", bold: true }),
              new TextRun("Commutador a la capçalera per adaptar la interfície segons les preferències d'il·luminació de l'usuari."),
            ],
            spacing: { after: 240 },
          }),

          // Section 3
          new Paragraph({
            text: "3. Guia Pas a Pas",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "Pas 1: Carregar les plantilles\n", bold: true }),
              new TextRun("Arrossegueu o seleccioneu les imatges PNG/JPG corresponents a la cara del davant i a la cara del darrere. Si no en teniu cap a mà, l'aplicació inclou unes plantilles de mostra ja carregades."),
            ],
            spacing: { after: 140 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "Pas 2: Dibuixar el requadre del QR\n", bold: true }),
              new TextRun("Feu clic i arrossegueu sobre la imatge del darrere per definir la caixa del QR. Podeu moure-la o redimensionar-la amb els controls fins que quedi perfectament enquadrada."),
            ],
            spacing: { after: 140 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "Pas 3: Ajustar els paràmetres de la sèrie\n", bold: true }),
              new TextRun("Indiqueu el prefix (ex: IMV2627), el número d'inici (ex: 3) i la quantitat de targetes a produir (ex: 20). Si ja n'havíeu generat prèviament, l'aplicació us proposarà el número següent."),
            ],
            spacing: { after: 140 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "Pas 4: Generar el PDF A4\n", bold: true }),
              new TextRun("Premeu el botó «Generar Document PDF A4». S'obrirà una finestra amb una barra de progrés en temps real, l'estimació de temps restant i el registre detallat de cada targeta processada."),
            ],
            spacing: { after: 140 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "Pas 5: Descarregar i Imprimir\n", bold: true }),
              new TextRun("Un cop acabat el procés, premeu «Descarregar PDF» o consulteu la previsualització integrada. Imprimiu el document en paper A4 a escala 100% (sense ajustar a la pàgina)."),
            ],
            spacing: { after: 240 },
          }),

          // Section 4
          new Paragraph({
            text: "4. Consells d'Impressió i Muntatge",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "• Tipus de paper: ", bold: true }),
              new TextRun("Es recomana utilitzar paper gruixut o cartolina blanca d'entre 180g i 250g per donar cos a la targeta."),
            ],
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "• Doblegat: ", bold: true }),
              new TextRun("Com que el davant i el darrere estan units pel lateral, es recomana marcar la línia central de doblec amb una regla i plegar abans de retallar el contorn exterior."),
            ],
            spacing: { after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "• Plastificat: ", bold: true }),
              new TextRun("Per a carnets escolars duradors, podeu introduir la targeta doblegada en una funda de plastificar de mida carnet (mida targeta de crèdit estàndard 85x54mm aprox.) i passar-la per la plastificadora."),
            ],
            spacing: { after: 240 },
          }),

          // Section 5
          new Paragraph({
            text: "5. Llicència i Condicions d'Ús",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Aquest projecte es distribueix sota la llicència Creative Commons Reconeixement-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0).\n\n",
              }),
              new TextRun({ text: "Això significa que:\n" }),
              new TextRun({ text: "✓ Podeu utilitzar lliurement l'aplicació per a qualsevol ús educatiu, domèstic o associatiu.\n" }),
              new TextRun({ text: "✓ Podeu modificar, millorar i crear versions derivades del codi font.\n" }),
              new TextRun({ text: "✗ No es pot cobrar per l'aplicació ni fer-ne ús comercial amb finalitat lucrativa directa.\n" }),
              new TextRun({ text: "✓ Cal citar sempre l'autoria d'Àngel Agustí (aagust11@xtec.cat) i el concepte VibeCoding.", italic: true }),
            ],
            spacing: { after: 240 },
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(__dirname, '../public/guia_us_generador_targetes_qr.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Document Word generat correctament a: ${outputPath}`);
}

generateGuideDocx().catch(console.error);
