import { useState, useContext } from "react";
import axios from "../../../utils/axios";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { AuthContext } from "../../../context/AuthContext.jsx";
import PhoneInput from "../../common/PhoneInput.jsx";
import { GoogleLogin } from "@react-oauth/google";
import * as jwtDecode from "jwt-decode";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      const onlyNums = value.replace(/\D/g, "");
      setForm({ ...form, [name]: onlyNums });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validatePassword = (password) => ({
    length: password.length >= 7,
    number: /\d/.test(password),
    special: /[!@#$%^&*]/.test(password),
  });

  const passwordChecks = validatePassword(form.password);
  const passwordsMatch =
    form.password && form.confirmPassword && form.password === form.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(passwordChecks).includes(false)) {
      message.error("Parola en az 7 karakter, 1 rakam ve 1 özel karakter içermelidir.");
      return;
    }

    if (!passwordsMatch) {
      message.error("Parolalar eşleşmiyor.");
      return;
    }

    try {
      const payload = {
        name: form.name,
        surname: form.surname,
        email: form.email,
        phoneNumber: "+90" + form.phoneNumber,
        password: form.password,
      };

      const response = await axios.post("/api/auth/register", payload, {
        withCredentials: true,
      });

      if (response.status === 200 || response.status === 201) {
        message.success("Kayıt başarılı!");

        if (response.data.user) {
          login(response.data.user);
        }

        navigate("/");
      } else {
        message.error("Kayıt sırasında beklenmeyen bir hata oluştu.");
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || "Kayıt başarısız oldu.";
      message.error(errMsg);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const { email, given_name, family_name } = decoded;

      const res = await axios.post(
        "/api/auth/google",
        {
          email,
          name: given_name,
          surname: family_name,
        },
        { withCredentials: true }
      );

      if (res.status === 200 || res.status === 201) {
        message.success("Google ile giriş başarılı!");
        login(res.data.user);
        navigate("/");
      } else {
        message.error("Google ile girişte bir hata oluştu.");
      }
    } catch (err) {
      console.error("Google login error:", err);
      message.error("Google ile giriş başarısız oldu.");
    }
  };

  return (
    <div className="register-container">
      <h2>Kayıt Ol</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>İsim *</span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          <span>Soyisim *</span>
          <input
            type="text"
            name="surname"
            value={form.surname}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          <span>E-mail adresi *</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          <span>Telefon Numarası *</span>
          <PhoneInput
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          <span>Parola *</span>
          <div className="password-input-with-toggle">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-icon"
            >
              {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </span>
          </div>
        </label>

        {isPasswordFocused && (
          <div className="password-validation">
            <p className={passwordChecks.length ? "valid" : "invalid"}>
              En az 7 karakter
            </p>
            <p className={passwordChecks.number ? "valid" : "invalid"}>
              En az 1 rakam
            </p>
            <p className={passwordChecks.special ? "valid" : "invalid"}>
              Özel karakter (!@#$%^&*)
            </p>
          </div>
        )}

        <label>
          <span>Parola Tekrar *</span>
          <div className="password-input-with-toggle">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="toggle-icon"
            >
              {showConfirmPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </span>
          </div>
        </label>

        {form.confirmPassword && (
          <p className={`match-message ${passwordsMatch ? "match" : "mismatch"}`}>
            {passwordsMatch ? "Parolalar eşleşiyor" : "Parolalar eşleşmiyor"}
          </p>
        )}

        <button type="submit" className="btn btn-sm">
          Kayıt Ol
        </button>

        <div className="google-login">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => {
              message.error("Google ile giriş başarısız.");
            }}
          />
        </div>
      </form>

      <div
        className="back-to-login"
        onClick={() => navigate("/")}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === "Enter") navigate("/");
        }}
      >
        <ArrowLeftOutlined /> Giriş Sayfasına Dön
      </div>
    </div>
  );
};

export default Register;
