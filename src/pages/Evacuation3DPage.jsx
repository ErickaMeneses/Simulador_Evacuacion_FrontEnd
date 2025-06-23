import { Canvas } from "@react-three/fiber";
import PersonModel from "../components/PersonModel";
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from "@react-three/drei";
import { useEffect, useState } from "react";
import api from "../services/api";
import RoomModel from "../components/RoomModel";
import DoorModel from "../components/DoorModel";
import { Html } from "@react-three/drei";
import TexturedFloor from "../components/TexturedFloor";
import TexturedWall from "../components/TexturedWall";
import WindowModel from "../components/WindowModel";
import ExitBoxModel from "../components/ExitBoxModel";
import { useNavigate } from "react-router-dom";
import "./Evacuation3DPage.css";

export default function Evacuation3DPage() {
  const [people, setPeople] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [exits, setExits] = useState([]);

  const [showLoader, setShowLoader] = useState(true);
  const [loading, setLoading] = useState(true);
  const [evacuatedIds, setEvacuatedIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resPeople = await api.get("/management/people");
        const resRooms = await api.get("/management/rooms");
        const resExits = await api.get("/management/exits");

        setPeople(resPeople.data);
        setRooms(resRooms.data);
        setExits(resExits.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 3000);

    fetchData();
    return () => clearTimeout(timer);
  }, []);

  const generateRoomPosition = (index) => [-20, 0.5, index * 8 - 20];
  const generateExitPosition = (index) => [24, 0.25, index * 14 - 20];

  const handleEvacuated = async (personId) => {
    setEvacuatedIds((prev) => {
      const updated = [...prev, personId];

      if (updated.length === people.length) {
        // ✅ Guardar flag para el EvacuationPage
        localStorage.setItem("from3D", "true");
        navigate("/evacuation");
      }

      return updated;
    });
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {showLoader && (
        <div className="loader-splash">
          <h1>Cargando simulación 3D...</h1>
          <img src="/loader.gif" alt="Cargando..." style={{ width: "150px", marginTop: "20px" }} />
        </div>
      )}

      <Canvas
        shadows
        style={{ opacity: showLoader ? 0 : 1, transition: "opacity 0.5s ease-in-out" }}
      >
        <ambientLight intensity={0.4} />
        <spotLight position={[10, 20, 10]} angle={0.3} intensity={1} castShadow />
        <pointLight position={[-10, 15, -10]} intensity={0.7} />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
        <PerspectiveCamera makeDefault position={[0, 5, 15]} />
        <OrbitControls />

        <Environment preset="city" />
        <ContactShadows position={[0, 0.01, 0]} opacity={0.4} scale={20} blur={1} far={10} />

        <TexturedFloor />

        <TexturedWall position={[0, 2.5, -25]} size={[50, 5, 1]} />
        <TexturedWall position={[0, 2.5, 25]} size={[50, 5, 1]} />
        <TexturedWall position={[-25, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} size={[50, 5, 1]} />
        <TexturedWall position={[25, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} size={[50, 5, 1]} />

        <WindowModel position={[10, 2.7, -24.2]} />
        <WindowModel position={[-10, 2.7, -24.2]} />
        <WindowModel position={[10, 2.7, 24.5]} />
        <WindowModel position={[-10, 2.7, 24.5]} />

        <ExitBoxModel position={[20, 3, 23.2]} scale={0.1} />
        <ExitBoxModel position={[20, 3, -23.8]} scale={0.1} />

        {rooms.map((room, index) => {
          const position = generateRoomPosition(index);
          return (
            <group key={room.id}>
              <RoomModel position={position} rotation={[0, Math.PI / 2, 0]} />
              <Html center position={[position[0], position[1] + 6, position[2]]}>
                <div className="label">{room.name}</div>
              </Html>
            </group>
          );
        })}

        {exits.map((exit, index) => {
          const position = generateExitPosition(index);
          return (
            <group key={exit.id}>
              <DoorModel position={position} rotation={[0, Math.PI / 2, 0]} scale={0.5} />
              <Html center position={[position[0], position[1] + 6, position[2]]}>
                <div className="label">{exit.location}</div>
              </Html>
            </group>
          );
        })}

        {exits.map((exit, exitIndex) => {
          const exitPos = generateExitPosition(exitIndex);
          const assignedPeople = people.filter(
            (p) => (p.room?.exitId || p.room?.exit?.id) === exit.id
          );

          return assignedPeople.map((person, i) => {
            const roomIndex = rooms.findIndex((r) => r.id === person.room?.id);
            const start = generateRoomPosition(roomIndex);

            const capacity = exit.capacity || 1;
            const offset = (i - capacity + 1) * 1.5;
            const target = i < capacity ? exitPos : [exitPos[0] - offset, exitPos[1], exitPos[2]];
            const speed = 0.1 + (person.speed || 1) * 0.02;

            return (
              !evacuatedIds.includes(person.id) && (
                <PersonModel
                  key={person.id}
                  start={start}
                  target={target}
                  speed={speed}
                  scale={0.015}
                  onArrive={() => handleEvacuated(person.id)}
                  name={person.name}
                />
              )
            );
          });
        })}
      </Canvas>
    </div>
  );
}
