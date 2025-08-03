import { createContext, useState, useEffect, useCallback, useContext } from "react";
import PropTypes from "prop-types";
import api from "../utils/axios"; // api import edildi

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ⚡ Loading state

  // ✅ Auth kontrolü
  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/auth/check"); // api kullanıldı

      if (response.data.authenticated) {
        setIsAuthenticated(true);
        setUser(response.data.user || null);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      console.error("🔴 Auth kontrol hatası:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth(); // Uygulama ilk açıldığında kontrol et
  }, [checkAuth]);

  const login = (userData = null) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        checkAuth,
        loading,
      }}
    >
      {!loading && children}
      {loading && <div>Yükleniyor...</div>}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// ** Custom Hook **
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
