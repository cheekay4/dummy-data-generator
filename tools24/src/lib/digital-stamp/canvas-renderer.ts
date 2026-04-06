import type { StampOptions, WearIntensity } from './stamp-types';

function getFontFamily(style: string): string {
  if (style === 'kaisho') return '"Noto Serif JP", serif';
  if (style === 'tensho') return '"Noto Serif JP", serif';
  return '"Noto Serif JP", serif';
}

function getDateText(date: string, format: string): string {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  if (format === 'iso') return date;
  if (format === 'japanese') {
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    return `${y}.${String(m).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
  }
  if (format === 'wareki') {
    const y = d.getFullYear();
    let era = '令和';
    let eraYear = y - 2018;
    if (y >= 2019) { era = '令和'; eraYear = y - 2018; }
    else if (y >= 1989) { era = '平成'; eraYear = y - 1988; }
    else if (y >= 1926) { era = '昭和'; eraYear = y - 1925; }
    const m = d.getMonth() + 1;
    const day = d.getDate();
    return `${era}${eraYear}年${m}月${day}日`;
  }
  return date;
}

function drawVerticalText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  startY: number,
  charHeight: number
): void {
  for (let i = 0; i < text.length; i++) {
    ctx.fillText(text[i], cx, startY + i * charHeight);
  }
}

function addWearEffect(
  ctx: CanvasRenderingContext2D,
  size: number,
  intensity: WearIntensity
): void {
  if (intensity === 'none') return;
  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;
  const prob = intensity === 'light' ? 0.1 : 0.25;

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a > 0 && Math.random() < prob) {
      data[i + 3] = 0;
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function drawMaruSei(
  ctx: CanvasRenderingContext2D,
  options: StampOptions,
  size: number
): void {
  const { sei, color, lineWidth, fontStyle } = options;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - lineWidth * 2;

  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;

  // 外円
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  // 姓テキスト（縦書き）
  if (sei) {
    const fontSize = Math.round(r * (sei.length <= 2 ? 0.55 : sei.length === 3 ? 0.38 : 0.30));
    ctx.font = `${fontSize}px ${getFontFamily(fontStyle)}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const charH = fontSize * 1.2;
    const totalH = sei.length * charH;
    const startY = cy - totalH / 2 + charH / 2;
    drawVerticalText(ctx, sei, cx, startY, charH);
  }
}

function drawMaruFull(
  ctx: CanvasRenderingContext2D,
  options: StampOptions,
  size: number
): void {
  const { sei, mei, color, lineWidth, fontStyle } = options;
  const fullName = sei + mei;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - lineWidth * 2;

  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;

  // 外円
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  // 内円（細い）
  ctx.beginPath();
  ctx.arc(cx, cy, r - lineWidth * 3, 0, Math.PI * 2);
  ctx.stroke();

  // 縦書きテキスト
  if (fullName) {
    const fontSize = Math.round(r * (fullName.length <= 3 ? 0.42 : 0.32));
    ctx.font = `${fontSize}px ${getFontFamily(fontStyle)}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const charH = fontSize * 1.2;
    const totalH = fullName.length * charH;
    const startY = cy - totalH / 2 + charH / 2;
    drawVerticalText(ctx, fullName, cx, startY, charH);
  }
}

function drawKaku(
  ctx: CanvasRenderingContext2D,
  options: StampOptions,
  size: number
): void {
  const { companyName, upperText, sei, color, lineWidth, fontStyle } = options;
  const pad = lineWidth * 3;

  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;

  // 外枠
  ctx.strokeRect(pad, pad, size - pad * 2, size - pad * 2);

  const inner = size - pad * 2;
  const topH = Math.round(inner * 0.25);
  const bottomH = Math.round(inner * 0.25);
  const midH = inner - topH - bottomH;

  // 上段区切り線
  ctx.beginPath();
  ctx.moveTo(pad, pad + topH);
  ctx.lineTo(size - pad, pad + topH);
  ctx.stroke();

  // 下段区切り線
  ctx.beginPath();
  ctx.moveTo(pad, size - pad - bottomH);
  ctx.lineTo(size - pad, size - pad - bottomH);
  ctx.stroke();

  // 上段テキスト（横書き）
  const topFontSize = Math.round(topH * 0.55);
  ctx.font = `${topFontSize}px ${getFontFamily(fontStyle)}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(upperText || '承認', size / 2, pad + topH / 2);

  // 中段テキスト（縦書き）
  if (companyName) {
    const midFontSize = Math.round(midH * 0.22);
    ctx.font = `${midFontSize}px ${getFontFamily(fontStyle)}`;
    ctx.textBaseline = 'middle';
    const charH = midFontSize * 1.1;
    const totalH = companyName.length * charH;
    const startY = pad + topH + midH / 2 - totalH / 2 + charH / 2;
    drawVerticalText(ctx, companyName, size / 2, startY, charH);
  }

  // 下段テキスト
  const bottomFontSize = Math.round(bottomH * 0.55);
  ctx.font = `${bottomFontSize}px ${getFontFamily(fontStyle)}`;
  ctx.textBaseline = 'middle';
  ctx.fillText(sei || '', size / 2, size - pad - bottomH / 2);
}

function drawDate(
  ctx: CanvasRenderingContext2D,
  options: StampOptions,
  size: number
): void {
  const { upperText, date, dateFormat, color, lineWidth, fontStyle } = options;
  const cx = size / 2;
  const pad = lineWidth * 2;
  const r = size / 2 - pad;

  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;

  // 外円
  ctx.beginPath();
  ctx.arc(cx, cx, r, 0, Math.PI * 2);
  ctx.stroke();

  // 上下区切り線（水平）
  const rInner = r - lineWidth * 2;
  const sep = rInner * 0.4;
  ctx.beginPath();
  ctx.moveTo(cx - rInner * Math.cos(Math.asin(sep / rInner)), cx - sep);
  ctx.lineTo(cx + rInner * Math.cos(Math.asin(sep / rInner)), cx - sep);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx - rInner * Math.cos(Math.asin(sep / rInner)), cx + sep);
  ctx.lineTo(cx + rInner * Math.cos(Math.asin(sep / rInner)), cx + sep);
  ctx.stroke();

  // 上段テキスト
  const topFontSize = Math.round(r * 0.25);
  ctx.font = `${topFontSize}px ${getFontFamily(fontStyle)}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(upperText || '承認', cx, cx - sep / 2 - topFontSize / 2);

  // 日付テキスト
  const dateText = getDateText(date, dateFormat);
  const dateFontSize = Math.round(r * 0.18);
  ctx.font = `${dateFontSize}px ${getFontFamily(fontStyle)}`;
  ctx.fillText(dateText, cx, cx);

  // 下段（空欄）
}

export function renderStamp(canvas: HTMLCanvasElement, options: StampOptions): void {
  const { size, rotation, type, wear } = options;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, size, size);

  // 回転
  if (rotation !== 0) {
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-size / 2, -size / 2);
  }

  switch (type) {
    case 'maru-sei': drawMaruSei(ctx, options, size); break;
    case 'maru-full': drawMaruFull(ctx, options, size); break;
    case 'kaku': drawKaku(ctx, options, size); break;
    case 'date': drawDate(ctx, options, size); break;
  }

  if (rotation !== 0) ctx.restore();

  addWearEffect(ctx, size, wear);
}
