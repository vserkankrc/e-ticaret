// src/utils/axios.js
import axios from "axios";
import { message } from "antd";
import Cookies from "js-cookie";

// 🔹 Axios instance oluştur
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // .env'deki API base URL
  withCredentials: true, // 🍪 Cookie token'ı da gönder
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔒 Interceptor: token süresi bitince yakala
api.interceptors.response.use(
  (response) => {
    // Başarılı yanıt ise direkt return et
    return response;
  },
  (error) => {
    if (error.response) {
      // 401 Unauthorized → token süresi dolmuş
      if (error.response.status === 401) {
        message.error("Oturum süreniz doldu. Lütfen tekrar giriş yapın.");

        // 🍪 Cookie'den token'i sil
        Cookies.remove("token");

        // Kullanıcıyı login sayfasına yönlendir
        window.location.href = "/login";
      } else if (error.response.data && error.response.data.message) {
        // API’den gelen özel hata mesajını göster
        message.error(error.response.data.message);
      } else {
        message.error("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } else {
      // Eğer yanıt yoksa (network hatası vb.)
      message.error("Sunucuya ulaşılamıyor. İnternet bağlantınızı kontrol edin.");
    }

    return Promise.reject(error);
  }
);

export default api;
