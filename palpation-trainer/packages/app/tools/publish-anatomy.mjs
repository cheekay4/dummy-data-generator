#!/usr/bin/env node
/**
 * anatomy-data の dist（GLB + manifest）を app の public/anatomy にコピーし、
 * Draco デコーダ（three 同梱）を public/draco に配置する。
 * メッシュは JS バンドルに取り込まず、実行時に fetch でロードする（仕様 §2.1）。
 */
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = join(HERE, "..");
const ANATOMY_DIST = join(APP, "..", "anatomy-data", "dist");
const PUB = join(APP, "public");

if (!existsSync(join(ANATOMY_DIST, "manifest.json"))) {
  console.error("anatomy-data/dist がありません。先に npm run data:download && npm run data:convert を実行してください");
  process.exit(1);
}
mkdirSync(PUB, { recursive: true });
cpSync(ANATOMY_DIST, join(PUB, "anatomy"), { recursive: true });

const dracoSrc = join(APP, "node_modules", "three", "examples", "jsm", "libs", "draco", "gltf");
const dracoSrcHoisted = join(APP, "..", "..", "node_modules", "three", "examples", "jsm", "libs", "draco", "gltf");
const src = existsSync(dracoSrc) ? dracoSrc : dracoSrcHoisted;
cpSync(src, join(PUB, "draco"), { recursive: true });
console.log("public/anatomy + public/draco を更新しました");
