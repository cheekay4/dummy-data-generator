import { z } from "zod";

/** FMA ID（例: "FMA32521"）。層B・scope・採点の共通キー */
export type FmaId = `FMA${number}`;

export const fmaIdSchema = z.custom<FmaId>(
  (v) => typeof v === "string" && /^FMA\d+$/.test(v),
  "FMA ID 形式（FMA + 数字）ではありません"
);

export const structureCategorySchema = z.enum([
  "muscle",
  "bone",
  "landmark",
  "nerve",
  "joint",
  "skin",
]);
export type StructureCategory = z.infer<typeof structureCategorySchema>;

/** 解剖学教員レビューの状態（仕様 §4.2/§4.3。後付け不可のため最初から必須） */
export const reviewMetaSchema = z.strictObject({
  reviewedBy: z.string().nullable(),
  reviewedAt: z.string().nullable(),
  reviewStatus: z.enum(["draft", "in_review", "approved"]),
});
export type ReviewMeta = z.infer<typeof reviewMetaSchema>;

/** 層B: 構造事実テーブルの1レコード（仕様 §4.3） */
export const structureFactsSchema = z.strictObject({
  fmaId: fmaIdSchema,
  category: structureCategorySchema,
  nameJa: z.string().min(1),
  nameEn: z.string().min(1),
  nameLa: z.string().min(1),
  aliasesJa: z.array(z.string()),
  origin: z.string().optional(),
  insertion: z.string().optional(),
  innervation: z.array(fmaIdSchema).optional(),
  action: z.string().optional(),
  bloodSupply: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  ta98: z.string().nullable(),
  ta2: z.string().nullable(),
  source: z.string().min(1),
  review: reviewMetaSchema,
});
export type StructureFacts = z.infer<typeof structureFactsSchema>;

/** scope.json: 対象領域ホワイトリストの1エントリ（仕様 §3.1） */
export const scopeEntrySchema = z.strictObject({
  fmaId: fmaIdSchema,
  nameEn: z.string().min(1),
  category: structureCategorySchema,
  hasMesh: z.boolean(),
});
export type ScopeEntry = z.infer<typeof scopeEntrySchema>;

export const scopeSchema = z.strictObject({
  region: z.literal("shoulder"),
  generatedBy: z.string(),
  structures: z.array(scopeEntrySchema),
});
export type Scope = z.infer<typeof scopeSchema>;
