// モデル ID のハードコード禁止（仕様 §2.5）。役割ごとに環境変数で差し替え可能。
// 実行時パス（patientActor / examiner）の既定値に Fable / Opus を置いてはならない。
export const MODEL_ROLES = {
  patientActor:      process.env.MODEL_PATIENT_ACTOR      ?? "claude-haiku-4-5-20251001",
  examiner:          process.env.MODEL_EXAMINER           ?? "claude-sonnet-5",
  contentGeneration: process.env.MODEL_CONTENT_GENERATION ?? "claude-fable-5",
} as const;

export type ModelRole = keyof typeof MODEL_ROLES;
