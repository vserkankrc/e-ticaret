import "./Header.css";
import PropTypes from "prop-types";
import { message } from "antd";
import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext.jsx";
import { CartContext } from "../../../context/CartProvider.jsx";
import api from "../../../utils/axios";

const Header = ({ setIsSearchShow }) => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { cartItems, clearCart } = useContext(CartContext);

  const [menuActive, setMenuActive] = useState(false);
  const toggleMenu = () => setMenuActive((prev) => !prev);

  // 🔔 Bildirim sayısı
  const [unreadCount, setUnreadCount] = useState(0);

  // Kullanıcı giriş yaptıysa unread count çek
  const fetchUnread = async () => {
    try {
      const res = await api.get("/api/notifications/unread", { withCredentials: true });
      setUnreadCount(res.data.count || 0);
    } catch (err) {
      console.error("Bildirim sayısı alınamadı:", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchUnread();
  }, [isAuthenticated]);

  // Çıkış işlemi
  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout", {}, { withCredentials: true });

      clearCart();   // Sepeti temizle
      logout();      // AuthContext üzerinden kullanıcıyı sıfırla

      message.success("Çıkış başarılı.");
      window.location.href = "/";

    } catch (error) {
      console.error("Çıkış hatası:", error);
      message.error("Çıkış işlemi başarısız.");
    }
  };

  return (
    <header>
      <div className="header-row">
        <div className="container">
          <div className="header-wrapper">

            {/* Mobil Menü */}
            <div className="header-mobile" onClick={toggleMenu}>
              <i className="bi bi-list" id="btn-menu"></i>
            </div>

            {/* Logo */}
            <div className="header-left">
              <Link to="/" className="logo">
                <img src="/img/logo/logo.png" alt="Logo" />
              </Link>
            </div>

            {/* Menü */}
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
              <i className="bi bi-x-circle" id="close-sidebar" onClick={toggleMenu}></i>
            </div>

            {/* Sağ Taraf */}
            <div className="header-right">
              <div className="header-right-links">

                {!isAuthenticated ? (
                  <Link to="/auth" className="header-account">
                    <i className="bi bi-person"></i>
                  </Link>
                ) : (
                  <>
                    {/* Profil */}
                    <Link to="/profile" className="header-account">
                      <i className="bi bi-person-check"></i>
                    </Link>

                    {/* Çıkış */}
                    <div className="header-exit">
                      <button onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right"></i>
                      </button>
                    </div>
                  </>
                )}

                {/* Search */}
                <button className="search-button" onClick={() => setIsSearchShow(true)}>
                  <i className="bi bi-search"></i>
                </button>

                {/* 🔔 Bildirim Çanı */}
                {isAuthenticated && (
                  <Link to="/notifications" className="header-notification">
                    <i className="bi bi-bell"></i>
                    {unreadCount > 0 && (
                      <span className="notification-badge">{unreadCount}</span>
                    )}
                  </Link>
                )}

                {/* Sepet */}
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
