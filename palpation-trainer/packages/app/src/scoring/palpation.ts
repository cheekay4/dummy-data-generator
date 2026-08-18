import { z } from "zod";
import { fmaIdSchema, type FmaId } from "../types/anatomy.js";

/** 体表ランドマーク（仕様 §4.2）。center は BodyParts3D ネイティブ座標（Z-up, mm） */
export const landmarkSchema = z.strictObject({
  fmaId: fmaIdSchema,
  center: z.tuple([z.number(), z.number(), z.number()]),
  radiusMm: z.number().positive(),
  radiusRationale: z.string().min(1),
  weight: z.number().positive(),
});
export type Landmark = z.infer<typeof landmarkSchema>;

export type Vec3 = readonly [number, number, number];

export interface LandmarkResult {
  fmaId: FmaId;
  distanceMm: number;
  withinRadius: boolean;
  weight: number;
}

export interface PalpationJudgment {
  /** クリック座標（ネイティブ mm） */
  point: Vec3;
  /** 各ランドマークの判定（入力順を保持） */
  results: LandmarkResult[];
  /** 最も近いランドマーク（ランドマーク0件のときのみ null） */
  nearest: LandmarkResult | null;
  /** 命中ランドマークの weight 合計 / 全 weight 合計（0〜1）。L1 スコアの素点 */
  weightedScore: number;
}

function distanceMm(a: Vec3, b: Vec3): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * 触診部位の決定論的判定（仕様 §5.2 / §6.1 L1）。
 * メッシュ ID ではなく 3D 座標の距離で採点する。LLM は一切関与しない。
 */
export function judgePalpation(point: Vec3, landmarks: readonly Landmark[]): PalpationJudgment {
  const results: LandmarkResult[] = landmarks.map((lm) => {
    const d = distanceMm(point, lm.center);
    return {
      fmaId: lm.fmaId,
      distanceMm: d,
      withinRadius: d <= lm.radiusMm,
      weight: lm.weight,
    };
  });

  let nearest: LandmarkResult | null = null;
  for (const r of results) {
    if (nearest === null || r.distanceMm < nearest.distanceMm) nearest = r;
  }

  const totalWeight = results.reduce((s, r) => s + r.weight, 0);
  const hitWeight = results.reduce((s, r) => s + (r.withinRadius ? r.weight : 0), 0);
  const weightedScore = totalWeight === 0 ? 0 : hitWeight / totalWeight;

  return { point, results, nearest, weightedScore };
}
