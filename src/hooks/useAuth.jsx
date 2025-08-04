import { useState, useEffect, useContext, createContext } from "react";
import ServicioApi from "../services/apiServices.jsx";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      ServicioApi.obtenerPerfilUsuario()
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setToken(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await ServicioApi.iniciarSesion(credentials);
      const { token: newToken, user: userData } = response;

      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(userData);

      return response;
    } catch (error) {
      console.error("Error en login:", error);
      throw new Error("Error al iniciar sesión. Verifica tus credenciales.");
    }
  };

  const registrarse = async (userData) => {
    try {
      const response = await ServicioApi.registrarse(userData);
      return response;
    } catch (error) {
      console.error("Error en registro:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    registrarse,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
