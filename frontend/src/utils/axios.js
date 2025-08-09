// src/utils/axios.js
import axios from "axios";
import { message } from "antd";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // 🍪 Cookie token'ı da gönder
});

// 🔒 Token süresi bitince yakala
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      message.error("Oturum süreniz doldu. Lütfen tekrar giriş yapın.");

      // 🍪 Cookie'den token'i sil
      Cookies.remove("token");

      // Kullanıcıyı login sayfasına yönlendir
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
