// src/context/LoadingProvider.js
import { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";
import LoadingOverlay from "../components/LoadingOverlay/LoadingOverlay.jsx";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
      {loading && <LoadingOverlay />}
    </LoadingContext.Provider>
  );
};

// ✅ children prop'u tanımlandı
LoadingProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLoading = () => useContext(LoadingContext);
