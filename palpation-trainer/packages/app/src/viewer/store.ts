import { create } from "zustand";
import { createOsceSession } from "../session/engine.js";
import { scoreTask } from "../scoring/scoreTask.js";
import type { PalpationJudgment } from "../scoring/palpation.js";
import type { FmaId } from "../types/anatomy.js";
import type { Attempt, Session, TaskScore, TaskType } from "../types/session.js";

export type LayerKey = "skin" | "muscle" | "bone";
export type AppMode = "dev" | "session";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface DebriefResponse {
  score: {
    palpation: { weightedScore: number };
    muscles: { score: number; correct: FmaId[]; missed: FmaId[]; extra: FmaId[] };
    nerves: { score: number; correct: FmaId[]; missed: FmaId[]; extra: FmaId[] };
  };
  feedback: string;
  factGuard: { violations: string[]; retried: boolean };
  usage: { inputTokens: number; outputTokens: number };
}

export const MAX_QUESTIONS = 5;

interface SessionRun {
  session: Session;
  taskIndex: number;
  chat: ChatMessage[];
  questionsAsked: string[];
  pendingPoint: [number, number, number] | null;
  muscles: FmaId[];
  nerves: FmaId[];
  reasoning: string;
  scores: TaskScore[];
  debrief: DebriefResponse | null;
  busy: boolean;
  error: string | null;
}

interface ViewerState {
  mode: AppMode;
  layers: Record<LayerKey, boolean>;
  skinOpacity: number;
  lastJudgment: PalpationJudgment | null;
  /** 開発用: 選択中の症例 ID（null = プレースホルダー3点） */
  caseId: string | null;
  run: SessionRun | null;
  inspected: FmaId | null;
  setMode: (mode: AppMode) => void;
  toggleLayer: (key: LayerKey) => void;
  setSkinOpacity: (value: number) => void;
  setJudgment: (judgment: PalpationJudgment) => void;
  setCaseId: (caseId: string | null) => void;
  setInspected: (fmaId: FmaId | null) => void;
  startSession: (caseId: string) => void;
  endSession: () => void;
  askQuestion: (question: string) => Promise<void>;
  finishInterview: () => void;
  setPendingPoint: (point: [number, number, number]) => void;
  confirmPalpation: () => void;
  toggleMuscle: (fmaId: FmaId) => void;
  toggleNerve: (fmaId: FmaId) => void;
  setReasoning: (value: string) => void;
  submitIdentification: () => Promise<void>;
}

function currentTaskTypeOf(run: SessionRun | null): TaskType | null {
  if (run === null) return null;
  return run.session.tasks[run.taskIndex]?.type ?? null;
}

export function currentTaskType(state: Pick<ViewerState, "run">): TaskType | null {
  return currentTaskTypeOf(state.run);
}

