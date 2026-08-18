import { z } from "zod";
import { fmaIdSchema } from "./anatomy.js";

/**
 * セッションは Task の順序付きリスト（仕様 §4.1【確定】）。
 * 採点は scoreTask(task, attempt) で Task 単位に完結させ、
 * セッション単位の採点関数は作らない（drill モード追加時の全面書き直しを防ぐ）。
 */

export const taskTypeSchema = z.enum(["interview", "palpation", "identification", "debrief"]);
export type TaskType = z.infer<typeof taskTypeSchema>;

export const taskSchema = z.strictObject({
  id: z.string(),
  type: taskTypeSchema,
  caseId: z.string(),
  params: z.record(z.string(), z.unknown()),
});
export type Task = z.infer<typeof taskSchema>;

export const interviewAttemptSchema = z.strictObject({
  taskId: z.string(),
  type: z.literal("interview"),
  questions: z.array(z.string()),
});
export const palpationAttemptSchema = z.strictObject({
  taskId: z.string(),
  type: z.literal("palpation"),
  point: z.tuple([z.number(), z.number(), z.number()]).nullable(),
});
export const identificationAttemptSchema = z.strictObject({
  taskId: z.string(),
  type: z.literal("identification"),
  muscles: z.array(fmaIdSchema),
  nerves: z.array(fmaIdSchema),
  reasoning: z.string(),
});
export const debriefAttemptSchema = z.strictObject({
  taskId: z.string(),
  type: z.literal("debrief"),
});

export const attemptSchema = z.discriminatedUnion("type", [
  interviewAttemptSchema,
  palpationAttemptSchema,
  identificationAttemptSchema,
  debriefAttemptSchema,
]);
export type Attempt = z.infer<typeof attemptSchema>;
export type InterviewAttempt = z.infer<typeof interviewAttemptSchema>;
export type PalpationAttempt = z.infer<typeof palpationAttemptSchema>;
export type IdentificationAttempt = z.infer<typeof identificationAttemptSchema>;

export const sessionModeSchema = z.enum(["osce", "drill"]);
export type SessionMode = z.infer<typeof sessionModeSchema>;

export interface Session {
  id: string;
  mode: SessionMode;
  tasks: Task[];
  attempts: Attempt[];
}

/** Task 単位の採点結果。公式スコアは L1+L2 のみ（§6.1）。debrief は scored=false */
export interface TaskScore {
  taskId: string;
  type: TaskType;
  scored: boolean;
  /** 0〜1。scored=false のときは 0 */
  score: number;
  /** 決定論層の詳細（UI 表示・講評プロンプト用） */
  detail: Record<string, unknown>;
}
