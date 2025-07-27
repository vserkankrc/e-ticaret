import React from "react";
import Policy from "../../Policy/Policys/Policy";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <React.Fragment>
      <Policy />
      <footer className="footer">
        <div className="widgets-row">
          <div className="container">
            <div className="footer-widgets">
              <div className="brand-info">
                <div className="footer-logo">
                  <Link to="/" className="logo">
                    <img src="img/logo/logo.png" alt="logo" />
                  </Link>
                </div>
                <div className="footer-desc">
                  <p>İletişim bilgilerimiz</p>
                </div>
                <div className="footer-contact">
                  <p>
                    <a href="tel:5549840844">(+90) 554 984 08 44</a> –{" "}
                    <a href="mailto:info@example.com">info@tercihsepetim.com</a>
                  </p>
                </div>
              </div>

              <div className="widget-nav-menu">
                <h4>Tercihsepetim</h4>
                <ul className="menu-list">
                  <li>
                    <Link to="/aboutus">Biz Kimiz?</Link>
                  </li>
                  <li>
                    <Link to="/communication">İletişim</Link>
                  </li>
                </ul>
              </div>

              <div className="widget-nav-menu">
                <h4>Yardım</h4>
                <ul className="menu-list">
                  <li>
                    <Link to="/Requirements">Nasıl iade ederim</Link>
                  </li>
                  <li>
                    <Link to="#">Canlı Yardım</Link>
                  </li>
                  <li>
                    <Link to="/questions">Sıkça Sorulan Sorular</Link>
                  </li>
                </ul>
              </div>
{/* 
              <div className="widget-nav-menu">
                <h4>Satıcı</h4>
                <ul className="menu-list">
                  <li>
                    <Link to="#">TercihSepetim&apos;de Satış yap</Link>
                  </li>
                </ul>
              </div> */}
            </div>
          </div>
        </div>

        <div className="copyright-row">
          <div className="container">
            <div className="footer-copyright">
              <div className="site-copyright">
                <p>© 2024 E-Ticaret sitesi. Tüm hakları saklıdır.</p>
              </div>
              <Link to="/">
                <img src="img/footer/logo_band_colored.svg" alt="Logo" />
              </Link>
              <div className="footer-menu">
                <ul className="footer-menu-list">
                  <li className="list-item">
                    <Link to="/cookie-policy">Çerez Politikası</Link>
                  </li>
                  <li className="list-item">
                    <Link to="/privacy-policy">KVKK ve Gizlilik Politikası</Link>
                  </li>
                  <li className="list-item">
                    <Link to="/termofuse">Kullanım Koşulları</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </React.Fragment>
  );
};

export default Footer;
