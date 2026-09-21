import { GeneratorConfig } from '../types';

export function generatePythonScript(config: GeneratorConfig): string {
  const xPct = config.box.xPercent.toFixed(2);
  const yPct = config.box.yPercent.toFixed(2);
  const wPct = config.box.widthPercent.toFixed(2);
  const hPct = config.box.heightPercent.toFixed(2);
  const start = config.startNumber;
  const count = config.count;
  const prefix = config.prefix;
  const digits = config.digits;

  return `#!/usr/bin/env python3
"""
Generador de Targetes amb QR en PDF A4
Creat a partir de la configuració exportada de l'aplicació web.

Requisits:
    pip install pillow qrcode reportlab tqdm

Instruccions d'ús:
    1. Deseu aquest fitxer com a 'generar_targetes.py'
    2. Col·loqueu les imatges 'davant.png' i 'darrere.png' a la mateixa carpeta
    3. Executeu: python generar_targetes.py
"""

import os
import sys
import math
import shutil
import tempfile
import time
from pathlib import Path
from PIL import Image
import qrcode
from tqdm import tqdm
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

# ==========================================
# CONFIGURACIÓ DE LA GENERACIÓ
# (Coordenades i paràmetres definits a la web)
# ==========================================
FITXER_DAVANT = "davant.png"
FITXER_DARRERE = "darrere.png"

# Format del codi (ex: IMV26270003)
PREFIX = "${prefix}"
NUMERO_DIGITS = ${digits}
NUMERO_INICI = ${start}
QUANTITAT = ${count}

# Coordenades del requadre del QR en percentatge (0-100%) respecte a la imatge del darrere
QR_BOX_PERCENT = {
    "x": ${xPct},       # Desplaçament horitzontal des de l'esquerra (%)
    "y": ${yPct},       # Desplaçament vertical des de dalt (%)
    "width": ${wPct},   # Amplada del requadre (%)
    "height": ${hPct}   # Alçada del requadre (%)
}

# Paràmetres del document PDF (A4)
MARGE_MM = ${config.marginMm}
SEPARACIO_FILA_MM = ${config.spacingMm}
SEPARACIO_PARELLA_MM = ${config.pairSpacingMm}
DIBUIXAR_GUIES_TALL = ${config.drawCutGuides ? 'True' : 'False'}

MM_TO_PT = 72.0 / 25.4
A4_WIDTH_PT, A4_HEIGHT_PT = A4

def format_codi(num: int) -> str:
    """Genera el codi amb els dígits necessaris, ex: IMV26270003"""
    return f"{PREFIX}{str(num).zfill(NUMERO_DIGITS)}"

def compositar_targeta_darrere(img_darrere_original: Image.Image, codi_qr_text: str) -> Image.Image:
    """Crea una còpia de la cara posterior i hi incrusta el codi QR al requadre especificat."""
    base = img_darrere_original.copy().convert("RGBA")
    bw, bh = base.size

    # Calcular coordenades en píxels reals de la imatge base
    box_x = int(bw * (QR_BOX_PERCENT["x"] / 100.0))
    box_y = int(bh * (QR_BOX_PERCENT["y"] / 100.0))
    box_w = int(bw * (QR_BOX_PERCENT["width"] / 100.0))
    box_h = int(bh * (QR_BOX_PERCENT["height"] / 100.0))

    # Assegurar mida quadrada pel QR mantenint la proporció dins del requadre
    qr_size = min(box_w, box_h)
    offset_x = box_x + (box_w - qr_size) // 2
    offset_y = box_y + (box_h - qr_size) // 2

    # Generar el codi QR amb fons transparent
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=1,
    )
    qr.add_data(codi_qr_text)
    qr.make(fit=True)
    img_qr = qr.make_image(fill_color="black", back_color="white").convert("RGBA")

    # Fer transparent el fons blanc del codi QR
    datas = img_qr.getdata()
    new_data = []
    for item in datas:
        if item[0] > 200 and item[1] > 200 and item[2] > 200:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append((item[0], item[1], item[2], 255))
    img_qr.putdata(new_data)
    img_qr = img_qr.resize((qr_size, qr_size), Image.Resampling.LANCZOS)

    # Enganxar el QR amb fons transparent a la targeta (fent servir el canal alfa com a màscara)
    base.paste(img_qr, (offset_x, offset_y), img_qr)
    return base.convert("RGB")

def calcular_distribucio_a4(card_w_px: int, card_h_px: int):
    """Calcula quantes parelles (Davant + Darrere) caben com a màxim per full A4."""
    marge_pt = MARGE_MM * MM_TO_PT
    espai_util_w = A4_WIDTH_PT - (2 * marge_pt)
    espai_util_h = A4_HEIGHT_PT - (2 * marge_pt)

    # Cada fila té: [Davant] + [Sep] + [Darrere]
    aspect_ratio = card_w_px / card_h_px
    sep_parella_pt = SEPARACIO_PARELLA_MM * MM_TO_PT
    sep_fila_pt = SEPARACIO_FILA_MM * MM_TO_PT

    # L'amplada de 2 targetes més la separació ha de cabre en espai_util_w
    targeta_w_pt = (espai_util_w - sep_parella_pt) / 2.0
    targeta_h_pt = targeta_w_pt / aspect_ratio

    # Quantes files caben verticalment?
    files_per_full = int((espai_util_h + sep_fila_pt) / (targeta_h_pt + sep_fila_pt))

    # Si no cap cap fila o si són massa altes, reajustem per alçada
    if files_per_full < 1:
        files_per_full = 1
        targeta_h_pt = espai_util_h
        targeta_w_pt = targeta_h_pt * aspect_ratio

    return files_per_full, targeta_w_pt, targeta_h_pt

def main():
    print("=" * 60)
    print("  GENERADOR DE TARGETES AMB CODI QR EN PDF A4")
    print("=" * 60)

    # Comprovació de fitxers d'entrada
    p_davant = Path(FITXER_DAVANT)
    p_darrere = Path(FITXER_DARRERE)

    if not p_davant.exists() or not p_darrere.exists():
        print(f"\\n❌ ERROR: Falten els fitxers d'imatge.")
        print(f"   Assegureu-vos de tenir '{FITXER_DAVANT}' i '{FITXER_DARRERE}'")
        print(f"   a la mateixa carpeta que aquest script.\\n")
        sys.exit(1)

    print(f"✔️ Imatges trobades: {FITXER_DAVANT} i {FITXER_DARRERE}")
    img_davant = Image.open(p_davant)
    img_darrere = Image.open(p_darrere)

    # Comprovar mides
    card_w, card_h = img_davant.size
    print(f"   Mida targeta original: {card_w}x{card_h} px")

    # Càlcul de distribució A4
    files_per_full, card_w_pt, card_h_pt = calcular_distribucio_a4(card_w, card_h)
    targetes_per_full = files_per_full # 1 parella per fila
    total_fulls = math.ceil(QUANTITAT / targetes_per_full)

    nom_pdf = f"targetes_{PREFIX}_{str(NUMERO_INICI).zfill(NUMERO_DIGITS)}_a_{str(NUMERO_INICI + QUANTITAT - 1).zfill(NUMERO_DIGITS)}.pdf"

    print(f"\\n📄 Paràmetres del document PDF:")
    print(f"   • Files per full A4: {files_per_full} parelles")
    print(f"   • Total de targetes: {QUANTITAT} (Davant + Darrere amb QR)")
    print(f"   • Total de fulls A4 estimats: {total_fulls}")
    print(f"   • Nom del fitxer final: {nom_pdf}\\n")

    # Crear carpeta temporal per emmagatzemar els PNGs renderitzats
    temp_dir = tempfile.mkdtemp(prefix="targetes_qr_tmp_")
    print(f"📁 Carpeta temporal creada: {temp_dir}")

    # Guardar davant a la carpeta temporal un sol cop
    davant_temp_path = os.path.join(temp_dir, "davant_temp.png")
    img_davant.save(davant_temp_path, "PNG")

    start_time = time.time()
    pdf = canvas.Canvas(nom_pdf, pagesize=A4)

    marge_pt = MARGE_MM * MM_TO_PT
    sep_parella_pt = SEPARACIO_PARELLA_MM * MM_TO_PT
    sep_fila_pt = SEPARACIO_FILA_MM * MM_TO_PT

    try:
        print("\\n🚀 Iniciant generació amb barra de progrés:")
        progress_bar = tqdm(range(QUANTITAT), desc="Generant targetes", unit="targeta")

        item_in_page = 0
        current_page = 1

        for i in progress_bar:
            current_num = NUMERO_INICI + i
            codi = format_codi(current_num)

            # 1. Generar composició del darrere amb QR
            back_composed = compositar_targeta_darrere(img_darrere, codi)
            back_temp_path = os.path.join(temp_dir, f"darrere_{codi}.png")
            back_composed.save(back_temp_path, "PNG")

            # 2. Calcular posició vertical en la pàgina (de dalt cap a baix)
            # En reportlab, l'origen Y=0 és a baix de la pàgina
            fila = item_in_page
            y_pos_top = A4_HEIGHT_PT - marge_pt - (fila * (card_h_pt + sep_fila_pt))
            y_pos_bottom = y_pos_top - card_h_pt

            x_davant = marge_pt
            x_darrere = marge_pt + card_w_pt + sep_parella_pt

            # 3. Dibuixar Davant i Darrere
            pdf.drawImage(davant_temp_path, x_davant, y_pos_bottom, width=card_w_pt, height=card_h_pt)
            pdf.drawImage(back_temp_path, x_darrere, y_pos_bottom, width=card_w_pt, height=card_h_pt)

            # Guies de tall i línia de plegat si estan activades
            if DIBUIXAR_GUIES_TALL:
                pdf.setStrokeColorRGB(0.75, 0.75, 0.75)
                pdf.setLineWidth(0.5)
                if SEPARACIO_PARELLA_MM == 0:
                    # Marc perimetral de la parella que es doblega
                    pdf.rect(x_davant, y_pos_bottom, card_w_pt * 2, card_h_pt)
                    # Línia de plegat central discontínua
                    pdf.setStrokeColorRGB(0.55, 0.55, 0.55)
                    pdf.setDash(3, 2)
                    pdf.line(x_darrere, y_pos_bottom, x_darrere, y_pos_bottom + card_h_pt)
                    pdf.setDash()
                else:
                    pdf.rect(x_davant, y_pos_bottom, card_w_pt, card_h_pt)
                    pdf.rect(x_darrere, y_pos_bottom, card_w_pt, card_h_pt)

            # Esborrar la imatge individual generada per alliberar espai ràpidament
            if os.path.exists(back_temp_path):
                os.remove(back_temp_path)

            item_in_page += 1

            # Si hem completat el full o és l'últim element
            if item_in_page >= targetes_per_full and (i + 1) < QUANTITAT:
                pdf.showPage()
                current_page += 1
                item_in_page = 0

        # Tancar i desar el PDF
        pdf.save()

    finally:
        # Neteja de la carpeta temporal (obligatòria segons especificació)
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir, ignore_errors=True)
            print(f"\\n🧹 Carpeta temporal eliminada amb èxit.")

    elapsed = time.time() - start_time
    file_size_mb = os.path.getsize(nom_pdf) / (1024 * 1024)

    print("=" * 60)
    print(f"✨ PROCÉS FINALITZAT AMB ÈXIT!")
    print(f"   • Fitxer generat: {nom_pdf}")
    print(f"   • Mida: {file_size_mb:.2f} MB")
    print(f"   • Pàgines A4: {total_fulls}")
    print(f"   • Temps d'execució: {elapsed:.1f} segons")
    print("=" * 60)

if __name__ == "__main__":
    main()
`;
}
