// index.jsx veya main.jsx

import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartProvider.jsx";
import  {Layout}  from "./layouts/Layout";
import App from "./App";
import "./index.css";
import { LoadingProvider } from "./context/LoadingProvider.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="822725773355-1kebtf1v352o7osdq4l0ee6hopjmsbp4.apps.googleusercontent.com">
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <LoadingProvider>
            <Layout>
              <App />
            </Layout>
          </LoadingProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>
);
