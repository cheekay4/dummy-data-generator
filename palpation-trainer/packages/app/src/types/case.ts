import { z } from "zod";
import { landmarkSchema } from "../scoring/palpation.js";
import { fmaIdSchema, reviewMetaSchema } from "./anatomy.js";

/**
 * 症例データモデル（仕様 §4.2）。
 * public と truth を型レベルで分離する（§2.4: 患者役 LLM には CasePublic のみを渡す）。
 */

export const casePersonaSchema = z.strictObject({
  speechStyle: z.string().min(1),
  emotionalState: z.string().min(1),
  cooperativeness: z.literal("high"), // MVP は high 固定（§7.3）。難易度パラメータ化の余地として型に保持
});
export type CasePersona = z.infer<typeof casePersonaSchema>;

export const casePublicSchema = z.strictObject({
  demographics: z.string().min(1),
  chiefComplaint: z.string().min(1),
  historyScript: z.record(z.string(), z.string()),
  persona: casePersonaSchema,
  forbidden: z.array(z.string()),
});
export type CasePublic = z.infer<typeof casePublicSchema>;

export const distractorSchema = z.strictObject({
  fmaId: fmaIdSchema,
  kind: z.enum(["muscle", "nerve"]),
  reason: z.string().min(1), // よくある誤答の理由（講評用）
});
export type Distractor = z.infer<typeof distractorSchema>;

export const caseTruthSchema = z.strictObject({
  targetLandmarks: z.array(landmarkSchema).min(1),
  responsibleMuscles: z.array(fmaIdSchema).min(1),
  innervation: z.array(fmaIdSchema).min(1),
  diagnosisLabel: z.string().min(1),
  distractors: z.array(distractorSchema),
});
export type CaseTruth = z.infer<typeof caseTruthSchema>;

/** 難易度（§7.2 の内訳設計をデータとして保持・検証するための拡張フィールド） */
export const caseDifficultySchema = z.enum(["basic", "intermediate", "advanced"]);
export type CaseDifficulty = z.infer<typeof caseDifficultySchema>;

export const caseDefinitionSchema = z.strictObject({
  id: z.string().regex(/^case-\d{2}-[a-z0-9-]+$/),
  region: z.literal("shoulder"),
  difficulty: caseDifficultySchema,
  public: casePublicSchema,
  truth: caseTruthSchema,
  review: reviewMetaSchema,
});
export type CaseDefinition = z.infer<typeof caseDefinitionSchema>;
