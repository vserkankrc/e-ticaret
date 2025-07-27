import { createContext, useState, useEffect, useCallback, useContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ⚡ Loading state eklendi

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // Backend'den auth durumunu kontrol et
  const checkAuth = useCallback(async () => {
    setLoading(true); // Doğrulama başlıyor
    try {
      const response = await axios.get(`${apiUrl}/api/auth/check`, {
        withCredentials: true,
      });

      if (response.data.authenticated) {
        setIsAuthenticated(true);
        setUser(response.data.user || null);
       /*  console.log("✅ Auth doğrulandı:"); */
      } else {
        setIsAuthenticated(false);
        setUser(null);
       /*  console.log("❌ Auth doğrulanmadı"); */
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      console.error("🔴 Auth kontrol hatası:", error);
    } finally {
      setLoading(false); // Doğrulama bitti
    }
  }, [apiUrl]);

  useEffect(() => {
    checkAuth(); // Uygulama yüklendiğinde bir kere kontrol
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
        loading, // ⚡ Loading'i de context'e ekledik
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

// ** BURASI EKLENDİ **
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
