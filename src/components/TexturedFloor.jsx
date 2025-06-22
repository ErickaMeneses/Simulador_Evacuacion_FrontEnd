import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function TexturedFloor() {
  const texture = useTexture("/textures/wood.jpg");

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8); // Ajustá para más o menos mosaico

  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
