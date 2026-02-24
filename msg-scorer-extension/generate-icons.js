const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const sizes = [16, 48, 128];

async function generateIcons() {
  fs.mkdirSync(path.join(__dirname, 'icons'), { recursive: true });

  for (const size of sizes) {
    const fontSize = Math.round(size * 0.55);
    const rx = Math.round(size * 0.15);

    // ◆ をpolygonで描く（フォント依存なし・どのサイズでも綺麗）
    const cx = size / 2;
    const cy = size / 2;
    const margin = Math.round(size * 0.14);
    const points = [
      `${cx},${margin}`,           // 上
      `${size - margin},${cy}`,    // 右
      `${cx},${size - margin}`,    // 下
      `${margin},${cy}`,           // 左
    ].join(' ');

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <rect fill="#4F46E5" width="${size}" height="${size}" rx="${rx}"/>
      <polygon points="${points}" fill="white"/>
    </svg>`;

    const outPath = path.join(__dirname, 'icons', `icon${size}.png`);
    await sharp(Buffer.from(svg)).png().toFile(outPath);
    console.log(`Generated: icons/icon${size}.png`);
  }
}

generateIcons().catch((err) => {
  console.error(err);
  process.exit(1);
});
