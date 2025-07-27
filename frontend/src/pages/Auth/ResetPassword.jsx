// src/pages/Auth/ResetPassword.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import "./ResetPassword.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      return message.error("Şifreler eşleşmiyor");
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/reset-password`, {
        token,
        password,
      });

      message.success(res.data.message);
      navigate("/login");
    } catch (error) {
      message.error(
        error.response?.data?.message || "Bir hata oluştu, tekrar deneyin"
      );
    }
  };

  return (
    <div className="reset-password-form">
      <h2>Yeni Şifre Belirle</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Yeni şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Şifre tekrar"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        <button type="submit">Şifreyi Güncelle</button>
      </form>
    </div>
  );
};

export default ResetPassword;
