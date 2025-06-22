
import { useGLTF, useAnimations } from "@react-three/drei";
import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";
import { Html } from "@react-three/drei";

export default function PersonModel({ start = [0, 0, 0], target = [5, 0, 5], speed = 1, scale = 0.1, onArrive, name  }) {
  const group = useRef();
  const { scene, animations } = useGLTF("/models/walker.glb");

  // ✅ Clonar correctamente el modelo con animación (una sola vez)
  const clonedScene = useMemo(() => clone(scene), [scene]);
  const { actions } = useAnimations(animations, group);

  // Activar la animación de caminar
  useEffect(() => {
    const walkAction = actions["Armature|Walk"] || actions["Walk"];
    if (walkAction) {
      walkAction.play();
    }
  }, [actions]);

  // Movimiento hacia el destino
  useFrame(() => {
    if (!group.current) return;

    const pos = group.current.position;
    const dest = new THREE.Vector3(...target);
    const dir = dest.clone().sub(pos).normalize();
    const distance = pos.distanceTo(dest);

    if (distance > 0.1) {
      pos.x += dir.x * speed;
      pos.y += dir.y * speed;
      pos.z += dir.z * speed;

      group.current.lookAt(dest);
    } else {
      if (onArrive) onArrive();
    }
  });

  return (
    <primitive object={clonedScene} ref={group} position={start} scale={scale}>
      <Html center position={[0, 2.2, 0]}>
        <div style={{
          background: "white",
          padding: "2px 6px",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: "bold",
          color: "#222",
          boxShadow: "0 0 4px rgba(0,0,0,0.3)"
        }}>
          {name}
        </div>
      </Html>
    </primitive>
  );

}
