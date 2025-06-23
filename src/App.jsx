/*
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import System from "./pages/System";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/system" element={<System />} />
      </Routes>
    </Router>
  );
}

export default App;
*/
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ManagementPage from "./pages/ManagementPage";
import EvacuationPage from "./pages/EvacuationPage";
import Evacuation3DPage from "./pages/Evacuation3DPage";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/evacuation-3d" element={<Evacuation3DPage />} />
        <Route path="/management" element={<ManagementPage />} />
        <Route path="/evacuation" element={<EvacuationPage />} />
      </Routes>
    </Router>
  );
}
