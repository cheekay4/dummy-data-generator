import type { Session, Task } from "../types/session.js";

/**
 * osce モードの Task シーケンス生成（仕様 §4.1）。
 * drill モードは将来、このシーケンス生成器の差し替えのみで実装する。
 */
export function createOsceSession(caseId: string, sessionId: string): Session {
  const tasks: Task[] = (["interview", "palpation", "identification", "debrief"] as const).map(
    (type, i) => ({
      id: `${sessionId}-t${i + 1}-${type}`,
      type,
      caseId,
      params: {},
    })
  );
  return { id: sessionId, mode: "osce", tasks, attempts: [] };
}
