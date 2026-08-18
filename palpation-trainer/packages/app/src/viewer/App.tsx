import { useEffect, useMemo, useState } from "react";
import { Bp3dManifestSource } from "../anatomy/AnatomySource.js";
import { getScopeIds } from "../facts/getStructureFacts.js";
import { landmarkSchema, type Landmark } from "../scoring/palpation.js";
import { AnatomyScene } from "./AnatomyScene.js";
import { Panel } from "./Panel.js";
import testLandmarksJson from "../data/test-landmarks.json" with { type: "json" };

export function App(): React.JSX.Element {
  const [manifest, setManifest] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

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

  const landmarks: Landmark[] = useMemo(
    () => testLandmarksJson.landmarks.map((l) => landmarkSchema.parse(l)),
    []
  );

  if (error !== null) {
    return (
      <div style={{ padding: 24 }}>
        メッシュデータをロードできません: {error}
        <br />
        <code>npm run data:convert && node tools/publish-anatomy.mjs</code> を実行してください
      </div>
    );
  }
  return (
    <div className="layout">
      <div className="canvas-wrap">
        {source === null ? (
          <div style={{ padding: 24 }}>manifest をロード中…</div>
        ) : (
          <AnatomyScene source={source} landmarks={landmarks} />
        )}
      </div>
      <Panel landmarks={landmarks} />
    </div>
  );
}
