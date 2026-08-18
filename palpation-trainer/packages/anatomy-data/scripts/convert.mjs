#!/usr/bin/env node
/**
 * BodyParts3D OBJ → GLB (Draco) 変換パイプライン。
 *
 * 加工はフォーマット変換 + Draco 圧縮のみ。頂点座標・トポロジーは無改変
 * （座標系も元データの Z-up/mm のまま。DECISIONS.md D-003）。
 *
 * 入力:  .cache/isa_BP3D_4.0_obj_99.zip + インデックス TSV（download.mjs で取得）
 *        ../structures.json（対象構造の bp3dConcepts）
 * 出力:  dist/glb/FJxxxx.glb + dist/manifest.json（fmaId → メッシュファイル対応 + 帰属）
 */
import AdmZip from "adm-zip";
import obj2gltf from "obj2gltf";
import { NodeIO } from "@gltf-transform/core";
import { KHRDracoMeshCompression } from "@gltf-transform/extensions";
import { draco } from "@gltf-transform/functions";
import draco3d from "draco3dgltf";
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = join(ROOT, ".cache");
const DIST = join(ROOT, "dist");
const TMP = join(DIST, ".tmp-obj");

function readTsv(name) {
  return readFileSync(join(CACHE, name), "utf8")
    .split(/\r?\n/)
    .slice(1)
    .filter(Boolean)
    .map((l) => l.split("\t"));
}

// concept id -> [FJ element file id...] / concept id -> english name
const elementsByConcept = new Map();
for (const [concept, , fj] of readTsv("isa_element_parts.txt")) {
  if (!elementsByConcept.has(concept)) elementsByConcept.set(concept, []);
  elementsByConcept.get(concept).push(fj);
}
const nameByConcept = new Map(readTsv("isa_parts_list_e.txt").map(([c, , en]) => [c, en]));

const curation = JSON.parse(readFileSync(join(ROOT, "structures.json"), "utf8"));
const zip = new AdmZip(join(CACHE, "isa_BP3D_4.0_obj_99.zip"));
const zipEntries = new Map(zip.getEntries().map((e) => [e.entryName.split("/").pop(), e]));

mkdirSync(join(DIST, "glb"), { recursive: true });
mkdirSync(TMP, { recursive: true });

const io = new NodeIO()
  .registerExtensions([KHRDracoMeshCompression])
  .registerDependencies({
    "draco3d.encoder": await draco3d.createEncoderModule(),
    "draco3d.decoder": await draco3d.createDecoderModule(),
  });

const manifest = {
  generatedBy: "convert.mjs (obj2gltf + gltf-transform/draco)",
  license: "CC BY 4.0",
  attribution:
    "BodyParts3D, DBCLS — Mitsuhashi N, et al. Nucleic Acids Res. 2009;37:D782-5. doi:10.1093/nar/gkn613",
  coordinateSystem: { up: "+Z", unit: "mm", note: "元データ無改変。Y-up 変換はアプリのビューワー層で行う" },
  structures: {},
};

let converted = 0;
const missing = [];
for (const s of curation.structures) {
  const files = [];
  for (const concept of s.bp3dConcepts) {
    const fjIds = elementsByConcept.get(concept) ?? [];
    if (fjIds.length === 0) {
      missing.push(`${s.fmaId}: concept ${concept} に要素ファイルなし`);
      continue;
    }
    const conceptName = nameByConcept.get(concept) ?? "";
    const side = /\bright\b/.test(conceptName) ? "right" : /\bleft\b/.test(conceptName) ? "left" : "both";
    for (const fj of fjIds) {
      const entry = zipEntries.get(`${fj}.obj`);
      if (!entry) {
        missing.push(`${s.fmaId}: ${fj}.obj が ZIP に見つからない`);
        continue;
      }
      const objPath = join(TMP, `${fj}.obj`);
      writeFileSync(objPath, entry.getData());
      const glb = await obj2gltf(objPath, { binary: true });
      const doc = await io.readBinary(new Uint8Array(glb));
      await doc.transform(draco());
      const outName = `${fj}.glb`;
      await io.write(join(DIST, "glb", outName), doc);
      files.push({ file: `glb/${outName}`, bp3dConcept: concept, bp3dConceptName: conceptName, side });
      converted++;
    }
  }
  manifest.structures[s.fmaId] = { en: s.en, category: s.category, files };
}

rmSync(TMP, { recursive: true, force: true });
writeFileSync(join(DIST, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8");
writeFileSync(join(DIST, "ATTRIBUTION.md"), readFileSync(join(ROOT, "ATTRIBUTION.md")));

console.log(`converted: ${converted} meshes / structures: ${curation.structures.length}`);
if (missing.length > 0) {
  console.error("MISSING:\n" + missing.join("\n"));
  process.exit(1);
}
