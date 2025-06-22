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
import "./Evacuation3DPage.css";

export default function Evacuation3DPage() {
  const [people, setPeople] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [exits, setExits] = useState([]);

  const [showLoader, setShowLoader] = useState(true);
const [loading, setLoading] = useState(true);

const [evacuatedIds, setEvacuatedIds] = useState([]);
const [showResults, setShowResults] = useState(false);
const [results, setResults] = useState([]);


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
        setLoading(false); // 🟢 Finaliza la carga
      }
    };
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 3000); // 3 segundos o lo que veas adecuado



    fetchData();
  }, []);

  // Asignar posición automática a cada room
  const generateRoomPosition = (index) => [-20, 0.5, index * 8 - 20];
  const generateExitPosition = (index) => [24, 0.25, index * 14 - 20];

  //VIEJA
  /*const handleEvacuated = (id) => {
    setEvacuatedIds((prev) => [...prev, id]);
  };*/
  //NUEVA
  const handleEvacuated = async (personId) => {
  setEvacuatedIds(prev => {
    const updated = [...prev, personId];

    // Cuando todas las personas hayan evacuado
    if (updated.length === people.length) {
      // Mostrar resultados
      fetchResults();
    }

    return updated;
  });

  const fetchResults = async () => {
  try {
    await api.post("/evacuation/start");

    const res = await api.get("/evacuation/results");
    setResults(res.data);
    setShowResults(true);
  } catch (err) {
    console.error("Error al obtener resultados:", err);
  }
};
};


  return (
    <div style={{ width: "100vw", height: "100vh" }}>

{showLoader && (
  <div className="loader-splash">
    <div style={{ textAlign: "center" }}>
      <h1>Cargando simulación...</h1>
      <img
        src="./public/loader.gif" 
        alt="Cargando..."
        style={{ width: "150px", marginTop: "20px" }}
      />
    </div>
  </div>
)}


{showResults ? (
  <div className="results-table">
    <h2>Resultados de la simulación</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Tiempo de evacuación (s)</th>

        </tr>
      </thead>
      <tbody>
        {results.map(r => (
          <tr key={r.id}>
            <td>{r.id}</td>
            <td>{r.personName}</td>
            <td>{r.timeToEvacuate.toFixed(2)}</td>

          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : (

      <Canvas shadows style={{ opacity: showLoader ? 0 : 1, transition: "opacity 0.5s ease-in-out" }}>
        

        <ambientLight intensity={0.4} />
        <spotLight position={[10, 20, 10]} angle={0.3} intensity={1} castShadow />
        <pointLight position={[-10, 15, -10]} intensity={0.7} color="white" />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
        <PerspectiveCamera makeDefault position={[0, 5, 15]} />
        <OrbitControls />

        
        <Environment preset="city" />
        <ContactShadows position={[0, 0.01, 0]} opacity={0.4} scale={20} blur={1} far={10} />

        {/* Piso */}
        <TexturedFloor />

        {/* Paredes*/}
        <TexturedWall position={[0, 2.5, -25]} rotation={[0, 0, 0]} size={[50, 5, 1]} />
        <TexturedWall position={[0, 2.5, 25]} rotation={[0, 0, 0]} size={[50, 5, 1]} />
        <TexturedWall position={[-25, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} size={[50, 5, 1]} />  // Izquierda
        <TexturedWall position={[25, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} size={[50, 5, 1]} />   // Derecha

        <WindowModel position={[10, 2.7, -24.2]} scale={1} rotation={[0, 0, 0]} />
        <WindowModel position={[-10, 2.7, -24.2]} scale={1} rotation={[0, 0, 0]} />
        <WindowModel position={[10, 2.7, -25.5]} scale={1} rotation={[0, 0, 0]} />
        <WindowModel position={[-10, 2.7, -25.5]} scale={1} rotation={[0, 0, 0]} />

        <WindowModel position={[10, 2.7, 24.5]} scale={1} rotation={[0, 0, 0]} />
        <WindowModel position={[-10, 2.7, 24.5]} scale={1} rotation={[0, 0, 0]} />
        <WindowModel position={[10, 2.7, 25.8]} scale={1} rotation={[0, 0, 0]} />
        <WindowModel position={[-10, 2.7, 25.8]} scale={1} rotation={[0, 0, 0]} />

        <ExitBoxModel position={[20, 3, 23.2]} scale={0.1} rotation={[0, 0, 0]} />
        <ExitBoxModel position={[20, 3, -23.8]} scale={0.1} rotation={[0, Math.PI, 0]} />

        {/* ROOMS reales */}
        {rooms.map((room, index) => {
          const position = generateRoomPosition(index);
          return (
            <group key={room.id}>

              <RoomModel
                key={room.id}
                position={position}
                scale={1}
                rotation={[0, Math.PI / 2, 0]} // ajustá esto según tu modelo
                name={room.name}
              />

              <Html center position={[position[0], position[1] + 6, position[2]]}>
                <div style={{
                  background: "white",
                  padding: "4px 14px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  boxShadow: "0 1px 1px rgba(0,0,0,0.3)"
                }}>
                  {room.name}
                </div>
              </Html>
            </group>
          );
        })}

        {/* EXITS con puerta 3D */}
        {exits.map((exit, index) => {
          const position = generateExitPosition(index);
          return (
            <group key={exit.id}>

              <DoorModel position={position} scale={0.5} rotation={[0, Math.PI / 2, 0]} />

              {/* Etiqueta flotante más alta, sin tapar la puerta */}
              <Html center position={[position[0], position[1] + 6, position[2]]}>
                <div style={{
                  background: "white",
                  padding: "4px 14px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  boxShadow: "0 1px 1px rgba(0,0,0,0.3)"
                }}>
                  {exit.location}
                </div>
              </Html>
            </group>
          );
        })}

        {/* PERSONAS reales */}
        {exits.map((exit, exitIndex) => {
          const exitPos = generateExitPosition(exitIndex);
          const assignedPeople = people.filter(
            (p) => (p.room?.exitId || p.room?.exit?.id) === exit.id
          );

          return assignedPeople.map((person, i) => {
            const roomId = person.room?.id;
            const roomIndex = rooms.findIndex((r) => r.id === roomId);
            const start = generateRoomPosition(roomIndex);

            const capacity = exit.capacity || 1;

            let target;
            if (i < capacity) {
              target = exitPos;
            } else {
              const offset = (i - capacity + 1) * 1.5;
              target = [exitPos[0] - offset, exitPos[1], exitPos[2]];
            }

            const speed = 0.1 + (person.speed || 1) * 0.02;
            //const speed = 0.1 + (person.speed || 1) * 0.02;

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
      )}
    </div>
  );
}
