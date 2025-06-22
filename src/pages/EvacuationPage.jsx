import { useState } from "react";
import api from "../services/api";
import "./EvacuationPage.css";

export default function EvacuationPage() {
  const [results, setResults] = useState([]);
  const [exits, setExits] = useState([]);
  const [loading, setLoading] = useState(false);

  const startEvacuation = async () => {
    setLoading(true);

    try {
      // Inicia la simulación
      await api.post("/evacuation/start");

      // Obtiene resultados
      const resResults = await api.get("/evacuation/results");
      setResults(resResults.data);

      // Obtiene salidas
      const resExits = await api.get("/management/exits");
      setExits(resExits.data);

    } catch (error) {
      console.error("Error al iniciar la evacuación:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cálculos económicos (solo si tenemos datos)
  const costoPorSalida = 25000; // ₡ por salida
  const costoPorSegundo = 100;  // ₡ por segundo de evacuación

  const costoInfraestructura = exits.length * costoPorSalida;
  const costoPerdidas = results.reduce((acc, r) => acc + r.timeToEvacuate * costoPorSegundo, 0);
  const ahorroPotencial = costoPerdidas * 0.3; // 30% ahorro estimado (ejemplo)

  return (
    <div className="evacuation-container">
      <h1>Simulación de Evacuación</h1>
      <button onClick={startEvacuation} disabled={loading}>
        {loading ? "Simulando..." : "Iniciar Simulación"}
      </button>

      {results.length > 0 && (
        <div>
          <h2>Resultados</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Persona</th>
                <th>Salida</th>
                <th>Tiempo de Evacuación (s)</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {results.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.personName}</td>
                  <td>{r.exitLocation}</td>
                  <td>{r.timeToEvacuate}</td>
                  <td>{new Date(r.simulationDate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cost-summary">
            <h3>Resumen Económico</h3>
            <p>Costo de infraestructura (salidas): ₡ {costoInfraestructura.toLocaleString()}</p>
            <p>Costo por pérdidas: ₡ {costoPerdidas.toLocaleString()}</p>
            <p>Ahorro potencial con mejoras: ₡ {ahorroPotencial.toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
