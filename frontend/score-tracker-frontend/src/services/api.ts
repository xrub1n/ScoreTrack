import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5156/api",
});

export default api;
