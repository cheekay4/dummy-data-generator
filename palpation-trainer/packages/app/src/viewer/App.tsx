import { useEffect, useMemo, useState } from "react";
import { Bp3dManifestSource } from "../anatomy/AnatomySource.js";
import { getCaseTruth } from "../cases/caseDb.js";
import { getScopeIds } from "../facts/getStructureFacts.js";
import { judgePalpation, landmarkSchema, type Landmark } from "../scoring/palpation.js";
import { AnatomyScene, type Vec3 } from "./AnatomyScene.js";
import { DevPanel } from "./Panel.js";
import { SessionPanel } from "./SessionPanel.js";
import { currentTaskType, useViewerStore } from "./store.js";
import testLandmarksJson from "../data/test-landmarks.json" with { type: "json" };

export function App(): React.JSX.Element {
  const [manifest, setManifest] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const mode = useViewerStore((s) => s.mode);
  const setMode = useViewerStore((s) => s.setMode);
  const caseId = useViewerStore((s) => s.caseId);
  const setJudgment = useViewerStore((s) => s.setJudgment);
  const setPendingPoint = useViewerStore((s) => s.setPendingPoint);
  const run = useViewerStore((s) => s.run);
  const taskType = useViewerStore((s) => currentTaskType(s));

  useEffect(() => {
    // メッシュはビルドに同梱せず実行時ロード（仕様 §2.1）
    fetch("/anatomy/manifest.json")
      .then((r) => {
        if (!r.ok) throw new Error(`manifest.json: HTTP ${r.status}`);
        return r.json();
      })
      .then(setManifest)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  const source = useMemo(
    () => (manifest === null ? null : new Bp3dManifestSource(manifest, "/anatomy", getScopeIds())),
    [manifest]
  );

  // 開発モードで表示するランドマーク（セッション中は正解を隠すため空）
  const devLandmarks: Landmark[] = useMemo(
    () =>
      caseId === null
        ? testLandmarksJson.landmarks.map((l) => landmarkSchema.parse(l))
        : getCaseTruth(caseId).targetLandmarks,
    [caseId]
  );
  const landmarks = mode === "dev" ? devLandmarks : [];

  const onNativePick = useMemo(() => {
    if (mode === "dev") {
      return (point: Vec3): void => {
        setJudgment(judgePalpation(point, devLandmarks));
      };
    }
    if (mode === "session" && taskType === "palpation") {
      return (point: Vec3): void => {
        setPendingPoint(point);
      };
    }
    return undefined;
  }, [mode, taskType, devLandmarks, setJudgment, setPendingPoint]);

  if (error !== null) {
    return (
      <div style={{ padding: 24 }}>
        メッシュデータをロードできません: {error}
        <br />
        <code>npm run data:convert &amp;&amp; npm run data:publish</code> を実行してください
      </div>
    );
  }
  return (
    <div className="layout">
      <div className="canvas-wrap">
        <div className="mode-switch">
          <button className={mode === "session" ? "active" : ""} onClick={() => setMode("session")}>
            学習セッション
          </button>
          <button className={mode === "dev" ? "active" : ""} onClick={() => setMode("dev")}>
            開発ビューワー
          </button>
        </div>
        {source === null ? (
          <div style={{ padding: 24 }}>manifest をロード中…</div>
        ) : (
          <AnatomyScene
            source={source}
            landmarks={landmarks}
            {...(onNativePick !== undefined ? { onNativePick } : {})}
            pickedPoint={mode === "session" && taskType === "palpation" ? run?.pendingPoint ?? null : null}
            inspectMode={mode === "session" && taskType === "identification"}
          />
        )}
      </div>
      {mode === "dev" ? <DevPanel landmarks={devLandmarks} /> : <SessionPanel />}
    </div>
  );
}
