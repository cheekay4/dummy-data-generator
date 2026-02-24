const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

const isWatch = process.argv.includes('--watch');

// dist ディレクトリを作成
['dist/content', 'dist/popup', 'dist/background'].forEach((dir) => {
  fs.mkdirSync(path.join(__dirname, dir), { recursive: true });
});

// content.css を dist/content/ にコピー
const contentCssSrc = path.join(__dirname, 'src/content/content.css');
const contentCssDst = path.join(__dirname, 'dist/content/content.css');
if (fs.existsSync(contentCssSrc)) {
  fs.copyFileSync(contentCssSrc, contentCssDst);
}

// popup.html を dist/popup/ にコピー
const popupHtmlSrc = path.join(__dirname, 'src/popup/popup.html');
const popupHtmlDst = path.join(__dirname, 'dist/popup/popup.html');
if (fs.existsSync(popupHtmlSrc)) {
  fs.copyFileSync(popupHtmlSrc, popupHtmlDst);
}

// popup.css を dist/popup/ にコピー
const popupCssSrc = path.join(__dirname, 'src/popup/popup.css');
const popupCssDst = path.join(__dirname, 'dist/popup/popup.css');
if (fs.existsSync(popupCssSrc)) {
  fs.copyFileSync(popupCssSrc, popupCssDst);
}

const sharedConfig = {
  bundle: true,
  target: 'chrome120',
  minify: false, // デバッグしやすさ優先
};

const entries = [
  {
    entryPoints: ['src/popup/popup.ts'],
    outfile: 'dist/popup/popup.js',
    format: 'iife',
  },
  {
    entryPoints: ['src/content/gmail.ts'],
    outfile: 'dist/content/gmail.js',
    format: 'iife',
  },
  {
    entryPoints: ['src/content/outlook.ts'],
    outfile: 'dist/content/outlook.js',
    format: 'iife',
  },
  {
    entryPoints: ['src/background/service-worker.ts'],
    outfile: 'dist/background/service-worker.js',
    format: 'esm',
  },
];

async function build() {
  if (isWatch) {
    const contexts = await Promise.all(
      entries.map((entry) =>
        esbuild.context({ ...sharedConfig, ...entry })
      )
    );
    await Promise.all(contexts.map((ctx) => ctx.watch()));
    console.log('Watching for changes...');
  } else {
    await Promise.all(
      entries.map((entry) =>
        esbuild.build({ ...sharedConfig, ...entry })
      )
    );
    console.log('Build complete.');
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
