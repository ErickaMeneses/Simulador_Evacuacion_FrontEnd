import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">
      <Navbar />

      <div className="background">
        <video autoPlay muted loop className="background-video">
          <source src="/video-background.mp4" type="video/mp4" />
        </video>
        <div className="overlay" />
      </div>


        <div className="home-container">
          <h1>Bienvenido a la Simulación de Evacuación</h1>
          <div className="buttons">
            <button className="modern-button" onClick={() => navigate("/management")}>Gestión</button>
            <button className="modern-button" onClick={() => navigate("/evacuation")}>Simulación</button>
            <button className="modern-button" onClick={() => navigate("/evacuation-3d")}>Simulación</button>
          </div>
        </div>


      <Footer />
    </div>
  );
}
