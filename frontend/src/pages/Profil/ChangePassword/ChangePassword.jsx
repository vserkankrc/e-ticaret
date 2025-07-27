import { useState } from "react";
import axios from "axios";
import { message as antMessage } from "antd";
import { Eye, EyeOff } from "lucide-react";
import "./ChangePassword.css";

const ChangePassword = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      antMessage.error("Yeni şifreler eşleşmiyor.");
      return;
    }

    if (newPassword.length < 6) {
      antMessage.error("Yeni şifre en az 6 karakter olmalı.");
      return;
    }

    try {
      const response = await axios.put(
        `${apiUrl}/api/auth/change-password`,

        { currentPassword, newPassword },
        { withCredentials: true }
      );

      antMessage.success(
        response.data.message || "Şifre başarıyla güncellendi."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      const errorMsg =
        err.response?.data?.message ||
        "Şifre değiştirme işlemi sırasında bir hata oluştu.";
      antMessage.error(errorMsg);
    }
  };

  return (
    <div className="change-password-container">
      <h2>Şifre Değiştir</h2>
      <form className="change-password-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Mevcut Şifre</label>
          <div className="password-input">
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="icon-btn"
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Yeni Şifre</label>
          <div className="password-input">
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="icon-btn"
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Yeni Şifre (Tekrar)</label>
          <div className="password-input">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="icon-btn"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button type="submit" className="change-password-button">
          Şifreyi Güncelle
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
