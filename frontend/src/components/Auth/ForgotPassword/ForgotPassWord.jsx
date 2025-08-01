import { useState } from "react";
import axios from "axios";
import { message } from "antd";
import "./ForgotPassWord.css";

const ForgotPassword = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/api/forgot/password`, { email });
      message.success(res.data.message || "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.");
    } catch (err) {
      message.error(err.response?.data?.message || "Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password">
      <h2>Şifremi Unuttum</h2>
      <form onSubmit={handleForgotPassword}>
        <label>
          Kayıtlı Email Adresinizi Girin <span>*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading} className="forgot-button">
          {loading ? "Gönderiliyor..." : "Sıfırlama Linki Gönder"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