export const useViewerStore = create<ViewerState>((set, get) => ({
  mode: "session",
  layers: { skin: true, muscle: true, bone: true },
  skinOpacity: 0.5,
  lastJudgment: null,
  caseId: null,
  run: null,
  inspected: null,
  setMode: (mode): void => {
    set({ mode, lastJudgment: null, inspected: null });
  },
  toggleLayer: (key): void => {
    set((s) => ({ layers: { ...s.layers, [key]: !s.layers[key] } }));
  },
  setSkinOpacity: (value): void => {
    set({ skinOpacity: value });
  },
  setJudgment: (judgment): void => {
    set({ lastJudgment: judgment });
  },
  setCaseId: (caseId): void => {
    set({ caseId, lastJudgment: null });
  },
  setInspected: (fmaId): void => {
    set({ inspected: fmaId });
  },

  startSession: (caseId): void => {
    const session = createOsceSession(caseId, `s-${Date.now()}`);
    set({
      run: {
        session,
        taskIndex: 0,
        chat: [],
        questionsAsked: [],
        pendingPoint: null,
        muscles: [],
        nerves: [],
        reasoning: "",
        scores: [],
        debrief: null,
        busy: false,
        error: null,
      },
      layers: { skin: true, muscle: true, bone: true },
      inspected: null,
    });
  },
  endSession: (): void => {
    set({ run: null, inspected: null });
  },

  askQuestion: async (question): Promise<void> => {
    const { run } = get();
    if (run === null || run.busy || run.questionsAsked.length >= MAX_QUESTIONS) return;
    set({ run: { ...run, busy: true, error: null } });
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          caseId: run.session.tasks[0]!.caseId,
          history: run.chat,
          question,
        }),
      });
      if (!res.ok) throw new Error(`API エラー (${res.status})。npm run server を確認してください`);
      const data = (await res.json()) as { reply: string };
      const r = get().run;
      if (r === null) return;
      set({
        run: {
          ...r,
          busy: false,
          chat: [
            ...r.chat,
            { role: "user", content: question },
            { role: "assistant", content: data.reply },
          ],
          questionsAsked: [...r.questionsAsked, question],
        },
      });
    } catch (e) {
      const r = get().run;
      if (r !== null)
        set({ run: { ...r, busy: false, error: e instanceof Error ? e.message : String(e) } });
    }
  },

  finishInterview: (): void => {
    const { run } = get();
    if (run === null) return;
    const task = run.session.tasks[0]!;
    const attempt: Attempt = {
      taskId: task.id,
      type: "interview",
      questions: run.questionsAsked,
    };
    set({
      run: {
        ...run,
        session: { ...run.session, attempts: [...run.session.attempts, attempt] },
        scores: [...run.scores, scoreTask(task, attempt)],
        taskIndex: 1,
      },
    });
  },

  setPendingPoint: (point): void => {
    const { run } = get();
    if (run === null) return;
    set({ run: { ...run, pendingPoint: point } });
  },

  confirmPalpation: (): void => {
    const { run } = get();
    if (run === null || run.pendingPoint === null) return;
    const task = run.session.tasks[1]!;
    const attempt: Attempt = { taskId: task.id, type: "palpation", point: run.pendingPoint };
    set({
      run: {
        ...run,
        session: { ...run.session, attempts: [...run.session.attempts, attempt] },
        scores: [...run.scores, scoreTask(task, attempt)],
        taskIndex: 2,
      },
    });
  },

  toggleMuscle: (fmaId): void => {
    const { run } = get();
    if (run === null) return;
    const muscles = run.muscles.includes(fmaId)
      ? run.muscles.filter((m) => m !== fmaId)
      : [...run.muscles, fmaId];
    set({ run: { ...run, muscles } });
  },
  toggleNerve: (fmaId): void => {
    const { run } = get();
    if (run === null) return;
    const nerves = run.nerves.includes(fmaId)
      ? run.nerves.filter((n) => n !== fmaId)
      : [...run.nerves, fmaId];
    set({ run: { ...run, nerves } });
  },
  setReasoning: (value): void => {
    const { run } = get();
    if (run === null) return;
    set({ run: { ...run, reasoning: value } });
  },

  submitIdentification: async (): Promise<void> => {
    const { run } = get();
    if (run === null || run.busy) return;
    const task = run.session.tasks[2]!;
    const attempt: Attempt = {
      taskId: task.id,
      type: "identification",
      muscles: run.muscles,
      nerves: run.nerves,
      reasoning: run.reasoning,
    };
    const scores = [...run.scores, scoreTask(task, attempt)];
    const interviewScore = scores.find((s) => s.type === "interview");
    const covered = (interviewScore?.detail.covered as string[] | undefined) ?? [];
    set({
      run: {
        ...run,
        session: { ...run.session, attempts: [...run.session.attempts, attempt] },
        scores,
        taskIndex: 3,
        busy: true,
        error: null,
      },
    });
    try {
      const res = await fetch("/api/debrief", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          caseId: task.caseId,
          palpationPoint: run.pendingPoint,
          selectedMuscles: run.muscles,
          selectedNerves: run.nerves,
          interviewCoveredCategories: covered,
          reasoning: run.reasoning,
        }),
      });
      if (!res.ok) throw new Error(`API エラー (${res.status})。npm run server を確認してください`);
      const data = (await res.json()) as DebriefResponse;
      const r = get().run;
      if (r === null) return;
      set({ run: { ...r, busy: false, debrief: data } });
    } catch (e) {
      const r = get().run;
      if (r !== null)
        set({ run: { ...r, busy: false, error: e instanceof Error ? e.message : String(e) } });
    }
  },
}));
