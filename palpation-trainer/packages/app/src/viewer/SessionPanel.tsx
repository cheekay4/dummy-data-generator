import { useMemo, useState } from "react";
import { listCases } from "../cases/caseDb.js";
import { getCasePublic } from "../cases/caseDb.js";
import { getStructureFacts } from "../facts/getStructureFacts.js";
import { buildIdentificationChoices } from "../session/choices.js";
import { ALL_INTERVIEW_CATEGORIES } from "../scoring/interviewCoverage.js";
import { MAX_QUESTIONS, currentTaskType, useViewerStore } from "./store.js";
import { LayerControls } from "./Panel.js";

const DIFF_LABEL: Record<string, string> = {
  basic: "初級",
  intermediate: "中級",
  advanced: "上級",
};

function CaseSelect(): React.JSX.Element {
  const startSession = useViewerStore((s) => s.startSession);
  return (
    <>
      <h2>症例を選んでセッション開始</h2>
      <div className="sub">
        流れ: 問診（最大{MAX_QUESTIONS}問）→ 触診部位の指定 → 責任筋・支配神経の解答 → 講評（約5分）
      </div>
      {listCases().map((c) => (
        <button key={c.id} className="case-btn" onClick={() => startSession(c.id)}>
          {c.id.replace(/^case-\d+-/, "")}（{DIFF_LABEL[c.difficulty]}）
        </button>
      ))}
      <div className="notice">
        講評と患者応答には API サーバーが必要です: <code>npm run server</code>
      </div>
    </>
  );
}

function InterviewView(): React.JSX.Element {
  const run = useViewerStore((s) => s.run);
  const askQuestion = useViewerStore((s) => s.askQuestion);
  const finishInterview = useViewerStore((s) => s.finishInterview);
  const [input, setInput] = useState("");
  if (run === null) return <></>;
  const caseId = run.session.tasks[0]!.caseId;
  const pub = getCasePublic(caseId);
  const remaining = MAX_QUESTIONS - run.questionsAsked.length;

  const send = (): void => {
    const q = input.trim();
    if (q.length === 0 || run.busy || remaining <= 0) return;
    setInput("");
    void askQuestion(q);
  };

  return (
    <>
      <h2>1. 問診</h2>
      <div className="sub">
        患者: {pub.demographics}
        <br />
        主訴: {pub.chiefComplaint}
      </div>
      <div className="chat">
        {run.chat.map((m, i) => (
          <div key={i} className={m.role === "user" ? "chat-q" : "chat-a"}>
            {m.role === "user" ? "あなた: " : "患者: "}
            {m.content}
          </div>
        ))}
        {run.busy && <div className="chat-a sub">患者が考えています…</div>}
      </div>
      <div className="row">
        <input
          type="text"
          value={input}
          placeholder={remaining > 0 ? `質問を入力（残り${remaining}問）` : "質問回数の上限です"}
          disabled={run.busy || remaining <= 0}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
        />
        <button onClick={send} disabled={run.busy || remaining <= 0 || input.trim().length === 0}>
          質問
        </button>
      </div>
      <button
        className="primary"
        onClick={finishInterview}
        disabled={run.busy || run.questionsAsked.length === 0}
      >
        問診を終えて触診へ →
      </button>
    </>
  );
}

function PalpationView(): React.JSX.Element {
  const run = useViewerStore((s) => s.run);
  const confirmPalpation = useViewerStore((s) => s.confirmPalpation);
  if (run === null) return <></>;
  return (
    <>
      <h2>2. 触診部位の指定</h2>
      <div className="sub">
        問診から考えて、触診すべき位置を左の3Dモデルの<b>体表（皮膚）上でクリック</b>してください。
        クリックし直すと位置を変更できます。
      </div>
      <div className="coords">
        {run.pendingPoint === null
          ? "未選択"
          : `選択中: [${run.pendingPoint.join(", ")}] mm`}
      </div>
      <button className="primary" onClick={confirmPalpation} disabled={run.pendingPoint === null}>
        この位置に決定して次へ →
      </button>
      <div className="notice">正誤はこの場では表示されません。講評でまとめて確認します。</div>
    </>
  );
}

