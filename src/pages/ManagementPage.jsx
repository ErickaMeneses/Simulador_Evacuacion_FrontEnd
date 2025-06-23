import { useEffect, useState } from "react";
import api from "../services/api";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./ManagementPage.css";

export default function ManagementPage() {
  const navigate = useNavigate();

  const [exits, setExits] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [people, setPeople] = useState([]);

  // Modals de formularios
  const [showExitModal, setShowExitModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showPersonModal, setShowPersonModal] = useState(false);

  // Modal de confirmación y mensaje
  const [confirmModal, setConfirmModal] = useState({ show: false, message: "", onConfirm: null });
  const [messageModal, setMessageModal] = useState({ show: false, message: "", variant: "success" });

  // Estados de formulario y edición
  const [editingExit, setEditingExit] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);
  const [editingPerson, setEditingPerson] = useState(null);

  const [formExit, setFormExit] = useState({ location: "", capacity: 1 });
  const [formRoom, setFormRoom] = useState({ name: "", exitId: "" });
  const [formPerson, setFormPerson] = useState({ name: "", speed: 1, roomId: "" });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const exitsRes = await api.get("/management/exits");
    const roomsRes = await api.get("/management/rooms");
    const peopleRes = await api.get("/management/people");
    setExits(exitsRes.data);
    setRooms(roomsRes.data);
    setPeople(peopleRes.data);
  };

  // Mostrar mensaje tipo popup
  const showMessage = (msg, variant = "success") => {
    setMessageModal({ show: true, message: msg, variant });
    setTimeout(() => setMessageModal({ show: false, message: "", variant: "success" }), 2500);
  };

  // Abrir modales de formulario
  const openExitModal = (exit = null) => {
    setEditingExit(exit);
    setFormExit(exit || { location: "", capacity: 1 });
    setShowExitModal(true);
  };

  const openRoomModal = (room = null) => {
    setEditingRoom(room);
    setFormRoom(room || { name: "", exitId: "" });
    setShowRoomModal(true);
  };

  const openPersonModal = (person = null) => {
    setEditingPerson(person);
    setFormPerson(person || { name: "", speed: 1, roomId: "" });
    setShowPersonModal(true);
  };

  // Guardar cambios
  const saveExit = async () => {
    try {
      if (editingExit) {
        await api.put(`/management/exits/${editingExit.id}`, formExit);
        showMessage("Salida editada con éxito");
      } else {
        await api.post("/management/exits", formExit);
        showMessage("Salida añadida con éxito");
      }
    } catch {
      showMessage("Error al guardar salida", "danger");
    }
    setShowExitModal(false);
    fetchAll();
  };

  const saveRoom = async () => {
    try {
      if (editingRoom) {
        await api.put(`/management/rooms/${editingRoom.id}`, formRoom);
        showMessage("Sala editada con éxito");
      } else {
        await api.post("/management/rooms", formRoom);
        showMessage("Sala añadida con éxito");
      }
    } catch {
      showMessage("Error al guardar sala", "danger");
    }
    setShowRoomModal(false);
    fetchAll();
  };

  const savePerson = async () => {
    try {
      if (editingPerson) {
        await api.put(`/management/people/${editingPerson.id}`, formPerson);
        showMessage("Persona editada con éxito");
      } else {
        await api.post("/management/people", formPerson);
        showMessage("Persona añadida con éxito");
      }
    } catch {
      showMessage("Error al guardar persona", "danger");
    }
    setShowPersonModal(false);
    fetchAll();
  };

  // Confirmación genérica
  const confirmDelete = (msg, onConfirm) => {
    setConfirmModal({ show: true, message: msg, onConfirm });
  };

  const handleConfirm = () => {
    if (confirmModal.onConfirm) confirmModal.onConfirm();
    setConfirmModal({ show: false, message: "", onConfirm: null });
  };

  // Eliminar
  const deleteExit = async (id) => {
    try {
      await api.delete(`/management/exits/${id}`);
      showMessage("Salida eliminada");
      fetchAll();
    } catch {
      showMessage("Error al eliminar salida", "danger");
    }
  };

  const deleteRoom = async (id) => {
    try {
      await api.delete(`/management/rooms/${id}`);
      showMessage("Sala eliminada");
      fetchAll();
    } catch {
      showMessage("Error al eliminar sala", "danger");
    }
  };

  const deletePerson = async (id) => {
    try {
      await api.delete(`/management/people/${id}`);
      showMessage("Persona eliminada");
      fetchAll();
    } catch {
      showMessage("Error al eliminar persona", "danger");
    }
  };

  return (
    <div className="page-container">

      <h1>Gestión de Salidas, Salas y Personas</h1>
      <div className="back-buttons">
        <Button variant="secondary" onClick={() => navigate("/")}>Volver al Inicio</Button>
        <Button variant="success" onClick={() => navigate("/evacuation")}>Iniciar Simulación</Button>
      </div>

      {/* --- Salidas --- */}
      <div className="mb-5">
        <h2>Salidas</h2>
        <Button variant="primary" onClick={() => openExitModal()}>Añadir Salida</Button>
        <table className="table table-striped table-bordered mt-3">
          <thead>
            <tr>
              <th>Ubicación</th>
              <th>Capacidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {exits.map(e => (
              <tr key={e.id}>
                <td>{e.location}</td>
                <td>{e.capacity}</td>
                <td>
                  <Button size="sm" variant="warning" onClick={() => openExitModal(e)}>Editar</Button>{' '}
                  <Button size="sm" variant="danger" onClick={() => confirmDelete("¿Eliminar esta salida?", () => deleteExit(e.id))}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Salas --- */}
      <div className="mb-5">
        <h2>Salas</h2>
        <Button variant="primary" onClick={() => openRoomModal()}>Añadir Sala</Button>
        <table className="table table-striped table-bordered mt-3">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Salida</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(r => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.exit?.location}</td>
                <td>
                  <Button size="sm" variant="warning" onClick={() => openRoomModal(r)}>Editar</Button>{' '}
                  <Button size="sm" variant="danger" onClick={() => confirmDelete("¿Eliminar esta sala?", () => deleteRoom(r.id))}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Personas --- */}
      <div className="mb-5">
        <h2>Personas</h2>
        <Button variant="primary" onClick={() => openPersonModal()}>Añadir Persona</Button>
        <table className="table table-striped table-bordered mt-3">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Velocidad</th>
              <th>Sala</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {people.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.speed}</td>
                <td>{p.room?.name}</td>
                <td>
                  <Button size="sm" variant="warning" onClick={() => openPersonModal(p)}>Editar</Button>{' '}
                  <Button size="sm" variant="danger" onClick={() => confirmDelete("¿Eliminar esta persona?", () => deletePerson(p.id))}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Modales de Formulario --- */}
      <Modal show={showExitModal} onHide={() => setShowExitModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingExit ? "Editar Salida" : "Añadir Salida"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Ubicación</Form.Label>
            <Form.Control value={formExit.location} onChange={e => setFormExit({ ...formExit, location: e.target.value })} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Capacidad</Form.Label>
            <Form.Control type="number" value={formExit.capacity} onChange={e => setFormExit({ ...formExit, capacity: parseInt(e.target.value) })} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowExitModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={saveExit}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showRoomModal} onHide={() => setShowRoomModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingRoom ? "Editar Sala" : "Añadir Sala"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Nombre</Form.Label>
            <Form.Control value={formRoom.name} onChange={e => setFormRoom({ ...formRoom, name: e.target.value })} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Salida</Form.Label>
            <Form.Select value={formRoom.exitId} onChange={e => setFormRoom({ ...formRoom, exitId: e.target.value })}>
              <option value="">Selecciona Exit</option>
              {exits.map(exit => (
                <option key={exit.id} value={exit.id}>{exit.location}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRoomModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={saveRoom}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showPersonModal} onHide={() => setShowPersonModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingPerson ? "Editar Persona" : "Añadir Persona"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Nombre</Form.Label>
            <Form.Control value={formPerson.name} onChange={e => setFormPerson({ ...formPerson, name: e.target.value })} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Velocidad</Form.Label>
            <Form.Control type="number" value={formPerson.speed} onChange={e => setFormPerson({ ...formPerson, speed: parseFloat(e.target.value) })} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Sala</Form.Label>
            <Form.Select value={formPerson.roomId} onChange={e => setFormPerson({ ...formPerson, roomId: e.target.value })}>
              <option value="">Selecciona Sala</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>{room.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPersonModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={savePerson}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Modal */}
    <Modal show={confirmModal.show} onHide={() => setConfirmModal({ show: false })} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar</Modal.Title>
      </Modal.Header>
      <Modal.Body>{confirmModal.message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setConfirmModal({ show: false })}>Cancelar</Button>
        <Button variant="danger" onClick={handleConfirm}>Confirmar</Button>
      </Modal.Footer>
    </Modal>

    {/* ✅ Mensaje modal con color pro */}
    <Modal show={messageModal.show} onHide={() => setMessageModal({ show: false })} centered 
      className={messageModal.variant === "danger" ? "modal-error" : "modal-success"}>
      <Modal.Header closeButton>
        <Modal.Title>{messageModal.variant === "danger" ? "Error" : "Éxito"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{messageModal.message}</Modal.Body>
    </Modal>
    
    </div>
  );
}
