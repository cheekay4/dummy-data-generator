#!/usr/bin/env node
/**
 * 層B（facts）+ anatomy-data の structures.json から scope.json を生成する。
 * scope.json は対象 FMA ID のホワイトリスト（仕様 §3.1）。生成後はコミットして固定し、
 * 実行時に anatomy-data を参照するのはメッシュのみとする。
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, "..", "src");

const factFiles = ["muscles", "nerves", "landmarks", "skeleton"];
const facts = factFiles.flatMap((n) =>
  JSON.parse(readFileSync(join(SRC, "data", "facts", `${n}.json`), "utf8"))
);

const curation = JSON.parse(
  readFileSync(join(HERE, "..", "..", "anatomy-data", "structures.json"), "utf8")
);
const meshIds = new Set(curation.structures.map((s) => s.fmaId));

const order = { bone: 0, landmark: 1, joint: 2, muscle: 3, nerve: 4, skin: 5 };
const structures = facts
  .map((f) => ({
    fmaId: f.fmaId,
    nameEn: f.nameEn,
    category: f.category,
    hasMesh: meshIds.has(f.fmaId),
  }))
  .sort(
    (a, b) =>
      order[a.category] - order[b.category] || a.fmaId.localeCompare(b.fmaId)
  );

const dup = structures.filter((s, i, arr) => arr.findIndex((t) => t.fmaId === s.fmaId) !== i);
if (dup.length > 0) throw new Error("FMA ID 重複: " + dup.map((d) => d.fmaId).join(", "));

const orphanMeshes = [...meshIds].filter((id) => !structures.some((s) => s.fmaId === id));
if (orphanMeshes.length > 0)
  throw new Error("facts に無いメッシュ構造: " + orphanMeshes.join(", "));

const scope = {
  region: "shoulder",
  generatedBy: "tools/build-scope.mjs（層B facts + anatomy-data/structures.json から生成）",
  structures,
};
writeFileSync(join(SRC, "config", "scope.json"), JSON.stringify(scope, null, 2) + "\n", "utf8");
console.log(`scope.json: ${structures.length} 構造（メッシュあり ${structures.filter((s) => s.hasMesh).length}）`);
