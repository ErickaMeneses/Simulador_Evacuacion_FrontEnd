import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7236/api", // Cambia al puerto real de tu backend
});

export default api;
