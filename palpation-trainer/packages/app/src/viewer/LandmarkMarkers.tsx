import type { Landmark } from "../scoring/palpation.js";
import { useViewerStore } from "./store.js";

/** ランドマークの許容半径（球）と中心点を表示。座標はネイティブ mm（親グループ内に配置） */
export function LandmarkMarkers({ landmarks }: { landmarks: readonly Landmark[] }): React.JSX.Element {
  const judgment = useViewerStore((s) => s.lastJudgment);
  return (
    <group>
      {landmarks.map((lm) => {
        const result = judgment?.results.find((r) => r.fmaId === lm.fmaId);
        const hit = result?.withinRadius === true;
        const color = hit ? "#4caf50" : "#ffb300";
        return (
          <group key={lm.fmaId} position={lm.center}>
            <mesh>
              <sphereGeometry args={[lm.radiusMm, 24, 24]} />
              <meshBasicMaterial color={color} transparent opacity={0.18} depthWrite={false} />
            </mesh>
            <mesh>
              <sphereGeometry args={[3, 12, 12]} />
              <meshBasicMaterial color={color} />
            </mesh>
          </group>
        );
      })}
      {judgment !== null && (
        <mesh position={judgment.point as [number, number, number]}>
          <sphereGeometry args={[4, 12, 12]} />
          <meshBasicMaterial color="#42a5f5" />
        </mesh>
      )}
    </group>
  );
}
