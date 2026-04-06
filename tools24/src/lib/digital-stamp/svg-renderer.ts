import type { StampOptions } from './stamp-types';

function escape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function verticalTextSvg(
  text: string,
  cx: number,
  startY: number,
  charH: number,
  color: string,
  fontSize: number
): string {
  return text
    .split('')
    .map(
      (char, i) =>
        `<text x="${cx}" y="${startY + i * charH}" text-anchor="middle" dominant-baseline="middle" fill="${color}" font-size="${fontSize}" font-family="'Noto Serif JP', serif">${escape(char)}</text>`
    )
    .join('\n');
}

export function renderStampSVG(options: StampOptions): string {
  const { size, color, lineWidth, type, sei, fontStyle: _fontStyle } = options;
  const cx = size / 2;
  const r = size / 2 - lineWidth * 2;
  const transform = options.rotation !== 0 ? ` transform="rotate(${options.rotation}, ${cx}, ${cx})"` : '';

  let inner = '';

  if (type === 'maru-sei' || type === 'maru-full') {
    const name = type === 'maru-sei' ? sei : sei + options.mei;
    const fontSize = Math.round(r * (name.length <= 2 ? 0.55 : 0.38));
    const charH = fontSize * 1.2;
    const totalH = name.length * charH;
    const startY = cx - totalH / 2 + charH / 2;

    inner = `<circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${color}" stroke-width="${lineWidth}"/>
${verticalTextSvg(name, cx, startY, charH, color, fontSize)}`;
  } else if (type === 'kaku') {
    const pad = lineWidth * 3;
    const boxW = size - pad * 2;
    const boxH = size - pad * 2;
    const topH = Math.round(boxH * 0.25);
    const bottomH = Math.round(boxH * 0.25);
    const midFontSize = Math.round((boxH - topH - bottomH) * 0.22);
    const midCharH = midFontSize * 1.1;
    const totalMidH = options.companyName.length * midCharH;
    const midStartY = pad + topH + (boxH - topH - bottomH) / 2 - totalMidH / 2 + midCharH / 2;

    inner = `<rect x="${pad}" y="${pad}" width="${boxW}" height="${boxH}" fill="none" stroke="${color}" stroke-width="${lineWidth}"/>
<line x1="${pad}" y1="${pad + topH}" x2="${size - pad}" y2="${pad + topH}" stroke="${color}" stroke-width="${lineWidth}"/>
<line x1="${pad}" y1="${size - pad - bottomH}" x2="${size - pad}" y2="${size - pad - bottomH}" stroke="${color}" stroke-width="${lineWidth}"/>
<text x="${cx}" y="${pad + topH / 2}" text-anchor="middle" dominant-baseline="middle" fill="${color}" font-size="${Math.round(topH * 0.55)}" font-family="'Noto Serif JP', serif">${escape(options.upperText || '承認')}</text>
${verticalTextSvg(options.companyName, cx, midStartY, midCharH, color, midFontSize)}
<text x="${cx}" y="${size - pad - bottomH / 2}" text-anchor="middle" dominant-baseline="middle" fill="${color}" font-size="${Math.round(bottomH * 0.55)}" font-family="'Noto Serif JP', serif">${escape(sei)}</text>`;
  } else {
    // date
    inner = `<circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${color}" stroke-width="${lineWidth}"/>
<text x="${cx}" y="${cx}" text-anchor="middle" dominant-baseline="middle" fill="${color}" font-size="${Math.round(r * 0.2)}" font-family="'Noto Serif JP', serif">${escape(options.date)}</text>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
<g${transform}>
${inner}
</g>
</svg>`;
}
