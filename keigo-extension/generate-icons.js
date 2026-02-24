const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const sizes = [16, 48, 128];

async function generateIcons() {
  fs.mkdirSync(path.join(__dirname, 'icons'), { recursive: true });

  for (const size of sizes) {
    const fontSize = Math.round(size * 0.55);
    const rx = Math.round(size * 0.15);

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <rect fill="#4F46E5" width="${size}" height="${size}" rx="${rx}"/>
      <text
        x="50%"
        y="55%"
        text-anchor="middle"
        dominant-baseline="middle"
        fill="white"
        font-size="${fontSize}"
        font-family="serif"
      >敬</text>
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
