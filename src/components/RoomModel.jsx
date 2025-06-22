import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

export default function RoomModel({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0], name = "" }) {
  const { scene } = useGLTF("/models/room.glb");
  const clonedScene = useMemo(() => clone(scene), [scene]);

  return (
    <group>
      <primitive object={clonedScene} position={position} scale={scale} rotation={rotation} />
    </group>
  );
}
