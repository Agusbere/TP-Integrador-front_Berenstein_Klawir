import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

const clienteApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

clienteApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

clienteApi.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const mensaje =
      error.response?.data?.message || error.message || "Error en la solicitud";

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }

    return Promise.reject(new Error(mensaje));
  }
);

const clienteApiPublica = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

clienteApiPublica.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const mensaje =
      error.response?.data?.message || error.message || "Error en la solicitud";
    return Promise.reject(new Error(mensaje));
  }
);

class ServicioApi {
  static async iniciarSesion(credenciales) {
    return clienteApiPublica.post("/auth/login", credenciales);
  }

  static async registrarse(datosUsuario) {
    return clienteApiPublica.post("/auth/register", datosUsuario);
  }

  static async obtenerEventos(parametros = {}) {
    return clienteApi.get("/event", { params: parametros });
  }

  static async obtenerEventoPorId(id) {
    return clienteApi.get(`/event/${id}`);
  }

  static async buscarEventos(parametrosBusqueda) {
    const parametrosValidos = {};

    if (parametrosBusqueda.name)
      parametrosValidos.name = parametrosBusqueda.name;
    if (parametrosBusqueda.startdate)
      parametrosValidos.startdate = parametrosBusqueda.startdate;
    if (parametrosBusqueda.tag) parametrosValidos.tag = parametrosBusqueda.tag;

    return clienteApi.get("/event/search", { params: parametrosValidos });
  }

  static async crearEvento(datosEvento) {
    return clienteApi.post("/event", datosEvento);
  }

  static async actualizarEvento(id, datosEvento) {
    return clienteApi.put(`/event/${id}`, datosEvento);
  }

  static async eliminarEvento(id) {
    return clienteApi.delete(`/event/${id}`);
  }

  static async obtenerCategoriasEventos() {
    return clienteApiPublica.get("/event/categories");
  }

  static async inscribirseEnEvento(idEvento) {
    return clienteApi.post(`/event/${idEvento}/enrollment`);
  }

  static async desinscribirseDeEvento(idEvento) {
    return clienteApi.delete(`/event/${idEvento}/enrollment`);
  }

  static async obtenerUbicacionesEventos() {
    return clienteApi.get("/event-location");
  }

  static async obtenerUbicacionEventoPorId(id) {
    return clienteApi.get(`/event-location/${id}`);
  }

  static async crearUbicacionEvento(datosUbicacion) {
    return clienteApi.post("/event-location", datosUbicacion);
  }

  static async actualizarUbicacionEvento(id, datosUbicacion) {
    return clienteApi.put(`/event-location/${id}`, datosUbicacion);
  }

  static async eliminarUbicacionEvento(id) {
    return clienteApi.delete(`/event-location/${id}`);
  }

  static async obtenerPerfilUsuario() {
    return clienteApi.get("/user/profile");
  }

  static async obtenerTodosLosUsuarios() {
    return clienteApi.get("/user");
  }

  static async actualizarPerfilUsuario(datosUsuario) {
    return clienteApi.put("/user/profile", datosUsuario);
  }

  static async eliminarPerfilUsuario() {
    return clienteApi.delete("/user/profile");
  }
}

export default ServicioApi;
