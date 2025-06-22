import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function TexturedWall({ position = [0, 0, 0], rotation = [0, 0, 0], size = [50, 5, 1] }) {
  const texture = useTexture("/textures/wall2.png");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 1); // Repetición horizontal

  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={size} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
