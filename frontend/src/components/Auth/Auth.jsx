import { useState } from "react";
import "./Auth.css";
import Login from "./Login/Login.jsx";
import Register from "./Register/Register.jsx";
import ForgotPassword from "./ForgotPassword/ForgotPassWord.jsx";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login"); // "register" | "forgot"

  return (
    <section className="account-page">
      <div className="container">
        <div className="account-wrapper">
          {activeTab === "login" && (
            <Login
              onSwitch={() => setActiveTab("register")}
              onForgot={() => setActiveTab("forgot")}
            />
          )}
          {activeTab === "register" && (
            <Register onSwitch={() => setActiveTab("login")} />
          )}
          {activeTab === "forgot" && (
            <ForgotPassword onSwitch={() => setActiveTab("login")} />
          )}
        </div>
      </div>
    </section>
  );
};

export default Auth;
