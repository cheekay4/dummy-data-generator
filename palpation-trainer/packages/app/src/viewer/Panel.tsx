import { getStructureFacts } from "../facts/getStructureFacts.js";
import type { Landmark } from "../scoring/palpation.js";
import { useViewerStore, type LayerKey } from "./store.js";

const LAYER_LABEL: Record<LayerKey, string> = {
  skin: "皮膚",
  muscle: "筋",
  bone: "骨",
};

export function Panel({ landmarks }: { landmarks: readonly Landmark[] }): React.JSX.Element {
  const layers = useViewerStore((s) => s.layers);
  const toggleLayer = useViewerStore((s) => s.toggleLayer);
  const skinOpacity = useViewerStore((s) => s.skinOpacity);
  const setSkinOpacity = useViewerStore((s) => s.setSkinOpacity);
  const judgment = useViewerStore((s) => s.lastJudgment);

  return (
    <aside className="panel">
      <h1>触診部位同定トレーナー</h1>
      <div className="sub">Phase 2 — 3Dビューワー技術検証</div>

      <h2>レイヤー表示</h2>
      {(Object.keys(LAYER_LABEL) as LayerKey[]).map((key) => (
        <label key={key}>
          <input type="checkbox" checked={layers[key]} onChange={() => toggleLayer(key)} />
          {LAYER_LABEL[key]}
        </label>
      ))}
      <h2>皮膚の透明度</h2>
      <input
        type="range"
        min={0.1}
        max={1}
        step={0.05}
        value={skinOpacity}
        onChange={(e) => setSkinOpacity(Number(e.target.value))}
        style={{ width: "100%" }}
      />

      <h2>触診クリック判定</h2>
      {judgment === null ? (
        <div className="sub">皮膚の上をクリックすると座標を取得し、ランドマークとの距離で判定します</div>
      ) : (
        <>
          <div className="coords">
            クリック座標 (mm): [{judgment.point[0]}, {judgment.point[1]}, {judgment.point[2]}]
          </div>
          <table>
            <thead>
              <tr><th>ランドマーク</th><th>距離</th><th>判定</th></tr>
            </thead>
            <tbody>
              {judgment.results.map((r) => (
                <tr key={r.fmaId}>
                  <td>{getStructureFacts(r.fmaId).nameJa}</td>
                  <td>{r.distanceMm.toFixed(1)}mm</td>
                  <td className={r.withinRadius ? "hit" : "miss"}>
                    {r.withinRadius ? "命中" : "外れ"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="score">スコア素点: {(judgment.weightedScore * 100).toFixed(0)}%</div>
        </>
      )}

      <h2>ランドマーク（表示中）</h2>
      <table>
        <tbody>
          {landmarks.map((lm) => (
            <tr key={lm.fmaId}>
              <td>{getStructureFacts(lm.fmaId).nameJa}</td>
              <td className="coords">r={lm.radiusMm}mm</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="notice">
        ⚠️ 表示中のランドマーク座標は Phase 2 動作確認用のプレースホルダー（骨メッシュ極値からの近似）であり、
        症例の正解データではありません。正式なランドマークは Phase 3 で作成します。
      </div>
    </aside>
  );
}
