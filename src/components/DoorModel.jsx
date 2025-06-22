import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

export default function DoorModel({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }) {
  const { scene } = useGLTF("/models/door.glb");

  // Clonamos el modelo para evitar referencia compartida
  const clonedScene = useMemo(() => clone(scene), [scene]);

  return (
    <primitive
      object={clonedScene}
      position={position}
      scale={scale}
      rotation={rotation}
    />
  );
}
