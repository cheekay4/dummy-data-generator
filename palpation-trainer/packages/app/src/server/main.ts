import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { getCasePublic, getCaseTruth, listCases } from "../cases/caseDb.js";
import { runDebrief } from "../llm/debrief.js";
import { runInterviewTurn } from "../llm/patientActor.js";
import { AnthropicTransport } from "../llm/transport.js";
import { scoreIdentification } from "../scoring/identification.js";
import { judgePalpation } from "../scoring/palpation.js";
import { fmaIdSchema } from "../types/anatomy.js";

// .env.local から ANTHROPIC_API_KEY / MODEL_* を読み込む（値はログに出さない）
const envPath = join(dirname(fileURLToPath(import.meta.url)), "..", "..", ".env.local");
if (existsSync(envPath)) {
  try {
    process.loadEnvFile(envPath);
  } catch {
    // 空ファイル等は無視
  }
}

const app = new Hono();
const transport = new AnthropicTransport();

const interviewSchema = z.object({
  caseId: z.string(),
  history: z.array(
    z.object({ role: z.enum(["user", "assistant"]), content: z.string() })
  ),
  question: z.string().min(1).max(300),
});

app.post("/api/interview", async (c) => {
  const body = interviewSchema.parse(await c.req.json());
  // §2.4: 患者役に渡すのは CasePublic のみ。truth はこのハンドラに現れない
  const result = await runInterviewTurn({
    transport,
    casePublic: getCasePublic(body.caseId),
    history: body.history,
    question: body.question,
  });
  return c.json({
    reply: result.reply,
    filtered: !result.filter.ok,
    usage: result.usage,
  });
});

const debriefSchema = z.object({
  caseId: z.string(),
  palpationPoint: z.tuple([z.number(), z.number(), z.number()]).nullable(),
  selectedMuscles: z.array(fmaIdSchema),
  selectedNerves: z.array(fmaIdSchema),
  interviewCoveredCategories: z.array(z.string()),
  reasoning: z.string().max(2000),
});

app.post("/api/debrief", async (c) => {
  const body = debriefSchema.parse(await c.req.json());
  const truth = getCaseTruth(body.caseId);

  // L1 は決定論層で採点（LLM 出力は一切入力にしない。§2.3 / §6.1）
  const palpation = judgePalpation(
    body.palpationPoint ?? [0, 0, 0],
    truth.targetLandmarks
  );
  const muscles = scoreIdentification(body.selectedMuscles, truth.responsibleMuscles);
  const nerves = scoreIdentification(body.selectedNerves, truth.innervation);

  // L3: 講評コメントのみ LLM（同期呼び出し。§6.3）
  const debrief = await runDebrief({
    transport,
    truth,
    palpation,
    muscles,
    nerves,
    interviewCoveredCategories: body.interviewCoveredCategories,
    studentReasoning: body.reasoning,
  });

  return c.json({
    score: {
      palpation: { weightedScore: palpation.weightedScore, results: palpation.results },
      muscles,
      nerves,
    },
    feedback: debrief.feedback,
    factGuard: {
      violations: debrief.factGuardViolations,
      retried: debrief.retried,
    },
    usage: debrief.usage,
  });
});

app.get("/api/cases", (c) => c.json(listCases()));
app.onError((err, c) => {
  console.error(err instanceof Error ? err.message : err);
  return c.json({ error: err instanceof Error ? err.message : "internal error" }, 500);
});

const port = Number(process.env.PORT ?? 8787);
serve({ fetch: app.fetch, port }, () => {
  console.log(`palpation-trainer API server: http://localhost:${port}`);
});
