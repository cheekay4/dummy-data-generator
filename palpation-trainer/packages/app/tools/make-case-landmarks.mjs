#!/usr/bin/env node
/**
 * 症例ランドマークの座標生成: BodyParts3D の骨・筋メッシュ幾何から解剖学的ポイントを
 * 近似計算し、皮膚メッシュ上へ投影して src/data/case-landmarks.gen.json に出力する。
 * ⚠️ 幾何近似であり教員レビュー前提（全て draft）。右側のみ。
 * 軸: X=左右（右が負）/ Y=前後（前が負）/ Z=上下（mm）
 */
import AdmZip from "adm-zip";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const CACHE = join(HERE, "..", "..", "anatomy-data", ".cache");
const zip = new AdmZip(join(CACHE, "isa_BP3D_4.0_obj_99.zip"));
const manifest = JSON.parse(
  readFileSync(join(HERE, "..", "..", "anatomy-data", "dist", "manifest.json"), "utf8")
);

function verts(fj) {
  const entry = zip.getEntries().find((e) => e.entryName.endsWith(`${fj}.obj`));
  if (!entry) throw new Error(`${fj}.obj not found`);
  const out = [];
  for (const line of entry.getData().toString("utf8").split("\n")) {
    if (line.startsWith("v ")) {
      const [, x, y, z] = line.trim().split(/\s+/);
      out.push([+x, +y, +z]);
    }
  }
  return out;
}

/** manifest から構造の右側メッシュ FJ を引く */
function rightFj(fmaId, conceptNameIncludes = null) {
  const files = manifest.structures[fmaId].files.filter((f) => f.side === "right");
  const hit = conceptNameIncludes
    ? files.find((f) => f.bp3dConceptName.includes(conceptNameIncludes))
    : files[0];
  if (!hit) throw new Error(`right mesh not found: ${fmaId} ${conceptNameIncludes ?? ""}`);
  return hit.file.replace("glb/", "").replace(".glb", "");
}

const centroid = (vs) => {
  const s = vs.reduce((a, v) => [a[0] + v[0], a[1] + v[1], a[2] + v[2]], [0, 0, 0]);
  return s.map((x) => x / vs.length);
};
const zMax = (vs) => Math.max(...vs.map((v) => v[2]));
const zMin = (vs) => Math.min(...vs.map((v) => v[2]));
const band = (vs, lo, hi) => vs.filter((v) => v[2] >= lo && v[2] <= hi);
const minBy = (vs, f) => vs.reduce((a, b) => (f(b) < f(a) ? b : a));
const medianBy = (vs, f) => [...vs].sort((a, b) => f(a) - f(b))[Math.floor(vs.length / 2)];

const skin = verts("FJ2810");
function projectToSkin(p) {
  const n = minBy(skin, (v) => Math.hypot(v[0] - p[0], v[1] - p[1], v[2] - p[2]));
  const d = Math.hypot(n[0] - p[0], n[1] - p[1], n[2] - p[2]);
  return { point: n.map((x) => Math.round(x * 10) / 10), depthMm: Math.round(d * 10) / 10 };
}

const scap = verts(rightFj("FMA13394"));
const hum = verts(rightFj("FMA13303"));
const sZ = zMax(scap), hZ = zMax(hum), hZlo = zMin(hum);

const bonePoints = {
  acromion_r: minBy(band(scap, sZ - 30, sZ), (v) => v[0]),
  superior_angle_r: (() => { const b = band(scap, sZ - 30, sZ); return b.reduce((a, v) => (v[0] > a[0] ? v : a)); })(),
  spine_scapula_mid_r: (() => {
    const b = band(scap, sZ - 45, sZ - 15);
    const post = [...b].sort((a, c) => c[1] - a[1]).slice(0, Math.max(20, Math.floor(b.length * 0.1)));
    return medianBy(post, (v) => v[0]);
  })(),
  medial_border_mid_r: (() => {
    const xMax = Math.max(...scap.map((v) => v[0]));
    const edge = scap.filter((v) => v[0] > xMax - 8);
    return medianBy(edge, (v) => v[2]);
  })(),
  inferior_angle_r: minBy(scap, (v) => v[2]),
  infraglenoid_r: minBy(band(scap, sZ - 60, sZ - 35), (v) => v[0]),
  greater_tubercle_r: minBy(band(hum, hZ - 40, hZ), (v) => v[0]),
  intertubercular_r: minBy(band(hum, hZ - 40, hZ), (v) => v[1]),
  lesser_tubercle_r: (() => {
    const b = band(hum, hZ - 40, hZ);
    const ant = [...b].sort((a, c) => a[1] - c[1]).slice(0, Math.max(15, Math.floor(b.length * 0.15)));
    return ant.reduce((a, v) => (v[0] > a[0] ? v : a));
  })(),
  deltoid_tuberosity_r: minBy(band(hum, (hZ + hZlo) / 2 - 20, (hZ + hZlo) / 2 + 20), (v) => v[0]),
  lateral_epicondyle_r: minBy(band(hum, hZlo, hZlo + 30), (v) => v[0]),
  medial_epicondyle_r: (() => { const b = band(hum, hZlo, hZlo + 30); return b.reduce((a, v) => (v[0] > a[0] ? v : a)); })(),
};

const muscleCentroids = {
  supraspinatus_belly_r: centroid(verts(rightFj("FMA9629"))),
  infraspinatus_belly_r: centroid(verts(rightFj("FMA32546"))),
  teres_minor_belly_r: centroid(verts(rightFj("FMA32550"))),
  teres_major_belly_r: centroid(verts(rightFj("FMA32549"))),
  subscapularis_belly_r: centroid(verts(rightFj("FMA13413"))),
  deltoid_middle_belly_r: centroid(verts(rightFj("FMA32521", "acromial"))),
  biceps_long_belly_r: centroid(verts(rightFj("FMA37670", "long head"))),
  triceps_long_belly_r: centroid(verts(rightFj("FMA37688", "long head"))),
  trapezius_upper_belly_r: centroid(verts(rightFj("FMA9626", "descending"))),
  rhomboid_major_belly_r: centroid(verts(rightFj("FMA13379"))),
  levator_insertion_r: (() => {
    const vs = verts(rightFj("FMA32519"));
    return minBy(vs, (v) => v[2]); // 停止部 = 肩甲骨上角側（最下端）
  })(),
  serratus_belly_r: centroid(verts(rightFj("FMA13397"))),
  brachialis_belly_r: centroid(verts(rightFj("FMA37667"))),
};

const out = {};
for (const [name, p] of Object.entries({ ...bonePoints, ...muscleCentroids })) {
  const proj = projectToSkin(p);
  out[name] = {
    skinPoint: proj.point,
    depthMm: proj.depthMm,
    sourcePoint: p.map((x) => Math.round(x * 10) / 10),
  };
}

const dest = join(HERE, "..", "src", "data", "case-landmarks.gen.json");
writeFileSync(
  dest,
  JSON.stringify(
    {
      generatedBy: "tools/make-case-landmarks.mjs（骨・筋メッシュ幾何近似 → 皮膚投影。教員レビュー前）",
      side: "right",
      axes: "X=左右(右が負) Y=前後(前が負) Z=上下 [mm]",
      points: out,
    },
    null,
    2
  ) + "\n",
  "utf8"
);
for (const [k, v] of Object.entries(out))
  console.log(k.padEnd(26), JSON.stringify(v.skinPoint), "depth", v.depthMm);
