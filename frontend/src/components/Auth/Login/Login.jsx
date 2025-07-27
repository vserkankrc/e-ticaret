import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { message } from "antd";
import { AuthContext } from "../../../context/AuthContext.jsx"; // AuthContext import

// eslint-disable-next-line react/prop-types
const Login = ({ onSwitch, onForgot }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { login } = useContext(AuthContext); // login fonksiyonunu al

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${apiUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      if (res.data.user) {
        login(res.data.user);           // Burada login fonksiyonunu çağırıyoruz
        message.success("Giriş başarılı!");
        navigate("/");
      } else {
        message.error("Geçersiz e-posta veya şifre!");
      }
    } catch (err) {
      console.error("Login error:", err);
      message.error("Giriş sırasında bir hata oluştu.");
    }
  };

  return (
    <div className="login">
      <h2>Giriş</h2>
      <form onSubmit={handleLogin}>
        <label>
          Kayıtlı Email Adresini Giriniz <span>*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>
          Parola Giriniz <span>*</span>
        </label>
        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="password-toggle-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          </span>
        </div>

        <button type="submit" className="login-button">
          Giriş
        </button>

        <div className="login-links">
          <span className="help">
            <button
              type="button"
              onClick={onForgot}
              className="link-button-span"
            >
              Sorun mu yaşıyorsun?
            </button>
          </span>

          <span className="register-link">
            Hesabınız yok mu?{" "}
            <button type="button" onClick={onSwitch} className="link-button">
              Kayıt Ol
            </button>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
