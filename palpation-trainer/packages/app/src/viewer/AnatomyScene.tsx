import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { Suspense, useCallback, useMemo, useRef } from "react";
import type { Group } from "three";
import type { AnatomySource } from "../anatomy/AnatomySource.js";
import { getStructureFacts, listScope } from "../facts/getStructureFacts.js";
import { judgePalpation, type Landmark } from "../scoring/palpation.js";
import type { FmaId, StructureCategory } from "../types/anatomy.js";
import { LandmarkMarkers } from "./LandmarkMarkers.js";
import { StructureMesh } from "./StructureMesh.js";
import { useViewerStore, type LayerKey } from "./store.js";

const CATEGORY_COLOR: Record<string, string> = {
  skin: "#d9b8a3",
  muscle: "#b5493f",
  bone: "#ece5d3",
};

const SKIN_ID: FmaId = "FMA7163";

function layerOf(category: StructureCategory): LayerKey | null {
  if (category === "skin") return "skin";
  if (category === "muscle") return "muscle";
  if (category === "bone") return "bone";
  return null;
}

interface Props {
  source: AnatomySource;
  landmarks: readonly Landmark[];
}

/** 3D シーン。データは BodyParts3D ネイティブ座標（Z-up, mm）のまま持ち、
 *  表示用の回転（Z-up→Y-up）と縮尺（mm→m）はこのグループでのみ適用する（DECISIONS.md D-003） */
export function AnatomyScene({ source, landmarks }: Props): React.JSX.Element {
  const groupRef = useRef<Group>(null);
  const layers = useViewerStore((s) => s.layers);
  const skinOpacity = useViewerStore((s) => s.skinOpacity);
  const setJudgment = useViewerStore((s) => s.setJudgment);

  const categoryById = useMemo(() => {
    const map = new Map<FmaId, StructureCategory>();
    for (const s of listScope().structures) map.set(s.fmaId, s.category);
    return map;
  }, []);

  const onSkinPick = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      const group = groupRef.current;
      if (group === null) return;
      e.stopPropagation();
      const local = group.worldToLocal(e.point.clone());
      const point: [number, number, number] = [
        Math.round(local.x * 10) / 10,
        Math.round(local.y * 10) / 10,
        Math.round(local.z * 10) / 10,
      ];
      setJudgment(judgePalpation(point, landmarks));
    },
    [landmarks, setJudgment]
  );

  const meshes = source.listMeshStructures().flatMap((fmaId) => {
    const category = categoryById.get(fmaId);
    if (category === undefined) return [];
    const layer = layerOf(category);
    if (layer === null) return [];
    const isSkin = fmaId === SKIN_ID;
    return source.getMeshes(fmaId).map((ref) => ({
      key: `${fmaId}:${ref.file}`,
      url: source.resolveUrl(ref.file),
      color: CATEGORY_COLOR[category] ?? "#888888",
      opacity: isSkin ? skinOpacity : 1,
      visible: layers[layer],
      isSkin,
      nameJa: getStructureFacts(fmaId).nameJa,
    }));
  });

  return (
    <Canvas
      camera={{ position: [-0.75, 1.55, -0.45], fov: 40, near: 0.01, far: 20 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <color attach="background" args={["#14181e"]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[-2, 3, -2]} intensity={1.4} />
      <directionalLight position={[2, 2, 2]} intensity={0.5} />
      <Suspense fallback={null}>
        <group ref={groupRef} rotation={[-Math.PI / 2, 0, 0]} scale={0.001}>
          {meshes.map((m) => (
            <StructureMesh
              key={m.key}
              url={m.url}
              color={m.color}
              opacity={m.opacity}
              visible={m.visible}
              {...(m.isSkin && m.visible ? { onPick: onSkinPick } : {})}
            />
          ))}
          <LandmarkMarkers landmarks={landmarks} />
        </group>
      </Suspense>
      <OrbitControls target={[-0.17, 1.35, 0.06]} enableDamping />
      <Stats />
    </Canvas>
  );
}
