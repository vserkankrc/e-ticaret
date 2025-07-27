// src/components/Cookies/AnalyticsScriptLoader.jsx
import { useEffect } from "react";

const AnalyticsScriptLoader = () => {
  useEffect(() => {
    const consent = JSON.parse(localStorage.getItem("cookieConsent"));
    const GA_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
    const FB_ID = import.meta.env.VITE_FACEBOOK_PIXEL_ID;

    // === Google Analytics ===
    if (consent?.analytics && GA_ID) {
      const gaScript = document.createElement("script");
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      gaScript.async = true;
      document.head.appendChild(gaScript);

      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", GA_ID);
    }

    // === Facebook Pixel ===
    if (consent?.marketing && FB_ID) {
      !window.fbq &&
        (function (f, b, e, v, n, t, s) {
          if (f.fbq) return;
          n = f.fbq = function () {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
          };
          if (!f._fbq) f._fbq = n;
          n.push = n;
          n.loaded = true;
          n.version = "2.0";
          n.queue = [];
          t = b.createElement(e);
          t.async = true;
          t.src = `https://connect.facebook.net/en_US/fbevents.js`;
          s = b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t, s);
        })(window, document, "script");

      window.fbq("init", FB_ID);
      window.fbq("track", "PageView");
    }
  }, []);

  return null;
};

export default AnalyticsScriptLoader;