function IdentificationView(): React.JSX.Element {
  const run = useViewerStore((s) => s.run);
  const toggleMuscle = useViewerStore((s) => s.toggleMuscle);
  const toggleNerve = useViewerStore((s) => s.toggleNerve);
  const setReasoning = useViewerStore((s) => s.setReasoning);
  const submitIdentification = useViewerStore((s) => s.submitIdentification);
  const inspected = useViewerStore((s) => s.inspected);
  const caseId = run?.session.tasks[0]?.caseId ?? null;
  const choices = useMemo(
    () => (caseId === null ? null : buildIdentificationChoices(caseId)),
    [caseId]
  );
  if (run === null || choices === null) return <></>;

  return (
    <>
      <h2>3. 構造の同定</h2>
      <div className="sub">
        責任筋と支配神経を選んでください（複数選択可）。左の3Dで皮膚の透明度を下げると深部を観察できます。
        筋・骨をクリックすると名称を確認できます。
      </div>
      {inspected !== null && (
        <div className="coords">クリックした構造: {getStructureFacts(inspected).nameJa}</div>
      )}
      <h2>責任筋</h2>
      {choices.muscles.map((c) => (
        <label key={c.fmaId}>
          <input
            type="checkbox"
            checked={run.muscles.includes(c.fmaId)}
            onChange={() => toggleMuscle(c.fmaId)}
          />
          {c.nameJa}
        </label>
      ))}
      <h2>支配神経</h2>
      {choices.nerves.map((c) => (
        <label key={c.fmaId}>
          <input
            type="checkbox"
            checked={run.nerves.includes(c.fmaId)}
            onChange={() => toggleNerve(c.fmaId)}
          />
          {c.nameJa}
        </label>
      ))}
      <h2>なぜそう考えましたか？（自由記述）</h2>
      <textarea
        rows={3}
        value={run.reasoning}
        onChange={(e) => setReasoning(e.target.value)}
        placeholder="問診・触診から判断した根拠を書いてください"
      />
      <button
        className="primary"
        onClick={() => void submitIdentification()}
        disabled={run.busy || (run.muscles.length === 0 && run.nerves.length === 0)}
      >
        解答して講評へ →
      </button>
    </>
  );
}

function DebriefView(): React.JSX.Element {
  const run = useViewerStore((s) => s.run);
  const endSession = useViewerStore((s) => s.endSession);
  if (run === null) return <></>;
  const interview = run.scores.find((s) => s.type === "interview");
  const palpation = run.scores.find((s) => s.type === "palpation");
  const identification = run.scores.find((s) => s.type === "identification");
  const covered = (interview?.detail.covered as string[] | undefined) ?? [];

  return (
    <>
      <h2>4. 講評</h2>
      <table>
        <tbody>
          <tr>
            <td>問診カバレッジ (L2)</td>
            <td>
              {covered.length}/{ALL_INTERVIEW_CATEGORIES.length} 項目（
              {((interview?.score ?? 0) * 100).toFixed(0)}%）
            </td>
          </tr>
          <tr>
            <td>触診 (L1)</td>
            <td>{((palpation?.score ?? 0) * 100).toFixed(0)}%</td>
          </tr>
          <tr>
            <td>同定 筋+神経 (L1)</td>
            <td>{((identification?.score ?? 0) * 100).toFixed(0)}%</td>
          </tr>
        </tbody>
      </table>
      <div className="sub">公式スコアは上記の決定論採点（L1+L2）のみ。以下のコメントは採点に影響しません。</div>
      <h2>講評コメント</h2>
      {run.busy && <div className="sub">講評を生成しています…</div>}
      {run.error !== null && <div className="notice">エラー: {run.error}</div>}
      {run.debrief !== null && (
        <div className="feedback">{run.debrief.feedback}</div>
      )}
      <button className="primary" onClick={endSession}>
        新しいセッションへ
      </button>
    </>
  );
}

export function SessionPanel(): React.JSX.Element {
  const run = useViewerStore((s) => s.run);
  const taskType = useViewerStore((s) => currentTaskType(s));
  const error = run?.error ?? null;

  return (
    <aside className="panel">
      <h1>触診部位同定トレーナー</h1>
      <div className="sub">肩関節・上腕 — 体表解剖学習支援ツール</div>
      {run !== null && taskType !== "debrief" && error !== null && (
        <div className="notice">エラー: {error}</div>
      )}
      {run === null ? (
        <CaseSelect />
      ) : (
        <>
          {taskType === "interview" && <InterviewView />}
          {taskType === "palpation" && <PalpationView />}
          {taskType === "identification" && <IdentificationView />}
          {taskType === "debrief" && <DebriefView />}
          {(taskType === "palpation" || taskType === "identification") && <LayerControls />}
        </>
      )}
    </aside>
  );
}
