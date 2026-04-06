export interface ManifestConfig {
  name: string;
  shortName: string;
  themeColor: string;
  bgColor: string;
}

export function buildManifestJson(config: ManifestConfig): string {
  const manifest = {
    name: config.name,
    short_name: config.shortName,
    icons: [
      { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    theme_color: config.themeColor,
    background_color: config.bgColor,
    display: 'standalone',
    start_url: '/',
  };
  return JSON.stringify(manifest, null, 2);
}

export function buildBrowserConfig(themeColor: string): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square150x150logo src="/mstile-150x150.png"/>
      <TileColor>${themeColor}</TileColor>
    </tile>
  </msapplication>
</browserconfig>`;
}
