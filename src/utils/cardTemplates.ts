/**
 * Helper to generate crisp default sample cards (front & back)
 * so the user can test immediately without having to prepare files first.
 */

export function createDefaultFrontCard(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1012; // 85.6mm at 300dpi standard ID card approx
  canvas.height = 638; // 53.98mm at 300dpi standard CR80
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#1e293b');
  gradient.addColorStop(1, '#0f172a');
  ctx.fillStyle = gradient;
  ctx.roundRect(0, 0, canvas.width, canvas.height, 28);
  ctx.fill();

  // Subtle decorative accents
  ctx.save();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(canvas.width - 100, 100, 220, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(canvas.width - 60, 140, 300, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Badge Header
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.fillText('IDENTIFICACIÓ OFICIAL', 60, 90);

  // Institution / Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px system-ui, sans-serif';
  ctx.fillText('TARGETA D\'ACCÉS GENERAL', 60, 155);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '22px system-ui, sans-serif';
  ctx.fillText('CURS ACADÈMIC 2026 - 2027', 60, 195);

  // Placeholder avatar box
  ctx.fillStyle = '#334155';
  ctx.roundRect(60, 240, 200, 250, 16);
  ctx.fill();
  ctx.fillStyle = '#64748b';
  ctx.font = '60px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('👤', 160, 385);
  ctx.textAlign = 'left';

  // Info lines
  ctx.fillStyle = '#94a3b8';
  ctx.font = '18px system-ui, sans-serif';
  ctx.fillText('TITULAR DE LA TARGETA', 300, 290);
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 28px system-ui, sans-serif';
  ctx.fillText('NOM I COGNOMS DE L\'USUARI', 300, 330);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '18px system-ui, sans-serif';
  ctx.fillText('ESTAT', 300, 395);
  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.fillText('● ACTIU / VERIFICAT', 300, 430);

  // Front indicator label
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 18px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('[ CARA DAVANT ]', canvas.width - 60, canvas.height - 50);

  return canvas.toDataURL('image/png');
}

export function createDefaultBackCard(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1012;
  canvas.height = 638;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background light neutral
  ctx.fillStyle = '#f8fafc';
  ctx.roundRect(0, 0, canvas.width, canvas.height, 28);
  ctx.fill();

  // Border outline
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 4;
  ctx.roundRect(2, 2, canvas.width - 4, canvas.height - 4, 26);
  ctx.stroke();

  // Magnetic strip imitation (top)
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 50, canvas.width, 90);

  // Title / Instructions
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.fillText('CONDICIONS D\'ÚS I VERIFICACIÓ', 60, 200);

  ctx.fillStyle = '#64748b';
  ctx.font = '18px system-ui, sans-serif';
  const textLines = [
    '1. Aquesta targeta és personal i intransferible.',
    '2. Per accedir al recinte, mostreu el codi QR al lector del control d\'accés.',
    '3. En cas de pèrdua o deteriorament, contacteu immediatament amb l\'administració.',
    '4. Escanegeu per comprovar la validesa del registre.'
  ];
  textLines.forEach((line, index) => {
    ctx.fillText(line, 60, 240 + index * 30);
  });

  // Highlight area where the QR is intended to be placed
  ctx.strokeStyle = '#94a3b8';
  ctx.setLineDash([8, 6]);
  ctx.lineWidth = 2;
  // default preview area (right side)
  ctx.strokeRect(690, 210, 260, 260);
  ctx.setLineDash([]);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '16px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ÀREA DE CODI QR', 820, 345);
  ctx.textAlign = 'left';

  // Footer bar
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(40, canvas.height - 70, canvas.width - 80, 2);

  ctx.fillStyle = '#64748b';
  ctx.font = '16px system-ui, sans-serif';
  ctx.fillText('SERVEIS D\'IDENTIFICACIÓ I ACCÉS • SUPORT: contacte@xtec.cat', 60, canvas.height - 40);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 18px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('[ CARA DARRERE ]', canvas.width - 60, canvas.height - 40);

  return canvas.toDataURL('image/png');
}
