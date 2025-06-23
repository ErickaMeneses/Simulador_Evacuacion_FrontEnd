import { useEffect, useState } from "react";
import api from "../services/api";
import "./EvacuationPage.css";

export default function EvacuationPage() {
  const [results, setResults] = useState([]);
  const [exits, setExits] = useState([]);
  const [theoreticalResults, setTheoreticalResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const from3D = localStorage.getItem("from3D");
    if (from3D) {
      loadResults();
      localStorage.removeItem("from3D");
    }
  }, []);

  const loadResults = async () => {
    setLoading(true);
    try {
      const resResults = await api.get("/evacuation/results");
      const resExits = await api.get("/management/exits");
      const resTheoretical = await api.get("/evacuation/theoretical");
      setResults(resResults.data);
      setExits(resExits.data);
      setTheoreticalResults(resTheoretical.data);
    } catch (err) {
      console.error("Error cargando resultados:", err);
    } finally {
      setLoading(false);
    }
  };

  const startEvacuation = async () => {
    setLoading(true);
    try {
      await api.post("/evacuation/start");
      await loadResults();
    } catch (err) {
      console.error("Error iniciando simulación:", err);
    } finally {
      setLoading(false);
    }
  };

  const costoPorSalida = 25000;
  const costoPorSegundo = 100;

  const costoInfraestructura = exits.length * costoPorSalida;
  const costoPerdidas = results.reduce((acc, r) => acc + r.timeToEvacuate * costoPorSegundo, 0);
  const ahorroPotencial = costoPerdidas * 0.3;

  return (
    <div className="evacuation-container">
      <h1>Resultados de la Simulación</h1>

      {loading ? (
        <div className="loader-container">
          <h3>Procesando resultados...</h3>
          <img src="/loader.gif" alt="Cargando..." width="120" />
        </div>
      ) : (
        <>
          {results.length === 0 && (
            <button onClick={startEvacuation} className="btn-start">
              Iniciar Simulación
            </button>
          )}

          {results.length > 0 && (
            <>
              <h2>Resultados Reales</h2>
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
                  {results.map((r) => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{r.personName}</td>
                      <td>{r.exitLocation}</td>
                      <td>{r.timeToEvacuate.toFixed(2)}</td>
                      <td>{new Date(r.simulationDate).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="cost-summary">
                <h3>Resumen Económico</h3>
                <p><strong>Infraestructura:</strong> ₡ {costoInfraestructura.toLocaleString()}</p>
                <p><strong>Perdidas:</strong> ₡ {costoPerdidas.toLocaleString()}</p>
                <p><strong>Ahorro Potencial:</strong> ₡ {ahorroPotencial.toLocaleString()}</p>
              </div>
            </>
          )}

          {theoreticalResults.length > 0 && (
            <div style={{ marginTop: "2rem" }}>
              <h2>Resultados Teóricos (M/M/m)</h2>
              <table>
                <thead>
                  <tr>
                    <th>λ</th>
                    <th>μ</th>
                    <th>m</th>
                    <th>ρ</th>
                    <th>P₀</th>
                    <th>Lq</th>
                    <th>Wq</th>
                    <th>W</th>
                    <th>L</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {theoreticalResults.map((t, idx) => (
                    <tr key={idx}>
                      <td>{t.lambda.toFixed(3)}</td>
                      <td>{t.mu.toFixed(3)}</td>
                      <td>{t.m}</td>
                      <td>{t.rho.toFixed(3)}</td>
                      <td>{t.p0.toFixed(3)}</td>
                      <td>{t.lq.toFixed(3)}</td>
                      <td>{t.wq.toFixed(3)}</td>
                      <td>{t.w.toFixed(3)}</td>
                      <td>{t.l.toFixed(3)}</td>
                      <td>{new Date(t.simulationDate).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
