import "./Header.css";
import PropTypes from "prop-types";
import { message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext.jsx";
import { CartContext } from "../../../context/CartProvider.jsx";
import api from "../../../utils/axios";

const Header = ({ setIsSearchShow }) => {
  // eslint-disable-next-line no-unused-vars
  const { isAuthenticated, logout, checkAuth } = useContext(AuthContext);
  const { cartItems, clearCart } = useContext(CartContext);
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  const [menuActive, setMenuActive] = useState(false);
  const toggleMenu = () => setMenuActive((prev) => !prev);

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      clearCart();
      localStorage.removeItem("user");
      logout();
      message.success("Çıkış başarılı.");
      window.location.href = "/"; // Sayfayı tam yenile
    } catch (error) {
      console.error("Çıkış hatası:", error);
      message.error("Çıkış işlemi başarısız.");
    }
  };

  return (
    <header>
      <div className="global-notification">
        <div className="container">
          <p>
            Türkiye&apos;nin <b>Yeni!</b> E-Ticaret sitesi{" "}
            <Link to="/">Tercihsepetim</Link>
          </p>
        </div>
      </div>

      <div className="header-row">
        <div className="container">
          <div className="header-wrapper">
            <div className="header-mobile" onClick={toggleMenu}>
              <i className="bi bi-list" id="btn-menu"></i>
            </div>

            <div className="header-left">
              <Link to="/" className="logo">
                <img src="/img/logo/logo.png" alt="Logo" />
              </Link>
            </div>

            <div className={`header-center ${menuActive ? "active" : ""}`} id="sidebar">
              <nav className="navigation">
                <ul className="menu-list">
                  <li className="menu-list-item">
                    <Link to="/" className="menu-link active" onClick={toggleMenu}>
                      Anasayfa <i className="bi bi-chevron-down"></i>
                    </Link>
                  </li>
                  <li className="menu-list-item">
                    <Link to="/communication" className="menu-link" onClick={toggleMenu}>
                      İletişim
                    </Link>
                  </li>
                </ul>
              </nav>
              <i className="bi-x-circle" id="close-sidebar" onClick={toggleMenu}></i>
            </div>

            <div className="header-right">
              <div className="header-right-links">
                {!isAuthenticated ? (
                  <Link to="/auth" className="header-account">
                    <i className="bi bi-person"></i>
                  </Link>
                ) : (
                  <>
                    <Link to="/profile" className="header-account">
                      <i className="bi bi-person-check"></i>
                    </Link>
                    <div className="header-exit">
                      <button onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right"></i>
                      </button>
                    </div>
                  </>
                )}

                <button className="search-button" onClick={() => setIsSearchShow(true)}>
                  <i className="bi bi-search"></i>
                </button>

                <div className="header-cart">
                  <Link to="/cart" className="header-cart-link">
                    <i className="bi bi-cart3"></i>
                    <span className="header-cart-count">{cartItems?.length || 0}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  setIsSearchShow: PropTypes.func.isRequired,
};

export default Header;
