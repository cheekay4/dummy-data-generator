import { useGLTF } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useMemo } from "react";
import type { BufferGeometry, Mesh, Object3D } from "three";

interface Props {
  url: string;
  color: string;
  opacity: number;
  visible: boolean;
  onPick?: (e: ThreeEvent<PointerEvent>) => void;
}

function firstGeometry(root: Object3D): BufferGeometry | null {
  let found: BufferGeometry | null = null;
  root.traverse((o: Object3D) => {
    const mesh = o as Mesh;
    if (found === null && mesh.isMesh === true) found = mesh.geometry;
  });
  return found;
}

/** GLB 1ファイル = 1構造メッシュ。ジオメトリは GLTF キャッシュを共有し、材質のみ独自に持つ */
export function StructureMesh({ url, color, opacity, visible, onPick }: Props): React.JSX.Element | null {
  const gltf = useGLTF(url, "/draco/");
  const geometry = useMemo(() => firstGeometry(gltf.scene), [gltf.scene]);
  if (geometry === null) return null;
  return (
    <mesh
      geometry={geometry}
      visible={visible}
      {...(onPick === undefined ? {} : { onPointerDown: onPick })}
    >
      <meshStandardMaterial
        color={color}
        transparent={opacity < 1}
        opacity={opacity}
        roughness={0.8}
        metalness={0.05}
        depthWrite={opacity >= 1}
      />
    </mesh>
  );
}
