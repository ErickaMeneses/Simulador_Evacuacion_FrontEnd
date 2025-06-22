import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";

export default function WindowModel({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }) {
  const { scene } = useGLTF("/models/window.glb");
  const clonedScene = useMemo(() => clone(scene), [scene]);

  return (
    <primitive object={clonedScene} position={position} scale={scale} rotation={rotation} />
  );
}
