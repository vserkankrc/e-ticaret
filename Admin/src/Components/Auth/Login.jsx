import React, { useState } from "react";
import "./Login.css";
import api from "@/utils/axios";
import { message } from "antd";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      message.warning("⚠️ Lütfen e-posta ve şifre girin!");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/api/auth/login", { email, password });

      // Başarılı giriş
      if (res.data?.user?.role === "admin") {
        message.success(`🎉 Giriş başarılı! Hoş geldin, ${res.data.user.name || "Admin"}`);
        login(res.data.user);
        navigate("/admin");
      } 
      // Kullanıcı admin değilse
      else {
        message.error("🚫 Bu hesap admin yetkisine sahip değil!");
      }

    } catch (err) {
      // API hata mesajı varsa göster, yoksa genel mesaj ver
      const errorMsg =
        err.response?.data?.message ||
        (err.response?.status === 401
          ? "❌ E-posta veya şifre hatalı!"
          : "⚠️ Giriş işlemi başarısız. Lütfen tekrar deneyin.");
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Admin Panel Girişi</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">E-posta</label>
            <input
              type="email"
              id="email"
              placeholder="admin@ornek.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Şifre</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Şifrenizi girin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
