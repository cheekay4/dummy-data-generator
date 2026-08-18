#!/usr/bin/env node
/**
 * Phase 2 動作確認用のプレースホルダー・ランドマークを骨メッシュの幾何から近似生成する。
 * ⚠️ これは症例データ（truth）ではない。正式なランドマークは Phase 3 で教員検証を前提に作成する。
 * 依存: anatomy-data/.cache の BodyParts3D ZIP（adm-zip はワークスペースの hoisted 依存を利用）
 */
import AdmZip from "adm-zip";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const CACHE = join(HERE, "..", "..", "anatomy-data", ".cache");
const zip = new AdmZip(join(CACHE, "isa_BP3D_4.0_obj_99.zip"));

function vertices(fj) {
  const entry = zip.getEntries().find((e) => e.entryName.endsWith(`${fj}.obj`));
  if (!entry) throw new Error(`${fj}.obj not found`);
  const verts = [];
  for (const line of entry.getData().toString("utf8").split("\n")) {
    if (line.startsWith("v ")) {
      const [, x, y, z] = line.trim().split(/\s+/);
      verts.push([Number(x), Number(y), Number(z)]);
    }
  }
  return verts;
}

const nearest = (vs, p) =>
  vs.reduce((best, v) => {
    const d = Math.hypot(v[0] - p[0], v[1] - p[1], v[2] - p[2]);
    return d < best.d ? { v, d } : best;
  }, { v: vs[0], d: Infinity });

const skin = vertices("FJ2810");
const scapR = vertices("FJ3384");
const humR = vertices("FJ3368");

// 右肩峰の近似: 肩甲骨(右)の上端30mm帯のうち最も外側（右= X最小）の頂点
const zMaxS = Math.max(...scapR.map((v) => v[2]));
const topBand = scapR.filter((v) => v[2] > zMaxS - 30);
const acromionBone = topBand.reduce((a, b) => (b[0] < a[0] ? b : a));

// 右大結節の近似: 上腕骨(右)近位40mm帯のうち最も外側の頂点
const zMaxH = Math.max(...humR.map((v) => v[2]));
const proxBand = humR.filter((v) => v[2] > zMaxH - 40);
const tuberBone = proxBand.reduce((a, b) => (b[0] < a[0] ? b : a));

// 右外側上顆の近似: 上腕骨(右)遠位30mm帯のうち最も外側の頂点
const zMinH = Math.min(...humR.map((v) => v[2]));
const distBand = humR.filter((v) => v[2] < zMinH + 30);
const epiBone = distBand.reduce((a, b) => (b[0] < a[0] ? b : a));

const project = (p) => nearest(skin, p).v.map((n) => Math.round(n * 10) / 10);

const out = {
  placeholder: true,
  note: "Phase 2 ビューワー動作確認用。骨メッシュ極値から近似生成した仮座標であり、症例 truth データではない",
  generatedBy: "tools/make-test-landmarks.mjs",
  landmarks: [
    {
      fmaId: "FMA23260",
      center: project(acromionBone),
      radiusMm: 25,
      radiusRationale: "PLACEHOLDER: 浅層の明瞭な骨指標だが近似座標のため広めに設定",
      weight: 1,
    },
    {
      fmaId: "FMA23390",
      center: project(tuberBone),
      radiusMm: 25,
      radiusRationale: "PLACEHOLDER: 三角筋越しの触診となるため広めに設定",
      weight: 1,
    },
    {
      fmaId: "FMA23442",
      center: project(epiBone),
      radiusMm: 20,
      radiusRationale: "PLACEHOLDER: 浅層で明瞭な骨指標",
      weight: 1,
    },
  ],
};
const dest = join(HERE, "..", "src", "data", "test-landmarks.json");
writeFileSync(dest, JSON.stringify(out, null, 2) + "\n", "utf8");
console.log("test-landmarks.json:", JSON.stringify(out.landmarks.map((l) => ({ fmaId: l.fmaId, center: l.center }))));
