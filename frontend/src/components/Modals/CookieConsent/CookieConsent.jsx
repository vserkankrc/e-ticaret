import { useEffect, useState } from "react";
import "./CookieConsent.css";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) setIsVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(
      "cookieConsent",
      JSON.stringify({
        required: true,
        analytics: preferences.analytics,
        marketing: preferences.marketing,
      })
    );
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem(
      "cookieConsent",
      JSON.stringify({
        required: true,
        analytics: false,
        marketing: false,
      })
    );
    setIsVisible(false);
  };

  const handleTogglePreferences = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: checked }));
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-consent-wrapper">
      <div className="cookie-consent">
        <p>
          Web sitemiz, size en iyi deneyimi sunmak için zorunlu ve isteğe bağlı çerezleri kullanır.
          <br />
          Detaylı bilgi için{" "}
          <a href="/privacy-policy"  rel="noopener noreferrer">
            Gizlilik Politikası
          </a>{" "}
          sayfasına göz atabilirsiniz.
        </p>

        {isExpanded && (
          <div className="cookie-preferences">
            <label>
              <input type="checkbox" checked disabled /> Zorunlu Çerezler (gerekli)
            </label>
            <label>
              <input
                type="checkbox"
                name="analytics"
                checked={preferences.analytics}
                onChange={handleCheckboxChange}
              />{" "}
              Analitik Çerezler
            </label>
            <label>
              <input
                type="checkbox"
                name="marketing"
                checked={preferences.marketing}
                onChange={handleCheckboxChange}
              />{" "}
              Pazarlama Çerezleri
            </label>
          </div>
        )}

        <div className="cookie-buttons">
          <button className="accept-btn" onClick={handleAccept}>
            Kabul Et
          </button>
          <button className="reject-btn" onClick={handleReject}>
            Reddet
          </button>
          <button className="pref-btn" onClick={handleTogglePreferences}>
            {isExpanded ? "Tercihleri Gizle" : "Tercihleri Ayarla"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
