import { useEffect, useState } from "react";
import api from "../services/api";
import "./ManagementPage.css";

export default function ManagementPage() {
  const [exits, setExits] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [people, setPeople] = useState([]);

  const [newExit, setNewExit] = useState({ location: "", capacity: 1 });
  const [newRoom, setNewRoom] = useState({ name: "", exitId: "" });
  const [newPerson, setNewPerson] = useState({ name: "", speed: 1, roomId: "" });

  const [editingExit, setEditingExit] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);
  const [editingPerson, setEditingPerson] = useState(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const exitsRes = await api.get("/management/exits");
      const roomsRes = await api.get("/management/rooms");
      const peopleRes = await api.get("/management/people");
      setExits(exitsRes.data);
      setRooms(roomsRes.data);
      setPeople(peopleRes.data);
    } catch (err) {
      console.error("Error al cargar datos:", err);
    }
  };

  // ---------- EXIT CRUD ----------
  const createOrUpdateExit = async () => {
    try {
      if (editingExit) {
        await api.put(`/management/exits/${editingExit.id}`, newExit);
        setEditingExit(null);
      } else {
        await api.post("/management/exits", newExit);
      }
      setNewExit({ location: "", capacity: 1 });
      loadAllData();
    } catch (err) {
      console.error("Error en exit:", err);
    }
  };

  const deleteExit = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta salida?")) {
      await api.delete(`/management/exits/${id}`);
      loadAllData();
    }
  };

  // ---------- ROOM CRUD ----------
  const createOrUpdateRoom = async () => {
    try {
      if (editingRoom) {
        await api.put(`/management/rooms/${editingRoom.id}`, newRoom);
        setEditingRoom(null);
      } else {
        await api.post("/management/rooms", newRoom);
      }
      setNewRoom({ name: "", exitId: "" });
      loadAllData();
    } catch (err) {
      console.error("Error en room:", err);
    }
  };

  const deleteRoom = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta oficina?")) {
      await api.delete(`/management/rooms/${id}`);
      loadAllData();
    }
  };

  // ---------- PERSON CRUD ----------
  const createOrUpdatePerson = async () => {
    try {
      if (editingPerson) {
        await api.put(`/management/people/${editingPerson.id}`, newPerson);
        setEditingPerson(null);
      } else {
        await api.post("/management/people", newPerson);
      }
      setNewPerson({ name: "", speed: 1, roomId: "" });
      loadAllData();
    } catch (err) {
      console.error("Error en person:", err);
    }
  };

  const deletePerson = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta persona?")) {
      await api.delete(`/management/people/${id}`);
      loadAllData();
    }
  };

  return (
    <div className="management-container">
      <h1>Gestión de Salidas, Salas y Personas</h1>

      {/* EXIT */}
      <div className="section">
        <h2>{editingExit ? "Editar Salida" : "Agregar Salida"}</h2>
        <input
          type="text"
          placeholder="Ubicación"
          value={newExit.location}
          onChange={(e) => setNewExit({ ...newExit, location: e.target.value })}
        />
        <input
          type="number"
          placeholder="Capacidad"
          value={newExit.capacity}
          min={1}
          onChange={(e) => setNewExit({ ...newExit, capacity: parseInt(e.target.value) })}
        />
        <button onClick={createOrUpdateExit}>
          {editingExit ? "Actualizar Salida" : "Agregar Salida"}
        </button>
      </div>

      {/* ROOM */}
      <div className="section">
        <h2>{editingRoom ? "Editar Oficina" : "Agregar Oficina"}</h2>
        <input
          type="text"
          placeholder="Nombre"
          value={newRoom.name}
          onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
        />
        <select
          value={newRoom.exitId}
          onChange={(e) => setNewRoom({ ...newRoom, exitId: e.target.value })}
        >
          <option value="">Selecciona una salida</option>
          {exits.map((exit) => (
            <option key={exit.id} value={exit.id}>
              {exit.location}
            </option>
          ))}
        </select>
        <button onClick={createOrUpdateRoom}>
          {editingRoom ? "Actualizar Oficina" : "Agregar Oficina"}
        </button>
      </div>

      {/* PERSON */}
      <div className="section">
        <h2>{editingPerson ? "Editar Persona" : "Agregar Persona"}</h2>
        <input
          type="text"
          placeholder="Nombre"
          value={newPerson.name}
          onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Velocidad"
          value={newPerson.speed}
          min={1}
          onChange={(e) => setNewPerson({ ...newPerson, speed: parseFloat(e.target.value) })}
        />
        <select
          value={newPerson.roomId}
          onChange={(e) => setNewPerson({ ...newPerson, roomId: e.target.value })}
        >
          <option value="">Selecciona una sala</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>
        <button onClick={createOrUpdatePerson}>
          {editingPerson ? "Actualizar Persona" : "Agregar Persona"}
        </button>
      </div>

      {/* TABLES */}
      <div className="section">
        <h2>Salidas</h2>
        <table>
          <thead>
            <tr>
              <th>Ubicación</th>
              <th>Capacidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {exits.map((exit) => (
              <tr key={exit.id}>
                <td>{exit.location}</td>
                <td>{exit.capacity}</td>
                <td>
                  <button onClick={() => {
                    setNewExit({ location: exit.location, capacity: exit.capacity });
                    setEditingExit(exit);
                  }}>Editar</button>
                  <button onClick={() => deleteExit(exit.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section">
        <h2>Salas</h2>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Salida</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td>{room.name}</td>
                <td>{room.exit?.location}</td>
                <td>
                  <button onClick={() => {
                    setNewRoom({ name: room.name, exitId: room.exitId });
                    setEditingRoom(room);
                  }}>Editar</button>
                  <button onClick={() => deleteRoom(room.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section">
        <h2>Personas</h2>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Velocidad</th>
              <th>Sala</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <tr key={person.id}>
                <td>{person.name}</td>
                <td>{person.speed}</td>
                <td>{person.room?.name}</td>
                <td>
                  <button onClick={() => {
                    setNewPerson({
                      name: person.name,
                      speed: person.speed,
                      roomId: person.roomId
                    });
                    setEditingPerson(person);
                  }}>Editar</button>
                  <button onClick={() => deletePerson(person.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
