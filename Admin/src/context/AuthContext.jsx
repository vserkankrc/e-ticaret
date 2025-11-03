import { createContext, useState, useEffect, useCallback, useContext } from "react";
import PropTypes from "prop-types";
import api from "@/utils/axios";


// 🔹 Context oluştur
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

// 🔹 Provider bileşeni
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Kullanıcı oturumunu kontrol et
  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/auth/check");

      if (data?.authenticated) {
        setIsAuthenticated(true);
        setUser(data.user || null);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err) {
      console.error("🔴 Auth kontrol hatası:", err.message);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Uygulama ilk yüklendiğinde auth durumunu kontrol et
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 🔹 Giriş fonksiyonu
  const login = (userData = null) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  // 🔹 Çıkış fonksiyonu
  const logout = async () => {
    try {
      await api.post("/api/auth/logout"); // backend destekliyorsa logout isteği
    } catch (err) {
      console.warn("Logout isteği başarısız:", err.message);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // 🔹 Sağlanacak değerler
  const contextValue = {
    isAuthenticated,
    user,
    login,
    logout,
    checkAuth,
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>🔄 Yükleniyor...</div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

// 🔹 PropTypes kontrolü
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// 🔹 Custom Hook
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth, AuthProvider içinde kullanılmalıdır!");
  }
  return context;
};
