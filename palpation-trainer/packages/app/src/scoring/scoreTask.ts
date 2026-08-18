import { getCaseTruth } from "../cases/caseDb.js";
import type { Attempt, Task, TaskScore } from "../types/session.js";
import { ALL_INTERVIEW_CATEGORIES, coveredCategories } from "./interviewCoverage.js";
import { scoreIdentification } from "./identification.js";
import { judgePalpation } from "./palpation.js";

/**
 * Task 単位の決定論的採点（仕様 §4.1【確定】/ §6.1 L1+L2）。
 * - LLM の出力は一切入力に使わない（§2.3）
 * - 同一の (task, attempt) に対して常に同一の TaskScore を返す
 * - セッション単位の採点関数は存在しない。集計は表示側の関心事
 */
export function scoreTask(task: Task, attempt: Attempt): TaskScore {
  if (attempt.taskId !== task.id || attempt.type !== task.type) {
    throw new Error(`attempt が task と一致しません: ${task.id}/${task.type}`);
  }

  switch (attempt.type) {
    case "interview": {
      // L2: 問診カバレッジ
      const covered = coveredCategories(attempt.questions);
      return {
        taskId: task.id,
        type: task.type,
        scored: true,
        score: covered.length / ALL_INTERVIEW_CATEGORIES.length,
        detail: {
          covered,
          missed: ALL_INTERVIEW_CATEGORIES.filter((c) => !covered.includes(c)),
          questionCount: attempt.questions.length,
        },
      };
    }
    case "palpation": {
      // L1: 座標×許容半径（§5.2）
      const truth = getCaseTruth(task.caseId);
      const judgment = judgePalpation(attempt.point ?? [0, 0, 0], truth.targetLandmarks);
      return {
        taskId: task.id,
        type: task.type,
        scored: true,
        score: attempt.point === null ? 0 : judgment.weightedScore,
        detail: { judgment, submitted: attempt.point !== null },
      };
    }
    case "identification": {
      // L1: FMA ID 集合比較（§5.3）。筋と神経の平均
      const truth = getCaseTruth(task.caseId);
      const muscles = scoreIdentification(attempt.muscles, truth.responsibleMuscles);
      const nerves = scoreIdentification(attempt.nerves, truth.innervation);
      return {
        taskId: task.id,
        type: task.type,
        scored: true,
        score: (muscles.score + nerves.score) / 2,
        detail: { muscles, nerves, reasoning: attempt.reasoning },
      };
    }
    case "debrief":
      // L3 は公式スコアに算入しない（§6.1）
      return { taskId: task.id, type: task.type, scored: false, score: 0, detail: {} };
  }
}
