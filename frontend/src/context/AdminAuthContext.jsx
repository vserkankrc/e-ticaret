import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("isAdminAuthenticated");
    if (stored === "true") setIsAdminAuthenticated(true);
  }, []);

  const login = () => setIsAdminAuthenticated(true);
  const logout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    setIsAdminAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAdminAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

AdminAuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAdminAuth = () => useContext(AdminAuthContext);
