#!/usr/bin/env node
/**
 * BodyParts3D Release 4.0 データを NBDC LSDB Archive から取得し .cache に保存する。
 * 取得はフォーマット無変換のダウンロードのみ。既存ファイルはサイズ一致ならスキップ。
 * データライセンス: CC BY 4.0（https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html）
 */
import { createWriteStream, existsSync, statSync, mkdirSync } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = "https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST";
const CACHE = join(dirname(fileURLToPath(import.meta.url)), "..", ".cache");

const FILES = [
  "isa_BP3D_4.0_obj_99.zip",
  "isa_parts_list_e.txt",
  "isa_parts_list.txt",
  "isa_element_parts.txt",
  "partof_parts_list_e.txt",
  "partof_element_parts.txt",
];

mkdirSync(CACHE, { recursive: true });

for (const name of FILES) {
  const dest = join(CACHE, name);
  const url = `${BASE}/${name}`;
  const head = await fetch(url, { method: "HEAD" });
  if (!head.ok) throw new Error(`HEAD ${url} -> ${head.status}`);
  const remoteSize = Number(head.headers.get("content-length") ?? -1);
  if (existsSync(dest) && remoteSize > 0 && statSync(dest).size === remoteSize) {
    console.log(`skip (cached): ${name}`);
    continue;
  }
  console.log(`download: ${name} (${remoteSize} bytes)`);
  const res = await fetch(url);
  if (!res.ok || res.body === null) throw new Error(`GET ${url} -> ${res.status}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
  const got = statSync(dest).size;
  if (remoteSize > 0 && got !== remoteSize) {
    throw new Error(`size mismatch: ${name} expected=${remoteSize} got=${got}`);
  }
  console.log(`done: ${name}`);
}
console.log("all files ready in .cache/");
