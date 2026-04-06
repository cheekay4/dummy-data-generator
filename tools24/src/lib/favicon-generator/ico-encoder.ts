// PNG-in-ICO形式（Vista以降対応）
// ICONDIR(6) + ICONDIRENTRY×N(16each) + PNG data × N
export function createIco(pngBuffers: ArrayBuffer[], sizes: number[]): ArrayBuffer {
  const n = pngBuffers.length;
  const headerSize = 6;
  const entrySize = 16;
  const dirSize = headerSize + entrySize * n;

  // データオフセットを事前計算
  const offsets: number[] = [];
  let offset = dirSize;
  for (const buf of pngBuffers) {
    offsets.push(offset);
    offset += buf.byteLength;
  }

  const totalSize = offset;
  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);

  // ICONDIR
  view.setUint16(0, 0, true);  // reserved
  view.setUint16(2, 1, true);  // type: 1 = ICO
  view.setUint16(4, n, true);  // count

  // ICONDIRENTRY × n
  for (let i = 0; i < n; i++) {
    const base = headerSize + entrySize * i;
    const sz = sizes[i];
    view.setUint8(base + 0, sz >= 256 ? 0 : sz);  // width (0 = 256)
    view.setUint8(base + 1, sz >= 256 ? 0 : sz);  // height
    view.setUint8(base + 2, 0);  // colorCount
    view.setUint8(base + 3, 0);  // reserved
    view.setUint16(base + 4, 1, true);  // planes
    view.setUint16(base + 6, 32, true); // bitCount
    view.setUint32(base + 8, pngBuffers[i].byteLength, true); // bytesInRes
    view.setUint32(base + 12, offsets[i], true); // imageOffset
  }

  // PNG data
  const uint8 = new Uint8Array(buffer);
  for (let i = 0; i < n; i++) {
    uint8.set(new Uint8Array(pngBuffers[i]), offsets[i]);
  }

  return buffer;
}
