import PropTypes from "prop-types";
import Header from "../components/Layout/Header/Header";
import Footer from "../components/Layout/Footer/Footer";
import Search from "../components/Modals/Search/Search";
import CookieConsent from "../components/Modals/CookieConsent/CookieConsent.jsx";
import AnalyticsScriptLoader from "../components/Modals/CookieConsent/AnalyticsScriptLoader.jsx";
import { useState ,useEffect} from "react";

const MainLayout = ({ children }) => {
  const [isSearchShow, setIsSearchShow] = useState(false);
  const [isAnalyticsAccepted, setIsAnalyticsAccepted] = useState(false);

  useEffect(() => {
    const consent = JSON.parse(localStorage.getItem("cookieConsent"));
    if (consent?.analytics) {
      setIsAnalyticsAccepted(true);
    }
  }, []);

  return (
    <>
      <Search isSearchShow={isSearchShow} setIsSearchShow={setIsSearchShow} />
      <Header setIsSearchShow={setIsSearchShow} />
      <main>{children}</main>
      <Footer />
      <CookieConsent /> {/* Burada her sayfada görünecek */}
      {isAnalyticsAccepted && <AnalyticsScriptLoader />}
    </>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node,
};

export default MainLayout;
